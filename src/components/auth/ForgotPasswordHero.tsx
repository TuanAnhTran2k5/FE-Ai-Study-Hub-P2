import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTE } from "@/models/routePath";

function ForgotPasswordHero() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-[650px] flex-col justify-center">
      <Link
        to={`/${ROUTE.AUTH}/${ROUTE.LOGIN}`}
        className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-link transition hover:text-link-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("auth.backToLogin")}
      </Link>

      <div className="space-y-5">
        <h1 className="text-4xl font-extrabold leading-tight text-card-foreground lg:text-5xl">
          {t("auth.forgotPassword.heroTitleStart")} <br />
          <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
            {t("auth.forgotPassword.heroTitleHighlight")}
          </span>
        </h1>

        <p className="max-w-md text-base leading-7 text-foreground">
          {t("auth.forgotPassword.heroDescription")}
        </p>
      </div>

      <div className="mt-10 max-w-md rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
        <div className="space-y-5">
          <HeroItem
            icon={<MailCheck className="h-5 w-5" />}
            title={t("auth.forgotPassword.checkEmailTitle")}
            description={t("auth.forgotPassword.checkEmailDescription")}
            className="bg-primary-bg-hover text-primary"
          />

          <HeroItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title={t("auth.forgotPassword.verifyIdentityTitle")}
            description={t("auth.forgotPassword.verifyIdentityDescription")}
            className="bg-secondary text-primary"
          />

          <HeroItem
            icon={<KeyRound className="h-5 w-5" />}
            title={t("auth.forgotPassword.createPasswordTitle")}
            description={t("auth.forgotPassword.createPasswordDescription")}
            className="bg-success/15 text-success"
          />
        </div>
      </div>
    </div>
  );
}

function HeroItem({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${className}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-card-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default ForgotPasswordHero;