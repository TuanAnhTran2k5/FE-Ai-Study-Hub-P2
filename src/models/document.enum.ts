export const FileType = {
  PDF: "PDF",
  DOCX: "DOCX",
  PPTX: "PPTX",
  XLSX: "XLSX",
  PNG: "PNG",
  JPG: "JPG",
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];

export const VisibilityStatus = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type VisibilityStatus =
  (typeof VisibilityStatus)[keyof typeof VisibilityStatus];

export const ModerationStatus = {
  NORMAL: "NORMAL",
  HIDDEN: "HIDDEN",
  REMOVED: "REMOVED",
} as const;

export type ModerationStatus =
  (typeof ModerationStatus)[keyof typeof ModerationStatus];

export const UploadStatus = {
  PENDING: "PENDING",
  UPLOADING: "UPLOADING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];