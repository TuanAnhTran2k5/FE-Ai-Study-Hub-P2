import React, { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { BadgeResponse } from "@/types/badge.type";

interface BadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingBadge: BadgeResponse | null;
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export default function BadgeDialog({
  isOpen,
  onOpenChange,
  editingBadge,
  onSubmit,
  isPending,
}: BadgeDialogProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Danh sách tên các Badge hệ thống cố định không liên quan đến lượt tải tài liệu (chỉ liên quan upload hoặc hoạt động tuần)
  const NON_DOWNLOAD_BADGES = ["First Upload", "Top Weekly Contributor"];

  // Kiểm tra xem badge có thuộc nhóm liên quan đến lượt tải tài liệu hay không
  const hasDownloadsCondition =
    !editingBadge || !NON_DOWNLOAD_BADGES.includes(editingBadge.badgeName);

  // States
  const [badgeName, setBadgeName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredDownloads, setRequiredDownloads] = useState<number | "">(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Sync state when editingBadge changes or modal opens
  useEffect(() => {
    if (editingBadge) {
      setBadgeName(editingBadge.badgeName);
      setDescription(editingBadge.description);
      // Nếu là 0 hoặc null thì hiển thị chuỗi rỗng để ô nhập hiển thị placeholder thông minh, hoặc hiển thị đúng số
      setRequiredDownloads(
        editingBadge.requiredDownloads !== null && editingBadge.requiredDownloads !== undefined
          ? editingBadge.requiredDownloads
          : ""
      );
      setPreviewUrl(editingBadge.iconUrl);
    } else {
      setBadgeName("");
      setDescription("");
      setRequiredDownloads("");
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [editingBadge, isOpen]);

  // Handle preview image when selecting file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation image file
      if (!file.type.startsWith("image/")) {
        toast.error(t("badges.validation.imageType"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("badges.validation.imageSize"));
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const downloadsValue = requiredDownloads === "" ? 0 : requiredDownloads;

    if (!badgeName.trim()) {
      toast.error(t("badges.validation.nameRequired"));
      return;
    }
    if (!description.trim()) {
      toast.error(t("badges.validation.descRequired"));
      return;
    }
    if (downloadsValue < 0) {
      toast.error(t("badges.validation.downloadsPositive"));
      return;
    }
    if (!editingBadge && !selectedFile) {
      toast.error(t("badges.validation.iconRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("badgeName", badgeName.trim());
    formData.append("description", description.trim());
    
    if (hasDownloadsCondition) {
      formData.append("requiredDownloads", downloadsValue.toString());
    }
    
    if (selectedFile) {
      formData.append("iconFile", selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border/80 bg-card/98 backdrop-blur-xl w-full max-w-4xl p-6 shadow-2xl shadow-primary/5 overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-2 pb-3 border-b border-border/50">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-black text-card-foreground">
            {editingBadge ? t("badges.dialog.editTitle") : t("badges.dialog.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: UPLOAD LOGO (4 COLS) */}
            <div className="md:col-span-4 flex flex-col items-center gap-3 border-r-0 md:border-r border-border/50 pr-0 md:pr-6 pb-4 md:pb-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground self-start md:self-center">
                {t("badges.fields.icon")} *
              </span>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex size-28 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/10 hover:bg-secondary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-inner"
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Badge Preview"
                      className="size-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground p-3 text-center">
                    <ImageIcon className="h-6 w-6 opacity-60" />
                    <span className="text-[10px] font-bold">
                      {t("badges.fields.selectImage")}
                    </span>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-[9px] text-muted-foreground text-center max-w-[150px] leading-relaxed">
                {t("badges.fields.imageHint")}
              </p>
            </div>

            {/* CỘT PHẢI: FORM FIELDS (8 COLS) */}
            <div className="md:col-span-8 space-y-4">
              {/* BADGE NAME */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {t("badges.fields.name")} *
                </span>
                <Input
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder={t("badges.placeholders.name")}
                  disabled={isPending}
                  className="h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/45 border-border bg-secondary/5"
                />
              </div>

              {/* REQUIRED DOWNLOADS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {t("badges.fields.downloads")} *
                </span>
                <Input
                  type="number"
                  min="0"
                  value={requiredDownloads}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setRequiredDownloads("");
                    } else {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) {
                        setRequiredDownloads(num);
                      }
                    }
                  }}
                  placeholder={
                    hasDownloadsCondition
                      ? t("badges.placeholders.downloads")
                      : editingBadge?.conditionText || "Fixed system condition"
                  }
                  disabled={isPending || !hasDownloadsCondition}
                  className={`h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/45 border-border ${
                    !hasDownloadsCondition
                      ? "bg-secondary/20 opacity-80 cursor-not-allowed italic text-muted-foreground font-semibold"
                      : "bg-secondary/5"
                  }`}
                />
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {hasDownloadsCondition
                    ? t("badges.fields.downloadsHint")
                    : t("badges.fields.downloadsSystemFixed")}
                </p>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {t("badges.fields.description")} *
                </span>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("badges.placeholders.description")}
                  disabled={isPending}
                  className="min-h-[85px] max-h-[120px] rounded-xl resize-none focus-visible:ring-1 focus-visible:ring-primary/45 border-border bg-secondary/5 text-sm p-3"
                />
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <DialogFooter className="flex gap-2 sm:justify-end border-t border-border/50 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-sm"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-bold cursor-pointer h-10 px-5 text-sm"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBadge ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
