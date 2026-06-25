import { ERROR_CODE } from "@/constants/errorCode";
import { SUCCESS_MESSAGE } from "@/constants/successMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import { forgotPassword } from "@/services/authService";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/types/auth";
import {
  forgotPasswordOtpSchema,
  type ForgotPasswordOtpFormValues,
} from "@/validations/auth.validation";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, KeyRound, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ForgotPasswordOtpErrors = Partial<
  Record<keyof ForgotPasswordOtpFormValues, string>
>;

function ForgotPasswordVerifyOtpForm() {
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
      toast.success(SUCCESS_MESSAGE.RESEND_OTP_SUCCESS);
    },

    onError: (error) => {
      toast.error(error.message || ERROR_CODE.SERVER_ERROR);
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

    navigate(
      `/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}/${ROUTE.FORGOT_PASSWORD_RESET}`,
      {
        state: {
          email,
          otpCode: result.data.otpCode,
        },
      },
    );
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
        Change email
      </Link>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-card-foreground">
          Verify{" "}
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            OTP
          </span>
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Enter the OTP code sent to
        </p>

        <p className="mt-1 font-bold text-card-foreground">{email}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div>
          <label
            htmlFor="otpCode"
            className="mb-2 block text-sm font-bold text-card-foreground"
          >
            OTP Code
          </label>

          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="otpCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={formValues.otpCode}
              onChange={handleOtpChange}
              className={`h-14 rounded-xl bg-secondary pl-12 text-center text-lg font-bold tracking-[0.4em] text-card-foreground placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground ${
                errors.otpCode
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
            />
          </div>

          {errors.otpCode && (
            <p className="mt-3 text-sm font-bold text-destructive">
              {errors.otpCode}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground transition hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          Verify OTP
          <ArrowRight className="ml-2 h-5 w-5" />
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
          {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordVerifyOtpForm;
