import { useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";

interface FilterOptions {
  keywords: string[];
  years: number[];
  supervisors: Array<{ id: number; name: string }>;
}
const useSearch = () => {
  const getCategories = () =>
    useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const { data } = await api.get("/search/categories");
        return data?.categories || [];
      },
    });

  const getSearchResults = (query: any) =>
    useQuery({
      queryKey: ["searchResults", query],
      queryFn: async () => {
        const { data } = await api.get(
          `/search/projects?title=${query.title || ""}&year=${query.year || ""}&researchArea=${query.researchArea || ""}&methodology=${query.methodology || ""}`,
        );
        console.log(data);

        return data?.projects || [];
      },
      enabled: !!query,
    });

  const useHome = () => {
    return useQuery({
      queryKey: ["home"],
      queryFn: async () => {
        const { data } = await api.get("/search/homepage-data");
        return data;
      },
    });
  };

  const getFilterOptions = () => {
    return useQuery({
      queryKey: ["filterOptions"],
      queryFn: async () => {
        const { data } = await api.get("/search/filter-options");
        return data;
      },
    });
  };

  return { getCategories, getSearchResults, useHome, getFilterOptions };
};

export default useSearch;
