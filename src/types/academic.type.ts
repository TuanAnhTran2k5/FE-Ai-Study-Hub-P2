export interface SemesterResponse {
  semesterId: number;
  semesterNo: string;
  description?: string | null;
}

export interface SubjectResponse {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  subjectType: "CORE" | "COMBO";
  description?: string | null;
  semesterId: number;
  semesterNo: string;
  comboId?: number | null;
  comboCode?: string | null;
  comboName?: string | null;
}
