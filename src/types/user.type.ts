export interface UpdateProfileRequest {
  fullName: string;
  avatar?: File | null;
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

export interface ProfileStatistics {
  documents: number;
  downloads: number;
  bookmarks: number;
}

export interface RankProgress {
  nextRank: string | null;
  remainingScore: number | null;
  progressPercent: number | null;
}

export interface LeaderboardInfo {
  globalRank: number | null;
  weeklyRank: number | null;
}

export interface UserResponse {
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  totalScore: number;
  email: string;
  role: "US" | "AD";
  status: "PENDING" | "ACTIVE" | "BANNED";
  displayRole?: string;
  displayStatus?: string;
  createdAt?: string;

  storageUsed: number;
  storageLimit: number;
  storageRemaining?: number | null;
  storageUsagePercent?: number | null;

  currentRank?: UserRank | null;
  rankProgress?: RankProgress | null;
  badges?: UserBadge[];
  statistics?: ProfileStatistics | null;
  leaderboard?: LeaderboardInfo | null;
  unreadNotificationCount?: number | null;

  accessToken?: string;
}
