export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface LeaderboardResponse {
  rank: number;
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  totalScore: number;
  rankName: string;
  rankIcon: string | null;
  rankColor: string | null;
  rankTextColor: string | null;
}

export interface GlobalLeaderboardResponse {
  rank: number;
  totalUsers: number;
}

export interface TopWeeklyUserResponse {
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  email: string;
  score: number;
  weekStart: string;
}

export interface RankResponse {
  rankId: number;
  rankName: string;
  minScore: number;
  maxScore: number;
  storageBonus: number;
  displayPriority: string;
  iconUrl: string | null;
  color: string | null;
  badgeColor: string | null;
  textColor: string | null;
}

export interface BadgeResponse {
  badgeId: number;
  badgeName: string;
  description: string;
  conditionText: string;
  iconUrl: string | null;
}

export interface UserRankHistoryResponse {
  userRankId: number;
  userId: number;
  rank: RankResponse;
  achievedAt: string;
  updatedAt: string;
}

export interface UserBadgeResponse {
  userBadgeId: number;
  userId: number;
  badge: BadgeResponse;
  achievedAt: string;
}
