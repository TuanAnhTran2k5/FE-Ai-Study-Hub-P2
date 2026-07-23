import { ERROR_CODE } from "@/constants/errorCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import { resetPassword } from "@/services/authService";
import type { ResetPasswordRequest } from "@/types/auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/validations/auth.validation";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ResetPasswordErrors = Partial<
  Record<keyof ResetPasswordFormValues, string>
>;

function ResetPasswordForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otpCode = location.state?.otpCode || "";

  const [formValues, setFormValues] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ResetPasswordErrors>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useMutation<
    boolean,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: resetPassword,

    onSuccess: () => {
      toast.success(t("success.resetPassword"));
      navigate(`/${ROUTE.AUTH}/${ROUTE.LOGIN}`);
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const handleChange =
    (field: keyof ResetPasswordFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !otpCode) {
      toast.error(ERROR_CODE.OTP_REQUIRED);

      navigate(
        `/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}/${ROUTE.FORGOT_PASSWORD_VERIFY_OTP}`,
        {
          state: { email },
        },
      );

      return;
    }

    const trimmedValues: ResetPasswordFormValues = {
      password: formValues.password.trim(),
      confirmPassword: formValues.confirmPassword.trim(),
    };

    const result = resetPasswordSchema.safeParse(trimmedValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });

      return;
    }

    setErrors({});

    resetPasswordMutation.mutate({
      email,
      otpCode,
      password: result.data.password,
      confirmPassword: result.data.confirmPassword,
      passwordMatching: result.data.password === result.data.confirmPassword,
    });
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-4xl bg-card p-8 shadow-sm lg:p-10">
      <Link
        to={`/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}/${ROUTE.FORGOT_PASSWORD_VERIFY_OTP}`}
        state={{ email }}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-link hover:text-link-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("auth.backToOtp")}
      </Link>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-card-foreground">
          {t("auth.resetPassword.titleStart")}{" "}
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            {t("auth.resetPassword.titleHighlight")}
          </span>
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          {t("auth.resetPassword.description")}
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold text-card-foreground"
          >
            {t("auth.newPassword")}
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.enterNewPassword")}
              value={formValues.password}
              onChange={handleChange("password")}
              className={`h-14 rounded-xl bg-secondary px-12 text-card-foreground placeholder:text-muted-foreground ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-3 text-sm font-bold text-destructive">
              {t(errors.password)}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-bold text-card-foreground"
          >
            {t("auth.confirmPassword")}
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.confirmNewPassword")}
              value={formValues.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className={`h-14 rounded-xl bg-secondary px-12 text-card-foreground placeholder:text-muted-foreground ${
                errors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-3 text-sm font-bold text-destructive">
              {t(errors.confirmPassword)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          <p className="mb-2 font-bold text-card-foreground">
            {t("auth.passwordRules.title")}
          </p>

          <ul className="space-y-1">
            <li>• {t("auth.passwordRules.minLength")}</li>
            <li>• {t("auth.passwordRules.upperLower")}</li>
            <li>• {t("auth.passwordRules.number")}</li>
            <li>• {t("auth.passwordRules.special")}</li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="h-14 w-full rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground transition hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          {resetPasswordMutation.isPending
            ? t("auth.resetting")
            : t("auth.resetPasswordButton")}

          <CheckCircle2 className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;