import { useEffect, useMemo, useState, useRef } from "react";
import { Globe2, Lock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisibilityStatus } from "@/models/document.enum";
import type { SubjectResponse } from "@/types/academic.type";
import type { DocumentResponse } from "@/types/document.type";

type DocumentUpdateDialogProps = {
  document: DocumentResponse;
  subjects: SubjectResponse[];
  isOpen: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function DocumentUpdateDialog({
  document: docProp,
  subjects,
  isOpen,
  isSaving,
  onOpenChange,
  onSubmit,
}: DocumentUpdateDialogProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubject = useMemo(
    () =>
      subjects.find(
        (subject) => Number(subject.subjectId) === Number(docProp.subjectId),
      ),
    [docProp.subjectId, subjects],
  );

  const [visibility, setVisibility] = useState<VisibilityStatus>(
    docProp.visibilityStatus === VisibilityStatus.PUBLIC
      ? VisibilityStatus.PUBLIC
      : VisibilityStatus.PRIVATE,
  );

  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    String(docProp.subjectId),
  );

  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const documentExtension = useMemo(() => {
    const name = docProp.fileName || "";
    return name.includes(".") ? name.substring(name.lastIndexOf(".")) : "";
  }, [docProp.fileName]);

  const semesterOptions = useMemo(() => {
    const semesterMap = new Map<string, number | string>();

    subjects.forEach((subject) => {
      if (subject.semesterId === undefined || subject.semesterId === null) {
        return;
      }

      semesterMap.set(
        String(subject.semesterId),
        subject.semesterNo ?? subject.semesterId,
      );
    });

    return Array.from(semesterMap.entries()).map(
      ([semesterId, semesterNo]) => ({
        semesterId,
        semesterNo,
      }),
    );
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    if (!selectedSemesterId) return [];

    return subjects.filter(
      (subject) => String(subject.semesterId) === selectedSemesterId,
    );
  }, [selectedSemesterId, subjects]);

  useEffect(() => {
    if (!isOpen) {
      setReplacementFile(null);
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setVisibility(
      docProp.visibilityStatus === VisibilityStatus.PUBLIC
        ? VisibilityStatus.PUBLIC
        : VisibilityStatus.PRIVATE,
    );

    const initialSemesterId =
      currentSubject?.semesterId !== undefined &&
      currentSubject?.semesterId !== null
        ? String(currentSubject.semesterId)
        : "";

    setSelectedSemesterId(initialSemesterId);
    setSelectedSubjectId(String(docProp.subjectId));
  }, [currentSubject, docProp, isOpen]);

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);

    const firstSubjectInSemester = subjects.find(
      (subject) => String(subject.semesterId) === semesterId,
    );

    setSelectedSubjectId(
      firstSubjectInSemester ? String(firstSubjectInSemester.subjectId) : "",
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setReplacementFile(null);
      setFileError("");
      return;
    }

    const newName = file.name || "";
    const newExt = newName.includes(".") ? newName.substring(newName.lastIndexOf(".")).toLowerCase() : "";
    if (newExt !== documentExtension.toLowerCase()) {
      setFileError(t("document.unsupportedTypePrompt", "Unsupported file type"));
      setReplacementFile(null);
    } else {
      setFileError("");
      setReplacementFile(file);
    }
  };

  const handleRemoveFile = () => {
    setReplacementFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t("document.dialogUpdateTitle", "Update Document")}</DialogTitle>
            <DialogDescription>
              {t("document.dialogUpdateDesc", "Edit document information and save your changes.")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="update-title">{t("documentUpload.titleLabel", "Title *")}</Label>
              <Input
                id="update-title"
                name="title"
                defaultValue={docProp.title}
                placeholder={t("documentUpload.titlePlaceholder", "Enter document title")}
                className="h-11 focus-visible:ring-primary/30"
                disabled={isSaving}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("documentUpload.semesterLabel", "Semester *")}</Label>
                <Select
                  value={selectedSemesterId}
                  onValueChange={handleSemesterChange}
                  disabled={isSaving}
                  required
                >
                  <SelectTrigger className="h-11 w-full focus:ring-primary/30">
                    <SelectValue placeholder={t("documentUpload.semesterPlaceholder", "Select semester")} />
                  </SelectTrigger>

                  <SelectContent>
                    {semesterOptions.map((semester) => (
                      <SelectItem
                        key={semester.semesterId}
                        value={semester.semesterId}
                      >
                        {t("documentUpload.semesterOption", { num: semester.semesterNo })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("documentUpload.subjectLabel", "Subject *")}</Label>
                <Select
                  name="subjectId"
                  value={selectedSubjectId}
                  onValueChange={setSelectedSubjectId}
                  disabled={isSaving || !selectedSemesterId}
                  required
                >
                  <SelectTrigger className="h-11 w-full focus:ring-primary/30">
                    <SelectValue
                      placeholder={
                        selectedSemesterId
                          ? t("documentUpload.subjectPlaceholder", "Select subject")
                          : t("documentUpload.selectSemesterFirst", "Select semester first")
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredSubjects.map((subject) => (
                      <SelectItem
                        key={subject.subjectId}
                        value={String(subject.subjectId)}
                      >
                        {subject.subjectCode} - {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("documentUpload.visibilityLabel", "Visibility *")}</Label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isSaving}
                  className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
                    visibility === VisibilityStatus.PUBLIC
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                  onClick={() => setVisibility(VisibilityStatus.PUBLIC)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Globe2 className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-card-foreground">
                        {t("documentUpload.publicTitle", "Public")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("documentUpload.publicDesc1", "Visible to everyone")}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
                    visibility === VisibilityStatus.PRIVATE
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                  onClick={() => setVisibility(VisibilityStatus.PRIVATE)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Lock className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-card-foreground">
                        {t("documentUpload.privateTitle", "Private")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("documentUpload.privateDesc1", "Only visible to you")}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <input
                type="hidden"
                name="visibilityStatus"
                value={visibility}
              />
            </div>

            {/* Replace file content section (Only for original documents, not copies) */}
            {(!docProp.originalUploaderId || Number(docProp.originalUploaderId) === Number(docProp.ownerId)) && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-bold text-card-foreground">
                    {t("document.replaceFileLabel", "Replace Document File (Optional)")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("document.replaceFileSwitch", "Replace with new file (Change document content)")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="replacement-file"
                    name="replacementFile"
                    ref={fileInputRef}
                    accept={documentExtension}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isSaving}
                  />

                  {!replacementFile ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSaving}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border-dashed border-primary/45 bg-primary/5 hover:bg-primary/10 text-primary font-bold h-11 px-5"
                    >
                      {t("document.chooseFilePrompt", "Choose replacement file")}
                    </Button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-card-foreground max-w-[200px] sm:max-w-md">
                            {replacementFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(replacementFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer px-3 shrink-0"
                        onClick={handleRemoveFile}
                      >
                        {t("common.delete", "Remove")}
                      </Button>
                    </div>
                  )}

                  {!replacementFile && (
                    <span className="text-xs text-muted-foreground">
                      {t("document.mustBeFile", { ext: documentExtension })}
                    </span>
                  )}
                </div>

                {fileError && (
                  <p className="text-xs font-semibold text-destructive">{fileError}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>

            <Button type="submit" disabled={isSaving || (replacementFile === null && fileError !== "")}>
              {isSaving ? t("document.savingChanges", "Saving... ") : t("document.btnSave", "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentUpdateDialog;