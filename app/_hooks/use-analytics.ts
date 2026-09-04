"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";

export const useAnalytics = () => useQuery({
  queryKey: ["advanced-analytics"],
  queryFn: async () => (await api.get("/analytics")).data?.analytics || {},
});
