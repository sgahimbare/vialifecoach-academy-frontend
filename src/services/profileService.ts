import { apiRequest } from "@/lib/api";
import type { User } from "@/types";

export type ProfileUpdatePayload = {
  name?: string;
  photo_url?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  bio?: string | null;
};

type UpdateResponse = {
  success?: boolean;
  data?: User;
};

export const profileService = {
  async updateProfile(token: string, payload: ProfileUpdatePayload) {
    const result = await apiRequest<UpdateResponse>("/auth/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return result?.data || null;
  },
};
