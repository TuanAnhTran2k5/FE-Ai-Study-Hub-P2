import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import DocumentPreview from "@/components/document/detail/DocumentPreview";

type DocumentPreviewPanelProps = {
  blob?: Blob;
  fileTypeLabel: string;
  title: string;
  isLoading: boolean;
  isError: boolean;
};

function DocumentPreviewPanel({
  blob,
  fileTypeLabel,
  title,
  isLoading,
  isError,
}: DocumentPreviewPanelProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="h-[calc(100vh-50px)] min-h-[1000px] w-full bg-white">
        {isLoading ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Loading preview...
            </p>
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-bold text-card-foreground">
              Cannot load preview
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Please check your login session or backend preview endpoint.
            </p>
          </div>
        ) : blob ? (
          <DocumentPreview
            blob={blob}
            fileTypeLabel={fileTypeLabel}
            title={title}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-bold text-card-foreground">
              Preview is not available
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              This file type cannot be previewed directly in the browser.
              Please open it in a new tab.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default DocumentPreviewPanel;
