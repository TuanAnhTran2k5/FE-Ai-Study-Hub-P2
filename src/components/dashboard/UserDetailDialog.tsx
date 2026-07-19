import { Calendar, Mail, Users, ShieldAlert, Award, FileText, Download, Shield, UserCheck, UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUserDetailForAdmin } from "@/services/adminDashboardService";
import type { AdminUserResponse } from "@/types/adminDashboard.type";

interface UserDetailDialogProps {
  detailUserId: number | null;
  onClose: () => void;
  currentUserId?: number;
  isSystemAdmin: boolean;
  onBan: (user: AdminUserResponse) => void;
  onUnban: (user: AdminUserResponse) => void;
  onChangeRole: (user: AdminUserResponse, newRole: "US" | "AD") => void;
  isBanPending: boolean;
  isUnbanPending: boolean;
  isRolePending: boolean;
}

export function UserDetailDialog({
  detailUserId,
  onClose,
  currentUserId,
  isSystemAdmin,
  onBan,
  onUnban,
  onChangeRole,
  isBanPending,
  isUnbanPending,
  isRolePending,
}: UserDetailDialogProps) {
  const { t } = useTranslation();

  // Fetch detailed user profile when detailUserId is valid
  const { data: userDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-user-detail", detailUserId],
    queryFn: () => getUserDetailForAdmin(detailUserId!),
    enabled: !!detailUserId,
  });

  const getStatusBadge = (userStatus: string) => {
    if (userStatus === "BANNED") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }
    if (userStatus === "PENDING") {
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
    return "bg-teal-500/10 text-teal-500 border-teal-500/20";
  };

  return (
    <Dialog open={!!detailUserId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl border border-slate-400 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-lg p-6 shadow-2xl overflow-hidden flex flex-col text-left max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 shrink-0 overflow-hidden shadow-inner">
              {userDetail?.avatarUrl ? (
                <img src={userDetail.avatarUrl} alt={userDetail.fullName} className="h-full w-full object-cover" />
              ) : (
                <Users className="h-7 w-7 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 dark:text-muted-foreground/80 block">
                {t("admin.userDetailTitle", "Student Profile")}
              </span>

              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <DialogTitle className="text-base font-black text-slate-900 dark:text-card-foreground">
                  {userDetail?.fullName || "Loading..."}
                </DialogTitle>

                {userDetail?.userId === currentUserId && (
                  <span className="text-[8px] font-black uppercase tracking-wider text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/15">
                    {t("admin.youBadge", "You")}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-700 dark:text-muted-foreground/80 font-bold flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 text-slate-500 dark:text-muted-foreground/75" />
                {userDetail?.email}
              </p>
            </div>
          </div>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="py-12 space-y-4 animate-pulse">
            <div className="h-5 bg-secondary/15 rounded-md w-3/4" />
            <div className="h-4.5 bg-secondary/15 rounded-md w-1/2" />
            <div className="h-10 bg-secondary/15 rounded-md w-full" />
          </div>
        ) : userDetail ? (
          <div className="flex-1 overflow-y-auto py-5 space-y-5 my-1 pr-1 custom-scrollbar">
            {/* Badges section */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-primary/20 bg-primary/5 rounded-md text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {t("admin.userRole", "Role")}: {userDetail.role}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 border rounded-full ${getStatusBadge(userDetail.status)}`}>
                {userDetail.status}
              </span>
            </div>

            {/* STATS HIGHLIGHT */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary/5 dark:bg-secondary/10 border border-slate-300 dark:border-border/30 text-center space-y-1">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-500 mx-auto" />
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase block">
                  {t("admin.userScore", "Total XP")}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-card-foreground">
                  {userDetail.totalScore?.toLocaleString() ?? 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/5 dark:bg-secondary/10 border border-slate-300 dark:border-border/30 text-center space-y-1">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-500 mx-auto" />
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase block">
                  {t("admin.userDocs", "Uploaded")}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-card-foreground">
                  {userDetail.activeDocumentCount?.toLocaleString() ?? 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/5 dark:bg-secondary/10 border border-slate-300 dark:border-border/30 text-center space-y-1">
                <Download className="h-5 w-5 text-teal-600 dark:text-teal-500 mx-auto" />
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase block">
                  {t("admin.userDownloads", "Downloads")}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-card-foreground">
                  {userDetail.documentDownloadsReceived?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>

            {/* BANNED DETAILS BLOCK (ONLY SHOW IF BANNED) */}
            {userDetail.status === "BANNED" && (
              <div className="p-4 bg-red-500/5 border border-red-500/25 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  {t("admin.banDetails", "Suspension Details")}
                </h4>

                <div className="space-y-2 text-xs font-semibold text-card-foreground/90">
                  <div className="flex justify-between border-b border-red-500/10 pb-1.5 flex-wrap gap-1">
                    <span className="text-slate-500 dark:text-muted-foreground/80">{t("admin.bannedBy", "Suspended by")}:</span>
                    <span className="font-bold">{userDetail.bannedByName || "System"}</span>
                  </div>
                  <div className="flex justify-between border-b border-red-500/10 pb-1.5 flex-wrap gap-1">
                    <span className="text-slate-500 dark:text-muted-foreground/80">{t("admin.bannedDate", "Suspended on")}:</span>
                    <span className="font-bold">
                      {userDetail.bannedAt ? new Date(userDetail.bannedAt).toLocaleString() : "-"}
                    </span>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-slate-500 dark:text-muted-foreground/80 block">{t("admin.banReasonLabel", "Reason for Ban")}:</span>
                    <p className="p-2.5 bg-background border border-border/45 rounded-xl text-xs font-bold leading-relaxed text-red-500 dark:text-red-400">
                      {userDetail.banReason || "No reason specified."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Created Time footer inside details */}
            <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500 dark:text-muted-foreground/75" />
              {t("admin.userColJoined", "Joined Date")}: {new Date(userDetail.createdAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-6 text-center">Failed to load profile details.</p>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-border/40">
          {userDetail && userDetail.userId !== currentUserId && (
            <>
              {/* Only allow Ban/Unban Admin account if performing user is System Admin */}
              {!(userDetail.role === "AD" && !isSystemAdmin) && (
                <>
                  {userDetail.status === "BANNED" ? (
                    <Button
                      onClick={() => onUnban(userDetail)}
                      disabled={isUnbanPending}
                      className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      {t("admin.unbanAction", "Unban Account")}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onBan(userDetail)}
                      disabled={isBanPending}
                      className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      {t("admin.banAction", "Ban Account")}
                    </Button>
                  )}
                </>
              )}

              {/* Role Change button - only for System Admin */}
              {isSystemAdmin && (
                <Button
                  onClick={() => onChangeRole(userDetail, userDetail.role === "AD" ? "US" : "AD")}
                  disabled={isRolePending}
                  className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-700 hover:text-white border border-indigo-600/25 text-white flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
                >
                  <Shield className="h-3.5 w-3.5" />
                  {t("admin.changeRoleAction", "Change Role")}
                </Button>
              )}
            </>
          )}

          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer ml-auto"
          >
            {t("common.close", "Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
