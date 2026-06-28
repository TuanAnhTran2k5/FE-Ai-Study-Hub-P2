export interface TopWeeklyUserResponse {
  userId: number;
  fullName: string;
  avatarUrl?: string | null;
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
}

export interface BadgeResponse {
  badgeId: number;
  badgeName: string;
  description: string;
  conditionText: string;
  iconUrl: string;
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