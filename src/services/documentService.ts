import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  BookmarkRequest,
  BookmarkResponse,
  DeleteResponse,
  DocumentDownloadResponse,
  DocumentResponse,
  DocumentUpdateRequest,
  DocumentUpdateResponse,
  DocumentUploadRequest,
  DocumentUploadResponse,
  MyDocumentResponse,
  RatingRequest,
  RatingResponse,
  ReportRequest,
  ReportResponse,
} from "@/types/document.type";

export const getMyDocuments = async (): Promise<MyDocumentResponse[]> => {
  // NOTE API: Lấy tài liệu của user đang đăng nhập. MyDocumentsPage dùng API này.
  const response = await api.get<APIResponse<MyDocumentResponse[]>>(
    "/user/document/my-documents",
  );

  return response.data.result;
};

export const getDocumentById = async (
  documentId: number,
): Promise<MyDocumentResponse> => {
  // NOTE API: Lấy chi tiết 1 document theo id. DocumentDetailPage dùng để render header/sidebar.
  const response = await api.get<APIResponse<MyDocumentResponse>>(
    `/user/document/${documentId}`,
  );

  return response.data.result;
};

export const uploadDocument = async (
  data: DocumentUploadRequest,
  onUploadProgress?: (progress: number) => void,
): Promise<DocumentUploadResponse> => {
  // NOTE API: Backend upload nhận multipart/form-data nên FE phải tự tạo FormData ở đây.
  const formData = new FormData();

  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("subjectId", String(data.subjectId));

  if (data.visibilityStatus) {
    formData.append("visibilityStatus", data.visibilityStatus);
  }

  const response = await api.post<APIResponse<DocumentUploadResponse>>(
    "/user/document/upload",
    formData,
    {
      // NOTE UX: Axios trả tiến độ upload theo byte; đổi sang phần trăm để UI hiện progress bar.
      onUploadProgress: (progressEvent) => {
  if (!progressEvent.total) {
    return;
  }

  const percent = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total,
  );

  onUploadProgress?.(Math.min(99, percent));
},
    },
  );

  return response.data.result;
};

export const searchPublicDocuments = async (
  keyword: string,
): Promise<DocumentResponse[]> => {
  // NOTE API COMMUNITY: Lấy tài liệu public theo keyword.
  // CommunityPage dùng hàm này để search tài liệu của cộng đồng.
  const response = await api.get<APIResponse<DocumentResponse[]>>(
    "/user/document/search",
    {
      params: {
        keyword,
      },
    },
  );

  return response.data.result;
};

export const updateDocument = async (
  documentId: number,
  data: DocumentUpdateRequest,
): Promise<DocumentUpdateResponse> => {
  // NOTE API: Cập nhật metadata document như title, subject, visibility.
  // UI edit document có thể gọi lại hàm này khi backend đã ổn định đầy đủ.
  const response = await api.patch<APIResponse<DocumentUpdateResponse>>(
    `/user/document/${documentId}`,
    data,
  );

  return response.data.result;
};

export const deleteDocument = async (
  documentId: number,
): Promise<DeleteResponse> => {
  // NOTE API: Xóa document của chính user. Không dùng để xóa document người khác trong Community.
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/user/document/${documentId}`,
  );

  return response.data.result;
};

export const downloadPublicDocument = async (
  documentId: number,
): Promise<DocumentDownloadResponse> => {
  // NOTE API COMMUNITY: Save to Storage / ghi nhận download public.
  // Backend xử lý quyền, tăng download count và trả metadata download.
  const response = await api.post<APIResponse<DocumentDownloadResponse>>(
    `/user/document/${documentId}/download/public`,
  );

  return response.data.result;
};

export const cloudDownloadDocument = async (
  documentId: number,
): Promise<Blob> => {
  // NOTE API: Dùng cho nút Download, trả file dạng Blob để trình duyệt tải xuống.
  const response = await api.get(`/user/document/${documentId}/cloud-download`, {
    responseType: "blob",
  });

  return response.data;
};

export const viewDocumentContent = async (
  documentId: number,
): Promise<Blob> => {
  // NOTE API: Dùng để preview file ngay trong web, không tải xuống trực tiếp.
  const response = await api.get(`/user/document/${documentId}/view-content`, {
    responseType: "blob",
  });

  return response.data;
};

export const ratingDocument = async (
  documentId: number,
  data: RatingRequest,
): Promise<RatingResponse> => {
  // NOTE API COMMUNITY: User đánh giá document public.
  // Sau khi thành công, DocumentDetailPage cập nhật cache để card/detail hiện sao mới.
  const response = await api.post<APIResponse<RatingResponse>>(
    `/user/document/${documentId}/rating`,
    data,
  );

  return response.data.result;
};

export const getBookmarks = async (): Promise<BookmarkResponse[]> => {
  // NOTE API COMMUNITY: Lấy danh sách bookmark của current user.
  // FE dùng để biết document nào đã được bookmark khi quay lại trang.
  const response = await api.get<APIResponse<BookmarkResponse[]>>(
    "/user/bookmarks",
  );

  return response.data.result;
};

export const addBookmark = async (
  data: BookmarkRequest,
): Promise<BookmarkResponse> => {
  // NOTE API COMMUNITY: Thêm bookmark cho document public.
  const response = await api.post<APIResponse<BookmarkResponse>>(
    "/user/bookmarks",
    data,
  );

  return response.data.result;
};

export const removeBookmark = async (
  documentId: number,
): Promise<DeleteResponse> => {
  // NOTE API COMMUNITY: Bỏ bookmark theo documentId.
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/user/bookmarks/${documentId}`,
  );

  return response.data.result;
};

export const reportDocument = async (
  data: ReportRequest,
): Promise<ReportResponse> => {
  // NOTE API COMMUNITY: Gửi report document cho moderation.
  // reasonId hiện phụ thuộc bảng report reason bên backend/database.
  const response = await api.post<APIResponse<ReportResponse>>(
    "/user/reports",
    data,
  );

  return response.data.result;
};
