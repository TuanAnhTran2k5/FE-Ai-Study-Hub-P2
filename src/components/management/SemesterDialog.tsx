import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ERROR_CODE } from "@/constants/errorCode";
import type {
  SemesterRequest,
  SemesterResponse,
} from "@/types/curriculum.type";
import { toast } from "react-toastify";

interface SemesterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSemester: SemesterResponse | null;
  onSubmit: (data: SemesterRequest) => void;
  isPending: boolean;
}

export default function SemesterDialog({
  isOpen,
  onOpenChange,
  editingSemester,
  onSubmit,
  isPending,
}: SemesterDialogProps) {
  const { t } = useTranslation();
  const [semesterNo, setSemesterNo] = useState("");
  const [description, setDescription] = useState("");

  // Sync data when editing semester changes
  useEffect(() => {
    if (editingSemester) {
      setSemesterNo(editingSemester.semesterNo);
      setDescription(editingSemester.description || "");
    } else {
      setSemesterNo("");
      setDescription("");
    }
  }, [editingSemester, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterNo.trim()) {
      toast.error(ERROR_CODE.SEMESTER_NO_REQUIRED);
      return;
    }
    onSubmit({
      semesterNo: semesterNo.trim(),
      description: description.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-card-foreground">
            {editingSemester ? t("curriculum.editSemester", "Edit Semester") : t("curriculum.addSemester", "Add Semester")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="semesterNo" className="font-bold">
              {t("curriculum.semesterCodeLabel", "Semester Code / Number")}
            </Label>
            <Input
              id="semesterNo"
              placeholder={t("curriculum.semesterCodePlaceholder", "e.g. Semester 1, Spring 2026...")}
              value={semesterNo}
              onChange={(e) => setSemesterNo(e.target.value)}
              className="h-11 rounded-xl"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold">
              {t("curriculum.descriptionOptional", "Description (Optional)")}
            </Label>
            <Textarea
              id="description"
              placeholder={t("curriculum.descriptionPlaceholder", "Details about this learning semester...")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl min-h-[100px]"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer rounded-xl font-bold"
            >
              <X className="mr-2 h-4 w-4" />
              {t("curriculum.btnCancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-xl font-bold"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("curriculum.btnSave", "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
