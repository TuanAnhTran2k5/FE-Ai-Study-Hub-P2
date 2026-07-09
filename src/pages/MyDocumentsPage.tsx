import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DocumentBulkDeleteDialog from "@/components/document/DocumentBulkDeleteDialog";
import DocumentGrid from "@/components/document/DocumentGrid";
import DocumentSearch from "@/components/document/DocumentSearch";
import DocumentUploadForm from "@/components/document/DocumentUploadForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisibilityStatus } from "@/models/document.enum";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import { getAllAcademicSubjects, getSemesters } from "@/services/academicService";
import {
  deleteDocument,
  getMyDocuments,
  uploadDocument,
} from "@/services/documentService";
import type {
  DocumentResponse,
  DocumentUploadRequest,
  DocumentUploadResponse,
} from "@/types/document.type";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

function getUploadErrorMessage(error: any) {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;

  if (serverMessage) {
    return serverMessage;
  }

  if (status === 401) {
    return "Please login again before uploading";
  }

  if (status === 404) {
    return "Selected subject was not found";
  }

  if (status === 413) {
    return "File is too large";
  }

  if (error.request) {
    return "Cannot connect to backend server";
  }

  return "Upload document failed";
}

function getDocumentsErrorMessage(error: any) {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;

  if (serverMessage) {
    return serverMessage;
  }

  if (status === 401) {
    return "Please login again to view your documents";
  }

  if (error.request) {
    return "Cannot connect to backend server";
  }

  return "Failed to load documents";
}

function MyDocumentsPage() {
  const [keyword, setKeyword] = useState("");
  const [subjectCode, setSubjectCode] = useState("ALL");
  const [semesterNo, setSemesterNo] = useState("ALL");
  const [visibilityStatus, setVisibilityStatus] = useState("ALL");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user as User | null);
  const authUserId =
    currentUser?.userId != null
      ? String(currentUser.userId)
      : localStorage.getItem("authUserId");
  const isAuthenticated =
    !!localStorage.getItem("accessToken") || !!currentUser?.userId;

  const {
    data: documents = [],
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery<DocumentResponse[], Error>({
    queryKey: ["myDocuments", authUserId ?? "current-user"],
    queryFn: getMyDocuments,
    enabled: isAuthenticated,
    retry: 1,
  });

  const { data: semesters = [], isLoading: isSemestersLoading } = useQuery({
    queryKey: ["academic", "semesters"],
    queryFn: getSemesters,
    retry: 1,
  });

  const { data: academicSubjects = [], isLoading: isSubjectsLoading } =
    useQuery({
      queryKey: ["academic", "subjects"],
      queryFn: getAllAcademicSubjects,
      retry: 1,
    });

  const uploadMutation = useMutation<
    DocumentUploadResponse,
    Error,
    DocumentUploadRequest
  >({
    mutationFn: (data) => uploadDocument(data, setUploadProgress),
    onMutate: () => {
      setUploadProgress(0);
    },
    onSuccess: () => {
      setUploadProgress(100);
      toast.success("Upload document successfully");
      setIsUploadOpen(false);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
    onError: (error: any) => {
      setUploadProgress(0);
      toast.error(getUploadErrorMessage(error), {
        toastId: "upload-document-error",
      });
    },
  });

  const bulkDeleteMutation = useMutation<void, Error, number[]>({
    mutationFn: async (documentIds) => {
      await Promise.all(
        documentIds.map((documentId) => deleteDocument(documentId)),
      );
    },
    onSuccess: () => {
      toast.success("Documents deleted successfully");
      setSelectedDocumentIds([]);
      setIsBulkDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
    onError: () => {
      toast.error("Delete documents failed");
    },
  });

  const enrichedDocuments = useMemo(() => {
    const subjectMap = new Map(
      academicSubjects.map((subject) => [subject.subjectId, subject]),
    );

    return documents.map((document) => {
      const subject = subjectMap.get(document.subjectId);

      if (!subject) {
        return document;
      }

      return {
        ...document,
        subjectCode: document.subjectCode ?? subject.subjectCode,
        subjectName: document.subjectName ?? subject.subjectName,
        semesterNo: document.semesterNo ?? subject.semesterNo,
        comboCode: document.comboCode ?? subject.comboCode,
        comboName: document.comboName ?? subject.comboName,
      };
    });
  }, [academicSubjects, documents]);

  const subjects = useMemo(() => {
    const subjectMap = new Map<string, string>();

    enrichedDocuments.forEach((document) => {
      const code = document.subjectCode ?? String(document.subjectId);
      const name = document.subjectName ?? `Subject ${document.subjectId}`;

      subjectMap.set(code, name);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectCode, subjectName]) => ({
        subjectCode,
        subjectName,
      }),
    );
  }, [enrichedDocuments]);

  const semesterOptions = useMemo(() => {
    return Array.from(
      new Set(
        enrichedDocuments
          .map((document) => document.semesterNo)
          .filter(
            (semester): semester is number | string =>
              typeof semester === "number" || typeof semester === "string",
          ),
      ),
    ).sort((a, b) => Number(a) - Number(b));
  }, [enrichedDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return enrichedDocuments.filter((document) => {
      const subjectCodeValue = document.subjectCode ?? String(document.subjectId);
      const subjectNameValue = document.subjectName ?? "";
      const descriptionValue = document.description ?? "";
      const comboNameValue = document.comboName ?? "";
      const comboCodeValue = document.comboCode ?? "";
      const ownerNameValue = document.ownerName ?? "";

      const matchesKeyword =
        !q ||
        document.title.toLowerCase().includes(q) ||
        document.fileName.toLowerCase().includes(q) ||
        descriptionValue.toLowerCase().includes(q) ||
        subjectNameValue.toLowerCase().includes(q) ||
        subjectCodeValue.toLowerCase().includes(q) ||
        comboNameValue.toLowerCase().includes(q) ||
        comboCodeValue.toLowerCase().includes(q) ||
        ownerNameValue.toLowerCase().includes(q);

      const matchesSubject =
        subjectCode === "ALL" || subjectCodeValue === subjectCode;

      const matchesSemester =
        semesterNo === "ALL" || String(document.semesterNo) === semesterNo;

      const matchesVisibility =
        visibilityStatus === "ALL" ||
        document.visibilityStatus === visibilityStatus;

      return (
        matchesKeyword && matchesSubject && matchesSemester && matchesVisibility
      );
    });
  }, [enrichedDocuments, keyword, subjectCode, semesterNo, visibilityStatus]);

  const handleViewDocument = (documentId: number) => {
    navigate(`/app/mydocuments/${documentId}`);
  };

  const handleBulkDeleteOpenChange = (open: boolean) => {
    setIsBulkDeleteOpen(open);

    if (!open && !bulkDeleteMutation.isPending) {
      setSelectedDocumentIds([]);
    }
  };

  const handleToggleDocumentSelect = (documentId: number) => {
    setSelectedDocumentIds((currentIds) =>
      currentIds.includes(documentId)
        ? currentIds.filter((id) => id !== documentId)
        : [...currentIds, documentId],
    );
  };

  const handleSelectAllDocuments = () => {
    setSelectedDocumentIds(
      enrichedDocuments.map((document) => document.documentId),
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedDocumentIds.length === 0 || bulkDeleteMutation.isPending) {
      return;
    }

    bulkDeleteMutation.mutate(selectedDocumentIds);
  };

  const handleUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploadMutation.isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const subjectId = Number(formData.get("subjectId"));
    const visibilityValue = String(
      formData.get("visibilityStatus") ?? VisibilityStatus.PRIVATE,
    );

    if (!(file instanceof File) || file.size === 0) {
      toast.error("Please choose a file", {
        toastId: "upload-document-validation",
      });
      return;
    }

    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      toast.error("Only PDF, DOCX, PPTX, XLS, XLSX, and TXT files are supported", {
        toastId: "upload-document-validation",
      });
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error("File must be 20MB or smaller", {
        toastId: "upload-document-validation",
      });
      return;
    }

    if (!title) {
      toast.error("Please enter document title", {
        toastId: "upload-document-validation",
      });
      return;
    }

    if (!Number.isFinite(subjectId) || subjectId <= 0) {
      toast.error("Please select subject", {
        toastId: "upload-document-validation",
      });
      return;
    }

    uploadMutation.mutate({
      file,
      title,
      subjectId,
      visibilityStatus:
        visibilityValue === VisibilityStatus.PUBLIC
          ? VisibilityStatus.PUBLIC
          : VisibilityStatus.PRIVATE,
    });
  };

  return (
    <section className="w-full px-8 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            My Documents
          </p>

          <h1 className="mt-2 text-4xl font-bold text-card-foreground">
            Manage Your Documents
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            View, organize, and manage all documents you have uploaded to AI
            Study Hub.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap justify-start gap-3 md:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="h-11 cursor-pointer rounded-xl px-5 font-bold"
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Select Document
            </Button>

            <Button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-primary-start to-primary-end px-5 font-bold text-primary-foreground shadow-sm hover:from-primary-start-hover hover:to-primary-end-hover"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-card-foreground">
              {filteredDocuments.length}
            </span>{" "}
            documents
          </div>
        </div>
      </div>

      <DocumentSearch
        keyword={keyword}
        subjectCode={subjectCode}
        semesterNo={semesterNo}
        visibilityStatus={visibilityStatus}
        subjects={subjects}
        semesters={semesterOptions}
        onKeywordChange={setKeyword}
        onSubjectChange={setSubjectCode}
        onSemesterChange={setSemesterNo}
        onVisibilityChange={setVisibilityStatus}
      />

      {isDocumentsLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            Loading documents...
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while your uploaded documents are loaded.
          </p>
        </div>
      ) : isDocumentsError ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            Failed to load documents
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {getDocumentsErrorMessage(documentsError)}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-10 rounded-xl"
            onClick={() => refetchDocuments()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <DocumentGrid
          documents={filteredDocuments}
          onView={(document) => handleViewDocument(document.documentId)}
        />
      )}

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-6 sm:max-w-[1200px] lg:max-w-[1280px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Add a file and complete the document details.
            </DialogDescription>
          </DialogHeader>

          <DocumentUploadForm
            isSubmitting={uploadMutation.isPending}
            uploadProgress={uploadProgress}
            isAcademicLoading={isSemestersLoading || isSubjectsLoading}
            semesters={semesters}
            subjects={academicSubjects}
            onCancel={() => setIsUploadOpen(false)}
            onSubmit={handleUploadSubmit}
          />
        </DialogContent>
      </Dialog>

      <DocumentBulkDeleteDialog
        documents={enrichedDocuments}
        isOpen={isBulkDeleteOpen}
        isDeleting={bulkDeleteMutation.isPending}
        selectedDocumentIds={selectedDocumentIds}
        onOpenChange={handleBulkDeleteOpenChange}
        onToggleDocument={handleToggleDocumentSelect}
        onSelectAll={handleSelectAllDocuments}
        onClearSelection={() => setSelectedDocumentIds([])}
        onConfirmDelete={handleConfirmBulkDelete}
      />
    </section>
  );
}

export default MyDocumentsPage;
