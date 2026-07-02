export interface UserRequest {
  fullName: string;
  avatarUrl: string;
}

export interface RankInfo {
  rankId: number;
  rankName: string;
  minScore: number;
  maxScore: number;
  storageBonus: number;
  displayPriority: string;
}

export interface UserRank {
  userRankId: number;
  userId: number;
  rank: RankInfo;
  achievedAt: string;
  updatedAt: string;
}

export interface BadgeInfo {
  badgeId: number;
  badgeName: string;
  description: string;
  conditionText: string;
  iconUrl: string | null;
}

export interface UserBadge {
  userBadgeId: number;
  userId: number;
  badge: BadgeInfo;
  achievedAt: string;
}

export interface UserResponse {
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  totalScore: number;
  email: string;
  role: "US" | "AD";
  status: "PENDING" | "ACTIVE" | "BANNED";
  storageUsed: number;
  storageLimit: number;
  rank?: UserRank | null;
  badges?: UserBadge[];
  createdAt?: string;
  accessToken?: string;
}