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
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ModerationStatus =
  (typeof ModerationStatus)[keyof typeof ModerationStatus];
