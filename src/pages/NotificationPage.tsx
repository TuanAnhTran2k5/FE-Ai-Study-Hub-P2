import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MoreVertical, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notificationService";
import type { User } from "@/models/user";
import { ROUTE } from "@/models/routePath";
import type { RootState } from "@/redux/store";
import type {
  NotificationFilterType,
  NotificationResponse,
} from "@/types/notification.type";

const FILTERS: { key: NotificationFilterType; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "UNREAD", label: "Unread" },
  { key: "READ", label: "Read" },
];

function NotificationPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );
  const currentUserId = currentUser?.userId;

  // NOTE UI STATE: Tab đang chọn. ALL không gửi isRead, UNREAD gửi false, READ gửi true.
  const [activeFilter, setActiveFilter] =
    useState<NotificationFilterType>("ALL");
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);

  // NOTE FILTER: Chuyen tab UI thanh query param cho backend.
  const queryParams = {
    isRead:
      activeFilter === "UNREAD"
        ? false
        : activeFilter === "READ"
          ? true
          : undefined,
  };

  // NOTE API: Lay notification cua current user tu backend theo JWT.
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", currentUserId, "page", activeFilter],
    queryFn: () => getMyNotifications({ page: 0, size: 100, ...queryParams }),
    enabled: !!currentUserId,
  });

  // NOTE API COUNT: Lay tat ca notification de tinh so cho tab All/Unread/Read.
  // Danh sach hien thi van dung query phia tren theo filter dang chon.
  const { data: allNotifications = [] } = useQuery({
    queryKey: ["notifications", currentUserId, "counts"],
    queryFn: () => getMyNotifications({ page: 0, size: 1000 }),
    enabled: !!currentUserId,
  });

  // NOTE UI DATA: Tong hop so luong hien trong tab va summary ben phai.
  const summary = useMemo(() => {
    return {
      total: allNotifications.length,
      unread: allNotifications.filter((item) => !item.isRead).length,
      read: allNotifications.filter((item) => item.isRead).length,
    };
  }, [allNotifications]);

  const getFilterCount = (filter: NotificationFilterType) => {
    // NOTE UI DATA: Số cạnh tab luôn lấy từ allNotifications để không bị sai khi đang filter.
    if (filter === "UNREAD") return summary.unread;
    if (filter === "READ") return summary.read;
    return summary.total;
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // NOTE CACHE: Refresh mọi query bắt đầu bằng "notifications" để tab, list, badge cùng cập nhật.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      // NOTE CACHE: Sau khi mark all, unread count trong header/sidebar cũng giảm theo.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success("Notification deleted successfully.");
      // NOTE CACHE: Xóa notification xong cần refresh cả list và summary count.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        allNotifications.map((notification) =>
          deleteNotification(notification.notificationId),
        ),
      );

      return allNotifications.length;
    },
    onSuccess: (deletedCount) => {
      toast.success(`${deletedCount} notifications deleted successfully.`);
      setIsDeleteAllConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Delete all notifications failed.");
    },
  });

  // NOTE ACTION: Click notification se danh dau da doc roi mo trang detail cua notification.
  const handleRead = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.notificationId);
    }

    navigate(
      `/${ROUTE.APP}/${ROUTE.NOTIFICATIONS}/${notification.notificationId}`,
    );
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black text-card-foreground">
            Notifications
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated with important account and document activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-fit rounded-xl"
            disabled={markAllMutation.isPending}
            onClick={() => markAllMutation.mutate()}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Mark all as read
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-fit rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={deleteAllMutation.isPending || summary.total === 0}
            onClick={() => setIsDeleteAllConfirmOpen(true)}
          >
            <Trash2 className="mr-2 size-4" />
            {deleteAllMutation.isPending ? "Deleting..." : "Delete all"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <div className="mb-5 flex w-full overflow-hidden rounded-2xl border border-border bg-card">
            {FILTERS.map((filter) => (
              // NOTE UI: Mỗi tab chỉ đổi activeFilter, React Query sẽ gọi lại API theo queryKey mới.
              <button
                key={filter.key}
                type="button"
                className={`h-12 flex-1 border-r border-border text-sm font-bold transition last:border-r-0 ${
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-accent"
                }`}
                onClick={() => setActiveFilter(filter.key)}
              >
                <span>{filter.label}</span>
                <span
                  className={`ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-black ${
                    activeFilter === filter.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-card-foreground"
                  }`}
                >
                  {getFilterCount(filter.key)}
                </span>
              </button>
            ))}
          </div>

          <Card className="rounded-3xl border border-border bg-card shadow-sm">
            <CardContent className="p-0">
              {isLoading && (
                <div className="p-8 text-muted-foreground">
                  Loading notifications...
                </div>
              )}

              {isError && (
                <div className="p-8 text-destructive">
                  Failed to load notifications.
                </div>
              )}

              {!isLoading && !isError && notifications.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                  No notifications found.
                </div>
              )}

              {notifications.map((notification) => (
                // NOTE ROW: Click vào row sẽ mark read; menu 3 chấm dùng event.stopPropagation để không bị mark read ngoài ý muốn.
                <button
                  key={notification.notificationId}
                  type="button"
                  className="flex w-full items-start gap-4 border-b border-border p-5 text-left transition last:border-b-0 hover:bg-accent"
                  onClick={() => handleRead(notification)}
                >
                  <span
                    className={`mt-2 size-2 shrink-0 rounded-full ${
                      notification.isRead ? "bg-muted" : "bg-primary"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-card-foreground">
                        {notification.title}
                      </h3>
                      <Badge variant="secondary" className="rounded-full">
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span
                        className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-card-foreground"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVertical className="size-4" />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteMutation.mutate(notification.notificationId);
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-black text-card-foreground">
              Notification Summary
            </h2>
            {/* NOTE SUMMARY: Summary dùng allNotifications, nên nó phản ánh tổng dữ liệu hiện tại sau delete/read. */}
            <div className="mt-5 space-y-3">
              <SummaryRow label="Total" value={summary.total} />
              <SummaryRow label="Unread" value={summary.unread} />
              <SummaryRow label="Read" value={summary.read} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isDeleteAllConfirmOpen}
        onOpenChange={setIsDeleteAllConfirmOpen}
      >
        <DialogContent className="overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-2xl shadow-black/20 sm:max-w-[500px]">
          <div className="bg-card px-8 pb-7 pt-8">
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                <Trash2 className="h-6 w-6" />
              </div>

              <DialogTitle className="text-xl font-black text-card-foreground">
                Delete all notifications?
              </DialogTitle>
              <DialogDescription className="max-w-sm text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete all notifications? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-border bg-secondary font-bold text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsDeleteAllConfirmOpen(false)}
                disabled={deleteAllMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="h-12 rounded-2xl bg-destructive font-black text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90"
                onClick={() => deleteAllMutation.mutate()}
                disabled={deleteAllMutation.isPending}
              >
                {deleteAllMutation.isPending ? "Deleting..." : "Delete all"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="font-black text-card-foreground">{value}</span>
    </div>
  );
}

export default NotificationPage;
