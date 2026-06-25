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
