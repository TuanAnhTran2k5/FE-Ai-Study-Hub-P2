import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  SyllabusResponse,
  SyllabusHistoryResponse,
  SyllabusUpdateRequest,
} from "@/types/syllabus.type";

// Upload Syllabus file PDF
export const uploadSyllabus = async (
  subjectId: number,
  file: File
): Promise<SyllabusResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<APIResponse<SyllabusResponse>>(
    `/admin/curriculum/syllabus/upload/${subjectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.result;
};

// Get Syllabus detail
export const getSyllabus = async (subjectId: number): Promise<SyllabusResponse> => {
  const response = await api.get<APIResponse<SyllabusResponse>>(
    `/admin/curriculum/syllabus/${subjectId}`
  );
  return response.data.result;
};

// Update Syllabus JSON
export const updateSyllabus = async (
  subjectId: number,
  data: SyllabusUpdateRequest
): Promise<SyllabusResponse> => {
  const response = await api.put<APIResponse<SyllabusResponse>>(
    `/admin/curriculum/syllabus/update/${subjectId}`,
    data
  );
  return response.data.result;
};

// Get Syllabus update history
export const getSyllabusHistory = async (
  subjectId: number
): Promise<SyllabusHistoryResponse[]> => {
  const response = await api.get<APIResponse<SyllabusHistoryResponse[]>>(
    `/admin/curriculum/syllabus/history/${subjectId}`
  );
  return response.data.result;
};

// Rollback to specific syllabus history version
export const rollbackSyllabus = async (
  subjectId: number,
  historyId: number
): Promise<SyllabusResponse> => {
  const response = await api.post<APIResponse<SyllabusResponse>>(
    `/admin/curriculum/syllabus/rollback/${subjectId}/${historyId}`
  );
  return response.data.result;
};

// Delete Syllabus
export const deleteSyllabus = async (subjectId: number): Promise<void> => {
  await api.delete<APIResponse<void>>(`/admin/curriculum/syllabus/${subjectId}`);
};
