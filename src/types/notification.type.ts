// NOTE TYPE: Một notification mà backend trả về cho current user.
// documentId/reportId có thể null vì không phải notification nào cũng liên quan đến document/report.
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

// NOTE TYPE: Tab filter ở NotificationPage. FE đổi tab này thành query param isRead cho backend.
export type NotificationFilterType = "ALL" | "UNREAD" | "READ";

// NOTE API: Backend notification tra ve dang Spring Page.
// Endpoint: GET /api/notifications?page=0&isRead=false&type=SYSTEM
export interface NotificationPageResponse {
  content: NotificationResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// NOTE TYPE: Query params gửi lên backend khi lấy notification.
// isRead undefined nghĩa là lấy cả read và unread.
export interface NotificationQueryParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: string;
}
