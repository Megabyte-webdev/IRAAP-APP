"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { useAuth } from "../_context/AuthContext";

export const useChat = () => {
  const { authDetails } = useAuth();
  const getConversations = () =>
    useInfiniteQuery({
      queryKey: ["conversations"],

      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.get("/chat/conversations", {
          params: {
            page: pageParam,
            limit: 20,
          },
        });

        return data;
      },

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;

        if (!pagination) return undefined;

        return pagination.page < pagination.totalPages
          ? pagination.page + 1
          : undefined;
      },

      refetchOnMount: true,
    });

  const getChatableUsers = () =>
    useInfiniteQuery({
      queryKey: ["chatUsers"],

      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.get("/chat/users", {
          params: {
            page: pageParam,
            limit: 20,
          },
        });

        return data;
      },

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;

        if (!pagination) return undefined;

        return pagination.page < pagination.totalPages
          ? pagination.page + 1
          : undefined;
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

      initialPageParam: null as number | null,

      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          limit: "10",
        });

        if (pageParam) {
          params.set("before", String(pageParam));
        }

        const { data } = await api.get(
          `/chat/messages/${userId}?${params.toString()}`,
        );

        return data;
      },

      getNextPageParam: (lastPage: any) => {
        return lastPage?.pagination?.nextCursor ?? undefined;
      },

      enabled: !!userId,
    });

  const getUserSchedules = () =>
    useInfiniteQuery({
      queryKey: ["meetings"],

      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.get(`/meetings`, {
          params: {
            page: pageParam,
            limit: 20,
          },
        });

        return data;
      },

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination.hasMore) {
          return undefined;
        }

        return lastPage.pagination.page + 1;
      },

      enabled: !!authDetails,
    });
  const transmitMessage = () => {};
  return {
    getConversations,
    getChatableUsers,
    getChatUserById,
    getMessages,
    transmitMessage,
    getUserSchedules,
  };
};

export default useChat;
