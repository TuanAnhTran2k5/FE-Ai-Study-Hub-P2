import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { UpdateProfileRequest, UserResponse } from "@/types/user.type";

export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await api.get<APIResponse<UserResponse>>("/user/profile");

  return response.data.result;
};

export const updateUserProfile = async (
  data: UpdateProfileRequest,
): Promise<UserResponse> => {
  const formData = new FormData();

  formData.append("fullName", data.fullName);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  const response = await api.put<APIResponse<UserResponse>>(
    "/user/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.result;
};