"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../_context/AuthContext";
import { useChatUtils } from "../_context/ChatContext";
import { websocket } from "../_services/websocket";
import { showChatNotification } from "../_services/chatNotification";
import {
  appendToCache,
  clearUnreadInCache,
  updateConversationLastMessage,
  updateMessageStatus,
  updateMessageStatusBulk,
} from "../helpers/chat-cache";

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
    const onMessage = (event: any) => {
      const msg = event.payload;
      const qc = queryClientRef.current;

      appendToCache(qc, msg.senderId, msg);

      updateConversationLastMessage(qc, msg, authUserRef.current);

      const isOwnMessage = msg.senderId === authUserRef.current;

      const isCurrentConversation = activeUserRef.current === msg.senderId;

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
        clearUnreadInCache(qc, msg.senderId);
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
      updateConversationLastMessage(qc, real, authUserRef.current);
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
        clearUnreadInCache(qc, Number(senderId));
      }
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
      qc.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;

        return old.map((conversation: any) => {
          if (conversation.lastMessage?.id !== messageId) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: {
              ...conversation.lastMessage,
              status: "READ",
            },
          };
        });
      });
    };

    // Read bulk
    const onReadBulk = (event: any) => {
      const qc = queryClientRef.current;
      const messageIds: number[] = event.payload?.messageIds ?? [];
      const senderId: number = event.payload?.senderId;

      qc.setQueriesData({ queryKey: ["messages"] }, (old: any) =>
        updateMessageStatusBulk(old, messageIds, "READ"),
      );

      qc.setQueryData(["conversations"], (old: any[]) => {
        if (!old) return old;
        return old.map((convo: any) => {
          if (convo.participant?.id !== senderId) return convo;
          return {
            ...convo,
            unreadCount: 0,
            lastMessage: convo.lastMessage
              ? { ...convo.lastMessage, status: "READ" }
              : convo.lastMessage,
          };
        });
      });
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
