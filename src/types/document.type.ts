import {
  FileType,
  ModerationStatus,
  VisibilityStatus,
} from "@/models/document.enum";

export interface DocumentResponse {
  documentId: number;

  ownerId: number;
  ownerName?: string;
  ownerAvatar?: string | null;

  subjectId: number;
  subjectCode?: string;
  subjectName?: string;

  title: string;
  description?: string | null;

  fileName: string;
  fileUrl: string;
  fileType: FileType;
  fileSize: number;

  visibilityStatus: VisibilityStatus;
  moderationStatus?: ModerationStatus;

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

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
  deletedId: number;
  entityName: string;
  entityIdentifier: string;
  deletedAt: string;
}

export interface DocumentDownloadResponse {
  documentId: number;
  title: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  ownerId: number;
  ownerName: string;
  firstDownload: boolean;
  addedPoint: number;
  ownerTotalScore: number;
  publicOwnerName: string;
  downloadedAt: string;
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
}

export interface BookmarkResponse {
  bookmarkId: number;
  userId: number;
  document: DocumentResponse;
  bookmarkedAt: string;
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
  documentId: number;
  reasonId: number;
  description?: string | null;
  evidenceUrl?: string | null;
  status?: string;
  createdAt?: string;
}

