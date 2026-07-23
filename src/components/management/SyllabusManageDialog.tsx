import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FileText,
  History,
  Trash2,
  FileJson,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import Components con đã được module hóa
import SyllabusUploadZone from "./syllabus/SyllabusUploadZone";
import SyllabusJsonEditor from "./syllabus/SyllabusJsonEditor";
import SyllabusHistoryTab from "./syllabus/SyllabusHistoryTab";
import SyllabusPdfTab from "./syllabus/SyllabusPdfTab";

import {
  getSyllabus,
  uploadSyllabus,
  updateSyllabus,
  getSyllabusHistory,
  rollbackSyllabus,
  deleteSyllabus,
} from "@/services/adminSyllabusService";
import type { SubjectResponse } from "@/types/curriculum.type";
import { ERROR_CODE } from "@/constants/errorCode";
import { useTranslation } from "react-i18next";

interface SyllabusManageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subject: SubjectResponse | null;
}

export default function SyllabusManageDialog({
  isOpen,
  onOpenChange,
  subject,
}: SyllabusManageDialogProps) {
  if (!subject) return null;
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  // States
  const [activeTab, setActiveTab] = useState<"editor" | "history" | "pdf">("editor");
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================
  // FETCHING SYLLABUS & HISTORY
  // ==========================================

  // Fetch Syllabus Detail
  const {
    data: syllabus,
    isLoading: isLoadingSyllabus,
    error: syllabusError,
    refetch: refetchSyllabus,
  } = useQuery({
    queryKey: ["admin-syllabus", subject.subjectId],
    queryFn: () => getSyllabus(subject.subjectId),
    enabled: isOpen && !!subject.subjectId,
    retry: false,
  });

  // Fetch History List
  const {
    data: historyList = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["admin-syllabus-history", subject.subjectId],
    queryFn: () => getSyllabusHistory(subject.subjectId),
    enabled: isOpen && !!subject.subjectId && !!syllabus,
  });

  const isNotFoundError = (syllabusError as any)?.response?.status === 404;
  const hasSyllabus = !!syllabus && !isNotFoundError;

  // Tự động làm mới (Auto Refetch/Polling) mỗi 3 giây khi đang phân tích AI
  React.useEffect(() => {
    let intervalId: any;

    const isSyncing =
      syllabus &&
      (syllabus.syncStatus === "UPLOADED" ||
        syllabus.syncStatus === "PARSING" ||
        syllabus.syncStatus === "INDEXING");

    if (isOpen && isSyncing) {
      intervalId = setInterval(() => {
        refetchSyllabus();
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [syllabus?.syncStatus, isOpen, refetchSyllabus]);

  // Reset tab & state khi thay đổi subject hoặc mở/đóng dialog
  React.useEffect(() => {
    setActiveTab("editor");
    setIsDeleting(false);
  }, [subject, isOpen]);

  // ==========================================
  // API MUTATIONS
  // ==========================================

  // 1. Upload/Update PDF Mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSyllabus(subject.subjectId, file),
    onSuccess: () => {
      toast.success(t("success.createSubject"));
      refetchSyllabus();
      refetchHistory();
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.CREATE_SUBJECT_FAILED));
    },
  });

  // 2. Update JSON Mutation
  const updateMutation = useMutation({
    mutationFn: (data: { jsonContent: string; reason: string }) =>
      updateSyllabus(subject.subjectId, data),
    onSuccess: () => {
      toast.success(t("success.updateSubject"));
      refetchSyllabus();
      refetchHistory();
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.UPDATE_SUBJECT_FAILED));
    },
  });

  // 3. Rollback Mutation
  const rollbackMutation = useMutation({
    mutationFn: (historyId: number) => rollbackSyllabus(subject.subjectId, historyId),
    onSuccess: (data) => {
      toast.success(t("success.rollbackVersion", { version: data.embeddingVersion, defaultValue: `Rolled back successfully to version ${data.embeddingVersion}!` }));
      refetchSyllabus();
      refetchHistory();
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to rollback version");
    },
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteSyllabus(subject.subjectId),
    onSuccess: () => {
      toast.success(t("success.deleteSyllabus", "Syllabus deleted successfully!"));
      setIsDeleting(false);
      refetchSyllabus();
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-combos"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t(ERROR_CODE.DELETE_SUBJECT_FAILED));
    },
  });

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 gap-1 rounded-full">
            <CheckCircle className="h-3 w-3" /> Ready
          </Badge>
        );
      case "PARSING":
      case "INDEXING":
      case "UPLOADED":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 gap-1 rounded-full">
            <Loader2 className="h-3 w-3 animate-spin" /> Syncing ({status})
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 gap-1 rounded-full">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-full">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-card sm:max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col p-6">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Syllabus & RAG AI Hub
              </span>
              {syllabus && getSyncStatusBadge(syllabus.syncStatus)}
            </div>
            <DialogTitle className="text-2xl font-black text-card-foreground mt-1">
              {subject.subjectCode} - {subject.subjectName}
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoadingSyllabus ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-3 text-sm font-semibold">
              Fetching syllabus configuration...
            </p>
          </div>
        ) : !hasSyllabus ? (
          <SyllabusUploadZone
            onUpload={(file) => uploadMutation.mutate(file)}
            isPending={uploadMutation.isPending}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-[450px]">
            {/* Nav tabs */}
            <div className="bg-secondary/40 border border-border p-1 rounded-2xl w-fit flex gap-1 mb-6">
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 ${
                  activeTab === "editor"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileJson className="h-4 w-4" />
                JSON Editor
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 ${
                  activeTab === "history"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <History className="h-4 w-4" />
                Change History
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 ${
                  activeTab === "pdf"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                Source PDF
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "editor" && (
              <SyllabusJsonEditor
                initialJson={syllabus.jsonContent || ""}
                onSave={(jsonContent, reason) =>
                  updateMutation.mutate({ jsonContent, reason })
                }
                isPending={updateMutation.isPending}
              />
            )}

            {activeTab === "history" && (
              <SyllabusHistoryTab
                historyList={historyList}
                isLoading={isLoadingHistory}
                onRollback={(historyId) => rollbackMutation.mutate(historyId)}
                isPending={rollbackMutation.isPending}
              />
            )}

            {activeTab === "pdf" && (
              <SyllabusPdfTab
                pdfUrl={syllabus.pdfUrl || ""}
                onUploadNewVersion={(file) => uploadMutation.mutate(file)}
                isPending={uploadMutation.isPending}
              />
            )}

            {/* DELETE SECTOR */}
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between bg-destructive/5 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <div className="space-y-1">
                <p className="text-sm font-bold text-card-foreground">
                  Danger Zone
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete this syllabus configuration, history, and
                  vector indices.
                </p>
              </div>

              {isDeleting ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsDeleting(false)}
                    className="rounded-lg font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg font-bold"
                  >
                    {deleteMutation.isPending && (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    )}
                    Confirm Delete
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsDeleting(true)}
                  className="rounded-xl font-bold cursor-pointer gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Syllabus
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
