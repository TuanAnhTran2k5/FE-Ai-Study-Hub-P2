import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Ban, UserCheck, Shield, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { ERROR_CODE } from "@/constants/errorCode";
import { getUsersForAdmin, banUser, unbanUser, updateUserRole } from "@/services/adminDashboardService";
import type { AdminUserResponse } from "@/types/adminDashboard.type";
import type { RootState } from "@/redux/store";
import type { User as AuthUser } from "@/models/user";

// Import extracted sub-components
import { UserFilter } from "./UserFilter";
import { UserTable } from "./UserTable";
import { UserDetailDialog } from "./UserDetailDialog";

export default function AdminUserManagement({ currentUserId }: { currentUserId?: number }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const currentUser = useSelector(
    (state: RootState) => state.user as AuthUser | null
  );
  const isSystemAdmin =
    currentUser?.email?.toLowerCase() ===
    import.meta.env.VITE_SYSTEM_ADMIN_EMAIL?.toLowerCase();

  // Search, filter & page states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "" means ALL
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // User detail states
  const [detailUserId, setDetailUserId] = useState<number | null>(null);

  // Ban/Unban action states
  const [targetUser, setTargetUser] = useState<AdminUserResponse | null>(null);
  const [banReason, setBanReason] = useState("");
  const [actionType, setActionType] = useState<"BAN" | "UNBAN" | null>(null);

  // Role change action states
  const [roleTargetUser, setRoleTargetUser] = useState<AdminUserResponse | null>(null);
  const [newRole, setNewRole] = useState<"US" | "AD" | null>(null);

  // Fetch users list
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users-list", search, status, page, size],
    queryFn: () => getUsersForAdmin({ search: search || undefined, status: status || undefined, page, size }),
  });

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalAccounts = data?.totalElements ?? 0;

  // Ban user mutation
  const banMutation = useMutation({
    mutationFn: () => banUser(targetUser!.userId, banReason),
    onSuccess: () => {
      toast.success(t("admin.banSuccess", "User banned successfully"));
      handleCloseActionDialog();
      if (detailUserId === targetUser?.userId) {
        queryClient.invalidateQueries({ queryKey: ["admin-user-detail", detailUserId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-moderation-summary"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t("admin.banFailed", "Failed to ban user"));
    }
  });

  // Unban user mutation
  const unbanMutation = useMutation({
    mutationFn: () => unbanUser(targetUser!.userId),
    onSuccess: () => {
      toast.success(t("admin.unbanSuccess", "User account active again"));
      handleCloseActionDialog();
      if (detailUserId === targetUser?.userId) {
        queryClient.invalidateQueries({ queryKey: ["admin-user-detail", detailUserId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-moderation-summary"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t("admin.unbanFailed", "Failed to unban user"));
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: () => updateUserRole(roleTargetUser!.userId, newRole!),
    onSuccess: () => {
      toast.success(t("admin.changeRoleSuccess", "User role updated successfully"));
      setRoleTargetUser(null);
      setNewRole(null);
      if (detailUserId === roleTargetUser?.userId) {
        queryClient.invalidateQueries({ queryKey: ["admin-user-detail", detailUserId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-moderation-summary"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t("admin.changeRoleFailed", "Failed to update user role"));
    }
  });

  const handleOpenAction = (user: AdminUserResponse, type: "BAN" | "UNBAN") => {
    setTargetUser(user);
    setActionType(type);
    setBanReason("");
  };

  const handleCloseActionDialog = () => {
    setTargetUser(null);
    setActionType(null);
    setBanReason("");
  };

  const handleConfirmAction = () => {
    if (!targetUser) return;
    if (actionType === "BAN") {
      if (!banReason.trim()) {
        toast.error(t("admin.pleaseProvideReason", "Please provide a reason for banning."));
        return;
      }
      banMutation.mutate();
    } else if (actionType === "UNBAN") {
      unbanMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTER PANEL */}
      <UserFilter
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(0);
        }}
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setPage(0);
        }}
        totalAccounts={totalAccounts}
      />

      {/* USER LIST BOARD */}
      <UserTable
        users={users}
        currentUserId={currentUserId}
        isSystemAdmin={isSystemAdmin}
        isLoading={isLoading}
        onViewDetail={setDetailUserId}
        onBan={(u) => handleOpenAction(u, "BAN")}
        onUnban={(u) => handleOpenAction(u, "UNBAN")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* USER DETAIL DIALOG */}
      <UserDetailDialog
        detailUserId={detailUserId}
        onClose={() => setDetailUserId(null)}
        currentUserId={currentUserId}
        isSystemAdmin={isSystemAdmin}
        onBan={(u) => handleOpenAction(u, "BAN")}
        onUnban={(u) => handleOpenAction(u, "UNBAN")}
        onChangeRole={(u, role) => {
          setRoleTargetUser(u);
          setNewRole(role);
        }}
        isBanPending={banMutation.isPending}
        isUnbanPending={unbanMutation.isPending}
        isRolePending={updateRoleMutation.isPending}
      />

      {/* CONFIRMATION DIALOG FOR BAN / UNBAN */}
      <Dialog open={!!targetUser} onOpenChange={(open) => !open && handleCloseActionDialog()}>
        <DialogContent className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden text-left z-[60]">
          {targetUser && actionType && (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`flex size-11 items-center justify-center rounded-2xl shrink-0 border ${
                    actionType === "BAN" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-teal-500/10 border-teal-500/20 text-teal-500"
                  }`}>
                    {actionType === "BAN" ? <Ban className="h-5.5 w-5.5" /> : <UserCheck className="h-5.5 w-5.5" />}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 dark:text-muted-foreground">
                      {actionType === "BAN" ? t("admin.banAction", "Ban Account") : t("admin.unbanAction", "Unban Account")}
                    </span>
                    <DialogTitle className="text-sm font-black text-card-foreground mt-0.5 truncate max-w-xs">
                      {targetUser.fullName}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4 my-2">
                <p className="text-xs text-slate-600 dark:text-muted-foreground/90 font-semibold leading-relaxed">
                  {actionType === "BAN" 
                    ? t("admin.banConfirmPrompt", "Are you sure you want to suspend this user? They will not be able to log in, upload documents, or chat with AI.") 
                    : t("admin.unbanConfirmPrompt", "Are you sure you want to reactivate this student's account? They will regain full access to all features.")}
                </p>

                {actionType === "BAN" && (
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-muted-foreground flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                      {t("admin.banReason", "Reason for suspension")}
                    </label>
                    <Textarea
                      placeholder={t("admin.banReasonPlaceholder", "Enter explicit reason (e.g. uploaded malicious files, spamming RAG chat...)")}
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="min-h-[85px] max-h-[140px] rounded-2xl border border-slate-300 dark:border-border bg-background text-xs font-bold p-3 text-card-foreground focus:border-primary placeholder:text-slate-400 dark:placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleConfirmAction}
                  disabled={banMutation.isPending || unbanMutation.isPending}
                  className={`w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl text-white ${
                    actionType === "BAN" ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {actionType === "BAN" ? t("admin.confirmBan", "Confirm Ban") : t("admin.confirmUnban", "Confirm Unban")}
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={handleCloseActionDialog}
                  disabled={banMutation.isPending || unbanMutation.isPending}
                  className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl"
                >
                  {t("common.cancel", "Cancel")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION DIALOG FOR ROLE CHANGE */}
      <Dialog open={!!roleTargetUser} onOpenChange={(open) => !open && setRoleTargetUser(null)}>
        <DialogContent className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden text-left z-[60]">
          {roleTargetUser && newRole && (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl shrink-0 border bg-indigo-500/10 border-indigo-500/20 text-indigo-500">
                    <Shield className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 dark:text-muted-foreground">
                      {t("admin.changeRoleTitle", "Change User Role")}
                    </span>
                    <DialogTitle className="text-sm font-black text-card-foreground mt-0.5 truncate max-w-xs">
                      {roleTargetUser.fullName}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 my-2">
                <p className="text-xs text-slate-600 dark:text-muted-foreground/90 font-semibold leading-relaxed">
                  {t("admin.changeRoleConfirmPrompt", {
                    from: roleTargetUser.role === "AD" ? "ADMIN" : "USER",
                    to: newRole === "AD" ? "ADMIN" : "USER"
                  })}
                </p>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => updateRoleMutation.mutate()}
                  disabled={updateRoleMutation.isPending}
                  className="w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                >
                  {t("admin.confirmChangeRole", "Confirm Change")}
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setRoleTargetUser(null);
                    setNewRole(null);
                  }}
                  disabled={updateRoleMutation.isPending}
                  className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer"
                >
                  {t("common.cancel", "Cancel")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
