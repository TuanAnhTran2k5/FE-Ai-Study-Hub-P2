import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  SystemStatisticsResponse,
  SubjectDistributionResponse,
  SystemHealthResponse,
  ActivityTrendResponse,
  AdminUserResponse,
  ModerationSummaryResponse,
} from "@/types/adminDashboard.type";

// 1. Nhóm API Dashboard
export const getSystemStatistics = async (): Promise<SystemStatisticsResponse> => {
  const response = await api.get<APIResponse<SystemStatisticsResponse>>(
    "/admin/dashboard/statistics"
  );
  return response.data.result;
};

export const getSubjectDistribution = async (): Promise<SubjectDistributionResponse[]> => {
  const response = await api.get<APIResponse<SubjectDistributionResponse[]>>(
    "/admin/dashboard/subject-distribution"
  );
  return response.data.result;
};

export const getSystemHealth = async (): Promise<SystemHealthResponse> => {
  const response = await api.get<APIResponse<SystemHealthResponse>>(
    "/admin/dashboard/system-health"
  );
  return response.data.result;
};

export const getActivityTrends = async (days = 7): Promise<ActivityTrendResponse[]> => {
  const response = await api.get<APIResponse<ActivityTrendResponse[]>>(
    "/admin/dashboard/trends",
    { params: { days } }
  );
  return response.data.result;
};

export const getModerationSummary = async (): Promise<ModerationSummaryResponse> => {
  const response = await api.get<APIResponse<ModerationSummaryResponse>>(
    "/admin/dashboard/moderation-summary"
  );
  return response.data.result;
};

// 2. Nhóm API Quản lý Người dùng
export interface GetUsersParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface SpringPage<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const getUsersForAdmin = async (params: GetUsersParams): Promise<SpringPage<AdminUserResponse>> => {
  const response = await api.get<APIResponse<SpringPage<AdminUserResponse>>>(
    "/admin/users",
    { params }
  );
  return response.data.result;
};

export const getUserDetailForAdmin = async (userId: number): Promise<AdminUserResponse> => {
  const response = await api.get<APIResponse<AdminUserResponse>>(
    `/admin/users/${userId}`
  );
  return response.data.result;
};

export const banUser = async (userId: number, reason: string): Promise<AdminUserResponse> => {
  const response = await api.post<APIResponse<AdminUserResponse>>(
    `/admin/users/${userId}/ban`,
    { reason }
  );
  return response.data.result;
};

export const unbanUser = async (userId: number): Promise<AdminUserResponse> => {
  const response = await api.post<APIResponse<AdminUserResponse>>(
    `/admin/users/${userId}/unban`
  );
  return response.data.result;
};

// Cập nhật vai trò người dùng (US <-> AD) - Chỉ dành cho System Admin
export const updateUserRole = async (
  userId: number,
  role: "US" | "AD"
): Promise<AdminUserResponse> => {
  const response = await api.post<APIResponse<AdminUserResponse>>(
    `/admin/users/${userId}/role`,
    { role }
  );
  return response.data.result;
};

