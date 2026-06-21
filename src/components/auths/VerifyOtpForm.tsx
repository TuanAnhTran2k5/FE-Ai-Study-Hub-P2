import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ROUTE } from "@/models/routePath";
import { resendOtp, verifyOtp } from "@/services/authService";

import type { User } from "@/models/user";
import type {
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
} from "@/types/auth";

import { SUCCESS_MESSAGE } from "@/constants/successMessage";
import { ERROR_CODE } from "@/constants/errorCode";

function VerifyOtpForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromRegister = location.state?.email || "";

  const [email] = useState(emailFromRegister);
  const [otpCode, setOtpCode] = useState("");

  const verifyMutation = useMutation<User, Error, VerifyOtpRequest>({
    mutationFn: verifyOtp,

    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.VERIFY_OTP_SUCCESS);

      navigate(`/${ROUTE.AUTH}/${ROUTE.LOGIN}`);
    },

    onError: (error: any) => {
      const message = error.response?.data?.message || ERROR_CODE.SERVER_ERROR;

      toast.error(message);
    },
  });

  const resendOtpMutation = useMutation<
    ResendOtpResponse,
    Error,
    ResendOtpRequest
  >({
    mutationFn: resendOtp,

    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.RESEND_OTP_SUCCESS);
    },

    onError: (error: any) => {
      const message = error.response?.data?.message || ERROR_CODE.SERVER_ERROR;

      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error(ERROR_CODE.FIELD_REQUIRED);

      navigate(`/${ROUTE.AUTH}/${ROUTE.REGISTER}`);
      return;
    }

    if (!otpCode.trim()) {
      toast.error(ERROR_CODE.OTP_REQUIRED);
      return;
    }

    if (otpCode.length !== 6) {
      toast.error(ERROR_CODE.OTP_INVALID);
      return;
    }

    verifyMutation.mutate({
      email: email.trim(),
      otpCode,
    });
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error(ERROR_CODE.FIELD_REQUIRED);

      navigate(`/${ROUTE.AUTH}/${ROUTE.REGISTER}`);
      return;
    }

    resendOtpMutation.mutate({
      email: email.trim(),
      purpose: "REGISTER",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[520px] rounded-3xl bg-card p-10 shadow-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </div>

        <h1 className="text-3xl font-bold text-card-foreground">
          Verify your email
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Enter the OTP code sent to your email.
        </p>

        {email && (
          <p className="mt-2 text-sm font-medium text-primary">{email}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            OTP Code
          </label>

          <Input
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setOtpCode(value);
            }}
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="h-12 rounded-lg border-border text-center text-lg font-semibold tracking-[0.4em]"
          />
        </div>

        <Button
          type="submit"
          disabled={verifyMutation.isPending || otpCode.length !== 6}
          className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-sm font-semibold text-primary-foreground"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify Email"}

          <ArrowRight className="ml-2 size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleResendOtp}
          disabled={resendOtpMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-lg border-border bg-card text-sm font-medium"
        >
          <RotateCcw className="mr-2 size-4" />

          {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
        </Button>
      </form>
    </div>
  );
}

export default VerifyOtpForm;
