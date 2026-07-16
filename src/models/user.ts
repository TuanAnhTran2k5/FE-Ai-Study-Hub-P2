export interface User {
  userId: number;

  fullName: string;
  avatarUrl: string | null;

  totalScore: number;

  email: string;

  role: "US" | "AD";

  storageUsed: number;
  storageLimit: number;

  status: "PENDING" | "ACTIVE" | "BANNED";

  accessToken?: string;
}