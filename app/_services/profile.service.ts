import { ReactNode } from "react";
import { api } from "../_lib/api-client";

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  supervisorId?: number | null;
  emailVerifiedAt?: string | null;
  profileImageUrl?: string | null;
  phone?: string | null;
  matricNumber?: string | null;
  department?: string | null;
  programme?: string | null;
  level?: string | null;
  academicSession?: string | null;
  bio?: string | null;
  profileCompletedAt?: string | null;
  profileComplete: boolean;
  organizationRole?: string | null;
  organization?: {
    id: number;
    name: string;
    slug: string;
    code?: string | null;
  } | null;
  organizations?: Array<{
    organizationName: string;
    organizationId: any;
    id: number;
    name: string;
    slug: string;
    code?: string | null;
    role: string;
    department?: string | null;
    joinedAt?: string | null;
  }>;
}
export type UserRole = "STUDENT" | "SUPERVISOR" | "RESEARCHER" | "MANAGER";

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  matricNumber?: string;
  department?: string;
  programme?: string;
  level?: string;
  academicSession?: string;
  bio?: string;
}

export const profileService = {
  async getMe() {
    const { data } = await api.get<{ success: boolean; profile: UserProfile }>(
      "/profile/me",
    );
    if (!data.success) throw new Error("Unable to load your profile.");
    return data.profile;
  },

  async update(payload: UpdateProfilePayload) {
    const { data } = await api.patch<{
      success: boolean;
      profile: UserProfile;
      message?: string;
    }>("/profile/me", payload);
    if (!data.success)
      throw new Error(data.message || "Unable to update your profile.");
    return data.profile;
  },

  async uploadImage(file: File) {
    const body = new FormData();
    body.append("image", file);
    const { data } = await api.post<{
      success: boolean;
      profile: UserProfile;
      message?: string;
    }>("/profile/me/image", body, {});
    if (!data.success)
      throw new Error(data.message || "Unable to update your profile photo.");
    return data.profile;
  },
};
