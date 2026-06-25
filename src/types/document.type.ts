import { ModerationStatus, VisibilityStatus } from "@/models/document.enum";

//Sài
export interface MyDocumentResponse {
  documentId: number;
  ownerId: number;
  ownerName: string;
  ownerAvatar: string | null;

  subjectId: number;
  subjectCode: string;
  subjectName: string;

  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;

  visibilityStatus: VisibilityStatus;
  moderationStatus?: ModerationStatus;

  averageRating: number;
  ratingCount: number;
  downloadCount: number;
  bookmarkCount: number;
  reportCount: number;

  createdAt: string;
  updatedAt: string;
}

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
  documentId: number;
  documentTitle: string;
  bookmarkedAt: string;
}

export interface BookmarkRequest {
  documentId: number;
}
