export interface StatisticCard {
  value: number;
  growthRate: string;
}

export interface SystemStatisticsResponse {
  totalActiveUsers: StatisticCard;
  totalDocuments: StatisticCard;
  totalDownloads: StatisticCard;
  totalAiQueries: StatisticCard;
}

export interface SubjectDistributionResponse {
  subjectName: string;
  documentCount: number;
  percentage: number;
}

export interface SystemHealthResponse {
  apiGatewayStatus: string;
  activeRagNodes: number;
  poolAvailablePercent: number;
}

export interface ActivityTrendResponse {
  date: string;
  newUsers: number;
  newDocuments: number;
  newDownloads: number;
  aiQueries: number;
}

export interface AdminUserResponse {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: "AD" | "US";
  status: "ACTIVE" | "BANNED" | "PENDING";
  totalScore: number;
  createdAt: string;
  
  // Ban info
  banReason: string | null;
  bannedAt: string | null;
  bannedByName: string | null;
  
  // Quick stats
  activeDocumentCount: number;
  documentDownloadsReceived: number;
}

export interface BanUserRequest {
  reason: string;
}

export interface ModerationSummaryResponse {
  pendingReportCasesCount: number;
  reportedDocumentsCount: number;
  pendingUploadDocumentsCount: number;
  totalBannedUsersCount: number;
  totalPendingUsersCount?: number;
}

