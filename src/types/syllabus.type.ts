export type SyncStatus = "UPLOADED" | "PARSING" | "PARSED" | "INDEXING" | "SUCCESS" | "FAILED";

export interface SyllabusResponse {
  id: number;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  pdfUrl: string;
  jsonContent: string;
  syncStatus: SyncStatus;
  parserVersion: string;
  embeddingModel: string;
  embeddingVersion: number;
  updatedAt: string;
}

export interface SyllabusHistoryResponse {
  id: number;
  subjectSyllabusId: number;
  pdfUrl: string;
  jsonContent: string;
  version: number;
  updatedBy: string;
  updatedReason: string;
  createdAt: string;
}

export interface SyllabusUpdateRequest {
  jsonContent: string;
  reason: string;
}
