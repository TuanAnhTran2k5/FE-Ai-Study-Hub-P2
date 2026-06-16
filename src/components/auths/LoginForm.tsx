import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, ArrowRight, Mail, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import { authLogin } from "@/services/authService";
import { login } from "@/redux/features/userSlice";
import { toast } from "react-toastify";

import { ROUTE } from "@/models/routePath";
import { SUCCESS_MESSAGE } from "@/constants/successMessage";
import {
  loginSchema,
  type LoginFormValues,
} from "@/validations/auth.validation";

type LoginErrors = Partial<Record<keyof LoginFormValues, string>>;
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<LoginErrors>({});

  //useDispatch để sài
  const dispatch = useDispatch();
  //useNavigate để điều hướng
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authLogin,
    //khi mà call API thành công, trả cho data
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      dispatch(login(data.user));

      toast.success(SUCCESS_MESSAGE.LOGIN_SUCCESS);

      navigate(`/${ROUTE.APP}`);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");

    const password = formData.get("password");

    const loginRequest: LoginRequest = {
      email: email as string,
      password: password as string,
    };

    const result = loginSchema.safeParse(loginRequest);

    if (!result.success) {
      const fieldErrors: LoginErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormValues;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    loginMutation.mutate(loginRequest);
  };

  return (
    <div className="mx-auto w-full max-w-[580px] rounded-3xl bg-card p-10 shadow-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">
          Login to <span className="text-primary">AI Study Hub</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`h-12 rounded-lg border-border pl-11 text-sm ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
          </div>
        </div>
        {errors.email && (
          <p className="mt-1 text-sm font-medium text-destructive">
            {errors.email}
          </p>
        )}

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`h-12 rounded-lg border-border px-11 text-sm ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm font-medium text-destructive">
            {errors.password}
          </p>
        )}

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" className="size-4 rounded border-border" />
            Remember me
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-link hover:text-link-hover hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-sm font-semibold text-primary-foreground transition-all duration-300 hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          Login
          <ArrowRight className="ml-2 size-4" />
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">
            or continue with
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full cursor-pointer rounded-lg border-border bg-card text-[16px] font-medium text-foreground hover:bg-accent"
        >
          <FcGoogle className="size-7" />
          Continue with Google
        </Button>

        {/* Register */}
        <p className="pt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-link hover:text-link-hover hover:underline"
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
