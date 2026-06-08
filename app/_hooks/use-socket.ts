"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../_context/AuthContext";
import { useChatUtils } from "../_context/ChatContext";
import { websocket } from "../_services/websocket";
import { showChatNotification } from "../_services/chatNotification";

export const useSocketConnection = ({
  authUserId,
  activeUserId,
}: {
  authUserId: number | undefined;
  activeUserId?: number;
}) => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();
  const { setTypingUsers, setOnlineUsers } = useChatUtils();

  const setTypingRef = useRef(setTypingUsers);
  const setOnlineRef = useRef(setOnlineUsers);
  const activeUserRef = useRef(activeUserId);
  const authUserRef = useRef(authUserId);
  const queryClientRef = useRef(queryClient);

  setTypingRef.current = setTypingUsers;
  setOnlineRef.current = setOnlineUsers;
  activeUserRef.current = activeUserId;
  authUserRef.current = authUserId;
  queryClientRef.current = queryClient;

  useEffect(() => {
    const token = authDetails?.token;
    if (!token) {
      websocket.disconnect();
      return;
    }
    if (websocket.connected) return;
    websocket.connect(token);
  }, [authDetails?.token]);

  useEffect(() => {
    const handler = (state: string) => {
      if (state === "connected") websocket.emit("chat:presence:list");
    };
    websocket.onStateChange(handler);
    return () => websocket.offStateChange(handler);
  }, []);

  useEffect(() => {
    // Incoming message from another user
    const onMessage = (event: any) => {
      const msg = event.payload;
      const qc = queryClientRef.current;

      // Update cache
      appendToCache(qc, msg.senderId, msg);
      qc.invalidateQueries({ queryKey: ["conversations"] });

      const isOwnMessage = msg.senderId === authUserRef.current;

      const isCurrentConversation = activeUserRef.current === msg.senderId;

      // Show notification
      if (!isOwnMessage && !isCurrentConversation) {
        showChatNotification({
          senderId: msg.senderId,
          senderName: msg.sender?.fullName ?? msg.sender?.name ?? "New Message",
          message: msg.content,
          avatar: msg.sender?.profileImage,
          conversationId: msg.conversationId,
          authRole: authDetails?.user?.role,
        });
      }

      // Auto-read if currently viewing chat
      if (isCurrentConversation) {
        websocket.emit("chat:read:bulk", {
          conversationId: msg.conversationId,
          senderId: msg.senderId,
        });
      }
    };

    const onSent = (event: any) => {
      const real = event.payload;
      const qc = queryClientRef.current;

      qc.setQueryData(["messages", activeUserRef.current], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((m: any) =>
              (real.clientId && m.id === real.clientId) ||
              (m.id && m.clientId === real.clientId)
                ? { ...real, clientId: undefined }
                : m,
            ),
          })),
        };
      });

      qc.invalidateQueries({ queryKey: ["conversations"] });
    };

    const onMessagesBulk = (event: any) => {
      const msgs: any[] = event.payload ?? [];
      const qc = queryClientRef.current;

      const bySender = msgs.reduce<Record<number, any[]>>((acc, m) => {
        (acc[m.senderId] ??= []).push(m);
        return acc;
      }, {});

      for (const [senderId, senderMsgs] of Object.entries(bySender)) {
        qc.setQueryData(["messages", Number(senderId)], (old: any) => {
          if (!old) return old;
          const pages = [...old.pages];
          const last = { ...pages[pages.length - 1] };
          // Deduplicate against existing ids
          const existingIds = new Set((last.data ?? []).map((m: any) => m.id));
          const newMsgs = senderMsgs.filter((m) => !existingIds.has(m.id));
          last.data = [...(last.data ?? []), ...newMsgs];
          pages[pages.length - 1] = last;
          return { ...old, pages };
        });
      }

      qc.invalidateQueries({ queryKey: ["conversations"] });
    };

    const onDelivered = (event: any) => {
      const messageId = event.payload?.messageId ?? event.messageId;
      queryClientRef.current.setQueriesData(
        { queryKey: ["messages"] },
        (old: any) => updateMessageStatus(old, messageId, "DELIVERED"),
      );
    };

    // Bulk delivered on reconnect
    const onDeliveredBulk = (event: any) => {
      const ids: number[] = event.messageIds ?? [];
      queryClientRef.current.setQueriesData(
        { queryKey: ["messages"] },
        (old: any) => updateMessageStatusBulk(old, ids, "DELIVERED"),
      );
    };

    // Read (single)
    const onRead = (event: any) => {
      const qc = queryClientRef.current;
      const messageId = event.payload?.messageId ?? event.messageId;
      qc.setQueriesData({ queryKey: ["messages"] }, (old: any) =>
        updateMessageStatus(old, messageId, "READ"),
      );
      qc.invalidateQueries({ queryKey: ["conversations"] });
    };

    // Read bulk
    const onReadBulk = (event: any) => {
      const qc = queryClientRef.current;
      const messageIds: number[] = event.payload?.messageIds ?? [];
      qc.setQueriesData({ queryKey: ["messages"] }, (old: any) =>
        updateMessageStatusBulk(old, messageIds, "READ"),
      );
      qc.invalidateQueries({ queryKey: ["conversations"] });
    };

    // Typing
    const onTyping = (event: any) => {
      const { senderId, isTyping } = event.payload;
      setTypingRef.current((prev: Record<number, boolean>) => ({
        ...prev,
        [senderId]: isTyping,
      }));
    };

    // Presence
    const onPresence = (event: any) => {
      const { userId, status } = event.payload;
      setOnlineRef.current((prev: unknown) => {
        const next = new Set<number>(prev instanceof Set ? prev : []);
        status === "online" ? next.add(userId) : next.delete(userId);
        return next;
      });
    };

    const onPresenceList = (event: any) => {
      const ids = event.payload?.onlineUserIds;
      setOnlineRef.current(new Set<number>(Array.isArray(ids) ? ids : []));
    };

    websocket.on("chat:message", onMessage);
    websocket.on("chat:message:sent", onSent);
    websocket.on("chat:messages:bulk", onMessagesBulk);
    websocket.on("chat:delivered", onDelivered);
    websocket.on("chat:delivered:bulk", onDeliveredBulk);
    websocket.on("chat:read", onRead);
    websocket.on("chat:read:bulk", onReadBulk);
    websocket.on("chat:typing", onTyping);
    websocket.on("chat:presence", onPresence);
    websocket.on("chat:presence:list", onPresenceList);

    return () => {
      websocket.off("chat:message", onMessage);
      websocket.off("chat:message:sent", onSent);
      websocket.off("chat:messages:bulk", onMessagesBulk);
      websocket.off("chat:delivered", onDelivered);
      websocket.off("chat:delivered:bulk", onDeliveredBulk);
      websocket.off("chat:read", onRead);
      websocket.off("chat:read:bulk", onReadBulk);
      websocket.off("chat:typing", onTyping);
      websocket.off("chat:presence", onPresence);
      websocket.off("chat:presence:list", onPresenceList);
    };
  }, []);
};

export function addOptimisticMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  recipientId: number,
  senderId: number,
  content: string,
  tempId: string,
) {
  const optimistic = {
    id: tempId, // temporary — replaced on ack
    _tempId: tempId,
    conversationId: -1,
    senderId,
    content,
    status: "SENT" as const,
    readAt: null,
    createdAt: new Date().toISOString(),
    sender: { id: senderId, fullName: "", role: "" },
  };
  appendToCache(queryClient, recipientId, optimistic);
}

function appendToCache(qc: any, userId: number, msg: any) {
  qc.setQueryData(["messages", userId], (old: any) => {
    if (!old) return old;
    const pages = [...old.pages];
    const last = { ...pages[pages.length - 1] };
    last.data = [...(last.data ?? []), msg];
    pages[pages.length - 1] = last;
    return { ...old, pages };
  });
}

function updateMessageStatus(
  old: any,
  messageId: number,
  status: "DELIVERED" | "READ",
) {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        m.id === messageId ? { ...m, status } : m,
      ),
    })),
  };
}

function updateMessageStatusBulk(
  old: any,
  messageIds: number[],
  status: "DELIVERED" | "READ",
) {
  if (!old?.pages) return old;
  const idSet = new Set(messageIds);
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) => (idSet.has(m.id) ? { ...m, status } : m)),
    })),
  };
}
