// import api from "@/configs/api";
// import type { User } from "@/models/user";
// import { type APIResponse, type LoginRequest } from "@/types/auth";

// //hàm gọi API
// export const authLogin = async (data: LoginRequest): Promise<User> => {
//   const reponse = await api.post<APIResponse<User>>("/auth/login", data);
//   return reponse.data.result; //là dữ liệu của User,  đây là data trong onSuccess của react query
// };

import api from "@/configs/api";
import { ERROR_CODE } from "@/constants/errorCode";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";
import type { UserResponse } from "@/types/user.type";

const uri = "users";

export const authLogin = async (
  loginData: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.get<UserResponse[]>(uri);

  const user = response.data.find(
    (item) =>
      item.email === loginData.email &&
      item.passwordHash === loginData.password,
  );

  if (!user) {
    throw new Error(ERROR_CODE.INVALID_CREDENTIALS);
  }

  if (user.status === "BANNED") {
    throw new Error(ERROR_CODE.ACCOUNT_BANNED);
  }

  const token = `mock-token-${user.id}`;

  return {
    user,
    token,
  };
};

export const authRegister = async (
  registerData: RegisterRequest,
): Promise<UserResponse> => {
  const response = await api.get<UserResponse[]>("users");

  const isEmailExist = response.data.some(
    (user) => user.email === registerData.email,
  );

  if (isEmailExist) {
    throw new Error(ERROR_CODE.EMAIL_ALREADY_EXISTS);
  }

  const newUser = {
    createdAt: new Date().toISOString(),
    fullName: registerData.fullName,
    avatarUrl: "",
    email: registerData.email,
    passwordHash: registerData.password,
    role: "USER",
    storageUsed: 0,
    storageLimit: 2048,
    status: "ACTIVE",
    banReason: "",
    bannedAt: null,
    bannedBy: null,
    authProvider: "LOCAL",
    googleId: "",
    totalScore: 0,
  };

  const createResponse = await api.post<UserResponse>("users", newUser);

  return createResponse.data;
};
