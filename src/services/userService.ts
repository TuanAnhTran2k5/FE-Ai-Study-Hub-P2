import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { UserRequest, UserResponse } from "@/types/user.type";

export const updateUserProfile = async (
  data: UserRequest,
): Promise<UserResponse> => {
  const response = await api.put<APIResponse<UserResponse>>(
    "/user/profile",
    data,
  );

  return response.data.result;
};