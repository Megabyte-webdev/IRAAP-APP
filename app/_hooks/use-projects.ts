"use client";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { ReviewTask } from "../_utils/types";
import { onFailure, onSuccess } from "../_utils/Notification";

export const useProject = () => {
  const queryClient = new QueryClient();
  const submitProject: any = useMutation({
    mutationFn: async (projectData: any) => {
      const { data } = await api.post("/projects/submit", projectData);
      return data;
    },
    onSuccess: () => {
      onSuccess({
        title: "Submission Received",
        message: "Your project has been submitted and is now awaiting review.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      onFailure({
        title: "Submission Failed",
        message:
          extractErrorMessage(error) ||
          "We couldn't submit your project. Please try again.",
      });
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
      onSuccess({
        title: "Changes Saved",
        message: "Your project details have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      onFailure({
        title: "Update Failed",
        message:
          extractErrorMessage(error) ||
          "Failed to save changes. Please check your connection.",
      });
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

  return {
    submitProject,
    updateProject,
    getProjects,
    getProjectById,
    getProjectReviews,
  };
};
