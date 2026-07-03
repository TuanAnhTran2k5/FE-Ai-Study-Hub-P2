import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/validations/auth.validation";
import { ROUTE } from "@/models/routePath";
import { authRegister } from "@/services/authService";

type RegisterErrors = Partial<Record<keyof RegisterFormValues, string>>;

function RegisterForm() {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormValues>({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});

  const navigate = useNavigate();

  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    RegisterRequest
  >({
    mutationFn: authRegister,

    onSuccess: (data) => {
      toast.success(t("success.otpSent"));

      navigate(`/${ROUTE.AUTH}/${ROUTE.REGISTER}/${ROUTE.VERIFY_OTP}`, {
        state: {
          email: data.email,
          otpExpiredAt: data.otpExpiredAt,
        },
      });
    },

    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    },
  });

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: RegisterErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormValues;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    registerMutation.mutate(result.data);
  };

  return (
    <div className="mx-auto w-full max-w-[520px] rounded-[28px] border border-card/70 bg-card/95 px-8 py-9 shadow-2xl shadow-primary/10 backdrop-blur md:px-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-card-foreground">
          {t("auth.registerForm.title")}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.registerForm.description")}
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            {t("auth.emailAddress")}
          </Label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder={t("auth.enterEmail")}
              className={`h-12 rounded-lg bg-muted pl-11 ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-sm font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            {t("auth.fullName")}
          </Label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder={t("auth.enterFullName")}
              className={`h-12 rounded-lg bg-muted pl-11 ${
                errors.fullName
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
          </div>

          {errors.fullName && (
            <p className="mt-1 text-sm font-medium text-destructive">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            {t("auth.password")}
          </Label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder={t("auth.createPassword")}
              className={`h-12 rounded-lg bg-muted px-11 ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-link"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            {t("auth.confirmPassword")}
          </Label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              placeholder={t("auth.confirmYourPassword")}
              className={`h-12 rounded-lg bg-muted px-11 ${
                errors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-link"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm font-medium text-destructive">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={registerMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-success-start to-success-end text-sm font-bold text-success-foreground shadow-lg shadow-success/20 hover:from-success-start-hover hover:to-success-end-hover"
        >
          {registerMutation.isPending
            ? t("auth.creatingAccount")
            : t("auth.createAccount")}
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
