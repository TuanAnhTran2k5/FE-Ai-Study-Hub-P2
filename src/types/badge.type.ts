export interface BadgeResponse {
  badgeId: number;
  badgeName: string;
  description: string;
  conditionText: string;
  iconUrl: string;
  requiredDownloads: number;
}

export interface BadgeRequest {
  badgeName: string;
  description: string;
  requiredDownloads: number;
  iconFile: File | null;
}
