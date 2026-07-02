import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Image,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import DocumentDeleteDialog from "@/components/document/detail/DocumentDeleteDialog";
import DocumentDetailHeader from "@/components/document/detail/DocumentDetailHeader";
import DocumentDetailSidebar from "@/components/document/detail/DocumentDetailSidebar";
import DocumentPreview from "@/components/document/detail/DocumentPreview";
import DocumentUpdateDialog from "@/components/document/detail/DocumentUpdateDialog";
import { VisibilityStatus } from "@/models/document.enum";
import { ROUTE } from "@/models/routePath";
import { getAllAcademicSubjects } from "@/services/academicService";
import {
  addBookmark,
  cloudDownloadDocument,
  deleteDocument,
  downloadPublicDocument,
  getDocumentById,
  ratingDocument,
  reportDocument,
  updateDocument,
  viewDocumentContent,
} from "@/services/documentService";
import type { RootState } from "@/redux/store";
import type { User } from "@/models/user";
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

// FE helper: sau khi user rating, cập nhật lại average/ratingCount ngay trên UI.
// Lý do: một số BE response có thể trả averageRating/ratingCount chưa kịp recompute,
// nên FE tự tính từ dữ liệu hiện tại để Statistics và DocumentCard đổi sao ngay.
function applyRatingToDocument(
  document: DocumentResponse,
  ratingValue: number,
  responseAverageRating?: number,
  responseRatingCount?: number,
) {
  const oldAverage = Number(document.averageRating ?? 0);
  const oldCount = Number(document.ratingCount ?? 0);
  const oldUserRating = Number(document.myRating ?? 0);
  const alreadyRated = oldUserRating > 0 && oldCount > 0;

  if (
    typeof responseAverageRating === "number" &&
    responseAverageRating > 0 &&
    typeof responseRatingCount === "number" &&
    responseRatingCount > 0
  ) {
    return {
      ...document,
      averageRating: responseAverageRating,
      ratingCount: responseRatingCount,
      myRating: ratingValue,
    };
  }

  const nextCount = alreadyRated ? Math.max(oldCount, 1) : oldCount + 1;
  const totalBefore = oldAverage * oldCount;
  const totalAfter = alreadyRated
    ? totalBefore - oldUserRating + ratingValue
    : totalBefore + ratingValue;
  const nextAverage =
    nextCount > 0 ? Number((totalAfter / nextCount).toFixed(2)) : ratingValue;

  return {
    ...document,
    averageRating: nextAverage,
    ratingCount: nextCount,
    myRating: ratingValue,
  };
}

// Lấy message lỗi từ backend để UI xử lý đúng từng trường hợp.
function getBackendErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "";
}

// Khi DB/BE chưa có bảng dữ liệu report_reason, API report sẽ trả "ReportReason not found".
// Hàm này giữ report tạm trong localStorage để FE vẫn test được luồng report.
// TODO: Khi BE seed đầy đủ report_reason hoặc có API report reasons, bỏ fallback local này.
function savePendingReportToLocalStorage(report: {
  documentId: number;
  reasonId: number;
  reasonLabel?: string;
  description?: string;
  evidenceFileName?: string;
}) {
  const storageKey = "pendingDocumentReports";
  const currentReports = JSON.parse(
    localStorage.getItem(storageKey) || "[]",
  ) as Array<typeof report & { createdAt: string }>;

  currentReports.push({
    ...report,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(storageKey, JSON.stringify(currentReports));
}

// Lý do report hard-code theo bảng report_reason trong database.
// Nếu BE có API lấy report reasons thì thay mảng này bằng useQuery từ API.
const REPORT_REASONS = [
  {
    reasonId: 1,
    label: "Wrong subject",
    helper: "Document is assigned to the wrong subject.",
  },
  {
    reasonId: 2,
    label: "Duplicate content",
    helper: "Document duplicates another uploaded document.",
  },
  {
    reasonId: 3,
    label: "Advertising or spam",
    helper: "Document contains ads, spam, or unrelated promotion.",
  },
  {
    reasonId: 4,
    label: "Invalid or harmful content",
    helper: "Document contains inappropriate or harmful content.",
  },
  {
    reasonId: 5,
    label: "Other",
    helper: "Another issue that does not match the reasons above.",
  },
];

// Trang chi tiết tài liệu: lấy document, preview nội dung, tải xuống, cập nhật và xóa.
function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // NOTE ROUTE: documentId lấy từ URL. Cùng page này dùng cho cả My Documents và Community detail.
  const documentId = id ? Number(id) : undefined;

  // NOTE AUTH: currentUser dùng để phân biệt tài liệu của mình hay tài liệu người khác.
  // Nếu là tài liệu người khác trong Community thì chỉ hiện action: save/bookmark/rating/report.
  const currentUser = useSelector(
    (state: RootState) => state.user,
  ) as User | null;
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reportReasonId, setReportReasonId] = useState("1");
  const [reportDescription, setReportDescription] = useState("");
  const [reportEvidenceFile, setReportEvidenceFile] = useState<File | null>(
    null,
  );
  const [reportEvidencePreview, setReportEvidencePreview] = useState("");

  const {
    data: document,
    isLoading,
    isError,
  } = useQuery({
    // NOTE API: Query chính lấy metadata document. Các cache update rating/bookmark cũng cập nhật key này.
    queryKey: ["document", documentId],
    queryFn: () => getDocumentById(documentId as number),
    enabled: Number.isFinite(documentId),
  });

  useEffect(() => {
    if (!document) {
      return;
    }

    // BE mới trả trạng thái cá nhân của user trong DocumentResponse.
    // isBookmarked dùng cho nút Bookmark, myRating dùng cho số sao user đã chọn.
    setIsBookmarked(!!document.isBookmarked);
    setSelectedRating(document.myRating ?? 0);
  }, [document]);

  // Tạo preview ảnh report ở phía FE; backend hiện chỉ nhận chuỗi evidenceUrl, chưa nhận file multipart.
  useEffect(() => {
    if (!reportEvidenceFile) {
      setReportEvidencePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(reportEvidenceFile);
    setReportEvidencePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [reportEvidenceFile]);

  // Nếu một document của người khác bị mở nhầm qua /app/mydocuments/:id,
  // tự chuyển về đúng route community để URL và ngữ cảnh trang khớp nhau.
  useEffect(() => {
    if (!document || !currentUser || !documentId) {
      return;
    }

    const isCurrentUserOwner =
      Number(currentUser.userId) === Number(document.ownerId);

    if (
      location.pathname.startsWith("/app/mydocuments/") &&
      !isCurrentUserOwner
    ) {
      navigate(`/${ROUTE.APP}/${ROUTE.COMMUNITY}/${documentId}`, {
        replace: true,
      });
    }
  }, [currentUser, document, documentId, location.pathname, navigate]);

  const { data: academicSubjects = [] } = useQuery({
    // NOTE API: Lấy subject/semester để bù thông tin nếu document response chưa trả đủ.
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
    // NOTE API PREVIEW: Lấy blob file để preview trong trang detail.
    // Không dùng API này để download file về máy.
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

  // NOTE COMMUNITY ACTION: Lưu document public của người khác vào storage của user đang đăng nhập.
  // Thành công thì refresh My Documents và Public Documents để số download/list cập nhật.
  const saveToStorageMutation = useMutation({
    mutationFn: () => downloadPublicDocument(documentId as number),
    onSuccess: (response) => {
      toast.success("Document saved to your storage successfully");
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });

      if (response.documentId) {
        navigate(`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}/${response.documentId}`);
      }
    },
    onError: () => {
      toast.error("Save to storage failed");
    },
  });

  // NOTE COMMUNITY ACTION: Bookmark document public của người khác.
  // FE cập nhật cache ngay để nút Bookmark đổi trạng thái mà không cần reload.
  const bookmarkMutation = useMutation({
    mutationFn: () => addBookmark({ documentId: documentId as number }),
    onSuccess: () => {
      setIsBookmarked(true);
      queryClient.setQueryData<DocumentResponse>(
        ["document", documentId],
        (currentDocument) =>
          currentDocument
            ? {
                ...currentDocument,
                isBookmarked: true,
                bookmarkCount: (currentDocument.bookmarkCount ?? 0) + 1,
              }
            : currentDocument,
      );
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });
      toast.success("Document bookmarked successfully");
    },
    onError: (error) => {
      const message = getBackendErrorMessage(error);

      if (message.toLowerCase().includes("already bookmarked")) {
        setIsBookmarked(true);
        toast.info("Document already bookmarked");
        return;
      }

      toast.error(message || "Bookmark failed");
    },
  });

  // NOTE COMMUNITY ACTION: Đánh giá sao cho document public.
  // Sau khi backend trả average/ratingCount, FE ghi lại vào cache detail và publicDocuments.
  const ratingMutation = useMutation({
    mutationFn: (ratingValue: number) =>
      ratingDocument(documentId as number, { ratingValue }),
    onSuccess: (response) => {
      setSelectedRating(response.ratingValue);
      queryClient.setQueryData<DocumentResponse>(
        ["document", documentId],
        (currentDocument) =>
          currentDocument
            ? applyRatingToDocument(
                currentDocument,
                response.ratingValue,
                response.averageRating,
                response.ratingCount,
              )
            : currentDocument,
      );

      // Cập nhật luôn cache danh sách Community để khi quay lại card đã hiện sao mới.
      queryClient.setQueriesData<DocumentResponse[]>(
        { queryKey: ["publicDocuments"] },
        (currentDocuments) =>
          currentDocuments?.map((currentDocument) =>
            currentDocument.documentId === documentId
              ? applyRatingToDocument(
                  currentDocument,
                  response.ratingValue,
                  response.averageRating,
                  response.ratingCount,
                )
              : currentDocument,
          ),
      );

      toast.success("Rating submitted successfully");
    },
    onError: () => {
      toast.error("Rating failed");
    },
  });

  // NOTE COMMUNITY ACTION: Report document vi phạm cho moderation team.
  // reasonId phải tồn tại trong bảng report reason của backend; nếu thiếu thì FE lưu pending local để không mất dữ liệu user nhập.
  const reportMutation = useMutation({
    mutationFn: () =>
      reportDocument({
        documentId: documentId as number,
        reasonId: Number(reportReasonId),
        description: reportDescription.trim() || undefined,
        // BE hiện đang nhận evidenceUrl dạng string, chưa có endpoint upload ảnh evidence.
        // Tạm gửi tên file ảnh để moderation biết user đã đính kèm ảnh nào.
        evidenceUrl: reportEvidenceFile
          ? `image:${reportEvidenceFile.name}`
          : undefined,
      }),
    onSuccess: () => {
      toast.success("Report submitted successfully");
      setIsReportOpen(false);
      setReportDescription("");
      setReportEvidenceFile(null);
    },
    onError: (error) => {
      const message = getBackendErrorMessage(error);

      if (message.toLowerCase().includes("reportreason not found")) {
        const selectedReason = REPORT_REASONS.find(
          (reason) => String(reason.reasonId) === reportReasonId,
        );

        savePendingReportToLocalStorage({
          documentId: documentId as number,
          reasonId: Number(reportReasonId),
          reasonLabel: selectedReason?.label,
          description: reportDescription.trim() || undefined,
          evidenceFileName: reportEvidenceFile?.name,
        });

        toast.success(
          "Report saved locally. Backend report reasons are not ready yet.",
        );
        setIsReportOpen(false);
        setReportDescription("");
        setReportEvidenceFile(null);
        return;
      }

      toast.error(message || "Report failed");
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

  // Nếu BE chưa recompute averageRating/ratingCount nhưng đã trả myRating,
  // FE dùng myRating làm fallback để người dùng thấy rating vừa chọn.
  const averageRating =
    (document.averageRating ?? 0) > 0
      ? (document.averageRating ?? 0)
      : (document.myRating ?? 0);
  const ratingCount =
    (document.ratingCount ?? 0) > 0
      ? (document.ratingCount ?? 0)
      : document.myRating
        ? 1
        : 0;
  const rating = Math.min(5, Math.round(averageRating));
  const subjectCode =
    document.subjectCode ?? academicSubject?.subjectCode ?? `Subject ${document.subjectId}`;
  const subjectName =
    document.subjectName ?? academicSubject?.subjectName ?? "N/A";
  const semesterNo = document.semesterNo ?? academicSubject?.semesterNo;
  const comboName = document.comboName ?? academicSubject?.comboName;
  const isOwner = Number(currentUser?.userId) === Number(document.ownerId);

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
        isOwner={isOwner}
        isDeleting={deleteMutation.isPending}
        onUpdate={() => setIsUpdateOpen(true)}
        onDelete={handleDelete}
      />

      {isOwner && (
        <>
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
        </>
      )}

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
          document={{ ...document, ratingCount }}
          averageRating={averageRating}
          rating={rating}
          isOwner={isOwner}
          isBookmarked={isBookmarked}
          selectedRating={selectedRating}
          isSavingToStorage={saveToStorageMutation.isPending}
          isBookmarking={bookmarkMutation.isPending}
          isRating={ratingMutation.isPending}
          onSaveToStorage={() => saveToStorageMutation.mutate()}
          onBookmark={() => bookmarkMutation.mutate()}
          onRate={(ratingValue: number) => ratingMutation.mutate(ratingValue)}
          onReport={() => setIsReportOpen(true)}
        />
      </div>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
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

              <Select
                value={reportReasonId}
                onValueChange={setReportReasonId}
              >
                <SelectTrigger className="h-12 w-full rounded-xl">
                  <SelectValue placeholder="Choose a report reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
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
                  REPORT_REASONS.find(
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
                onChange={(event) => setReportDescription(event.target.value)}
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
                        onClick={() => setReportEvidenceFile(null)}
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

                        setReportEvidenceFile(file);
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
              disabled={reportMutation.isPending}
              onClick={() => setIsReportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={reportMutation.isPending || !reportDescription.trim()}
              onClick={() => reportMutation.mutate()}
            >
              {reportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default DocumentDetailPage;
