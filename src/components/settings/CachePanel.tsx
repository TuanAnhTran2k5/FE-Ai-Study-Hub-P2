import { Trash2, RotateCcw, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CachePanel() {
  const { t } = useTranslation();
  const [isOpenResetDialog, setIsOpenResetDialog] = useState(false);
  const [storageBytes, setStorageBytes] = useState(0);

  const calculateStorage = () => {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || "";
        totalBytes += (key.length + value.length) * 2;
      }
    }
    setStorageBytes(totalBytes);
  };

  useEffect(() => {
    calculateStorage();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClearCache = () => {
    const keysToKeep = ["accessToken", "refreshToken", "user", "persist:root"];
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));
    calculateStorage();
    toast.success(t("settings.cache.clearSuccess", "Đã dọn sạch bộ nhớ tạm thời của trình duyệt!"));
  };

  const handleResetSettings = () => {
    const configKeys = ["theme-color", "default-semester", "language", "theme"];
    configKeys.forEach((key) => localStorage.removeItem(key));
    
    const root = document.documentElement;
    const themeClasses = ["theme-blue", "theme-indigo", "theme-purple", "theme-emerald", "theme-orange", "theme-rose"];
    themeClasses.forEach((cls) => root.classList.remove(cls));
    root.classList.add("theme-blue");
    
    calculateStorage();
    setIsOpenResetDialog(false);
    toast.success(t("settings.cache.resetSuccess", "Đã khôi phục tất cả cài đặt giao diện về mặc định. Đang tải lại trang..."));
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Clear Cache Card */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.cache.title", "Dọn dẹp bộ nhớ tạm")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.cache.description", "Giải phóng bộ nhớ tạm thời của trang web (không xóa dữ liệu tài khoản hay tài liệu đã tải).")}
              </p>

              <div className="pt-4 space-y-3">
                <div className="text-[11px] font-bold text-muted-foreground flex justify-between items-center max-w-sm">
                  <span>{t("settings.cache.usage", "Bộ nhớ cục bộ đã dùng:")}</span>
                  <span className="text-card-foreground font-extrabold">{formatBytes(storageBytes)} / 5.00 MB ({((storageBytes / 5242880) * 100).toFixed(4)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-200/60 dark:bg-zinc-800 rounded-full overflow-hidden max-w-sm border border-slate-300/40 dark:border-zinc-700/50 shadow-inner">
                  <div 
                    className="h-full rounded-full bg-amber-500 transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                    style={{ width: `${Math.max(0.8, (storageBytes / 5242880) * 100)}%` }}
                  />
                </div>
                <div className="pt-1">
                  <Button
                    variant="outline"
                    onClick={handleClearCache}
                    className="rounded-xl font-bold text-xs h-9 cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    {t("settings.cache.button", "Dọn dẹp bộ nhớ tạm")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings Card */}
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <RotateCcw className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-black text-card-foreground">
                {t("settings.cache.resetTitle", "Khôi phục cài đặt gốc")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("settings.cache.resetDescription", "Khôi phục toàn bộ cài đặt ngôn ngữ, giao diện và học kỳ mặc định về trạng thái ban đầu.")}
              </p>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpenResetDialog(true)}
                  className="rounded-xl font-bold text-xs h-9 cursor-pointer border-red-500/30 text-red-600 hover:bg-red-500/10"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  {t("settings.cache.resetButton", "Khôi phục mặc định")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isOpenResetDialog} onOpenChange={setIsOpenResetDialog}>
        <DialogContent className="rounded-3xl border border-slate-400 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden text-left z-[60]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl shrink-0 border bg-red-500/10 border-red-500/20 text-red-500">
                <ShieldAlert className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 dark:text-muted-foreground">
                  {t("settings.cache.warningLabel", "Cảnh báo")}
                </span>
                <DialogTitle className="text-sm font-black text-card-foreground mt-0.5">
                  {t("settings.cache.resetConfirmTitle", "Xác nhận khôi phục cài đặt?")}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 my-2">
            <p className="text-xs text-slate-600 dark:text-muted-foreground/90 font-semibold leading-relaxed">
              {t(
                "settings.cache.resetConfirmPrompt",
                "Hành động này sẽ thiết lập lại toàn bộ cấu hình ngôn ngữ, chế độ sáng tối và tông màu chủ đạo về trạng thái mặc định của hệ thống. Bạn có muốn tiếp tục?"
              )}
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleResetSettings}
              className="w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl text-white bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {t("settings.cache.confirmReset", "Xác nhận khôi phục")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsOpenResetDialog(false)}
              className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer"
            >
              {t("common.cancel", "Hủy bỏ")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
