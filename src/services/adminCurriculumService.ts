import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  SemesterRequest,
  SemesterResponse,
  ComboSubjectRequest,
  ComboSubjectResponse,
  SubjectRequest,
  SubjectResponse,
  DeleteResponse,
} from "@/types/curriculum.type";

// ==========================================
// SEMESTER SERVICES
// ==========================================

export const getAllSemesters = async (): Promise<SemesterResponse[]> => {
  const response = await api.get<APIResponse<SemesterResponse[]>>(
    "/admin/curriculum/semesters",
  );
  return response.data.result;
};

export const getSemesterById = async (id: number): Promise<SemesterResponse> => {
  const response = await api.get<APIResponse<SemesterResponse>>(
    `/admin/curriculum/semesters/${id}`,
  );
  return response.data.result;
};

export const createSemester = async (
  data: SemesterRequest,
): Promise<SemesterResponse> => {
  const response = await api.post<APIResponse<SemesterResponse>>(
    "/admin/curriculum/semesters",
    data,
  );
  return response.data.result;
};

export const updateSemester = async (
  id: number,
  data: SemesterRequest,
): Promise<SemesterResponse> => {
  const response = await api.put<APIResponse<SemesterResponse>>(
    `/admin/curriculum/semesters/${id}`,
    data,
  );
  return response.data.result;
};

export const deleteSemester = async (id: number): Promise<DeleteResponse> => {
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/admin/curriculum/semesters/${id}`,
  );
  return response.data.result;
};

// ==========================================
// COMBO SUBJECT SERVICES
// ==========================================

export const getAllComboSubjects = async (
  keyword?: string,
): Promise<ComboSubjectResponse[]> => {
  const response = await api.get<APIResponse<ComboSubjectResponse[]>>(
    "/admin/curriculum/combos",
    {
      params: keyword ? { keyword } : undefined,
    },
  );
  return response.data.result;
};

export const getComboSubjectById = async (
  id: number,
): Promise<ComboSubjectResponse> => {
  const response = await api.get<APIResponse<ComboSubjectResponse>>(
    `/admin/curriculum/combos/${id}`,
  );
  return response.data.result;
};

export const createComboSubject = async (
  data: ComboSubjectRequest,
): Promise<ComboSubjectResponse> => {
  const response = await api.post<APIResponse<ComboSubjectResponse>>(
    "/admin/curriculum/combos",
    data,
  );
  return response.data.result;
};

export const updateComboSubject = async (
  id: number,
  data: ComboSubjectRequest,
): Promise<ComboSubjectResponse> => {
  const response = await api.put<APIResponse<ComboSubjectResponse>>(
    `/admin/curriculum/combos/${id}`,
    data,
  );
  return response.data.result;
};

export const deleteComboSubject = async (
  id: number,
): Promise<DeleteResponse> => {
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/admin/curriculum/combos/${id}`,
  );
  return response.data.result;
};

export const restoreComboSubject = async (
  id: number,
): Promise<ComboSubjectResponse> => {
  const response = await api.put<APIResponse<ComboSubjectResponse>>(
    `/admin/curriculum/combos/restore/${id}`,
  );

  return response.data.result;
};

// ==========================================
// SUBJECT SERVICES
// ==========================================

export const getAllSubjects = async (keyword?: string): Promise<SubjectResponse[]> => {
  const response = await api.get<APIResponse<SubjectResponse[]>>(
    "/admin/curriculum/subjects",
    {
      params: { keyword },
    }
  );
  return response.data.result;
};

export const getSubjectById = async (id: number): Promise<SubjectResponse> => {
  const response = await api.get<APIResponse<SubjectResponse>>(
    `/admin/curriculum/subjects/${id}`
  );
  return response.data.result;
};

export const createSubject = async (data: SubjectRequest): Promise<SubjectResponse> => {
  const response = await api.post<APIResponse<SubjectResponse>>(
    "/admin/curriculum/subjects",
    data
  );
  return response.data.result;
};

export const updateSubject = async (
  id: number,
  data: SubjectRequest
): Promise<SubjectResponse> => {
  const response = await api.put<APIResponse<SubjectResponse>>(
    `/admin/curriculum/subjects/${id}`,
    data
  );
  return response.data.result;
};

export const deleteSubject = async (id: number): Promise<DeleteResponse> => {
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/admin/curriculum/subjects/${id}`
  );
  return response.data.result;
};

export const restoreSubject = async (
  id: number,
): Promise<SubjectResponse> => {
  const response = await api.put<APIResponse<SubjectResponse>>(
    `/admin/curriculum/subjects/restore/${id}`,
  );

  return response.data.result;
};