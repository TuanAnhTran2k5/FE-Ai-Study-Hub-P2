import { Check, Palette, Monitor, Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { THEME_COLORS } from "@/constants/themeColors";
import type { ThemeColor } from "@/constants/themeColors";
import { toast } from "react-toastify";

export default function AppearancePanel() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [currentColor, setCurrentColor] = useState(() => localStorage.getItem("theme-color") || "blue");

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    toast.success(t("settings.appearance.themeSuccess", "Cập nhật chế độ hiển thị thành công!"));
  };

  const handleColorChange = (color: ThemeColor) => {
    setCurrentColor(color.id);
    localStorage.setItem("theme-color", color.id);

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
    root.classList.add(`theme-${color.id}`);

    toast.success(t("settings.appearance.colorSuccess", "Đã thay đổi màu sắc chủ đạo của trang!"));
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sun className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.appearance.themeTitle", "Chế độ hiển thị")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.appearance.themeDescription", "Tùy chỉnh giao diện Sáng, Tối hoặc tự động đồng bộ theo hệ thống của bạn.")}
              </p>

              <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light Mode */}
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                    theme === "light"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-background hover:bg-secondary/10 text-card-foreground"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Sun className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold">{t("settings.appearance.light", "Giao diện Sáng")}</span>
                  {theme === "light" && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>

                {/* Dark Mode */}
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                    theme === "dark"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-background hover:bg-secondary/10 text-card-foreground"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Moon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold">{t("settings.appearance.dark", "Giao diện Tối")}</span>
                  {theme === "dark" && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>

                {/* System Mode */}
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                    theme === "system"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-background hover:bg-secondary/10 text-card-foreground"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-500">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold">{t("settings.appearance.system", "Mặc định hệ thống")}</span>
                  {theme === "system" && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accent Color Selection */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Palette className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.appearance.colorTitle", "Màu sắc chủ đạo")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.appearance.colorDescription", "Lựa chọn tông màu chủ đạo cho các nút bấm, liên kết và chi tiết nổi bật của trang web.")}
              </p>

              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                      currentColor === color.id
                        ? "border-primary bg-primary/5 text-primary font-black shadow-sm"
                        : "border-border bg-background hover:bg-secondary/10 text-muted-foreground hover:text-card-foreground font-bold"
                    }`}
                  >
                    <span className={`size-7 rounded-full shrink-0 flex items-center justify-center shadow-inner ${color.primaryColor}`}>
                      {currentColor === color.id && <Check className="h-4 w-4 text-white" />}
                    </span>
                    <span className="text-[11px] truncate max-w-full">
                      {t(color.nameKey, color.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
