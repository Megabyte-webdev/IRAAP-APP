import { QueryClient } from "@tanstack/react-query";

interface CreateOptimisticMessageArgs {
  clientId: string | number;
  content: string;
  msgType: string; // e.g., 'TEXT', 'MEDIA', 'MEETING'
  authDetails: {
    user: { id: string | number; fullName: string; role: string };
  };
  selectedChat: { id: string | number };
  meeting?: any;
  replyTo?: {
    id: number;
    content: string;
    senderId: number;
    createdAt: string | Date;
  } | null;
}

export function createOptimisticMessage({
  clientId,
  content,
  msgType,
  authDetails,
  selectedChat,
  meeting = null,
  replyTo = null,
}: CreateOptimisticMessageArgs) {
  const now = new Date().toISOString();
  const userId = Number(authDetails?.user?.id);

  return {
    id: clientId,
    clientId,
    conversationId: -1,

    senderId: userId,
    receiverId: Number(selectedChat?.id),

    content,
    msgType,

    meeting,

    status: "PENDING" as const,
    createdAt: now,
    readAt: null,

    replyToMessageId: replyTo?.id ?? null,

    sender: {
      id: userId,
      fullName: authDetails?.user?.fullName ?? "You",
      role: authDetails?.user?.role ?? "USER",
    },

    replyTo: replyTo
      ? {
          id: replyTo.id,
          content: replyTo.content,
          senderId: replyTo.senderId,
          createdAt: replyTo.createdAt,
        }
      : null,
  };
}

export function normalizeMessage(msg: any) {
  const meeting = msg.meeting ?? {};

  return {
    id: msg.id,
    clientId: msg.clientId ?? null,
    conversationId: msg.conversationId ?? -1,

    senderId: msg.senderId,
    receiverId: msg.receiverId ?? null,

    content: msg.content,

    msgType: msg.msgType ?? "TEXT",

    meeting: {
      msgType: "CALL_INVITE",
      ...meeting,
    },

    status: msg.status ?? "PENDING",
    createdAt: msg.createdAt,
    readAt: msg.readAt ?? null,

    replyToMessageId: msg.replyToMessageId ?? null,

    sender: msg.sender ?? {
      id: msg.senderId,
      fullName: "Unknown",
      role: "STUDENT",
    },

    replyTo: msg.replyTo ?? null,
  };
}

export function initializeCacheIfNeeded(old: any) {
  if (!old) {
    return {
      pages: [
        {
          data: [],
          conversationId: null,
        },
      ],
      pageParams: [undefined],
    };
  }
  return old;
}

export const appendMessage = (old: any, message: any) => {
  // Initialize if cache doesn't exist
  if (!old) {
    return {
      pages: [{ data: [normalizeMessage(message)] }],
      pageParams: [undefined],
    };
  }

  if (!old.pages?.length) {
    return {
      ...old,
      pages: [{ data: [normalizeMessage(message)] }],
    };
  }

  const normalized = normalizeMessage(message);
  const pages = [...old.pages];
  const lastPage = pages[pages.length - 1];

  pages[pages.length - 1] = {
    ...lastPage,
    data: [...(lastPage.data ?? []), normalized],
  };

  return {
    ...old,
    pages,
  };
};

export const replacePendingMessage = (old: any, payload: any) => {
  if (!old?.pages) return old;

  const normalized = normalizeMessage(payload);

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        m.id === payload.clientId ||
        m.clientId === payload.clientId ||
        m.id === payload.id
          ? normalized
          : m,
      ),
    })),
  };
};

export function appendToCache(qc: QueryClient, userId: number, msg: any) {
  qc.setQueryData(["messages", userId], (old: any) => {
    return appendMessage(old, msg);
  });
}

export function updateMessageStatus(
  old: any,
  messageId: number | string,
  status: "DELIVERED" | "READ",
) {
  if (!old?.pages) return old;

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        m.id === messageId || m.clientId === messageId ? { ...m, status } : m,
      ),
    })),
  };
}

export function updateMessageStatusBulk(
  old: any,
  messageIds: (number | string)[],
  status: "DELIVERED" | "READ",
) {
  if (!old?.pages) return old;

  const idSet = new Set(messageIds);

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        idSet.has(m.id) || idSet.has(m.clientId) ? { ...m, status } : m,
      ),
    })),
  };
}

export const updateConversationLastMessage = (
  qc: QueryClient,
  msg: any,
  authUserId?: number,
) => {
  qc.setQueryData(["conversations"], (old: any) => {
    if (!old?.pages?.length) return old;

    const pages = [...old.pages];
    const firstPage = { ...pages[0] };
    const conversations = [...firstPage.data];

    const index = conversations.findIndex(
      (conversation: any) =>
        conversation.id === msg.conversationId ||
        String(conversation.user?.id) === String(msg.senderId),
    );

    const lastMessage = {
      ...msg,
      metadata: {
        msgType: msg.msgType,
      },
    };

    if (index !== -1) {
      const existing = conversations[index];

      conversations.splice(index, 1);

      conversations.unshift({
        ...existing,
        lastMessage,
        updatedAt: msg.createdAt,
        unreadCount:
          String(msg.senderId) === String(authUserId)
            ? (existing.unreadCount ?? 0)
            : (existing.unreadCount ?? 0) + 1,
      });
    } else {
      // Only create if truly new
      conversations.unshift({
        id: msg.conversationId,

        user: {
          id: msg.sender.id,
          fullName: msg.sender.fullName,
          role: msg.sender.role,
        },

        lastMessage,

        updatedAt: msg.createdAt,

        unreadCount: msg.senderId === authUserId ? 0 : 1,
      });
    }

    firstPage.data = conversations;
    pages[0] = firstPage;

    return {
      ...old,
      pages,
    };
  });
};

export function clearUnreadInCache(qc: QueryClient, participantId: number) {
  qc.setQueryData(["conversations"], (old: any) => {
    if (!old?.pages) return old;

    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((conversation: any) =>
          conversation.user?.id === participantId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      })),
    };
  });
}

/**
 * Synchronize incoming WebSocket message with cache
 * Handles replacement of pending optimistic messages
 * and bulk read receipt updates
 */
export function syncMessageWithCache(
  qc: QueryClient,
  userId: number,
  payload: any,
) {
  qc.setQueryData(["messages", userId], (old: any) => {
    if (!old?.pages) return old;

    // If payload contains messageIds (bulk operation), update status
    if (Array.isArray(payload.messageIds)) {
      return updateMessageStatusBulk(old, payload.messageIds, payload.status);
    }

    // If it's a single message with clientId, replace pending
    if (payload.clientId) {
      return replacePendingMessage(old, payload);
    }

    // Otherwise, treat as new message
    return appendMessage(old, payload);
  });
}
