export interface NotificationResponse {
  id: string;
  userId: string;
  documentId?: string | null;
  reportId?: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  notificationCase: string;
  createdAt: string;
}