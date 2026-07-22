import { Settings, Globe, Sun, Palette, Check, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { THEME_COLORS } from "@/constants/themeColors";
import type { ThemeColor } from "@/constants/themeColors";
import { toast } from "react-toastify";

export default function GuestSettingsDialog() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [currentColor, setCurrentColor] = useState(() => localStorage.getItem("theme-color") || "blue");
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeLanguage = (lang: "en" | "vi") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    toast.success(t("settings.language.changeSuccess", "Thay đổi ngôn ngữ thành công!"));
  };

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="size-10 border-border cursor-pointer hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary active:scale-95 shrink-0"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-3xl border border-slate-400 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden text-left z-50 max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Settings className="h-5.5 w-5.5 animate-spin-slow" />
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 dark:text-muted-foreground/80 block">
                {t("settings.label", "Cấu hình")}
              </span>
              <DialogTitle className="text-sm font-black text-card-foreground mt-0.5">
                {t("settings.title", "Cài đặt ứng dụng")}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-5 my-1 pr-1 scrollbar-thin">
          {/* Language Selection */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" />
              {t("settings.language.title", "Ngôn ngữ hiển thị")}
            </h3>
            <div className="flex gap-2.5 pt-1">
              <Button
                variant={i18n.language === "en" ? "default" : "outline"}
                onClick={() => handleChangeLanguage("en")}
                className={`rounded-xl font-bold text-xs h-9 cursor-pointer flex-1 transition-all ${
                  i18n.language === "en" ? "bg-primary text-primary-foreground shadow-sm" : ""
                }`}
              >
                {t("settings.language.en", "English")}
              </Button>
              <Button
                variant={i18n.language === "vi" ? "default" : "outline"}
                onClick={() => handleChangeLanguage("vi")}
                className={`rounded-xl font-bold text-xs h-9 cursor-pointer flex-1 transition-all ${
                  i18n.language === "vi" ? "bg-primary text-primary-foreground shadow-sm" : ""
                }`}
              >
                {t("settings.language.vi", "Tiếng Việt")}
              </Button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2 pt-2 border-t border-border/30">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-muted-foreground flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-primary" />
              {t("settings.appearance.themeTitle", "Chế độ hiển thị")}
            </h3>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                  theme === "light"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-background hover:bg-secondary/15 text-card-foreground"
                }`}
              >
                <Sun className="h-4.5 w-4.5 text-orange-500" />
                <span className="text-[10px] font-bold">{t("settings.appearance.light", "Giao diện Sáng")}</span>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-background hover:bg-secondary/15 text-card-foreground"
                }`}
              >
                <Moon className="h-4.5 w-4.5 text-indigo-400" />
                <span className="text-[10px] font-bold">{t("settings.appearance.dark", "Giao diện Tối")}</span>
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                  theme === "system"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-background hover:bg-secondary/15 text-card-foreground"
                }`}
              >
                <Monitor className="h-4.5 w-4.5 text-slate-500" />
                <span className="text-[10px] font-bold">{t("settings.appearance.system", "Đồng bộ hệ thống")}</span>
              </button>
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-2 pt-3 border-t border-border/30">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-muted-foreground flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-primary" />
              {t("settings.appearance.colorTitle", "Màu sắc chủ đạo")}
            </h3>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                    currentColor === color.id
                      ? "border-primary bg-primary/5 text-primary font-black shadow-sm"
                      : "border-border bg-background hover:bg-secondary/15 text-muted-foreground hover:text-card-foreground font-bold"
                  }`}
                >
                  <span className={`size-5 rounded-full shrink-0 flex items-center justify-center shadow-inner ${color.primaryColor}`}>
                    {currentColor === color.id && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <span className="text-[10px] truncate max-w-full">
                    {t(color.nameKey, color.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 shrink-0">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full font-black text-xs h-9 rounded-2xl bg-primary text-primary-foreground cursor-pointer"
          >
            {t("common.close", "Đóng")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
