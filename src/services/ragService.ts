import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  RagChatRequest,
  RagChatResponse,
  RagDeleteResponse,
  RagDocumentResponse,
} from "@/types/rag.type";

export const askRagQuestion = async (
  data: RagChatRequest,
): Promise<RagChatResponse> => {
  const response = await api.post<APIResponse<RagChatResponse>>(
    "/user/rag/chat/ask",
    data,
  );

  return response.data.result;
};

export const indexRagDocument = async (
  documentId: number,
): Promise<RagDocumentResponse> => {
  const response = await api.post<APIResponse<RagDocumentResponse>>(
    `/user/rag/documents/${documentId}/index`,
  );

  return response.data.result;
};

export const getRagDocument = async (
  documentId: number,
): Promise<RagDocumentResponse> => {
  const response = await api.get<APIResponse<RagDocumentResponse>>(
    `/user/rag/documents/${documentId}`,
  );

  return response.data.result;
};

export const deleteRagDocument = async (
  documentId: number,
): Promise<RagDeleteResponse> => {
  const response = await api.delete<APIResponse<RagDeleteResponse>>(
    `/user/rag/documents/${documentId}`,
  );

  return response.data.result;
};
