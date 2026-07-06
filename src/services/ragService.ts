import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type {
  RagChatMessagesPageResponse,
  RagChatSessionResponse,
  RagCreateSessionRequest,
  RagDeleteResponse,
  RagDocumentResponse,
  RagSessionAskRequest,
  RagSessionAskResponse,
  RagUpdateSessionDocumentsRequest,
} from "@/types/rag.type";
export const getRagChatSessions = async (): Promise<
  RagChatSessionResponse[]
> => {
  const response = await api.get<APIResponse<RagChatSessionResponse[]>>(
    "/user/rag/chat/sessions",
  );

  return response.data.result;
};

export const createRagChatSession = async (
  data: RagCreateSessionRequest,
): Promise<RagChatSessionResponse> => {
  const response = await api.post<APIResponse<RagChatSessionResponse>>(
    "/user/rag/chat/sessions",
    data,
  );

  return response.data.result;
};

export const updateRagSessionDocuments = async (
  sessionId: number,
  data: RagUpdateSessionDocumentsRequest,
): Promise<RagChatSessionResponse> => {
  const response = await api.put<APIResponse<RagChatSessionResponse>>(
    `/user/rag/chat/sessions/${sessionId}/documents`,
    data,
  );

  return response.data.result;
};

export const askRagSessionQuestion = async (
  sessionId: number,
  data: RagSessionAskRequest,
): Promise<RagSessionAskResponse> => {
  const response = await api.post<APIResponse<RagSessionAskResponse>>(
    `/user/rag/chat/sessions/${sessionId}/ask`,
    {
      ...data,
      sessionId,
    },
  );

  return response.data.result;
};

export const getRagSessionMessages = async (
  sessionId: number,
  page = 0,
  size = 20,
): Promise<RagChatMessagesPageResponse> => {
  const response = await api.get<APIResponse<RagChatMessagesPageResponse>>(
    `/user/rag/chat/sessions/${sessionId}/messages`,
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data.result;
};

export const deleteRagChatSession = async (
  sessionId: number,
): Promise<RagSessionAskResponse> => {
  const response = await api.delete<APIResponse<RagSessionAskResponse>>(
    `/user/rag/chat/sessions/${sessionId}`,
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

export const getSuggestedPrompts = async (
  documentIds: number[],
): Promise<string[]> => {
  const response = await api.post<APIResponse<string[]>>(
    "/user/rag/chat/suggest-prompts",
    {
      documentIds,
    },
  );

  return response.data.result;
};