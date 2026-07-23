export const getErrorMessage = (message: string, t: any, currentLanguage: string): string => {
  if (!message) return t("error.serverError", "Something went wrong. Please try again later");
  
  // Nếu là tiếng Anh, giữ nguyên 100% chuỗi thô từ Backend (đáp ứng test case của nhóm)
  if (currentLanguage === "en" || currentLanguage.startsWith("en-")) {
    return message;
  }
  
  // Map từ API message sang i18n key cho tiếng Việt
  const errorMap: Record<string, string> = {
    "Invalid OTP code": "error.otpInvalid",
    "OTP code has expired": "error.otpExpired",
    "Email already exists": "error.emailAlreadyExists",
    "User not found": "error.userNotFound",
    "Invalid credentials": "error.invalidCredentials",
    "Account is banned": "error.accountBanned",
    "Account is inactive": "error.accountInactive",
    "Email is not verified": "error.emailNotVerified",
    "OTP code is required": "error.otpRequired",
  };
  
  const key = errorMap[message];
  return key ? t(key) : message;
};
