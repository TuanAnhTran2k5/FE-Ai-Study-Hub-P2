import { useState } from "react";
import { Check, FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DocumentResponse } from "@/types/document.type";

type DocumentBulkDeleteDialogProps = {
  documents: DocumentResponse[];
  isOpen: boolean;
  isDeleting: boolean;
  selectedDocumentIds: number[];
  onOpenChange: (open: boolean) => void;
  onToggleDocument: (documentId: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onConfirmDelete: () => void;
};

function DocumentBulkDeleteDialog({
  documents,
  isOpen,
  isDeleting,
  selectedDocumentIds,
  onOpenChange,
  onToggleDocument,
  onSelectAll,
  onClearSelection,
  onConfirmDelete,
}: DocumentBulkDeleteDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const selectedCount = selectedDocumentIds.length;
  const hasDocuments = documents.length > 0;
  const isAllSelected = hasDocuments && selectedCount === documents.length;

  const handleConfirmDelete = () => {
    onConfirmDelete();
    setIsConfirmOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfirmOpen(false);
    }

    onOpenChange(open);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-hidden rounded-3xl p-0 sm:max-w-[760px]">
          <div className="flex max-h-[90vh] flex-col">
            <div className="border-b border-border px-6 py-5">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">
                  Select Documents
                </DialogTitle>
                <DialogDescription>
                  Choose one or more documents from My Documents to delete.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  {selectedCount} selected
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl px-4"
                  onClick={isAllSelected ? onClearSelection : onSelectAll}
                  disabled={!hasDocuments || isDeleting}
                >
                  {isAllSelected ? "Clear all" : "Select all"}
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {!hasDocuments ? (
                <div className="rounded-2xl border border-border bg-secondary p-8 text-center">
                  <p className="font-bold text-card-foreground">
                    No documents found
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a document before using bulk delete.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => {
                    const isSelected = selectedDocumentIds.includes(
                      document.documentId,
                    );

                    return (
                      <button
                        key={document.documentId}
                        type="button"
                        className={`flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-primary bg-primary-bg-hover"
                            : "border-border bg-card hover:bg-secondary"
                        }`}
                        onClick={() => onToggleDocument(document.documentId)}
                        disabled={isDeleting}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </span>

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                          <FileText className="h-5 w-5" />
                        </span>

                        <span className="min-w-0 flex-1 space-y-2">
                          <span className="block break-words font-bold leading-5 text-card-foreground">
                            {document.title}
                          </span>

                          <span className="flex flex-wrap items-start gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">
                              {document.subjectCode ??
                                `Subject ${document.subjectId}`}
                            </span>

                            <span className="min-w-0 flex-1 break-words leading-5">
                              {document.fileName}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-3 border-t border-border px-6 py-5 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-transparent bg-secondary font-bold text-secondary-foreground hover:bg-secondary/80"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="h-12 rounded-2xl bg-red-600 font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-700"
                onClick={() => setIsConfirmOpen(true)}
                disabled={selectedCount === 0 || isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : `Delete ${selectedCount}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="overflow-hidden rounded-3xl border border-red-100 p-0 shadow-2xl sm:max-w-[500px]">
          <div className="bg-gradient-to-b from-red-50 to-white px-8 pb-7 pt-8">
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
                <Trash2 className="h-6 w-6" />
              </div>

              <DialogTitle className="text-xl font-black text-card-foreground">
                Delete Documents
              </DialogTitle>
              <DialogDescription className="max-w-sm text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete {selectedCount} selected
                document{selectedCount === 1 ? "" : "s"}? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-transparent bg-secondary font-bold text-secondary-foreground hover:bg-secondary/80"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="h-12 rounded-2xl bg-red-600 font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-700"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Documents"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentBulkDeleteDialog;
