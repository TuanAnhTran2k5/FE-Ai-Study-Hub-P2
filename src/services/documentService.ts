import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  BookmarkRequest,
  BookmarkResponse,
  DeleteDocumentResponse,
  MyDocumentResponse,
  DocumentDownloadResponse,
  DocumentResponse,
  DocumentUpdateRequest,
  DocumentUpdateResponse,
  DocumentUploadRequest,
  DocumentUploadResponse,
  RatingRequest,
  RatingResponse,
} from "@/types/document.type";

export const getMyDocuments = async (): Promise<MyDocumentResponse[]> => {
  const response = await api.get<APIResponse<MyDocumentResponse[]>>(
    "/user/document/my-documents",
  );

  return response.data.result;
};

export const getDocumentById = async (
  documentId: number,
): Promise<MyDocumentResponse> => {
  const response = await api.get<APIResponse<MyDocumentResponse>>(
    `/user/document/${documentId}`,
  );

  return response.data.result;
};

export const uploadDocument = async (
  data: DocumentUploadRequest,
  onUploadProgress?: (progress: number) => void,
): Promise<DocumentUploadResponse> => {
  // Backend upload nhận multipart/form-data nên phải tự tạo FormData ở đây.
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
      // Axios trả tiến độ upload theo byte; đổi sang phần trăm để UI hiển thị progress bar.
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) {
          return;
        }

        onUploadProgress?.(
          Math.min(
            100,
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          ),
        );
      },
    },
  );

  return response.data.result;
};

export const searchPublicDocuments = async (
  keyword: string,
): Promise<DocumentResponse[]> => {
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
  // API update đang tạm chưa gọi từ UI vì backend chưa lưu ổn định.
  // Giữ service lại để nối lại nhanh khi backend sửa xong.
  const response = await api.patch<APIResponse<DocumentUpdateResponse>>(
    `/user/document/${documentId}`,
    data,
  );

  return response.data.result;
};

export const deleteDocument = async (
  documentId: number,
): Promise<DeleteDocumentResponse> => {
  const response = await api.delete<APIResponse<DeleteDocumentResponse>>(
    `/user/document/${documentId}`,
  );

  return response.data.result;
};

export const downloadPublicDocument = async (
  documentId: number,
): Promise<DocumentDownloadResponse> => {
  const response = await api.post<APIResponse<DocumentDownloadResponse>>(
    `/user/document/${documentId}/download/public`,
  );

  return response.data.result;
};

export const cloudDownloadDocument = async (
  documentId: number,
): Promise<Blob> => {
  // Endpoint này dùng cho nút Download, trả file dạng Blob để trình duyệt tải xuống.
  const response = await api.get(`/user/document/${documentId}/cloud-download`, {
    responseType: "blob",
  });

  return response.data;
};

export const viewDocumentContent = async (
  documentId: number,
): Promise<Blob> => {
  // Endpoint này dùng để preview file ngay trong web, không tải xuống trực tiếp.
  const response = await api.get(`/user/document/${documentId}/view-content`, {
    responseType: "blob",
  });

  return response.data;
};

export const ratingDocument = async (
  documentId: number,
  data: RatingRequest,
): Promise<RatingResponse> => {
  const response = await api.post<APIResponse<RatingResponse>>(
    `/user/document/${documentId}/rating`,
    data,
  );

  return response.data.result;
};


export const getBookmarks = async (): Promise<BookmarkResponse[]> => {
  const response = await api.get<APIResponse<BookmarkResponse[]>>(
    "/user/bookmarks",
  );

  return response.data.result;
};

export const addBookmark = async (
  data: BookmarkRequest,
): Promise<BookmarkResponse> => {
  const response = await api.post<APIResponse<BookmarkResponse>>(
    "/user/bookmarks",
    data,
  );

  return response.data.result;
};

export const removeBookmark = async (
  documentId: number,
): Promise<DeleteDocumentResponse> => {
  const response = await api.delete<APIResponse<DeleteDocumentResponse>>(
    `/user/bookmarks/${documentId}`,
  );

  return response.data.result;
};
