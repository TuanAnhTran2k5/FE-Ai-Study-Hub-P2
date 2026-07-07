import { Image, X } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReportReason = {
  reasonId: number;
  label: string;
  helper: string;
};

type DocumentReportDialogProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  reportReasonId: string;
  reportDescription: string;
  reportEvidenceFile: File | null;
  reportEvidencePreview: string;
  reportReasons: ReportReason[];
  onOpenChange: (isOpen: boolean) => void;
  onReasonChange: (reasonId: string) => void;
  onDescriptionChange: (description: string) => void;
  onEvidenceFileChange: (file: File | null) => void;
  onSubmit: () => void;
};

function DocumentReportDialog({
  isOpen,
  isSubmitting,
  reportReasonId,
  reportDescription,
  reportEvidenceFile,
  reportEvidencePreview,
  reportReasons,
  onOpenChange,
  onReasonChange,
  onDescriptionChange,
  onEvidenceFileChange,
  onSubmit,
}: DocumentReportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report Document</DialogTitle>
          <DialogDescription>
            Send this report to the moderation team for review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-card-foreground">
              Reason
            </label>

            <Select value={reportReasonId} onValueChange={onReasonChange}>
              <SelectTrigger className="h-12 w-full rounded-xl">
                <SelectValue placeholder="Choose a report reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reason) => (
                  <SelectItem
                    key={reason.reasonId}
                    value={String(reason.reasonId)}
                  >
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="mt-1 text-xs text-muted-foreground">
              {
                reportReasons.find(
                  (reason) => String(reason.reasonId) === reportReasonId,
                )?.helper
              }
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-card-foreground">
              Description
            </label>
            <textarea
              value={reportDescription}
              className="min-h-28 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Explain what is wrong with this document."
              onChange={(event) => onDescriptionChange(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-card-foreground">
              Evidence Image
            </label>

            <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-4">
              {reportEvidencePreview ? (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                    <img
                      src={reportEvidencePreview}
                      alt="Report evidence preview"
                      className="max-h-48 w-full object-contain"
                    />

                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-muted-foreground shadow-sm transition hover:text-destructive"
                      onClick={() => onEvidenceFileChange(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="truncate text-xs font-semibold text-muted-foreground">
                    {reportEvidenceFile?.name}
                  </p>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-border bg-background px-4 py-6 text-center transition hover:border-primary">
                  <Image className="h-8 w-8 text-primary" />
                  <span className="mt-2 text-sm font-bold text-card-foreground">
                    Choose evidence image
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, JPEG, or WEBP
                  </span>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      onEvidenceFileChange(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || !reportDescription.trim()}
            onClick={onSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentReportDialog;
