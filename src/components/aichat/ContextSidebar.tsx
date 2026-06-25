import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FileText, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getMyDocuments } from "@/services/documentService";
import { indexRagDocument } from "@/services/ragService";
import type { MyDocumentResponse } from "@/types/document.type";

const SUGGESTED_PROMPTS = [
  "Explain inheritance with an example",
  "What is polymorphism in Java?",
  "Differences between abstract class and interface",
  "Create a UML class diagram for a library system",
  "Generate quiz about OOP in Java",
];

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

function getFileColor(fileType: string) {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) return "text-red-500 bg-red-100";
  if (type.includes("doc")) return "text-blue-500 bg-blue-100";
  if (type.includes("ppt")) return "text-orange-500 bg-orange-100";
  if (type.includes("xls")) return "text-green-500 bg-green-100";

  return "text-gray-500 bg-gray-100";
}

function ContextSidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [contextDocuments, setContextDocuments] = useState<
    MyDocumentResponse[]
  >([]);

  const {
    data: myDocuments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myDocuments"],
    queryFn: getMyDocuments,
  });

  const availableDocuments = useMemo(() => {
    return myDocuments.filter((doc) => doc.moderationStatus === "NORMAL");
  }, [myDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return availableDocuments;

    return availableDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.subjectCode.toLowerCase().includes(q) ||
        doc.subjectName.toLowerCase().includes(q),
    );
  }, [availableDocuments, keyword]);

  const indexMutation = useMutation({
    mutationFn: indexRagDocument,

    onSuccess: (_, documentId) => {
      const selectedDocument = availableDocuments.find(
        (doc) => doc.documentId === documentId,
      );

      if (!selectedDocument) return;

      setContextDocuments((prev) => {
        const existed = prev.some(
          (doc) => doc.documentId === selectedDocument.documentId,
        );

        if (existed) return prev;

        return [...prev, selectedDocument];
      });

      toast.success("Document added to AI context.");
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "Cannot add document to AI context.");
    },
  });

  const handleAddContext = (documentId: number) => {
    const existed = contextDocuments.some(
      (doc) => doc.documentId === documentId,
    );

    if (existed) {
      toast.info("This document is already in context.");
      return;
    }

    indexMutation.mutate(documentId);
  };

  const handleRemoveContext = (documentId: number) => {
    setContextDocuments((prev) =>
      prev.filter((doc) => doc.documentId !== documentId),
    );
  };

  return (
    <>
      <div className="flex h-full flex-col gap-4 overflow-y-auto pr-2 pb-4">
        <Card className="shrink-0 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-3">
            <CardTitle className="text-sm font-bold">
              Context Documents ({contextDocuments.length})
            </CardTitle>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage
            </button>
          </CardHeader>

          <CardContent className="space-y-3 p-4 pt-0">
            {contextDocuments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  No documents selected for AI context.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {contextDocuments.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="group flex items-start justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${getFileColor(
                          doc.fileType,
                        )}`}
                      >
                        <FileText className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate text-xs font-semibold"
                          title={doc.title}
                        >
                          {doc.title}
                        </p>

                        <p className="text-[10px] text-muted-foreground">
                          {formatFileSize(doc.fileSize)} · {doc.subjectCode}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveContext(doc.documentId)}
                      className="shrink-0 p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="h-9 px-1 text-xs font-semibold text-primary hover:bg-transparent hover:underline"
            >
              <Plus className="mr-1.5 size-4" />
              Add More Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="shrink-0 border-border/50 shadow-sm">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              Suggested Prompts
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="w-full truncate rounded-lg bg-muted/30 p-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Select documents for AI context</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search your documents..."
                className="h-10 pl-9 text-sm"
              />
            </div>

            {isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Loading documents...
              </p>
            )}

            {isError && (
              <p className="py-6 text-center text-sm text-destructive">
                Cannot load documents.
              </p>
            )}

            {!isLoading && !isError && filteredDocuments.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No documents found.
              </p>
            )}

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {filteredDocuments.map((doc) => {
                const isAdded = contextDocuments.some(
                  (item) => item.documentId === doc.documentId,
                );

                const isIndexing =
                  indexMutation.isPending &&
                  indexMutation.variables === doc.documentId;

                return (
                  <div
                    key={doc.documentId}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3 hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${getFileColor(
                          doc.fileType,
                        )}`}
                      >
                        <FileText className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {doc.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {doc.fileName}
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {formatFileSize(doc.fileSize)} · {doc.subjectCode} ·{" "}
                          {doc.visibilityStatus}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      disabled={isAdded || isIndexing}
                      onClick={() => handleAddContext(doc.documentId)}
                      className="h-8 shrink-0 rounded-full px-4 text-xs"
                    >
                      {isIndexing ? "Indexing..." : isAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ContextSidebar;
