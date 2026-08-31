"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { keepPreviousData } from "@tanstack/react-query";

const useSearch = () => {
  const getCategories = () =>
    useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const { data } = await api.get("/search/categories");
        return data?.categories || [];
      },
      staleTime: 1000 * 60 * 30,
      placeholderData: keepPreviousData,
    });

  const getSearchResults = (query: any) =>
    useQuery({
      queryKey: ["searchResults", query],
      queryFn: async () => {
        const { data } = await api.get("/projects", {
          params: { ...query, status: query?.status || "APPROVED" },
        });
        return data;
      },
      enabled: !!query,
      placeholderData: keepPreviousData,
    });

  const useHome = () =>
    useQuery({
      queryKey: ["home"],
      queryFn: async () => {
        const { data } = await api.get("/search/homepage-data");
        return data;
      },
      staleTime: 1000 * 60 * 5,
    });

  const getFilterOptions = () =>
    useQuery({
      queryKey: ["filterOptions"],
      queryFn: async () => {
        const { data } = await api.get("/search/filter-options");
        return data;
      },
      staleTime: 1000 * 60 * 15,
    });

  return { getCategories, getSearchResults, useHome, getFilterOptions };
};

export default useSearch;
