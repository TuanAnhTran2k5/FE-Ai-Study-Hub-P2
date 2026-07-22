import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FileText, Plus, Search, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_CONTEXT_DOCUMENTS } from "@/constants/ragPrompt";
import { getMyDocuments } from "@/services/documentService";
import { getSuggestedPrompts } from "@/services/ragService";

interface ContextSidebarProps {
  activeSessionId: number | null;
  selectedDocumentIds: number[];
  onSelectedDocumentIdsChange: (documentIds: number[]) => void;
  onPromptClick: (prompt: string) => void;
  isDialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
}

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

function ContextSidebar({
  selectedDocumentIds,
  onSelectedDocumentIdsChange,
  onPromptClick,
  isDialogOpen: propIsDialogOpen,
  onDialogOpenChange: propOnDialogOpenChange,
}: ContextSidebarProps) {
  const { t } = useTranslation();
  const [isLocalDialogOpen, setIsLocalDialogOpen] = useState(false);
  const isDialogOpen = propIsDialogOpen !== undefined ? propIsDialogOpen : isLocalDialogOpen;
  const setIsDialogOpen = propOnDialogOpenChange !== undefined ? propOnDialogOpenChange : setIsLocalDialogOpen;
  
  const [keyword, setKeyword] = useState("");

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

  const contextDocuments = useMemo(() => {
    return availableDocuments.filter((doc) =>
      selectedDocumentIds.includes(doc.documentId),
    );
  }, [availableDocuments, selectedDocumentIds]);

  const { data: suggestedPrompts = [] } = useQuery({
    queryKey: ["ragSuggestedPrompts", selectedDocumentIds],
    queryFn: () => getSuggestedPrompts(selectedDocumentIds),
    enabled: selectedDocumentIds.length > 0,
  });

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

  const handleAddContext = (documentId: number) => {
    if (selectedDocumentIds.includes(documentId)) {
      toast.info(t("aiChat.alreadyInContext", "This document is already in context."));
      return;
    }

    if (selectedDocumentIds.length >= MAX_CONTEXT_DOCUMENTS) {
      toast.warning(t("aiChat.maxSelected", { defaultValue: "You can select up to {{count}} documents.", count: MAX_CONTEXT_DOCUMENTS }));
      return;
    }

    onSelectedDocumentIdsChange([...selectedDocumentIds, documentId]);
    toast.success(t("aiChat.addedSuccess", "Document added to AI context."));
  };

  const handleRemoveContext = (documentId: number) => {
    onSelectedDocumentIdsChange(
      selectedDocumentIds.filter((id) => id !== documentId),
    );
  };

  return (
    <>
      <div className="flex h-full flex-col gap-3 overflow-y-auto pb-4">
        <div className="shrink-0 overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <div>
              <p className="text-sm font-black text-card-foreground">
                {t("aiChat.contextTitle", "Context Documents")}
              </p>

              <p className="text-[11px] text-muted-foreground">
                {selectedDocumentIds.length}/{MAX_CONTEXT_DOCUMENTS} {t("aiChat.selected", "selected")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary transition-all hover:bg-primary/20 cursor-pointer"
            >
              {t("aiChat.manage", "Manage")}
            </button>
          </div>

          <div className="mx-4 mb-3 h-1.5 overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{
                width: `${
                  (selectedDocumentIds.length / MAX_CONTEXT_DOCUMENTS) * 100
                }%`,
              }}
            />
          </div>

          <div className="px-3 pb-3">
            {contextDocuments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-5 text-center">
                <FileText className="mx-auto mb-2 size-6 text-muted-foreground/50" />

                <p className="text-xs font-medium text-muted-foreground">
                  {t("aiChat.emptyContext", "No documents in context yet")}
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                  {t("aiChat.emptyContextDesc", "Add documents to give AI more context")}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {contextDocuments.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="group flex items-center gap-2.5 rounded-2xl p-2 transition-colors hover:bg-muted/40 cursor-pointer"
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${getFileColor(
                        doc.fileType,
                      )}`}
                    >
                      <FileText className="size-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-xs font-semibold text-card-foreground"
                        title={doc.title}
                      >
                        {doc.title}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {formatFileSize(doc.fileSize)} · {doc.subjectCode}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveContext(doc.documentId)}
                      className="shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-primary/30 py-2 text-xs font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
            >
              <Plus className="size-3.5" />
              {t("aiChat.addDocs", "Add Documents")}
            </button>
          </div>
        </div>

        <div className="shrink-0 overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 pb-3 pt-4">
            <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-3.5 text-primary" />
            </div>

            <p className="text-sm font-black text-card-foreground">
              {t("aiChat.suggestedPrompts", "Suggested Prompts")}
            </p>
          </div>

          <div className="space-y-1.5 px-3 pb-4">
            {selectedDocumentIds.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                {t("aiChat.emptyPrompts", "Select documents to generate suggested prompts.")}
              </p>
            ) : suggestedPrompts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                {t("aiChat.noPromptsYet", "No suggested prompts yet.")}
              </p>
            ) : (
              suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onPromptClick(prompt)}
                  className="w-full rounded-2xl border border-border/40 bg-muted/20 p-3 text-left text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary cursor-pointer"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          style={{ maxWidth: "672px", width: "calc(100% - 32px)" }}
          className="rounded-3xl border border-border/40 bg-card p-0 shadow-2xl"
        >
          <DialogHeader className="border-b border-border/40 px-6 py-5">
            <DialogTitle className="text-lg font-black text-card-foreground">
              {t("aiChat.selectDocsTitle", "Select Documents for AI Context")}
            </DialogTitle>

            <p className="text-sm text-muted-foreground">
              {selectedDocumentIds.length}/{MAX_CONTEXT_DOCUMENTS} {t("aiChat.selected", "selected")}
            </p>
          </DialogHeader>

          <div className="space-y-4 p-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t("aiChat.searchPlaceholder", "Search by title, subject...")}
                className="h-full rounded-2xl border-border bg-card pl-10 text-sm focus-visible:border-primary/50"
              />
            </div>

            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("aiChat.loadingDocs", "Loading your documents...")}
              </p>
            )}

            {isError && (
              <p className="py-8 text-center text-sm text-destructive">
                {t("aiChat.loadFailed", "Cannot load documents. Please try again.")}
              </p>
            )}

            {!isLoading && !isError && filteredDocuments.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("myDocuments.emptyTitle", "No documents found.")}
              </p>
            )}

            <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1.5 scrollbar-thin">
              {filteredDocuments.map((doc) => {
                const isAdded = selectedDocumentIds.includes(doc.documentId);
                const isMaxSelected =
                  selectedDocumentIds.length >= MAX_CONTEXT_DOCUMENTS;

                return (
                  <div
                    key={doc.documentId}
                    className={`grid grid-cols-[40px_1fr_80px] items-center gap-3 rounded-2xl border p-3 transition-all cursor-pointer w-full max-w-full overflow-hidden ${
                      isAdded
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl ${getFileColor(
                        doc.fileType,
                      )}`}
                    >
                      <FileText className="size-5" />
                    </div>

                    <div className="min-w-0 overflow-hidden pr-2">
                      <p
                        className="truncate text-sm font-bold text-card-foreground"
                        title={doc.title}
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        {doc.title}
                      </p>

                      <p
                        className="truncate text-xs text-muted-foreground"
                        title={doc.fileName}
                        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        {doc.fileName}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {doc.subjectCode}
                        </span>

                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {doc.visibilityStatus === "PUBLIC" ? t("myDocuments.public", "Public") : t("myDocuments.private", "Private")}
                        </span>

                        <span className="text-[10px] text-muted-foreground">
                          {formatFileSize(doc.fileSize)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      disabled={isAdded || isMaxSelected}
                      onClick={() => handleAddContext(doc.documentId)}
                      className={`h-8 rounded-full px-4 text-xs font-bold cursor-pointer justify-self-end w-full ${
                        isAdded
                          ? "bg-primary/10 text-primary hover:bg-primary/10"
                          : ""
                      }`}
                    >
                      {isAdded ? t("aiChat.addedStatus", "✓ Added") : isMaxSelected ? t("aiChat.maxStatus", "Max 5") : t("aiChat.addStatus", "Add")}
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