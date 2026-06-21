import api from "@/configs/api";
import type { User } from "@/models/user";
import {
  type APIResponse,
  type LoginRequest,
  type RegisterRequest,
  type RegisterResponse,
  type ResendOtpRequest,
  type ResendOtpResponse,
  type VerifyOtpRequest,
} from "@/types/auth";

//hàm gọi API
export const authLogin = async (data: LoginRequest): Promise<User> => {
  const reponse = await api.post<APIResponse<User>>("/auth/login", data);
  return reponse.data.result; //là dữ liệu của User,  đây là data trong onSuccess của react query
};

export const authRegister = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<APIResponse<RegisterResponse>>(
    "/auth/register",
    data,
  );

  return response.data.result;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<User> => {
  const response = await api.post<APIResponse<User>>(
    "/auth/verify-email",
    data,
  );

  return response.data.result;
};

export const resendOtp = async (
  data: ResendOtpRequest,
): Promise<ResendOtpResponse> => {
  const response = await api.post<APIResponse<ResendOtpResponse>>(
    "/auth/resend-otp",
    data,
  );

  return response.data.result;
};
