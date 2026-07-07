export const ERROR_CODE = {
  FIELD_REQUIRED: "This field is required",

  INVALID_EMAIL: "Invalid email format",

  INVALID_PASSWORD:
    "Password must contain at least 8 characters, including uppercase, lowercase, number and special character",

  PASSWORD_NOT_MATCH: "Password and Confirm Password do not match",

  EMAIL_ALREADY_EXISTS: "Email already exists",

  USER_NOT_FOUND: "User not found",

  INVALID_CREDENTIALS: "Invalid email or password",

  ACCOUNT_BANNED: "Your account has been banned",

  ACCOUNT_INACTIVE: "Your account is inactive",

  EMAIL_NOT_VERIFIED: "Please verify your email",

  OTP_INVALID: "Invalid OTP code",

  OTP_EXPIRED: "OTP code has expired",

  OTP_SENT: "OTP has been sent to your email",

  OTP_RESENT: "OTP has been resent to your email",

  OTP_REQUIRED: "OTP code is required",

  UNAUTHORIZED: "You are not authorized",

  FORBIDDEN: "Access denied",

  GOOGLE_LOGIN_FAILED: "Google login failed",

  PROFILE_UPDATE_FAILED: "Update profile failed",

  UNSUPPORTED_IMAGE_TYPE:
    "Unsupported image format. Allowed formats: PNG, JPG, JPEG, WEBP, GIF, HEIC, HEIF, BMP, SVG, AVIF, TIFF, ICO.",

  INVALID_IMAGE_SIZE: "Image size exceeds the 5MB limit.",

  FILE_UPLOAD_FAILED:
    "Failed to upload or process the image. Please try again with another image.",

  SEMESTER_NO_REQUIRED: "Semester code or number is required",
  COMBO_CODE_REQUIRED: "Combo code is required",
  COMBO_NAME_REQUIRED: "Combo name is required",
  COMBO_SUBJECTS_REQUIRED: "At least one subject must belong to this combo",
  SUBJECT_CODE_REQUIRED: "Subject code is required",
  SUBJECT_NAME_REQUIRED: "Subject name is required",
  SEMESTER_SELECT_REQUIRED: "Semester selection is required for all subjects",

  CREATE_SEMESTER_FAILED: "Failed to create semester",
  UPDATE_SEMESTER_FAILED: "Failed to update semester",
  DELETE_SEMESTER_FAILED: "Failed to delete semester",
  CREATE_COMBO_FAILED: "Failed to create combo subject",
  UPDATE_COMBO_FAILED: "Failed to update combo subject",
  DELETE_COMBO_FAILED: "Failed to delete combo subject",
  CREATE_SUBJECT_FAILED: "Failed to add subject",
  UPDATE_SUBJECT_FAILED: "Failed to update subject",
  DELETE_SUBJECT_FAILED: "Failed to delete subject",

  SERVER_ERROR: "Something went wrong. Please try again later",
};

