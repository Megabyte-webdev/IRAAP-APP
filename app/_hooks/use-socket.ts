"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../_context/AuthContext";
import { useChatUtils } from "../_context/ChatContext";
import { websocket } from "../_services/websocket";
import { showChatNotification } from "../_services/chatNotification";
import {
  appendMeetingToCache,
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

      if (!msg?.id) return;
      websocket.emit("chat:received", {
        messageId: msg.id,
      });

      const qc = queryClientRef.current;

      appendToCache(qc, msg.senderId, msg);
      const isOwnMessage = msg.senderId === authUserRef.current;
      const otherUserId =
        String(msg.senderId) === String(authUserRef.current)
          ? String(msg.receiverId)
          : String(msg.senderId);

      const isCurrentConversation =
        String(activeUserRef.current) === otherUserId;
      console.log(
        isCurrentConversation,
        activeUserRef.current,
        otherUserId,
        msg,
      );

      updateConversationLastMessage(
        qc,
        msg,
        authUserRef.current,
        isCurrentConversation,
      );
      if (msg.msgType === "CALL_INVITE") {
        appendMeetingToCache(qc, msg);
      }

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

        qc.setQueryData(["messages", msg.senderId], (old: any) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((m: any) =>
                m.id === msg.id
                  ? {
                      ...m,
                      status: "READ",
                      readAt: new Date().toISOString(),
                    }
                  : m,
              ),
            })),
          };
        });

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
      if (real.msgType === "CALL_INVITE") {
        appendMeetingToCache(qc, real);
      }
    };

    const onMessagesBulk = (event: any) => {
      const msgs: any[] = event.payload ?? [];

      const ids = msgs.map((m) => m.id).filter(Boolean);

      if (ids.length) {
        websocket.emit("chat:received:bulk", {
          messageIds: ids,
        });
      }

      msgs.forEach((msg) => {
        const otherUserId =
          String(msg.senderId) === String(authUserRef.current)
            ? String(msg.receiverId)
            : String(msg.senderId);

        updateConversationLastMessage(
          queryClientRef.current,
          msg,
          authUserRef.current,
          String(activeUserRef.current) === otherUserId,
        );
      });

      queryClientRef.current.setQueryData(
        ["messages", activeUserRef.current],
        (old: any) => {
          if (!old?.pages?.length) return old;

          const existing = new Set(
            old.pages.flatMap((p: any) => p.data).map((m: any) => m.id),
          );

          const incoming = msgs.filter((m: any) => !existing.has(m.id));

          if (!incoming.length) return old;

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                data: [...old.pages[0].data, ...incoming],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
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
      const senderId = event.payload?.readerId;

      // Update message statuses
      qc.setQueriesData({ queryKey: ["messages"] }, (old: any) =>
        updateMessageStatusBulk(old, messageIds, "READ"),
      );

      // Update conversation unread count
      qc.setQueryData(["conversations"], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,

          pages: old.pages.map((page: any) => ({
            ...page,

            data: page.data.map((conversation: any) => {
              if (String(conversation.user?.id) !== String(senderId)) {
                return conversation;
              }
              return {
                ...conversation,
                unreadCount: 0,
                lastMessage: conversation.lastMessage
                  ? {
                      ...conversation.lastMessage,
                      status: "READ",
                    }
                  : null,
              };
            }),
          })),
        };
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
