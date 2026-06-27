import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DocumentDeleteDialog from "@/components/documents/detail/DocumentDeleteDialog";
import DocumentDetailHeader from "@/components/documents/detail/DocumentDetailHeader";
import DocumentDetailSidebar from "@/components/documents/detail/DocumentDetailSidebar";
import DocumentPreview from "@/components/documents/detail/DocumentPreview";
import DocumentUpdateDialog from "@/components/documents/detail/DocumentUpdateDialog";
import { VisibilityStatus } from "@/models/document.enum";
import { getAllAcademicSubjects } from "@/services/academicService";
import {
  cloudDownloadDocument,
  deleteDocument,
  getDocumentById,
  updateDocument,
  viewDocumentContent,
} from "@/services/documentService";
import type { DocumentResponse } from "@/types/document.type";

// Chuyển MIME type hoặc loại file từ BE thành nhãn ngắn để hiển thị trên giao diện.
function formatFileType(fileType?: string) {
  if (!fileType) return "FILE";

  const normalizedType = fileType.toLowerCase();

  if (normalizedType.includes("pdf")) return "PDF";
  if (
    normalizedType.includes("wordprocessingml") ||
    normalizedType.includes("docx")
  ) {
    return "DOCX";
  }
  if (
    normalizedType.includes("presentationml") ||
    normalizedType.includes("pptx")
  ) {
    return "PPTX";
  }
  if (
    normalizedType.includes("spreadsheetml") ||
    normalizedType.includes("xlsx")
  ) {
    return "XLSX";
  }
  if (normalizedType.includes("text/plain") || normalizedType.includes("txt")) {
    return "TXT";
  }

  return fileType.split("/").pop()?.toUpperCase() || "FILE";
}

// Đổi dung lượng file từ byte sang MB để người dùng dễ đọc hơn.
function formatFileSize(bytes?: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Kiểm tra loại file nào có thể lấy dạng Blob từ API và preview trực tiếp trong web.
function canPreviewWithBlob(fileTypeLabel: string) {
  // Các định dạng này có thể lấy file từ API dạng Blob rồi render trực tiếp trong trang.
  return ["PDF", "TXT", "DOCX"].includes(fileTypeLabel);
}

// Chuẩn hóa MIME type cho Blob để browser/thư viện biết cách render file.
function getPreviewMimeType(fileTypeLabel: string, fallbackType?: string) {
  // Ép MIME type đúng để trình duyệt biết cách render file, nhất là PDF.
  if (fileTypeLabel === "PDF") return "application/pdf";
  if (fileTypeLabel === "TXT") return "text/plain";
  if (fileTypeLabel === "DOCX") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return fallbackType || "application/octet-stream";
}

// Trang chi tiết tài liệu: lấy document, preview nội dung, tải xuống, cập nhật và xóa.
function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const documentId = id ? Number(id) : undefined;
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: document,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentById(documentId as number),
    enabled: Number.isFinite(documentId),
  });

  const { data: academicSubjects = [] } = useQuery({
    queryKey: ["academic", "subjects"],
    queryFn: getAllAcademicSubjects,
    retry: 1,
  });

  // Document detail chưa có semester/combo nên phải dò thêm bằng subjectId từ academic API.
  const academicSubject = useMemo(
    () =>
      document
        ? academicSubjects.find(
            (subject) => subject.subjectId === document.subjectId,
          )
        : undefined,
    [academicSubjects, document],
  );
  const fileTypeLabel = formatFileType(document?.fileType);
  const shouldLoadBlobPreview = canPreviewWithBlob(fileTypeLabel);

  const {
    data: previewBlob,
    isLoading: isPreviewLoading,
    isError: isPreviewError,
  } = useQuery({
    queryKey: ["documentPreview", documentId],
    queryFn: () => viewDocumentContent(documentId as number),
    enabled: Number.isFinite(documentId) && shouldLoadBlobPreview,
  });

  const normalizedPreviewBlob = useMemo(() => {
    if (!previewBlob) return undefined;

    // Tạo Blob mới với MIME type chuẩn để preview không bị browser hiểu là file download.
    return new Blob([previewBlob], {
      type: getPreviewMimeType(fileTypeLabel, previewBlob.type),
    });
  }, [fileTypeLabel, previewBlob]);
  const blobPreviewUrl = useMemo(
    () =>
      normalizedPreviewBlob ? URL.createObjectURL(normalizedPreviewBlob) : "",
    [normalizedPreviewBlob],
  );
  const canOpenInNewTab =
    (fileTypeLabel === "PDF" || fileTypeLabel === "TXT") && blobPreviewUrl;

  useEffect(() => {
    return () => {
      if (blobPreviewUrl) {
        URL.revokeObjectURL(blobPreviewUrl);
      }
    };
  }, [blobPreviewUrl]);

  // Gọi API update document và cập nhật lại cache để UI đổi ngay sau khi lưu.
  const updateMutation = useMutation({
    mutationFn: (data: {
      title: string;
      subjectId: number;
      visibilityStatus: VisibilityStatus;
    }) => updateDocument(documentId as number, data),
    onSuccess: async (updatedDocument, updatedValues) => {
      queryClient.setQueryData<DocumentResponse>(
        ["document", documentId],
        (currentDocument) =>
          currentDocument
            ? {
                ...currentDocument,
                title: updatedValues.title,
                subjectId: updatedDocument.subjectId ?? updatedValues.subjectId,
                visibilityStatus: updatedValues.visibilityStatus,
                updatedAt: updatedDocument.updatedAt ?? currentDocument.updatedAt,
              }
            : currentDocument,
      );

      queryClient.setQueryData<DocumentResponse[]>(["myDocuments"], (documents) =>
        documents?.map((currentDocument) =>
          currentDocument.documentId === documentId
            ? {
                ...currentDocument,
                title: updatedValues.title,
                subjectId: updatedDocument.subjectId ?? updatedValues.subjectId,
                visibilityStatus: updatedValues.visibilityStatus,
                updatedAt: updatedDocument.updatedAt ?? currentDocument.updatedAt,
              }
            : currentDocument,
        ),
      );

      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      toast.success("Document updated successfully");
      setIsUpdateOpen(false);
    },
    onError: () => {
      toast.error("Update document failed");
    },
  });

  // Gọi API xóa document; thành công thì quay lại trang My Documents.
  const deleteMutation = useMutation({
    mutationFn: () => deleteDocument(documentId as number),
    onSuccess: () => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      setIsDeleteOpen(false);
      navigate("/app/mydocuments");
    },
    onError: () => {
      toast.error("Delete document failed");
    },
  });

  // Tải file từ API dạng Blob rồi tạo link download tạm thời trên browser.
  const handleDownload = async () => {
    if (!document || !documentId) return;

    const blob = await cloudDownloadDocument(documentId);
    const downloadUrl = URL.createObjectURL(blob);
    const link = window.document.createElement("a");

    link.href = downloadUrl;
    link.download = document.fileName || document.title;
    link.click();

    URL.revokeObjectURL(downloadUrl);
  };

  // Mở dialog xác nhận xóa, chưa gọi API ở bước này.
  const handleDelete = () => {
    if (!documentId || deleteMutation.isPending) return;

    setIsDeleteOpen(true);
  };

  // Khi người dùng xác nhận trong dialog thì mới gọi API xóa document.
  const handleConfirmDelete = () => {
    if (!documentId || deleteMutation.isPending) return;

    deleteMutation.mutate();
  };

  // Xử lý form update: lấy title/visibility, validate title rồi gọi API update.
  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!document || updateMutation.isPending) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const visibilityStatus = String(
      formData.get("visibilityStatus") ?? document.visibilityStatus,
    );

    if (!title) {
      toast.error("Please enter document title");
      return;
    }

    updateMutation.mutate({
      title,
      subjectId: document.subjectId,
      visibilityStatus:
        visibilityStatus === VisibilityStatus.PUBLIC
          ? VisibilityStatus.PUBLIC
          : VisibilityStatus.PRIVATE,
    });
  };

  if (isLoading) {
    return (
      <section className="w-full px-8 py-10">
        <p className="text-muted-foreground">Loading document...</p>
      </section>
    );
  }

  if (isError || !document) {
    return (
      <section className="w-full px-8 py-10">
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-bold text-card-foreground">
              Document not found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check your document id or MockAPI endpoint.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const averageRating = document.averageRating ?? 0;
  const rating = Math.min(5, Math.round(averageRating));
  const subjectCode =
    document.subjectCode ?? academicSubject?.subjectCode ?? `Subject ${document.subjectId}`;
  const subjectName =
    document.subjectName ?? academicSubject?.subjectName ?? "N/A";
  const semesterNo = document.semesterNo ?? academicSubject?.semesterNo;
  const comboName = document.comboName ?? academicSubject?.comboName;

  return (
    <section className="w-full px-8 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-xl  cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={() => blobPreviewUrl && window.open(blobPreviewUrl, "_blank")}
            disabled={!canOpenInNewTab}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open New Tab
          </Button>

          <Button
            type="button"
            className="rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground hover:from-primary-start-hover hover:to-primary-end-hover"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4  cursor-pointer" />
            Download
          </Button>
        </div>
      </div>

      <DocumentDetailHeader
        document={document}
        fileTypeLabel={fileTypeLabel}
        subjectCode={subjectCode}
        subjectName={subjectName}
        semesterNo={semesterNo}
        comboName={comboName}
        fileSizeLabel={formatFileSize(document.fileSize)}
        isDeleting={deleteMutation.isPending}
        onUpdate={() => setIsUpdateOpen(true)}
        onDelete={handleDelete}
      />

      <DocumentUpdateDialog
        document={document}
        isOpen={isUpdateOpen}
        isSaving={updateMutation.isPending}
        onOpenChange={setIsUpdateOpen}
        onSubmit={handleUpdateSubmit}
      />

      <DocumentDeleteDialog
        documentTitle={document.title}
        isOpen={isDeleteOpen}
        isDeleting={deleteMutation.isPending}
        onOpenChange={setIsDeleteOpen}
        onConfirmDelete={handleConfirmDelete}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-black text-card-foreground">
              Document Preview
            </h2>
          </div>

          <div className="h-[calc(100vh-190px)] min-h-[820px] w-full bg-white">
            {isPreviewLoading ? (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  Loading preview...
                </p>
              </div>
            ) : isPreviewError ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <FileText className="h-16 w-16 text-muted-foreground" />

                <h2 className="mt-4 text-xl font-bold text-card-foreground">
                  Cannot load preview
                </h2>

                <p className="mt-2 max-w-md text-muted-foreground">
                  Please check your login session or backend preview endpoint.
                </p>
              </div>
            ) : normalizedPreviewBlob ? (
              <DocumentPreview
                blob={normalizedPreviewBlob}
                fileTypeLabel={fileTypeLabel}
                title={document.title}
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

        <DocumentDetailSidebar
          document={document}
          averageRating={averageRating}
          rating={rating}
        />
      </div>
    </section>
  );
}

export default DocumentDetailPage;


