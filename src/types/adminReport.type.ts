export type CaseStatus = "PENDING_REVIEW" | "WARNING_1" | "WARNING_2" | "RESOLVED" | "REJECTED";

export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";

export type AdminDecision = "BAN" | "REMOVE_DOCUMENT" | "REJECT";

export interface ReportCaseAdminResponse {
  caseId: number;
  documentId: number;
  documentTitle: string;
  reasonName: string;
  caseLevel: number;
  reportCount: number;
  requiredThreshold: number;
  caseStatus: CaseStatus;
  openedAt: string;
  resolvedAt: string | null;
  resolvedByName: string | null;
  resolvedByEmail?: string | null;
  adminNote: string | null;
}

export interface ReportDetailResponse {
  reportId: number;
  reporterName: string;
  description: string;
  evidenceUrl: string | null;
  createdAt: string;
  status: ReportStatus;
}

export interface ResolveRequest {
  adminId: number;
  decision: AdminDecision;
  note: string;
}
