import {
  ArrowLeft,
  Download,
  ExternalLink,
  Globe,
  Lock,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisibilityStatus } from "@/models/document.enum";
import type { DocumentResponse } from "@/types/document.type";

type DocumentDetailHeaderProps = {
  document: DocumentResponse;
  fileTypeLabel: string;
  subjectCode: string;
  isOwner: boolean;
  isDeleting: boolean;
  canOpenInNewTab: boolean;
  onBack: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onOpenNewTab: () => void;
  onDownload: () => void;
};

function DocumentDetailHeader({
  document,
  fileTypeLabel,
  subjectCode,
  isOwner,
  isDeleting,
  canOpenInNewTab,
  onBack,
  onUpdate,
  onDelete,
  onOpenNewTab,
  onDownload,
}: DocumentDetailHeaderProps) {
  return (
    <div className="mb-5 rounded-3xl border border-border bg-card p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 cursor-pointer rounded-2xl border-border bg-background px-4 text-sm font-semibold text-slate-700 hover:bg-secondary"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-black tracking-tight text-card-foreground">
                {document.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 hover:bg-sky-100">
                  {fileTypeLabel}
                </Badge>

                <Badge
                  className={`rounded-full px-3 py-1 text-xs font-black ${
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

                <Badge className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 hover:bg-slate-100">
                  {subjectCode}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            {isOwner && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer rounded-2xl border-primary/25 bg-primary/5 px-5 font-bold text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={onUpdate}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer rounded-2xl border-red-200 bg-red-50 px-5 font-bold text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="outline"
              className="h-11 cursor-pointer rounded-2xl border-border bg-background px-5 font-bold text-slate-700 hover:bg-secondary"
              onClick={onOpenNewTab}
              disabled={!canOpenInNewTab}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open New Tab
            </Button>

            <Button
              type="button"
              className="h-11 rounded-2xl bg-gradient-to-r from-primary-start to-primary-end px-6 font-black text-primary-foreground shadow-sm hover:from-primary-start-hover hover:to-primary-end-hover"
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetailHeader;