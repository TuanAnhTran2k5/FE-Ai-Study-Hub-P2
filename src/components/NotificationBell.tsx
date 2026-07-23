import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "@/services/notificationService";

function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );
  const currentUserId = currentUser?.userId;

  // NOTE API: Badge lay so unread that tu backend.
  // Query key co userId de khi doi account khong hien cache notification cua user cu.
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", currentUserId, "unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: !!currentUserId,
  });

  // NOTE API: Dropdown chi lay notification moi nhat de xem nhanh.
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", currentUserId, "dropdown"],
    queryFn: () => getMyNotifications(),
    enabled: !!currentUserId,
  });

  const openNotificationDetail = (notificationId: number) => {
    setIsOpen(false);
    navigate(`/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}/${notificationId}`);
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      // NOTE CACHE: Mark read xong thi refresh dropdown, badge va NotificationPage.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      openNotificationDetail(notificationId);
    },
  });

  const latestNotifications = notifications.slice(0, 5);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary active:scale-95">
          <Bell className="size-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black leading-none text-white shadow-md ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[380px] overflow-hidden rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-xl"
      >
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-black text-card-foreground">{t("notifications.title", "Notifications")}</h3>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {latestNotifications.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              {t("notifications.empty", "No notifications yet.")}
            </p>
          ) : (
            latestNotifications.map((item) => (
              <button
                key={item.notificationId}
                type="button"
                className={`block w-full cursor-pointer border-b border-border px-5 py-4 text-left transition-all duration-300 last:border-b-0 hover:bg-accent ${
                  item.isRead ? "bg-popover" : "bg-primary-bg-hover/40"
                }`}
                onClick={() => {
                  if (item.isRead) {
                    openNotificationDetail(item.notificationId);
                    return;
                  }

                  markReadMutation.mutate(item.notificationId);
                }}
              >
                <h4 className="text-sm font-semibold text-card-foreground">
                  {item.title}
                </h4>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.message}
                </p>
              </button>
            ))
          )}
        </div>

        <button
          type="button"
          className="w-full cursor-pointer border-t border-border px-5 py-3 text-sm font-bold text-primary hover:bg-accent"
          onClick={() => {
            setIsOpen(false);
            navigate(`/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}`);
          }}
        >
          {t("notifications.viewAll", "View all notifications")}
        </button>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
