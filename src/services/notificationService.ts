import api from "@/configs/api";
import type { NotificationResponse } from "@/types/notification.type";


export const getNotificationsByUserId = async (userId: string) => {
  const response = await api.get<NotificationResponse[]>(
    `/notifications?userId=${userId}`
  );

  return response.data;
};