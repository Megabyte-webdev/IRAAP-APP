import { QueryClient } from "@tanstack/react-query";

/**
 * Normalizes an optimistic message to match server response structure
 * Server sends back: { id, type, status, metadata, senderId, createdAt, content, ... }
 * We need to ensure all fields are present
 */
export function normalizeMessage(msg: any) {
  return {
    id: msg.id,
    clientId: msg.clientId ?? null,
    conversationId: msg.conversationId ?? -1,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    content: msg.content,
    type: msg.type ?? "TEXT",
    messageType: msg.messageType ?? msg.type,
    metadata: msg.metadata ?? {},
    status: msg.status ?? "PENDING",
    createdAt: msg.createdAt,
    replyToMessageId: msg.replyToMessageId ?? null,
    readAt: msg.readAt ?? null,
    externalMeetingId: msg.externalMeetingId ?? null,
    externalMeetingUrl: msg.externalMeetingUrl ?? null,
    sender: msg.sender ?? {
      id: msg.senderId,
      fullName: "Unknown",
      role: "STUDENT",
    },
    replyTo: msg.replyTo ?? null,
  };
}

/**
 * Create initial cache structure if it doesn't exist
 */
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

/**
 * Append a new message to the paginated messages cache
 */
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

/**
 * Replace a pending optimistic message with the actual server response
 * Matches by clientId or temporary id
 */
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

/**
 * Append message to cache (alternative signature)
 */
export function appendToCache(qc: QueryClient, userId: number, msg: any) {
  qc.setQueryData(["messages", userId], (old: any) => {
    return appendMessage(old, msg);
  });
}

/**
 * Update a single message status (DELIVERED, READ)
 */
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

/**
 * Update multiple messages status (bulk read receipts)
 */
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

/**
 * Update conversations cache when a new message arrives
 * Matches participant by id and updates lastMessage + unreadCount
 */
export const updateConversationLastMessage = (
  qc: QueryClient,
  msg: any,
  authUserId?: number,
) => {
  qc.setQueryData(["conversations"], (old: any) => {
    if (!old?.pages) {
      return old;
    }

    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((conversation: any) => {
          const participantId = conversation.participant?.id;

          // Check if this message belongs to this conversation
          const isConversation =
            participantId === msg.senderId || participantId === msg.receiverId;

          if (!isConversation) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: msg,
          };
        }),
      })),
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
          conversation.participant?.id === participantId
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
