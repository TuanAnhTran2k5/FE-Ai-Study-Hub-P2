import * as React from "react";
import { useTranslation } from "react-i18next";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Loader2 } from "lucide-react";

interface AuthInitProps {
  children: React.ReactNode;
}

export default function AuthInit({ children }: AuthInitProps) {
  const { t } = useTranslation();
  const { isChecking } = useAuthCheck();

  React.useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") || "blue";
    const root = document.documentElement;
    const themeClasses = [
      "theme-blue",
      "theme-indigo",
      "theme-purple",
      "theme-emerald",
      "theme-orange",
      "theme-rose",
    ];
    themeClasses.forEach((cls) => root.classList.remove(cls));
    root.classList.add(`theme-${savedColor}`);
  }, []);

  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">
            {t("auth.verifyingToken", "Xác thực tài khoản...")}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
