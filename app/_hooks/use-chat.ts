"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";

export const useChat = () => {
  const getConversations = () =>
    useQuery({
      queryKey: ["conversations"],
      queryFn: async () => {
        const { data } = await api.get("/chat/conversations");
        return data?.data || [];
      },
    });

  const getChatableUsers = () =>
    useQuery({
      queryKey: ["chatUsers"],
      queryFn: async () => {
        const { data } = await api.get("/chat/users");
        return data?.data || [];
      },
    });

  const getChatUserById = (userId: number) =>
    useQuery({
      queryKey: ["chatUser", userId],
      queryFn: async () => {
        const { data } = await api.get(`/chat/users/${userId}`);
        return data?.data || null;
      },
      enabled: !!userId,
    });

  const getMessages = (userId: number) =>
    useInfiniteQuery({
      queryKey: ["messages", userId],
      // v5 requires initialPageParam — this is the cursor for the first fetch
      // null means "no cursor yet, fetch the latest 30 messages"
      initialPageParam: null as number | null,
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({ limit: "30" });
        if (pageParam) params.set("before", String(pageParam));
        const { data } = await api.get(
          `/chat/messages/${userId}?${params.toString()}`,
        );
        return data;
      },
      // nextCursor is null when there are no older pages left
      getNextPageParam: (lastPage: any) =>
        lastPage.pagination.nextCursor ?? null,
      enabled: !!userId,
    });

  const transmitMessage = () => {};
  return {
    getConversations,
    getChatableUsers,
    getChatUserById,
    getMessages,
    transmitMessage,
  };
};

export default useChat;
