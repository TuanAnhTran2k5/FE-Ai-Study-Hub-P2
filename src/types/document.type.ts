import {
  FileType,
  ModerationStatus,
  UploadStatus,
  VisibilityStatus,
} from "@/models/document.enum";
import type { UserRank } from "@/types/user.type";

export interface DocumentResponse {
  documentId: number;

  ownerId: number;
  ownerName?: string;
  ownerAvatar?: string | null;
  ownerTotalScore?: number | null;
  ownerCurrentRank?: UserRank | null;
  ownerRankName?: string | null;
  ownerDocumentCount?: number | null;
  ownerDownloadCount?: number | null;

  originalUploaderId?: number;
  originalUploaderName?: string;
  originalUploaderAvatar?: string | null;

  subjectId: number;
  subjectCode?: string;
  subjectName?: string;

  title: string;
  description?: string | null;

  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;

  visibilityStatus: VisibilityStatus;
  moderationStatus?: ModerationStatus;
  uploadStatus?: UploadStatus;

  averageRating?: number;
  ratingCount?: number;
  downloadCount?: number;
  bookmarkCount?: number;
  reportCount?: number;

  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;

  semesterNo?: number | string | null;

  comboCode?: string | null;
  comboName?: string | null;

  isBookmarked?: boolean;
  myRating?: number | null;
  moderatedByEmail?: string | null;
  moderationNote?: string | null;
}

export type MyDocumentResponse = DocumentResponse & {
  ownerName: string;
  ownerAvatar: string | null;
  subjectCode: string;
  subjectName: string;
  averageRating: number;
  ratingCount: number;
  downloadCount: number;
  bookmarkCount: number;
  reportCount: number;
  updatedAt: string;
};

export interface DocumentUploadRequest {
  file: File;
  title: string;
  subjectId: number;
  visibilityStatus?: VisibilityStatus;
}

export interface DocumentUploadResponse {
  documentId: number;
  ownerId: number;
  subjectId: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: FileType;
  fileSize: number;
  visibilityStatus: VisibilityStatus;
  createdAt: string;
  message: string;
  uploadStatus?: UploadStatus;
  storageUsed?: number;
  storageRemaining?: number;
  storageUsagePercent?: number;
}

export interface DocumentUpdateRequest {
  title?: string;
  subjectId?: number;
  visibilityStatus?: VisibilityStatus;
}

export interface DocumentUpdateResponse {
  documentId: number;
  title: string;
  subjectId: number;
  visibilityStatus: VisibilityStatus;
  updatedAt: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
  entityName: string;
  entityIdentifier: string;
  deletedAt: string;
  storageUsed?: number;
  storageRemaining?: number;
  storageUsagePercent?: number;
}

export interface DocumentDownloadResponse {
  documentId: number;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  ownerId: number;
  ownerName: string;
  ownerAvatar?: string | null;
  originalUploaderId?: number | null;
  originalUploaderName?: string | null;
  originalUploaderAvatar?: string | null;
  firstDownload: boolean;
  addedPoint: number;
  ownerTotalScore: number;
  publicOwnerName: string;
  downloadedAt: string;
  ownerCurrentRank?: UserRank | null;
  ownerNextRank?: string | null;
  ownerProgressPercent?: number | null;
}

export interface RatingRequest {
  ratingValue: number;
  comment?: string;
}

export interface RatingResponse {
  ratingId: number;
  documentId: number;
  ratingValue: number;
  averageRating: number;
  ratingCount: number;
  myRating?: number | null;
}

export interface ReportReasonResponse {
  reasonId: number;
  reasonName: string;
  description?: string | null;
  severityLevel?: string | null;
  reportThreshold?: number | null;
  penaltyScore?: number | null;
}

export interface BookmarkResponse {
  bookmarkId: number;
  userId: number;
  document: DocumentResponse;
  bookmarkedAt: string;
  bookmarkCount: number;
  isBookmarked: boolean;
}

export interface BookmarkRequest {
  documentId: number;
}

export interface ReportRequest {
  documentId: number;
  reasonId: number;
  description?: string;
  evidenceUrl?: string;
}

export interface ReportResponse {
  reportId: number;
  reporterId?: number;
  documentId: number;
  reasonId: number;
  description?: string | null;
  evidenceUrl?: string | null;
  status?: string;
  createdAt?: string;
}

