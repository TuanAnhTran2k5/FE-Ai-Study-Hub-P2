import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lock, KeyRound, ArrowLeft, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/errorHelper";

import { ERROR_CODE } from "@/constants/errorCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword, verifyForgotPasswordOtp, resetPassword } from "@/services/authService";
import { resetPasswordSchema } from "@/validations/auth.validation";

interface ChangePasswordFlowProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChangePasswordFlow({ email, onSuccess, onCancel }: ChangePasswordFlowProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<"otp-send" | "otp-verify" | "password-reset">("otp-send");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordErrors, setChangePasswordErrors] = useState<{
    otpCode?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleResetState = () => {
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setChangePasswordErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    return () => {
      handleResetState();
    };
  }, []);

  // Mutation 1: Gửi OTP
  const sendOtpMutation = useMutation({
    mutationFn: () => forgotPassword({ email }),
    onSuccess: () => {
      toast.success(t("success.forgotPasswordOtpSent", "OTP has been sent to your email!"));
      setView("otp-verify");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(getErrorMessage(serverMessage, t, i18n.language));
    },
  });

  // Mutation 2: Xác thực OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (code: string) => verifyForgotPasswordOtp({ email, otpCode: code }),
    onSuccess: (isValid) => {
      if (isValid) {
        setView("password-reset");
      } else {
        toast.error(t("error.invalidOtp", "Invalid OTP code. Please check and try again."));
      }
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(getErrorMessage(serverMessage, t, i18n.language));
    },
  });

  // Mutation 3: Đặt lại mật khẩu mới
  const resetPasswordMutation = useMutation({
    mutationFn: () =>
      resetPassword({
        email,
        otpCode: otpCode.trim(),
        password: newPassword,
        confirmPassword: confirmPassword,
        passwordMatching: newPassword === confirmPassword,
      }),
    onSuccess: () => {
      toast.success(t("success.resetPassword", "Password reset successfully!"));
      handleResetState();
      onSuccess();
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(getErrorMessage(serverMessage, t, i18n.language));
    },
  });

  return (
    <>
      {view === "otp-send" && (
        <div className="space-y-5">
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-card-foreground">
              {t("profile.confirmSecurity", "Confirm Security Verification")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {t("profile.sendOtpDesc", "We will send a one-time verification OTP code to your registered email:")} <strong className="text-card-foreground">{email}</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer rounded-xl font-bold"
              disabled={sendOtpMutation.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("profile.btnBack", "Back")}
            </Button>

            <Button
              type="button"
              onClick={() => sendOtpMutation.mutate()}
              className="cursor-pointer rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              {t("profile.btnSendOtp", "Send OTP")}
            </Button>
          </div>
        </div>
      )}

      {view === "otp-verify" && (
        <div className="space-y-5">
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <KeyRound className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-card-foreground">
              {t("profile.enterVerificationCode", "Enter Verification Code")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {t("profile.enterOtpDesc", "Please enter the 6-digit OTP code sent to:")} <strong className="text-card-foreground">{email}</strong>.
            </p>
          </div>

          <div>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtpCode(val);
                if (changePasswordErrors.otpCode) {
                  setChangePasswordErrors(prev => ({ ...prev, otpCode: "" }));
                }
              }}
              placeholder={t("profile.otpPlaceholder", "Enter 6-digit OTP")}
              className={`h-11 rounded-xl text-center text-base font-semibold tracking-[0.2em] placeholder:tracking-normal ${
                changePasswordErrors.otpCode ? "border-destructive focus-visible:ring-destructive/20" : ""
              }`}
            />
            {changePasswordErrors.otpCode && (
              <p className="mt-2 text-xs font-medium text-destructive text-center">
                {t(changePasswordErrors.otpCode)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setView("otp-send")}
              className="cursor-pointer rounded-xl font-bold"
              disabled={verifyOtpMutation.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("profile.btnBack", "Back")}
            </Button>

            <Button
              type="button"
              onClick={() => {
                const trimmed = otpCode.trim();
                if (!trimmed) {
                  setChangePasswordErrors({ otpCode: ERROR_CODE.OTP_REQUIRED || "OTP code is required" });
                  return;
                }
                if (trimmed.length !== 6) {
                  setChangePasswordErrors({ otpCode: ERROR_CODE.OTP_INVALID || "Invalid OTP code" });
                  return;
                }
                verifyOtpMutation.mutate(trimmed);
              }}
              className="cursor-pointer rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
            >
              {verifyOtpMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("profile.btnVerify", "Verify")}
            </Button>
          </div>
        </div>
      )}

      {view === "password-reset" && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-card-foreground">
              {t("profile.createNewPassword", "Create New Password")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("profile.newPasswordDesc", "Create a secure and strong password for your account.")}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-card-foreground">
                {t("profile.newPasswordLabel", "New Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (changePasswordErrors.password) {
                      setChangePasswordErrors(prev => ({ ...prev, password: "" }));
                    }
                  }}
                  placeholder={t("profile.newPasswordPlaceholder", "Enter new password")}
                  className={`h-11 rounded-xl pl-10 pr-10 ${
                    changePasswordErrors.password ? "border-destructive focus-visible:ring-destructive/20" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {changePasswordErrors.password && (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {t(changePasswordErrors.password)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-card-foreground">
                {t("profile.confirmPasswordLabel", "Confirm New Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (changePasswordErrors.confirmPassword) {
                      setChangePasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  placeholder={t("profile.confirmPasswordPlaceholder", "Confirm your new password")}
                  className={`h-11 rounded-xl pl-10 pr-10 ${
                    changePasswordErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {changePasswordErrors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {t(changePasswordErrors.confirmPassword)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setView("otp-verify")}
              className="cursor-pointer rounded-xl font-bold"
              disabled={resetPasswordMutation.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("profile.btnBack", "Back")}
            </Button>

            <Button
              type="button"
              onClick={() => {
                const values = { password: newPassword, confirmPassword };
                const result = resetPasswordSchema.safeParse(values);
                if (!result.success) {
                  const fieldErrors = result.error.flatten().fieldErrors;
                  setChangePasswordErrors({
                    password: fieldErrors.password?.[0],
                    confirmPassword: fieldErrors.confirmPassword?.[0],
                  });
                  return;
                }
                resetPasswordMutation.mutate();
              }}
              className="cursor-pointer rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t("profile.btnResetPassword", "Reset Password")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
