import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  BookmarkRequest,
  BookmarkResponse,
  DeleteDocumentResponse,
  DocumentDownloadResponse,
  DocumentResponse,
  DocumentUpdateRequest,
  DocumentUpdateResponse,
  DocumentUploadRequest,
  DocumentUploadResponse,
  RatingRequest,
  RatingResponse,
} from "@/types/document.type";

export const getMyDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await api.get<APIResponse<DocumentResponse[]>>(
    "/user/document/my-documents",
  );

  return response.data.result;
};

export const getDocumentById = async (
  documentId: number,
): Promise<DocumentResponse> => {
  const response = await api.get<APIResponse<DocumentResponse>>(
    `/user/document/${documentId}`,
  );

  return response.data.result;
};

export const uploadDocument = async (
  data: DocumentUploadRequest,
): Promise<DocumentUploadResponse> => {
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.result;
};

export const searchPublicDocuments = async (
  keyword: string,
): Promise<DocumentUploadResponse[]> => {
  const response = await api.get<APIResponse<DocumentUploadResponse[]>>(
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
  const response = await api.get(`/user/document/${documentId}/cloud-download`, {
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