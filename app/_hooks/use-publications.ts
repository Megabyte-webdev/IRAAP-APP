"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";

export const usePublication = () => {
  const queryClient = useQueryClient();

  // Submit a publication request
  const submitPublication = useMutation({
    mutationFn: async (publicationData: FormData) => {
      const { data } = await api.post(
        "/publications/request",
        publicationData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      onSuccess({
        title: "Publication Submitted",
        message:
          "Your publication request has been submitted and is awaiting approval.",
      });

      queryClient.invalidateQueries({
        queryKey: ["my-publications"],
      });
    },

    onError: (error: any) => {
      onFailure({
        title: "Submission Failed",
        message: extractErrorMessage(error) || "Unable to submit publication.",
      });
    },
  });

  // Get current user's submitted publications
  const getMyPublications = () =>
    useQuery({
      queryKey: ["my-publications"],

      queryFn: async () => {
        const { data } = await api.get("/publications/me");

        return data?.publications || [];
      },

      refetchOnWindowFocus: true,
    });

  // Get public approved publications
  const getPublications = ({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }) =>
    useQuery({
      queryKey: ["publications", page, limit],

      queryFn: async () => {
        const { data } = await api.get("/publications", {
          params: {
            page,
            limit,
          },
        });

        return data;
      },
    });

  // Get single publication
  const getPublicationById = (id: number) =>
    useQuery({
      queryKey: ["publication", id],

      queryFn: async () => {
        const { data } = await api.get(`/publications/${id}`);

        return data?.publication || null;
      },

      enabled: !!id,
    });

  const getPendingPublications = () =>
    useQuery({
      queryKey: ["admin-publications"],

      queryFn: async () => {
        const { data } = await api.get("/publications/pending");

        return data?.publications || [];
      },
    });

  // Admin approve publication
  const approvePublication = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/publications/${id}/approve`);

      return data;
    },

    onSuccess: () => {
      onSuccess({
        title: "Publication Approved",
        message: "The publication is now publicly available.",
      });

      queryClient.invalidateQueries({
        queryKey: ["publications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-publications"],
      });
    },

    onError: (error: any) => {
      onFailure({
        title: "Approval Failed",
        message: extractErrorMessage(error) || "Could not approve publication.",
      });
    },
  });

  // Admin reject publication
  const rejectPublication = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const { data } = await api.patch(`/publications/${id}/reject`, {
        reason,
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-publications"],
      });

      onSuccess({
        title: "Publication Rejected",
        message: "Publication request has been rejected.",
      });
    },

    onError: (error: any) => {
      onFailure({
        title: "Rejection Failed",
        message: extractErrorMessage(error) || "Could not reject publication.",
      });
    },
  });

  return {
    submitPublication,
    getMyPublications,
    getPendingPublications,
    getPublications,
    getPublicationById,
    approvePublication,
    rejectPublication,
  };
};
