import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE } from "@/models/routePath";

function ForgotPasswordHero() {
  return (
    <div className="flex h-full min-h-[650px] flex-col justify-center">
      <Link
        to={`/${ROUTE.AUTH}/${ROUTE.LOGIN}`}
        className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-link transition hover:text-link-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="space-y-5">
        <h1 className="text-4xl font-extrabold leading-tight text-card-foreground lg:text-5xl">
          Forgot your <br />
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            password?
          </span>
        </h1>

        <p className="max-w-md text-base leading-7 text-foreground">
          No worries. Enter your email address and we will send you an OTP code
          to verify your account before creating a new password.
        </p>
      </div>

      <div className="mt-10 max-w-md rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-bg-hover text-primary">
              <MailCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-card-foreground">
                Check your email
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We will send a secure OTP code to your registered email.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-card-foreground">
                Verify identity
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                OTP verification helps protect your AI Study Hub account.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
              <KeyRound className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-card-foreground">
                Create new password
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                After verification, you can safely reset your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordHero;
