import { useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";

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
  return { getCategories, getSearchResults };
};

export default useSearch;
