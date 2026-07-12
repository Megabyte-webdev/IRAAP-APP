"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { ReviewTask } from "../_utils/types";
import { onFailure, onSuccess } from "../_utils/Notification";

export const useProject = () => {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
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
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
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
      queryKey: ["my-projects"],
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
      refetchOnWindowFocus: "always",
    });

  const getProjectVersionHistory = (projectId: number) =>
    useQuery({
      queryKey: ["project-history", projectId],
      queryFn: async () => {
        const { data } = await api.get(`/projects/${projectId}/history`);
        return data || null;
      },
      enabled: !!projectId,
    });

  const getProjectById = (id: number) =>
    useQuery({
      queryKey: ["project", id],
      queryFn: async () => {
        const { data } = await api.get(`/projects/${id}`);
        return data?.project?.[0] || null;
      },
      enabled: !!id,
      refetchOnWindowFocus: "always",
    });

  const submitRevisionForReview = useMutation({
    mutationFn: async ({
      reviewId,
      file,
      changeNote,
    }: {
      reviewId: number;
      file: File;
      changeNote?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      if (changeNote) {
        formData.append("changeNote", changeNote);
      }

      const { data } = await api.post(`/reviews/${reviewId}/submit`, formData);

      return data;
    },

    onSuccess: (data) => {
      const reviewId = data?.revisionVersion?.linkedReviewId;
      const projectId = data?.projectId;

      queryClient.setQueryData(["project-reviews", projectId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((review: any) =>
            review.id === reviewId
              ? {
                  ...review,
                  revisionSubmitted: data?.revisionSubmitted || true,
                  ...data,
                }
              : review,
          ),
        };
      });

      onSuccess({
        title: "Revision Submitted",
        message: "Your revised project has been submitted successfully.",
      });
    },
  });

  const getAllProjects = (
    filters: {
      status?: string;
      categoryId?: number;
      limit?: number;
      title?: string;
      year?: number;
      researchArea?: string;
      methodology?: string;
      researchType?: string;
      keyword?: string | string[];
    } = {},
  ) => {
    const { limit = 20, status = "APPROVED", ...restFilters } = filters;

    return useInfiniteQuery({
      queryKey: ["all-projects", status, limit, restFilters],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const { data } = await api.get("/projects", {
          params: {
            page: pageParam,
            limit,
            status,
            ...restFilters,
          },
        });
        return data;
      },
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  };

  const releaseProject = useMutation({
    mutationFn: async (projectId: number) => {
      const { data } = await api.get(`/projects/${projectId}/release`);
      return data;
    },
    onSuccess: (_, projectId) => {
      queryClient.setQueryData(["project", projectId], (oldProject: any) => {
        if (!oldProject) return oldProject;

        return {
          ...oldProject,
          isSignaledForPublication: true,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  const publishProject = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await api.post(`/projects/${projectId}/publish`);

      return response.data;
    },

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  return {
    submitProject,
    updateProject,
    getProjects,
    releaseProject,
    getAllProjects,
    getProjectVersionHistory,
    getProjectById,
    getProjectReviews,
    submitRevisionForReview,
    publishProject,
  };
};
