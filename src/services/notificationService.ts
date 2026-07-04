import api from "@/configs/api";
import type { APIResponse } from "@/types/auth";
import type { DeleteResponse } from "@/types/document.type";
import type {
  NotificationPageResponse,
  NotificationQueryParams,
  NotificationResponse,
} from "@/types/notification.type";

// NOTE API: Lay notification cua user dang dang nhap.
// Backend tu doc user qua JWT trong Authorization header, FE khong can truyen userId.
export const getMyNotificationsPage = async (
  params: NotificationQueryParams = {},
): Promise<NotificationPageResponse> => {
  const response = await api.get<APIResponse<NotificationPageResponse>>(
    "/notifications",
    { params },
  );

  return response.data.result;
};

// NOTE API HELPER: UI hien tai chi can mang notification cua page dau tien.
// Neu sau nay lam pagination that, dung getMyNotificationsPage de lay totalPages/totalElements.
export const getMyNotifications = async (
  params: NotificationQueryParams = {},
): Promise<NotificationResponse[]> => {
  const page = await getMyNotificationsPage(params);
  return page.content;
};

// NOTE API: Lay so notification chua doc de hien badge do tren chuong/sidebar.
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<APIResponse<{ unreadCount: number }>>(
    "/notifications/unread-count",
  );

  return response.data.result.unreadCount;
};

// NOTE API: Danh dau 1 notification la da doc.
// Dung khi user click vao dropdown/list/detail.
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<NotificationResponse> => {
  const response = await api.patch<APIResponse<NotificationResponse>>(
    `/notifications/${notificationId}/read`,
  );

  return response.data.result;
};

// NOTE API: Danh dau tat ca notification cua current user la da doc.
export const markAllNotificationsAsRead = async (): Promise<number> => {
  const response = await api.patch<APIResponse<{ updatedCount: number }>>(
    "/notifications/read-all",
  );

  return response.data.result.updatedCount;
};

// NOTE API: Xoa 1 notification cua current user.
export const deleteNotification = async (
  notificationId: number,
): Promise<DeleteResponse> => {
  const response = await api.delete<APIResponse<DeleteResponse>>(
    `/notifications/${notificationId}`,
  );

  return response.data.result;
};

// NOTE API: Xoa tat ca notification da doc.
// Hien UI dang delete all bang cach xoa tung item de xoa ca read/unread.
export const deleteAllReadNotifications = async (): Promise<number> => {
  const response = await api.delete<APIResponse<{ deletedCount: number }>>(
    "/notifications/read",
  );

  return response.data.result.deletedCount;
};
