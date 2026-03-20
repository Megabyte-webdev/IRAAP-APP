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

  const updateProject: any = useMutation({
    mutationFn: async ({
      id,
      projectData,
    }: {
      id: string;
      projectData: any;
    }) => {
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data;
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const getProjects: any = () =>
    useQuery({
      queryKey: ["projects"],
      queryFn: async () => {
        const { data } = await api.get("/projects/submissions");
        return data?.projects || [];
      },
    });

  const getProjectById = (id: string) =>
    useQuery({
      queryKey: ["project", id],
      queryFn: async () => {
        const { data } = await api.get(`/projects/${id}`);
        return data?.project || null;
      },
    });

  return { submitProject, updateProject, getProjects, getProjectById };
};
