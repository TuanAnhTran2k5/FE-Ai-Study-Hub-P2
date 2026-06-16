import {
  FileType,
  ModerationStatus,
  VisibilityStatus,
} from "@/models/document.enum";

export interface DocumentRequest {
  title: string;
  description: string;

  subjectName: string;
  subjectCode: string;

  semesterNo: number;

  comboName: string;
  comboCode: string;

  fileUrl: string;
  fileType: FileType;
  fileSize: number;

  visibilityStatus: VisibilityStatus;
}

export interface DocumentResponse {
  id: string;

  title: string;
  description: string;

  subjectName: string;
  subjectCode: string;

  semesterNo: number;

  comboName: string;
  comboCode: string;

  ownerId: number;
  ownerName: string;
  ownerAvatar: string;

  fileUrl: string;
  fileType: FileType;
  fileSize: number;

  visibilityStatus: VisibilityStatus;
  moderationStatus: ModerationStatus;

  averageRating: number;
  ratingCount: number;

  downloadCount: number;
  bookmarkCount: number;

  createdAt: string;
}

export interface DocumentFilter {
  keyword?: string;

  subjectCode?: string;

  semesterNo?: number;

  comboCode?: string;

  fileType?: FileType;

  visibilityStatus?: VisibilityStatus;
}
