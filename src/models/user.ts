export interface User {
  id: string;

  fullName: string;
  avatarUrl: string;

  totalScore: number;

  email: string;

  role: "USER" | "ADMIN";

  status: "ACTIVE" | "INACTIVE" | "BANNED";

  authProvider: "LOCAL" | "GOOGLE";
}