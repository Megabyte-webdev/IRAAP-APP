"use client";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";
import { ReviewTask } from "../_utils/types";

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

  const getProjectReviews = (projectId: number) =>
    useQuery<ReviewTask[]>({
      queryKey: ["project-reviews", projectId],
      queryFn: async () => {
        const { data } = await api.get(`/reviews/${projectId}`);
        return data?.data || []; // now includes tasks
      },
      enabled: !!projectId,
    });

  const getProjectById = (id: number) =>
    useQuery({
      queryKey: ["project", id],
      queryFn: async () => {
        const { data } = await api.get(`/projects/${id}`);
        return data?.project || null;
      },
    });

  const updateTaskByStudent = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: number;
      status?: "IN_PROGRESS" | "COMPLETED";
    }) => {
      const { data } = await api.patch(`/reviews/tasks/${taskId}`, {
        status,
      });
      return data;
    },
    onSuccess: (_, { taskId, projectId }: any) => {
      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
      });
    },
  });

  return {
    submitProject,
    updateProject,
    getProjects,
    getProjectById,
    getProjectReviews,
    updateTaskByStudent,
  };
};
