import type { User } from "@/models/user";


export interface APIResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
