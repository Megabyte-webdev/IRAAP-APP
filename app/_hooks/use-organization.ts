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


  return { getOrganizations, createOrganization, getMembers, importMembers, getAnalytics };
};


export const useManager = () => {
  const queryClient = useQueryClient();

  const getDashboard = () => useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: async () => (await api.get("/manager/dashboard")).data,
  });

  const getMembers = () => useQuery({
    queryKey: ["manager-members"],
    queryFn: async () => (await api.get("/manager/members")).data?.members || [],
  });


  const addMember = useMutation({
    mutationFn: async (payload: { fullName: string; email: string; role: "STUDENT" | "SUPERVISOR" | "RESEARCHER"; department?: string }) =>
      (await api.post("/manager/members", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-members"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      onSuccess({ title: "Member added", message: "The organization member has been added successfully." });
    },
    onError: (error: any) => onFailure({ title: "Could not add member", message: extractErrorMessage(error) || "Unable to add member." }),
  });

  const addManager = useMutation({
    mutationFn: async (payload: { fullName: string; email: string; department?: string }) =>
      (await api.post("/manager/managers", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-members"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      onSuccess({ title: "Manager added", message: "The organization manager has been added successfully." });
    },
    onError: (error: any) => onFailure({ title: "Could not add manager", message: extractErrorMessage(error) || "Unable to add manager." }),
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, ...payload }: { userId: number; role: "STUDENT" | "SUPERVISOR" | "RESEARCHER" | "MANAGER"; department?: string }) =>
      (await api.patch(`/manager/members/${userId}/role`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-members"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      onSuccess({ title: "Role updated", message: "The organization role has been updated." });
    },
    onError: (error: any) => onFailure({ title: "Role update failed", message: extractErrorMessage(error) || "Unable to update member role." }),
  });

  const removeMember = useMutation({
    mutationFn: async (userId: number) => (await api.delete(`/manager/members/${userId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-members"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      onSuccess({ title: "Member removed", message: "The member is no longer in this organization." });
    },
    onError: (error: any) => onFailure({ title: "Removal failed", message: extractErrorMessage(error) || "Unable to remove member." }),
  });

  const getBilling = () => useQuery({
    queryKey: ["manager-billing"],
    queryFn: async () => (await api.get("/manager/billing")).data,
  });

  const startCheckout = useMutation({
    mutationFn: async (planCode: "INSTITUTION" | "ENTERPRISE") =>
      (await api.post("/manager/billing/checkout", { planCode })).data,
    onSuccess: (data) => {
      if (data?.authorizationUrl) window.location.assign(data.authorizationUrl);
    },
    onError: (error: any) => onFailure({ title: "Payment could not start", message: extractErrorMessage(error) || "Unable to start payment." }),
  });

  return { getDashboard, getMembers, addMember, addManager, updateRole, removeMember, getBilling, startCheckout };
};
