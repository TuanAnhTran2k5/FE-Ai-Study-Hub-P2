import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { ReportCaseAdminResponse, ReportDetailResponse, ResolveRequest } from "@/types/adminReport.type";

export const getPendingReportCases = async (): Promise<ReportCaseAdminResponse[]> => {
  const response = await api.get<APIResponse<ReportCaseAdminResponse[]>>(
    "/admin/report-cases/pending"
  );
  return response.data.result;
};

export const getHistoryReportCases = async (): Promise<ReportCaseAdminResponse[]> => {
  const response = await api.get<APIResponse<ReportCaseAdminResponse[]>>(
    "/admin/report-cases/history"
  );
  return response.data.result;
};

export const getReportsByCase = async (caseId: number): Promise<ReportDetailResponse[]> => {
  const response = await api.get<APIResponse<ReportDetailResponse[]>>(
    `/admin/report-cases/${caseId}/reports`
  );
  return response.data.result;
};

export const claimReportCase = async (caseId: number, adminId: number): Promise<ReportCaseAdminResponse> => {
  const response = await api.post<APIResponse<ReportCaseAdminResponse>>(
    `/admin/report-cases/${caseId}/claim`,
    null,
    {
      params: { adminId }
    }
  );
  return response.data.result;
};

export const unclaimReportCase = async (caseId: number, adminId: number): Promise<ReportCaseAdminResponse> => {
  const response = await api.post<APIResponse<ReportCaseAdminResponse>>(
    `/admin/report-cases/${caseId}/unclaim`,
    null,
    {
      params: { adminId }
    }
  );
  return response.data.result;
};

export const resolveReportCase = async (
  caseId: number,
  data: ResolveRequest
): Promise<ReportCaseAdminResponse> => {
  const response = await api.post<APIResponse<ReportCaseAdminResponse>>(
    `/admin/report-cases/${caseId}/resolve`,
    data
  );
  return response.data.result;
};
