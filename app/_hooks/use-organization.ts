"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { onFailure, onSuccess } from "../_utils/Notification";
import { extractErrorMessage } from "../_lib/utils";

export const useOrganization = () => {
  const queryClient = useQueryClient();

  const getOrganizations = () => useQuery({
    queryKey: ["organizations"],
    queryFn: async () => (await api.get("/organizations")).data?.organizations || [],
  });

  const createOrganization = useMutation({
    mutationFn: async (payload: { name: string; code?: string; description?: string }) =>
      (await api.post("/organizations", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess({ title: "Organization created", message: "The organization is ready for members and research management." });
    },
    onError: (error: any) => onFailure({ title: "Creation failed", message: extractErrorMessage(error) || "Unable to create organization." }),
  });

  const getMembers = (organizationId?: number) => useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: async () => (await api.get(`/organizations/${organizationId}/members`)).data?.members || [],
    enabled: !!organizationId,
  });

  const importMembers = useMutation({
    mutationFn: async (payload: { organizationId: number; members: Array<{ fullName: string; email: string; role: "STUDENT" | "SUPERVISOR" | "RESEARCHER"; department?: string; externalRef?: string }> }) =>
      (await api.post(`/organizations/${payload.organizationId}/import`, payload)).data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization-members", variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess({ title: "Import complete", message: "Organization members have been imported successfully." });
    },
    onError: (error: any) => onFailure({ title: "Import failed", message: extractErrorMessage(error) || "Unable to import organization members." }),
  });

  const getAnalytics = (organizationId?: number) => useQuery({
    queryKey: ["organization-analytics", organizationId],
    queryFn: async () => (await api.get(`/organizations/${organizationId}/analytics`)).data?.analytics || {},
    enabled: !!organizationId,
  });

  const updateSubscription = useMutation({
    mutationFn: async ({ organizationId, ...payload }: { organizationId: number; planCode: string; status: string; startsAt?: string; endsAt?: string | null }) =>
      (await api.put(`/organizations/${organizationId}/subscription`, payload)).data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-analytics", variables.organizationId] });
      onSuccess({ title: "Subscription updated", message: "Subscription settings were updated. Billing enforcement remains isolated." });
    },
    onError: (error: any) => onFailure({ title: "Subscription update failed", message: extractErrorMessage(error) || "Unable to update subscription." }),
  });

  return { getOrganizations, createOrganization, getMembers, importMembers, getAnalytics, updateSubscription };
};
