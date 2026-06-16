export interface UserRequest {
  fullName: string;
  avatarUrl: string;
}

export interface UserResponse {
  id: string;

  fullName: string;
  avatarUrl: string;
  totalScore: number;

  email: string;
  passwordHash?: string;

  role: "USER" | "ADMIN";

  storageUsed: number;
  storageLimit: number;

  status: "ACTIVE" | "INACTIVE" | "BANNED";

  banReason?: string | null;
  bannedAt?: string | null;
  bannedBy?: number | null;

  createdAt: string;

  authProvider: "LOCAL" | "GOOGLE";
  googleId?: string | null;
}
