import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bell, CalendarDays, FileText, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNotificationBadgeStyles } from "@/lib/notificationUtils";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import {
  deleteNotification,
  getMyNotifications,
  markNotificationAsRead,
} from "@/services/notificationService";

function NotificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notificationId = Number(id);

  // NOTE AUTH: User id duoc dua vao query key de khong lay nham cache notification cua account khac.
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );
  const currentUserId = currentUser?.userId;

  // NOTE API: Backend hien chua co endpoint get notification by id rieng.
  // FE lay danh sach notification cua user hien tai roi tim notificationId can xem.
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", currentUserId, "detail-source"],
    queryFn: () => getMyNotifications({ page: 0, size: 1000 }),
    enabled: !!currentUserId && Number.isFinite(notificationId),
  });

  const notification = useMemo(() => {
    return notifications.find((item) => item.notificationId === notificationId);
  }, [notificationId, notifications]);

  // NOTE ACTION: Khi vao detail, neu notification chua doc thi danh dau da doc.
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success("Notification deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      navigate(`/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}`);
    },
    onError: () => {
      toast.error("Delete notification failed.");
    },
  });

  useEffect(() => {
    if (notification && !notification.isRead && !markReadMutation.isPending) {
      markReadMutation.mutate(notification.notificationId);
    }
  }, [markReadMutation, notification]);

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  if (isError || !notification) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-8">
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-10 text-center">
            <h1 className="text-2xl font-black text-card-foreground">
              Notification not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              This notification may have been deleted or belongs to another
              account.
            </p>
            <Button
              type="button"
              className="mt-6 rounded-xl"
              onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}`)}
            >
              Back to notifications
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const createdAt = new Date(notification.createdAt).toLocaleString("vi-VN");

  return (
    <section className="mx-auto w-full max-w-6xl px-8 py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}`)}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(notification.notificationId)}
        >
          <Trash2 className="mr-2 size-4" />
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <Card className="min-h-[520px] overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-0">
        <CardContent className="p-0">
          <div className="bg-secondary/90 px-10 py-4 rounded-t-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Bell className="size-8" />
              </span>
              <Badge variant="outline" className={cn("rounded-full px-3 py-1 font-bold", getNotificationBadgeStyles(notification.type))}>
                {notification.type}
              </Badge>
              <Badge
                variant={notification.isRead ? "secondary" : "default"}
                className="rounded-full px-3 py-1"
              >
                {notification.isRead ? "Read" : "Unread"}
              </Badge>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-card-foreground">
              {notification.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                {createdAt}
              </span>

              {notification.documentTitle && (
                <span className="flex items-center gap-2">
                  <FileText className="size-4" />
                  {notification.documentTitle}
                </span>
              )}
            </div>
          </div>

          <div className="px-10 py-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
              Content
            </h2>
            <p className="mt-5 whitespace-pre-line text-lg leading-9 text-card-foreground">
              {notification.message}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default NotificationDetailPage;
