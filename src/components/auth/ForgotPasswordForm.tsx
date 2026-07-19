import { ERROR_CODE } from "@/constants/errorCode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import { forgotPassword } from "@/services/authService";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/types/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/validations/auth.validation";

import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type ForgotPasswordErrors = Partial<
  Record<keyof ForgotPasswordFormValues, string>
>;

function ForgotPasswordForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [formValues, setFormValues] = useState<ForgotPasswordFormValues>({
    email: initialEmail,
  });

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const forgotPasswordMutation = useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,

    onSuccess: (_, variables) => {
      toast.success(t("success.forgotPasswordOtpSent"));

      navigate(
        `/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}/${ROUTE.FORGOT_PASSWORD_VERIFY_OTP}`,
        {
          state: {
            email: variables.email,
          },
        },
      );
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message || error.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormValues({
      email: value,
    });

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValues: ForgotPasswordFormValues = {
      email: formValues.email.trim(),
    };

    const result = forgotPasswordSchema.safeParse(trimmedValues);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
      });

      return;
    }

    setErrors({});

    forgotPasswordMutation.mutate({
      email: result.data.email,
    });
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-4xl bg-card p-8 shadow-sm lg:p-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-card-foreground">
          {t("auth.forgotPassword.titleStart")}{" "}
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            {t("auth.forgotPassword.titleHighlight")}
          </span>
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          {t("auth.forgotPassword.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-card-foreground"
          >
            {t("auth.emailAddress")}
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder={t("auth.enterEmail")}
              value={formValues.email}
              onChange={handleChangeEmail}
              className={`h-14 rounded-xl bg-secondary pl-12 text-card-foreground placeholder:text-muted-foreground ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-3 text-sm font-bold text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="h-14 w-full cursor-pointer rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground transition hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          {forgotPasswordMutation.isPending
            ? t("auth.sending")
            : t("auth.sendOtp")}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("auth.rememberPassword")}{" "}
        <Link
          to={`/${ROUTE.AUTH}/${ROUTE.LOGIN}`}
          className="font-bold text-link hover:text-link-hover"
        >
          {t("auth.loginNow")}
        </Link>
      </p>
    </div>
  );
}

export default ForgotPasswordForm;