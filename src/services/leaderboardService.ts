import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  BadgeResponse,
  RankResponse,
  TopWeeklyUserResponse,
  UserBadgeResponse,
  UserRankHistoryResponse,
} from "@/types/leaderboard.type";

export const getTopWeeklyUsers = async (
  limit = 10,
): Promise<TopWeeklyUserResponse[]> => {
  const response = await api.get<APIResponse<TopWeeklyUserResponse[]>>(
    "/user/top-weekly",
    {
      params: { limit },
    },
  );

  return response.data.result;
};

export const getRanks = async (): Promise<RankResponse[]> => {
  const response = await api.get<APIResponse<RankResponse[]>>("/user/ranks");

  return response.data.result;
};

export const getBadges = async (): Promise<BadgeResponse[]> => {
  const response = await api.get<APIResponse<BadgeResponse[]>>("/user/badges");

  return response.data.result;
};

export const getUserRankHistory = async (
  userId: number,
): Promise<UserRankHistoryResponse> => {
  const response = await api.get<APIResponse<UserRankHistoryResponse>>(
    `/user/users/${userId}/ranks/history`,
  );

  return response.data.result;
};

export const getUserBadges = async (
  userId: number,
): Promise<UserBadgeResponse[]> => {
  const response = await api.get<APIResponse<UserBadgeResponse[]>>(
    `/user/users/${userId}/badges`,
  );

  return response.data.result;
};