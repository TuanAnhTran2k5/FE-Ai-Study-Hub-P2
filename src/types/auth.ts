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

export interface RegisterResponse {
  email: string;
  otpExpiredAt: string;
  status: "PENDING" | "ACTIVE" | "BANNED";
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResendOtpRequest {
  email: string;
  purpose: "REGISTER";
}

export interface ResendOtpResponse {
  email: string;
  purpose: "REGISTER";
  otpExpiredAt: string;
}

/* Forgot password */
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  email: string;
  otpExpiredAt: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
  passwordMatching: boolean;
}

export interface LogoutRequest {
  token: string;
}
