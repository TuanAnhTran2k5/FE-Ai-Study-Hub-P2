export interface RagChatRequest {
  question: string;
}

export interface RagChatResponse {
  answer: string;
  sources: string[];
}

export interface RagDocumentResponse {
  id: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  uploadedBy: string;
  uploadDate: string;
  status: string;
}

export interface RagDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
  entityName: string;
  entityIdentifier: string;
  deletedAt: string;
}
