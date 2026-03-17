"use client";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

export const useProject = () => {
  const queryClient = new QueryClient();
  const submitProject: any = useMutation({
    mutationFn: async (projectData: any) => {
      const { data } = await api.post("/projects/submit", projectData);
      return data;
    },
    onSuccess: () => {
      toast.success("Project submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const getProjects = () =>
    useQuery({
      queryKey: ["projects"],
      queryFn: async () => {
        const { data } = await api.get("/projects/submissions");
        return data?.projects || [];
      },
    });

  return { submitProject, getProjects };
};
