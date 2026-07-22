import { Globe, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getSemesters } from "@/services/academicService";

export default function GeneralPanel() {
  const { t, i18n } = useTranslation();
  const [semester, setSemester] = useState(() => localStorage.getItem("default-semester") || "");

  const { data: semesters = [], isLoading: isSemestersLoading } = useQuery({
    queryKey: ["academic", "semesters"],
    queryFn: getSemesters,
    retry: 1,
  });

  const handleChangeLanguage = (lang: "en" | "vi") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    toast.success(t("settings.language.changeSuccess", "Thay đổi ngôn ngữ thành công!"));
  };

  const handleSemesterChange = (val: string) => {
    const value = val === "ALL" ? "" : val;
    setSemester(value);
    if (value) {
      localStorage.setItem("default-semester", value);
    } else {
      localStorage.removeItem("default-semester");
    }
    toast.success(t("settings.academic.semesterSuccess", "Cập nhật học kỳ mặc định thành công!"));
  };

  return (
    <div className="space-y-6">
      {/* Language Section */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.language.title", "Ngôn ngữ hiển thị")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.language.description", "Chọn ngôn ngữ hiển thị cho giao diện ứng dụng AI Study Hub.")}
              </p>

              <div className="pt-4 flex flex-wrap gap-3">
                <Button
                  variant={i18n.language === "en" ? "default" : "outline"}
                  onClick={() => handleChangeLanguage("en")}
                  className={`rounded-xl font-bold text-xs h-9 cursor-pointer transition-all duration-300 ${
                    i18n.language === "en" ? "bg-primary text-primary-foreground shadow-sm" : ""
                  }`}
                >
                  {t("settings.language.en", "English")}
                </Button>
                <Button
                  variant={i18n.language === "vi" ? "default" : "outline"}
                  onClick={() => handleChangeLanguage("vi")}
                  className={`rounded-xl font-bold text-xs h-9 cursor-pointer transition-all duration-300 ${
                    i18n.language === "vi" ? "bg-primary text-primary-foreground shadow-sm" : ""
                  }`}
                >
                  {t("settings.language.vi", "Tiếng Việt")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic default Settings */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.academic.title", "Học kỳ mặc định")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.academic.description", "Lọc tài liệu và chương trình học tự động theo học kỳ của bạn.")}
              </p>

              <div className="pt-4 max-w-xs">
                <Select value={semester || "ALL"} onValueChange={handleSemesterChange} disabled={isSemestersLoading}>
                  <SelectTrigger className="h-10 rounded-2xl border border-slate-300 dark:border-border bg-background text-xs font-bold text-card-foreground cursor-pointer focus:ring-0 focus:border-primary">
                    <SelectValue placeholder={isSemestersLoading ? t("common.loading", "Loading...") : t("settings.academic.placeholder", "Tất cả học kỳ")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-slate-300 dark:border-border bg-popover text-popover-foreground shadow-lg z-50">
                    <SelectItem value="ALL" className="text-xs font-bold cursor-pointer">
                      {t("settings.academic.all", "Tất cả học kỳ")}
                    </SelectItem>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.semesterId} value={sem.semesterNo} className="text-xs font-bold cursor-pointer">
                        {t("settings.academic.semesterNum", "Kỳ học {{num}}", { num: sem.semesterNo })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
