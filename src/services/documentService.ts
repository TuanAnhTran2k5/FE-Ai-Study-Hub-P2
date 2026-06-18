import api from "@/configs/api";
import type { DocumentRequest, DocumentResponse } from "@/types/document.type";

export const getDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await api.get<DocumentResponse[]>("/documents");

  return response.data;
};

export const createDocument = async (
  data: DocumentRequest,
): Promise<DocumentResponse> => {
  const response = await api.post<DocumentResponse>("/documents", data);

  return response.data;
};

export const getDocumentById = async (
  id: string,
): Promise<DocumentResponse> => {
  const response = await api.get<DocumentResponse>(`/documents/${id}`);
  return response.data;
};
