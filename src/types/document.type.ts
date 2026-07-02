import {
  FileType,
  ModerationStatus,
  VisibilityStatus,
} from "@/models/document.enum";

export interface DocumentResponse {
  // NOTE TYPE: Đây là shape document dùng chung cho Home, Community, My Documents và Detail.
  // Các field optional là do một số API backend chưa trả đủ subject/rating/bookmark.
  documentId: number;

  // NOTE OWNER: Community dùng ownerId để không cho user sửa/xóa tài liệu của người khác.
  ownerId: number;
  ownerName?: string;
  ownerAvatar?: string | null;

  // NOTE SUBJECT: subjectId là dữ liệu gốc từ backend; subjectCode/subjectName có thể được FE hydrate từ academic API.
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

  // NOTE ACADEMIC: Các field này giúp card/detail hiển thị semester/combo mà không phải gọi lại nhiều API.
  semesterNo?: number | string | null;

  comboCode?: string | null;
  comboName?: string | null;

  // NOTE USER STATE: Trạng thái riêng của current user với document này.
  // isBookmarked/myRating giúp UI giữ trạng thái sau khi reload nếu backend trả về.
  isBookmarked?: boolean;
  myRating?: number | null;
}

// NOTE TYPE: Response riêng cho trang My Documents, yêu cầu nhiều field đầy đủ hơn DocumentResponse.
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

// NOTE TYPE: Payload upload tài liệu từ form FE sang documentService.
export interface DocumentUploadRequest {
  file: File;
  title: string;
  subjectId: number;
  visibilityStatus?: VisibilityStatus;
}

// NOTE TYPE: Response sau khi upload thành công.
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

// NOTE TYPE: Payload edit metadata document.
export interface DocumentUpdateRequest {
  title?: string;
  subjectId?: number;
  visibilityStatus?: VisibilityStatus;
}

// NOTE TYPE: Response sau khi edit document thành công.
export interface DocumentUpdateResponse {
  documentId: number;
  title: string;
  subjectId: number;
  visibilityStatus: VisibilityStatus;
  updatedAt: string;
}

// NOTE TYPE: Response chuẩn cho thao tác delete như document/bookmark.
export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
  deletedId: number;
  entityName: string;
  entityIdentifier: string;
  deletedAt: string;
}

// NOTE TYPE: Response khi user save/download public document.
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

// NOTE TYPE: Payload gửi rating document.
export interface RatingRequest {
  ratingValue: number;
  comment?: string;
}

// NOTE TYPE: Response rating dùng để cập nhật lại averageRating/ratingCount trên UI.
export interface RatingResponse {
  ratingId: number;
  documentId: number;
  ratingValue: number;
  averageRating: number;
  ratingCount: number;
}

// NOTE TYPE: Một bookmark đã lưu trong database.
export interface BookmarkResponse {
  bookmarkId: number;
  userId: number;
  documentId: number;
  documentTitle: string;
  bookmarkedAt: string;
}

// NOTE TYPE: Payload thêm bookmark.
export interface BookmarkRequest {
  documentId: number;
}

// NOTE TYPE: Payload report document. reasonId phải khớp bảng reason bên backend/database.
export interface ReportRequest {
  documentId: number;
  reasonId: number;
  description?: string;
  evidenceUrl?: string;
}

// NOTE TYPE: Response sau khi report được tạo.
export interface ReportResponse {
  reportId: number;
  reporterId: number;
  documentId: number;
  reasonId: number;
  description?: string;
  evidenceUrl?: string;
  createdAt: string;
  status: string;
}
