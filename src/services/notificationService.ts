import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { DeleteDocumentResponse } from "@/types/document.type";
import type {
  NotificationPageResponse,
  NotificationQueryParams,
  NotificationResponse,
} from "@/types/notification.type";

// NOTE API: Lay notification cua current user. Backend tu doc user tu JWT.
export const getMyNotificationsPage = async (
  params: NotificationQueryParams = {},
): Promise<NotificationPageResponse> => {
  const response = await api.get<APIResponse<NotificationPageResponse>>(
    "/notifications",
    { params },
  );

  return response.data.result;
};

// NOTE API: Helper cho UI hien tai. Chi lay content cua page dau tien.
export const getMyNotifications = async (
  params: NotificationQueryParams = {},
): Promise<NotificationResponse[]> => {
  const page = await getMyNotificationsPage(params);
  return page.content;
};

// NOTE API: Lay so notification chua doc de hien badge tren chuong.
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<APIResponse<{ unreadCount: number }>>(
    "/notifications/unread-count",
  );

  return response.data.result.unreadCount;
};

// NOTE API: Danh dau 1 notification la da doc.
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<NotificationResponse> => {
  const response = await api.patch<APIResponse<NotificationResponse>>(
    `/notifications/${notificationId}/read`,
  );

  return response.data.result;
};

// NOTE API: Danh dau tat ca notification la da doc.
export const markAllNotificationsAsRead = async (): Promise<number> => {
  const response = await api.patch<APIResponse<{ updatedCount: number }>>(
    "/notifications/read-all",
  );

  return response.data.result.updatedCount;
};

// NOTE API: Xoa 1 notification cua current user.
export const deleteNotification = async (
  notificationId: number,
): Promise<DeleteDocumentResponse> => {
  const response = await api.delete<APIResponse<DeleteDocumentResponse>>(
    `/notifications/${notificationId}`,
  );

  return response.data.result;
};

// NOTE API: Xoa tat ca notification da doc.
export const deleteAllReadNotifications = async (): Promise<number> => {
  const response = await api.delete<APIResponse<{ deletedCount: number }>>(
    "/notifications/read",
  );

  return response.data.result.deletedCount;
};
