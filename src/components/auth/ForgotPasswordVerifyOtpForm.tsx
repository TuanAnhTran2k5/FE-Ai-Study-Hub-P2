import { ERROR_CODE } from "@/constants/errorCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import { forgotPassword, verifyForgotPasswordOtp } from "@/services/authService";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/types/auth";
import {
  forgotPasswordOtpSchema,
  type ForgotPasswordOtpFormValues,
} from "@/validations/auth.validation";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ForgotPasswordOtpErrors = Partial<
  Record<keyof ForgotPasswordOtpFormValues, string>
>;

function ForgotPasswordVerifyOtpForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [formValues, setFormValues] = useState<ForgotPasswordOtpFormValues>({
    otpCode: "",
  });

  const [errors, setErrors] = useState<ForgotPasswordOtpErrors>({});

  const resendOtpMutation = useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success(t("success.resendOtp"));
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const verifyOtpMutation = useMutation<
    boolean,
    Error,
    { email: string; otpCode: string }
  >({
    mutationFn: verifyForgotPasswordOtp,

    onSuccess: (isValid) => {
      if (isValid) {
        navigate(
          `/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}/${ROUTE.FORGOT_PASSWORD_RESET}`,
          {
            state: {
              email,
              otpCode: formValues.otpCode.trim(),
            },
          },
        );
      } else {
        toast.error(t("error.invalidOtp"));
      }
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          ERROR_CODE.SERVER_ERROR,
      );
    },
  });

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");

    setFormValues({
      otpCode: value,
    });

    if (errors.otpCode) {
      setErrors((prev) => ({
        ...prev,
        otpCode: "",
      }));
    }
  };

  const handleVerifyOtp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error(ERROR_CODE.EMAIL_NOT_VERIFIED);
      navigate(`/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}`);
      return;
    }

    const trimmedValues: ForgotPasswordOtpFormValues = {
      otpCode: formValues.otpCode.trim(),
    };

    const result = forgotPasswordOtpSchema.safeParse(trimmedValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        otpCode: fieldErrors.otpCode?.[0],
      });

      return;
    }

    setErrors({});

    verifyOtpMutation.mutate({
      email,
      otpCode: result.data.otpCode,
    });
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error(ERROR_CODE.EMAIL_NOT_VERIFIED);
      navigate(`/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}`);
      return;
    }

    resendOtpMutation.mutate({
      email,
    });
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-4xl bg-card p-8 shadow-sm lg:p-10">
      <Link
        to={`/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-link hover:text-link-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("auth.changeEmail")}
      </Link>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-card-foreground">
          {t("auth.verify")}{" "}
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            OTP
          </span>
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          {t("auth.otpSentTo")}
        </p>

        <p className="mt-1 font-bold text-card-foreground">{email}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div>
          <label
            htmlFor="otpCode"
            className="mb-2 block text-sm font-bold text-card-foreground"
          >
            {t("auth.otpCode")}
          </label>

          <Input
            id="otpCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t("auth.enterOtp")}
            value={formValues.otpCode}
            onChange={handleOtpChange}
            className={`h-12 rounded-lg text-center text-lg font-semibold tracking-[0.4em] ${
              errors.otpCode
                ? "border-destructive focus-visible:ring-destructive/20"
                : "border-border"
            }`}
          />

          {errors.otpCode && (
            <p className="mt-3 text-sm font-bold text-destructive">
              {errors.otpCode}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="h-14 w-full rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground transition hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          {verifyOtpMutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              {t("auth.verifyOtp")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          disabled={resendOtpMutation.isPending}
          onClick={handleResendOtp}
          className="font-bold text-link hover:text-link-hover"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {resendOtpMutation.isPending
            ? t("auth.resending")
            : t("auth.resendOtp")}
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordVerifyOtpForm;