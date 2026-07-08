import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { BadgeResponse } from "@/types/badge.type";

// Get all badges or search by name
export const getAllBadges = async (keyword?: string): Promise<BadgeResponse[]> => {
  const response = await api.get<APIResponse<BadgeResponse[]>>(
    "/admin/gamification/badges",
    {
      params: { keyword },
    }
  );
  return response.data.result;
};

// Get badge by ID
export const getBadgeById = async (badgeId: number): Promise<BadgeResponse> => {
  const response = await api.get<APIResponse<BadgeResponse>>(
    `/admin/gamification/badges/${badgeId}`
  );
  return response.data.result;
};

// Create a new badge (Form-data)
export const createBadge = async (data: FormData): Promise<BadgeResponse> => {
  const response = await api.post<APIResponse<BadgeResponse>>(
    "/admin/gamification/badges",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.result;
};

// Update an existing badge (Form-data)
export const updateBadge = async (
  badgeId: number,
  data: FormData
): Promise<BadgeResponse> => {
  const response = await api.put<APIResponse<BadgeResponse>>(
    `/admin/gamification/badges/${badgeId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.result;
};

// Delete a badge
export const deleteBadge = async (badgeId: number): Promise<BadgeResponse> => {
  const response = await api.delete<APIResponse<BadgeResponse>>(
    `/admin/gamification/badges/${badgeId}`
  );
  return response.data.result;
};
