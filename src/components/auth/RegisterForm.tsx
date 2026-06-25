import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/validations/auth.validation";
import { ROUTE } from "@/models/routePath";
import { authRegister } from "@/services/authService";

type RegisterErrors = Partial<Record<keyof RegisterFormValues, string>>;

function RegisterForm() {
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
    toast.success("OTP has been sent to your email");

    navigate(`/${ROUTE.AUTH}/${ROUTE.REGISTER}/${ROUTE.VERIFY_OTP}`, {
      state: {
        email: data.email,
        otpExpiredAt: data.otpExpiredAt,
      },
    });
  },

  onError: (error: any) => {
    const message =
      error.response?.data?.message || error.message;

    toast.error(message);
  },
});

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    setErrors({
      ...errors,
      [field]: "",
    });
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
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details below to get started.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <Label className="mb-2 block text-sm font-semibold text-foreground">
            Email Address
          </Label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
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
            Full Name
          </Label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name"
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
            Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Create a password"
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
            Confirm Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
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
          Create Account
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
