import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, ArrowRight, Mail, EyeOff, ShieldAlert } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import { authLogin, googleLogin } from "@/services/authService";
import { login } from "@/redux/features/userSlice";
import type { GoogleLoginRequest, LoginRequest } from "@/types/auth";
import type { User } from "@/models/user";
import { ERROR_CODE } from "@/constants/errorCode";
import {
  loginSchema,
  type LoginFormValues,
} from "@/validations/auth.validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type LoginErrors = Partial<Record<keyof LoginFormValues, string>>;

function saveAuthSession(user: User) {
  localStorage.setItem("accessToken", user.accessToken);
  localStorage.setItem("authUserId", String(user.userId));
}

function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValue, setEmailValue] = useState(
    localStorage.getItem("rememberEmail") || "",
  );

  // States for Appeal Suspension Dialog
  const [showAppealDialog, setShowAppealDialog] = useState(false);
  const [appealEmail, setAppealEmail] = useState("");

  const loginMutation = useMutation<User, Error, LoginRequest>({
    mutationFn: authLogin,

    onSuccess: (data) => {
      queryClient.clear();
      saveAuthSession(data);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", data.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      dispatch(login(data));

      toast.success(t("success.login"));

      navigate(`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`);
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;

      if (serverMessage === "Account is banned") {
        setAppealEmail(emailValue);
        setShowAppealDialog(true);
        return;
      }

      if (serverMessage === "Email not verified") {
        toast.error(t("error.emailNotVerified"));
        return;
      }

      if (serverMessage === "Invalid credentials") {
        toast.error(t("error.invalidCredentials"));
        return;
      }

      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const googleLoginMutation = useMutation<User, Error, GoogleLoginRequest>({
    mutationFn: googleLogin,

    onSuccess: (data) => {
      queryClient.clear();
      saveAuthSession(data);

      dispatch(login(data));

      toast.success(t("success.login"));

      navigate(`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`);
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;

      if (serverMessage === "Account is banned") {
        setAppealEmail("");
        setShowAppealDialog(true);
        return;
      }

      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleLoginMutation.mutate({
        token: tokenResponse.access_token,
      });
    },

    onError: () => {
      toast.error(t("error.googleLoginFailed"));
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const loginRequest: LoginRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
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

  const handleSendAppealEmail = () => {
    const adminEmail = "aistudyhub062026@gmail.com";
    const subject = encodeURIComponent("[AI Study Hub] Appeal Account Suspension Request");
    const body = encodeURIComponent(
      `Hello AI Study Hub Support Team,\n\nMy account has been suspended and I would like to request an appeal.\n\nAccount Email: ${appealEmail || "[Please enter your email here]"}\nFull Name: [Please enter your full name here]\n\nAppeal Reason & Details:\n[Explain why your account should be reactivated here]\n\nThank you.`
    );
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto w-full max-w-[580px] rounded-3xl bg-card p-10 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">
          {t("auth.loginForm.title")}{" "}
          <span className="text-primary">AI Study Hub</span>
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {t("auth.loginForm.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} autoComplete="on" className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            {t("auth.emailAddress")}
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              name="email"
              type="email"
              value={emailValue}
              onChange={(event) => setEmailValue(event.target.value)}
              placeholder={t("auth.enterEmail")}
              autoComplete="email"
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

        <div>
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            {t("auth.password")}
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              name="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.enterPassword")}
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-border"
            />
            {t("auth.rememberMe")}
          </label>

          <Link
            to={`/${ROUTE.AUTH}/${ROUTE.FORGOT_PASSWORD}`}
            className="text-sm font-medium text-link hover:text-link-hover hover:underline"
          >
            {t("auth.forgotPasswordLink")}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-sm font-semibold text-primary-foreground transition-all duration-300 hover:from-primary-start-hover hover:to-primary-end-hover"
        >
          {loginMutation.isPending ? t("auth.signingIn") : t("auth.login")}
          <ArrowRight className="ml-2 size-4" />
        </Button>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">
            {t("auth.orContinueWith")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={googleLoginMutation.isPending}
          onClick={() => handleGoogleLogin()}
          className="h-12 w-full cursor-pointer rounded-lg border-border bg-card text-[16px] font-medium text-foreground hover:bg-accent"
        >
          <FcGoogle className="size-7" />
          {googleLoginMutation.isPending
            ? t("auth.signingIn")
            : t("auth.continueWithGoogle")}
        </Button>

        <p className="pt-4 text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link
            to={`/${ROUTE.AUTH}/${ROUTE.REGISTER}`}
            className="font-semibold text-link hover:text-link-hover hover:underline"
          >
            {t("auth.registerNow")}
          </Link>
        </p>
      </form>

      {/* APPEAL ACCOUNT SUSPENSION DIALOG */}
      <Dialog open={showAppealDialog} onOpenChange={setShowAppealDialog}>
        <DialogContent className="rounded-3xl border border-slate-400 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden text-left z-50">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl shrink-0 border bg-red-500/10 border-red-500/20 text-red-500">
                <ShieldAlert className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[9px] uppercase font-black tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15">
                  {t("admin.appealTitle", "Account Locked")}
                </span>
                <DialogTitle className="text-sm font-black text-card-foreground mt-0.5">
                  {t("admin.appealHeader", "Suspension Appeal")}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-3 my-1">
            <p className="text-xs text-slate-700 dark:text-muted-foreground/90 font-semibold leading-relaxed">
              {t("admin.appealMessage", "Your account has been locked due to a violation of community guidelines. If you believe this is a mistake or wish to appeal this decision, you can submit an appeal directly to the Support Team.")}
            </p>
            
            <div className="p-3 bg-secondary/15 rounded-xl border border-border/30 text-[11px] font-bold text-slate-700 dark:text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>Support Email: <strong className="text-primary">aistudyhub062026@gmail.com</strong></span>
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleSendAppealEmail}
              className="w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              {t("admin.sendAppealAction", "Appeal via Email")}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setShowAppealDialog(false)}
              className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer sm:ml-auto"
            >
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoginForm;