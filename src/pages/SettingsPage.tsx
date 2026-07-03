import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import LanguageSettings from "@/components/settings/LanguageSettings";

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          <Settings className="h-5 w-5" />
          {t("settings.label")}
        </p>

        <h1 className="mt-2 text-4xl font-black text-card-foreground">
          {t("settings.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      <div className="grid gap-5">
        <LanguageSettings />
      </div>
    </section>
  );
}

export default SettingsPage;