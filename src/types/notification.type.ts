export interface NotificationResponse {
  notificationId: number;
  userId?: number;
  documentId?: number | null;
  documentTitle?: string | null;
  reportId?: number | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  notificationCase?: string | null;
  createdAt: string;
}
export type NotificationFilterType = "ALL" | "UNREAD" | "READ";

export interface NotificationPageResponse {
  content: NotificationResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface NotificationQueryParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: string;
}
