export interface RagChatRequest {
  question: string;
  sessionId?: number;
  documentIds?: number[];
}

export interface RagChatResponse {
  sessionId?: number;
  sessionTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  documentIds?: number[];
  answer: string;
  sources?: string[];
}

export interface RagCreateSessionRequest {
  documentIds: number[];
}

export interface RagUpdateSessionDocumentsRequest {
  documentIds: number[];
}

export interface RagChatSessionResponse {
  sessionId: number;
  sessionTitle: string;
  createdAt: string;
  updatedAt: string;
  documentIds: number[];
}

export type RagMessageSenderType = "USER" | "AI";

export interface RagChatMessageResponse {
  messageId: number;
  senderType: RagMessageSenderType;
  content: string;
  createdAt: string;
}

export interface RagChatMessagesPageResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: RagChatMessageResponse[];
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RagSessionAskRequest {
  question: string;
  sessionId?: number;
  documentIds?: number[];
}

export type RagSessionAskResponse = RagChatResponse;

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
  storageUsed?: number;
  storageRemaining?: number;
  storageUsagePercent?: number;
}
