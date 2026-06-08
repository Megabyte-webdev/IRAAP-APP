import { QueryClient } from "@tanstack/react-query";

export const appendMessage = (old: any, message: any) => {
  if (!old?.pages?.length) return old;

  const pages = [...old.pages];
  const lastPage = pages[pages.length - 1];

  pages[pages.length - 1] = {
    ...lastPage,
    data: [...lastPage.data, message],
  };

  return {
    ...old,
    pages,
  };
};

export const replacePendingMessage = (old: any, payload: any) => {
  if (!old?.pages) return old;

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        m.id === payload.clientId || m.clientId === payload.clientId
          ? {
              ...payload,
              sender: m.sender,
            }
          : m,
      ),
    })),
  };
};

export function appendToCache(qc: QueryClient, userId: number, msg: any) {
  qc.setQueryData(["messages", userId], (old: any) => {
    if (!old) return old;
    const pages = [...old.pages];
    const last = { ...pages[pages.length - 1] };
    last.data = [...(last.data ?? []), msg];
    pages[pages.length - 1] = last;
    return { ...old, pages };
  });
}

export function updateMessageStatus(
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

export function updateMessageStatusBulk(
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

export const updateConversationLastMessage = (
  qc: QueryClient,
  msg: any,
  authUserId?: number,
) => {
  qc.setQueryData(["conversations"], (old: any) => {
    if (!old) return old;

    return old.map((conversation: any) => {
      const participantId = conversation.participant.id;

      const isConversation =
        participantId === msg.senderId || participantId === msg.receiverId;

      if (!isConversation) return conversation;

      return {
        ...conversation,
        lastMessage: {
          id: msg.id,
          content: msg.content,
          status: msg.status,
          senderId: msg.senderId,
          createdAt: msg.createdAt,
        },
        updatedAt: msg.createdAt,
        unreadCount:
          msg.senderId !== authUserId
            ? (conversation.unreadCount ?? 0) + 1
            : conversation.unreadCount,
      };
    });
  });
};

export function clearUnreadInCache(qc: QueryClient, participantId: number) {
  qc.setQueryData(["conversations"], (old: any) => {
    if (!old) return old;
    return old.map((convo: any) =>
      convo.participant?.id === participantId
        ? { ...convo, unreadCount: 0 }
        : convo,
    );
  });
}
