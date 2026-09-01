import { api } from "../_lib/api-client";

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: "STUDENT" | "SUPERVISOR" | "ADMIN";
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
}

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
    const { data } = await api.get<{ success: boolean; profile: UserProfile }>("/profile/me");
    if (!data.success) throw new Error("Unable to load your profile.");
    return data.profile;
  },

  async update(payload: UpdateProfilePayload) {
    const { data } = await api.patch<{ success: boolean; profile: UserProfile; message?: string }>(
      "/profile/me",
      payload,
    );
    if (!data.success) throw new Error(data.message || "Unable to update your profile.");
    return data.profile;
  },

  async uploadImage(file: File) {
    const body = new FormData();
    body.append("image", file);
    const { data } = await api.post<{ success: boolean; profile: UserProfile; message?: string }>(
      "/profile/me/image",
      body,
      {},
    );
    if (!data.success) throw new Error(data.message || "Unable to update your profile photo.");
    return data.profile;
  },
};
