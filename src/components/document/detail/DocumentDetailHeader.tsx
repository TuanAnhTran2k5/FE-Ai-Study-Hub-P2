import { FileText, Globe, Lock, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VisibilityStatus } from "@/models/document.enum";
import type { DocumentResponse } from "@/types/document.type";

type DocumentDetailHeaderProps = {
  document: DocumentResponse;
  fileTypeLabel: string;
  subjectCode: string;
  subjectName: string;
  semesterNo?: number | string | null;
  comboName?: string | null;
  fileSizeLabel: string;
  isDeleting: boolean;
  onUpdate: () => void;
  onDelete: () => void;
};

// Header hiển thị thông tin chính của tài liệu và nút update/delete.
function DocumentDetailHeader({
  document,
  fileTypeLabel,
  subjectCode,
  subjectName,
  semesterNo,
  comboName,
  fileSizeLabel,
  isDeleting,
  onUpdate,
  onDelete,
}: DocumentDetailHeaderProps) {
  return (
    <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
      <CardContent className="relative p-6 pr-6 md:pr-52">
        <div className="mb-5 flex gap-2 md:absolute md:right-6 md:top-6 md:mb-0">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-primary/30 text-primary"
            onClick={onUpdate}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Update Document
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <FileText className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground hover:bg-secondary">
                {fileTypeLabel}
              </Badge>

              <Badge
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  document.visibilityStatus === VisibilityStatus.PUBLIC
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                }`}
              >
                {document.visibilityStatus === VisibilityStatus.PUBLIC ? (
                  <Globe className="mr-1 h-3 w-3" />
                ) : (
                  <Lock className="mr-1 h-3 w-3" />
                )}
                {document.visibilityStatus}
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-bold"
              >
                {subjectCode}
              </Badge>
            </div>

            <h1 className="text-3xl font-black text-card-foreground">
              {document.title}
            </h1>

            <p className="mt-3 max-w-4xl text-muted-foreground">
              {document.description}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem label="Subject" value={subjectName} />
              <InfoItem
                label="Semester"
                value={semesterNo ? `Semester ${semesterNo}` : "N/A"}
              />
              <InfoItem label="Combo" value={comboName ?? "N/A"} />
              <InfoItem label="File Size" value={fileSizeLabel} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Ô thông tin nhỏ trong header tài liệu như subject, semester, combo, file size.
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-black text-card-foreground">{value}</p>
    </div>
  );
}

export default DocumentDetailHeader;
