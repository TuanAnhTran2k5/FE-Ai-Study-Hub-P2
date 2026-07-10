import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bell, Award, BookOpen, MessageSquare, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMyNotifications, markNotificationAsRead } from "@/services/notificationService";
import type { NotificationResponse } from "@/types/notification.type";
import { ROUTE } from "@/models/routePath";
import { cn } from "@/lib/utils";
import { getNotificationBadgeStyles } from "@/lib/notificationUtils";

function getRelativeTime(dateString: string, lang: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (lang === "vi") {
    if (diffSec < 60) return "vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    return `${diffDay} ngày trước`;
  } else {
    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  }
}

// Icon mapper helper for notification cases/types
const getNotificationIcon = (type?: string, className = "h-4.5 w-4.5") => {
  const t = type?.toLowerCase() ?? "";
  if (t.includes("badge") || t.includes("reward") || t.includes("rank")) {
    return <Award className={`${className} text-amber-500`} />;
  }
  if (t.includes("document") || t.includes("upload") || t.includes("approve")) {
    return <BookOpen className={`${className} text-teal-600 dark:text-teal-400`} />;
  }
  if (t.includes("comment") || t.includes("feedback") || t.includes("message")) {
    return <MessageSquare className={`${className} text-sky-600 dark:text-sky-400`} />;
  }
  return <Bell className={`${className} text-primary`} />;
};

export default function RecentActivitiesList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNotif, setSelectedNotif] = useState<NotificationResponse | null>(null);

  // Fetch only the first page of notifications for dashboard preview
  const { data: notifications = [], isLoading } = useQuery<NotificationResponse[]>({
    queryKey: ["my-recent-activities"],
    queryFn: () => getMyNotifications({ page: 0, size: 5 }),
    refetchInterval: 30000, // Auto refetch every 30 seconds for live feel
  });

  // Mutation to mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notifId: number) => markNotificationAsRead(notifId),
    onSuccess: () => {
      // Invalidate queries to refresh notification state and counts across sidebar/header
      queryClient.invalidateQueries({ queryKey: ["my-recent-activities"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    }
  });

  const handleOpenNotification = (notif: NotificationResponse) => {
    setSelectedNotif(notif);
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.notificationId);
    }
  };

  const handleNavigateToDocument = (docId: number) => {
    setSelectedNotif(null);
    navigate(`/${ROUTE.APP}/${ROUTE.DOCUMENT_DETAIL.replace(":id", String(docId))}`);
  };

  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card/60 backdrop-blur-md shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="h-4.5 bg-secondary/15 rounded-md w-1/3 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="size-8 rounded-xl bg-secondary/15 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4.5 bg-secondary/15 rounded-md w-3/4" />
                <div className="h-3 bg-secondary/15 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <Card className="rounded-3xl border border-border bg-card/60 backdrop-blur-md shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-primary animate-swing" />
              {t("dashboard.recentActivities", "Recent Activities")}
            </h3>
            {recentNotifications.length > 0 && (
              <span className="text-[10px] font-bold text-muted-foreground">
                {t("dashboard.realtimeUpdates", "Live Updates")}
              </span>
            )}
          </div>

          {recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map((notif) => (
                <div 
                  key={notif.notificationId}
                  onClick={() => handleOpenNotification(notif)}
                  className={`flex gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(3,105,161,0.04)] dark:hover:shadow-[0_4px_16px_rgba(56,189,248,0.05)] hover:-translate-y-0.5 ${
                    notif.isRead 
                      ? "bg-slate-50/50 dark:bg-slate-900/10 border-slate-100/80 dark:border-slate-800/30 hover:bg-slate-100/40 dark:hover:bg-slate-900/30 hover:border-slate-200/80 dark:hover:border-slate-700/40" 
                      : "bg-sky-50/60 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40 hover:bg-sky-100/50 dark:hover:bg-sky-950/40 hover:border-sky-200 dark:hover:border-sky-800/60"
                  }`}
                >
                  {/* Notification Icon */}
                  <div className={`flex size-9 items-center justify-center rounded-xl shrink-0 border transition-colors ${
                    notif.isRead 
                      ? "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400" 
                      : "bg-sky-100/80 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400"
                  }`}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  {/* Notification text details */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs truncate ${notif.isRead ? "font-bold text-slate-700 dark:text-slate-300" : "font-extrabold text-sky-950 dark:text-sky-100"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">
                        {getRelativeTime(notif.createdAt, i18n.language)}
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-2 leading-relaxed ${notif.isRead ? "text-slate-500/90 dark:text-slate-400/90" : "text-sky-900/80 dark:text-sky-200/80 font-medium"}`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Pulsing circle indicating unread status */}
                  {!notif.isRead && (
                    <div className="flex items-center shrink-0">
                      <span className="size-2 rounded-full bg-sky-500 dark:bg-primary animate-pulse shadow-[0_0_8px_rgba(3,105,161,0.5)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-border/60 rounded-2xl bg-secondary/5">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-40 mb-2" />
              <p className="text-xs text-muted-foreground font-medium">
                {t("dashboard.noRecentActivities", "No recent activities or notifications")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DETAILED NOTIFICATION DIALOG - Click to View Details */}
      <Dialog open={!!selectedNotif} onOpenChange={(open) => !open && setSelectedNotif(null)}>
        <DialogContent className="rounded-3xl border border-border bg-card/98 backdrop-blur-xl w-[92vw] max-w-lg p-6 shadow-2xl overflow-hidden">
          {selectedNotif && (
            <>
              <DialogHeader className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
                    {getNotificationIcon(selectedNotif.type, "h-5.5 w-5.5")}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className={cn("text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border", getNotificationBadgeStyles(selectedNotif.type))}>
                      {selectedNotif.type || "Notification"}
                    </span>
                    <DialogTitle className="text-sm font-black text-card-foreground mt-1 text-left leading-snug">
                      {selectedNotif.title}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              {/* Message Details */}
              <div className="py-4 space-y-4 text-left border-y border-border/50 my-2">
                <p className="text-xs text-card-foreground/90 leading-relaxed font-semibold">
                  {selectedNotif.message}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(selectedNotif.createdAt).toLocaleString(i18n.language === "vi" ? "vi-VN" : "en-US")}
                  </span>
                  <span className="mx-1">•</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    {t("dashboard.notifRead", "Read")}
                  </span>
                </div>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedNotif.documentId && (
                  <Button 
                    onClick={() => handleNavigateToDocument(selectedNotif.documentId!)}
                    className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-hover flex items-center gap-1.5 rounded-2xl"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("dashboard.viewRelatedDocument", "View Document")}
                  </Button>
                )}
                <Button 
                  variant="secondary" 
                  onClick={() => setSelectedNotif(null)}
                  className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl"
                >
                  {t("common.close", "Close")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
