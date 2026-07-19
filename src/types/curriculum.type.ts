export type SubjectType = "CORE" | "COMBO";

export interface SemesterRequest {
  semesterNo: string;
  description: string;
}

export interface SemesterResponse {
  semesterId: number;
  semesterNo: string;
  description: string;
}

export interface SubjectRequest {
  subjectCode: string;
  subjectName: string;
  description: string;
  subjectType: SubjectType;
  semesterId: number;
  comboId?: number | null;
}

export interface SubjectResponse {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  subjectType: SubjectType;
  description: string;
  semesterId: number;
  semesterNo: string;
  comboId: number | null;
  comboCode: string | null;
  comboName: string | null;
  isDeleted: boolean;
}

export interface ComboSubjectRequest {
  comboCode: string;
  comboName: string;
  subjects: SubjectRequest[];
}

export interface ComboSubjectResponse {
  comboId: number;
  comboCode: string;
  comboName: string;
  subjects: SubjectResponse[];
  isDeleted: boolean;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
  entityName: string;
  entityIdentifier: string;
  deletedAt: string;
  storageUsed?: number | null;
  storageRemaining?: number | null;
  storageUsagePercent?: number | null;
}
