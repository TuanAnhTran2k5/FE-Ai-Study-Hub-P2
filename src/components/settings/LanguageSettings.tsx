import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LanguageSettings() {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (language: "en" | "vi") => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Languages className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-black text-card-foreground">
              {t("settings.language.title")}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {t("settings.language.description")}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant={i18n.language === "en" ? "default" : "outline"}
                onClick={() => handleChangeLanguage("en")}
                className="rounded-xl font-bold"
              >
                English
              </Button>

              <Button
                variant={i18n.language === "vi" ? "default" : "outline"}
                onClick={() => handleChangeLanguage("vi")}
                className="rounded-xl font-bold"
              >
                Tiếng Việt
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LanguageSettings;