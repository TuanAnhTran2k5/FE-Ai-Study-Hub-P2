import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  BadgeResponse,
  GlobalLeaderboardResponse,
  LeaderboardResponse,
  PageResponse,
  RankResponse,
  TopWeeklyUserResponse,
  UserBadgeResponse,
  UserRankHistoryResponse,
} from "@/types/leaderboard.type";

export const getGlobalLeaderboard = async (
  page = 0,
  size = 10,
): Promise<PageResponse<LeaderboardResponse>> => {
  const response = await api.get<
    APIResponse<PageResponse<LeaderboardResponse>>
  >("/user/leaderboard", {
    params: { page, size },
  });

  return response.data.result;
};

export const getMyLeaderboardRank =
  async (): Promise<GlobalLeaderboardResponse> => {
    const response = await api.get<APIResponse<GlobalLeaderboardResponse>>(
      "/user/leaderboard/me",
    );

    return response.data.result;
  };

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
