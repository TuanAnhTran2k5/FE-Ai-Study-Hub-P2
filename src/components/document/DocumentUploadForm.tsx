import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { FileText, FileUp, Globe2, Lock, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SemesterResponse, SubjectResponse } from "@/types/academic.type";

type DocumentUploadFormProps = {
  isSubmitting?: boolean;
  uploadProgress?: number;
  isAcademicLoading?: boolean;
  semesters: SemesterResponse[];
  subjects: SubjectResponse[];
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function formatFileSize(bytes: number) {
  // Đổi dung lượng file từ byte sang B/KB/MB để hiển thị dễ đọc.
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function DocumentUploadForm({
  isSubmitting = false,
  uploadProgress = 0,
  isAcademicLoading = false,
  semesters,
  subjects,
  onCancel,
  onSubmit,
}: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chỉ hiển thị subject thuộc semester mà người dùng vừa chọn.
  const filteredSubjects = selectedSemesterId
    ? subjects.filter(
        (subject) => String(subject.semesterId) === selectedSemesterId,
      )
    : [];

  const handleFileChange = (file?: File) => {
    // Lưu file đã chọn để đổi UI từ vùng chọn file sang thẻ thông tin file.
    setSelectedFile(file ?? null);
  };

  const handleRemoveFile = () => {
    // Xoá cả state và giá trị input thật, tránh submit nhầm file cũ.
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Khi đã chọn file rồi thì không nhận kéo thả thêm; muốn đổi file phải bấm nút X trước.
    if (isSubmitting || selectedFile) return;

    const file = event.dataTransfer.files?.[0];

    if (!file || !fileInputRef.current) return;

    fileInputRef.current.files = event.dataTransfer.files;
    handleFileChange(file);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start"
    >
      {/* CỘT TRÁI: CHỌN FILE */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share your knowledge with the community and help others learn.
        </p>

        <div
          className={`rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            selectedFile
              ? "border-primary/20 bg-card"
              : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
          }`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <Input
            ref={fileInputRef}
            name="file"
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={(event) => handleFileChange(event.target.files?.[0])}
          />

          {selectedFile ? (
            <div className="mx-auto flex max-w-2xl items-center gap-4 rounded-2xl border border-border bg-background p-4 text-left shadow-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="size-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black text-card-foreground">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="size-9 shrink-0 rounded-full p-0 text-muted-foreground hover:text-destructive"
                onClick={handleRemoveFile}
                aria-label="Remove selected file"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-card text-primary shadow-sm ring-1 ring-border">
                <FileUp className="size-10" />
              </div>

              <h3 className="mt-4 text-xl font-black text-card-foreground">
                Drag & drop your file here
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                or click to browse from your device
              </p>

              <Button
                type="button"
                disabled={isSubmitting}
                className="mt-5 h-11 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mr-2 size-4" />
                Choose File
              </Button>
            </>
          )}

          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Supported formats: PDF, DOCX, TXT
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Maximum file size: 20MB
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN DOCUMENT */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-black text-card-foreground">
          Document Information
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="upload-title">Title *</Label>
            <Input
              id="upload-title"
              name="title"
              placeholder="Enter document title"
              className="h-11 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Semester *</Label>
            <Select
              name="semesterId"
              required
              value={selectedSemesterId}
              onValueChange={setSelectedSemesterId}
              disabled={isAcademicLoading}
            >
              <SelectTrigger className="h-11 w-full text-sm">
                <SelectValue
                  placeholder={
                    isAcademicLoading ? "Loading semesters..." : "Select semester"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem
                    key={semester.semesterId}
                    value={String(semester.semesterId)}
                  >
                    Semester {semester.semesterNo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Subject *</Label>
            <Select
              name="subjectId"
              required
              disabled={!selectedSemesterId || isAcademicLoading}
            >
              <SelectTrigger className="h-11 w-full text-sm">
                <SelectValue
                  placeholder={
                    selectedSemesterId ? "Select subject" : "Select semester first"
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

        <div className="mt-5 space-y-2">
          <Label>Visibility *</Label>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              className={`rounded-2xl border p-4 text-left transition ${
                visibility === "PUBLIC"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-background hover:bg-accent"
              }`}
              onClick={() => setVisibility("PUBLIC")}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground">
                    Public
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Visible to everyone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Earn more reputation points
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`rounded-2xl border p-4 text-left transition ${
                visibility === "PRIVATE"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-background hover:bg-accent"
              }`}
              onClick={() => setVisibility("PRIVATE")}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground">
                    Private
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only visible to you
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Not publicly accessible
                  </p>
                </div>
              </div>
            </button>
          </div>
          <input type="hidden" name="visibilityStatus" value={visibility} />
        </div>

        <div className="mt-6 border-t border-border pt-4">
          {isSubmitting && (
            <div className="mb-4 w-full rounded-xl border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold text-card-foreground">
                  {uploadProgress >= 99
                    ? "Processing document..."
                    : "Uploading document"}
                </span>
                <span className="font-bold text-primary">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
            >
              <UploadCloud className="mr-2 size-4" />
              {isSubmitting ? "Uploading..." : "Upload Document"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-6 text-sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default DocumentUploadForm;