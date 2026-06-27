import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { SemesterResponse, SubjectResponse } from "@/types/academic.type";

export const getSemesters = async (): Promise<SemesterResponse[]> => {
  const response =
    await api.get<APIResponse<SemesterResponse[]>>("/user/academic/semesters");

  return response.data.result;
};

export const getSubjectsBySemester = async (
  semesterId: number,
): Promise<SubjectResponse[]> => {
  const response = await api.get<APIResponse<SubjectResponse[]>>(
    `/user/academic/subjects/semester/${semesterId}`,
  );

  return response.data.result;
};

// API document chỉ trả thông tin subject, chưa trả semester/combo đầy đủ.
// Hàm này lấy tất cả semester, sau đó lấy subject theo từng semester để FE tự map lại.
export const getAllAcademicSubjects = async (): Promise<SubjectResponse[]> => {
  const semesters = await getSemesters();
  const subjectGroups = await Promise.all(
    semesters.map((semester) => getSubjectsBySemester(semester.semesterId)),
  );

  return subjectGroups.flat();
};
