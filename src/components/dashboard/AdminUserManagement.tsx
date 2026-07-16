import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, UserX, UserCheck, Calendar, Mail, ShieldAlert, Users, ChevronLeft, ChevronRight, Ban, FileText, Download, Award, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { getUsersForAdmin, banUser, unbanUser, getUserDetailForAdmin, updateUserRole } from "@/services/adminDashboardService";
import type { AdminUserResponse } from "@/types/adminDashboard.type";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { User as AuthUser } from "@/models/user";


export default function AdminUserManagement({ currentUserId }: { currentUserId?: number }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Lấy thông tin user hiện tại từ Redux để kiểm tra phân quyền System Admin
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

  // Fetch detailed user profile when clicking
  const { data: userDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-user-detail", detailUserId],
    queryFn: () => getUserDetailForAdmin(detailUserId!),
    enabled: !!detailUserId,
  });

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalAccounts = data?.totalElements ?? 0; // Tự động lấy tổng số lượng theo bộ lọc/tìm kiếm hiện tại

  // Ban user mutation
  const banMutation = useMutation({
    mutationFn: () => banUser(targetUser!.userId, banReason),
    onSuccess: () => {
      toast.success(t("admin.banSuccess", "User banned successfully"));
      handleCloseActionDialog();
      // If the banned user is currently opened in detail, reload it too
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
    <div className="space-y-6">
      {/* FILTER PANEL */}
      <Card className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card shadow-sm">
        <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center w-full justify-between">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("admin.searchUsersPlaceholder", "Search by name or email...")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0); // reset page to first
              }}
              className="pl-10 h-10 rounded-2xl bg-secondary/15 hover:bg-secondary/25 dark:bg-background border border-slate-300 dark:border-border text-xs font-bold text-card-foreground focus:bg-background focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-muted-foreground/60 shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Status Select Box */}
            <Select
              value={status || "ALL"}
              onValueChange={(val) => {
                setStatus(val === "ALL" ? "" : val);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-10 w-full md:w-[180px] rounded-2xl border border-slate-300 dark:border-border bg-background text-xs font-bold text-card-foreground cursor-pointer focus:ring-0 focus:ring-offset-0 focus:border-primary">
                <SelectValue placeholder={t("admin.filterAll", "All Statuses")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-300 dark:border-border bg-popover text-popover-foreground shadow-lg z-50">
                <SelectItem value="ALL" className="text-xs font-bold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                    <span>{t("admin.filterAll", "All Statuses")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="ACTIVE" className="text-xs font-bold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
                    <span>{t("admin.filterActive", "Active")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="BANNED" className="text-xs font-bold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                    <span>{t("admin.filterBanned", "Banned")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="PENDING" className="text-xs font-bold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                    <span>{t("admin.filterPending", "Pending")}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Total Accounts Badge */}
            <div className="flex items-center gap-2 px-4 h-10 rounded-2xl border border-slate-300 dark:border-border bg-secondary/15 dark:bg-secondary/10 shrink-0 text-xs font-bold text-card-foreground shadow-sm select-none">
              <Users className="h-4 w-4 text-primary" />
              <span>{t("admin.totalAccountsLabel", "Total:")} <span className="text-primary font-black">{totalAccounts}</span></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* USER LIST BOARD */}
      <Card className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card shadow-sm overflow-hidden">
        <CardContent className="p-0">
          
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center animate-pulse">
                  <div className="size-10 rounded-full bg-secondary/15 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4.5 bg-secondary/15 rounded-md w-1/4" />
                    <div className="h-3 bg-secondary/15 rounded-md w-1/3" />
                  </div>
                  <div className="h-8 bg-secondary/15 rounded-md w-20" />
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-border/40 bg-secondary/10">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">{t("admin.userColName", "User Details")}</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">{t("admin.userColStatus", "Status")}</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">{t("admin.userColJoined", "Joined Date")}</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80 text-right">{t("admin.userColActions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-border/30">
                  {users.map((u) => (
                    <tr 
                      key={u.userId} 
                      className="hover:bg-secondary/5 transition-colors cursor-pointer"
                      onClick={() => setDetailUserId(u.userId)}
                    >
                      
                      {/* Name and avatar info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0 overflow-hidden">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.fullName} className="h-full w-full object-cover" />
                            ) : (
                              <Users className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-card-foreground truncate leading-snug">{u.fullName}</h4>
                              {u.userId === currentUserId && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/15">
                                  {t("admin.youBadge", "You")}
                                </span>
                              )}
                              {u.role === "AD" && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/15">
                                  ADMIN
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-slate-500 dark:text-muted-foreground/80 font-semibold flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User status badge */}
                      <td className="p-4">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 border rounded-full ${getStatusBadge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="p-4">
                        <span className="text-[10px] text-slate-500 dark:text-muted-foreground/80 font-semibold flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Moderate action buttons */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {u.userId === currentUserId ? (
                            <span className="text-[10px] text-muted-foreground italic font-semibold pr-3 select-none">
                              {t("admin.currentUserLabel", "Current Session")}
                            </span>
                          ) : u.role === "AD" && !isSystemAdmin ? (
                            <span className="text-[10px] text-muted-foreground italic font-semibold pr-3 select-none">
                              {t("admin.adminAccountLabel", "Admin Account")}
                            </span>
                          ) : u.status === "BANNED" ? (
                            <Button
                              onClick={() => handleOpenAction(u, "UNBAN")}
                              className="h-8 rounded-xl font-bold text-xs bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white flex items-center gap-1 px-3.5 cursor-pointer"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              {t("admin.unbanAction", "Unban")}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleOpenAction(u, "BAN")}
                              className="h-8 rounded-xl font-bold text-xs bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-1 px-3.5 cursor-pointer"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              {t("admin.banAction", "Ban")}
                            </Button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto h-9 w-9 text-muted-foreground opacity-40 mb-2.5" />
              <p className="text-xs text-muted-foreground font-bold">
                {t("admin.noUsersFound", "No users matched the criteria.")}
              </p>
            </div>
          )}

          {/* TABLE PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
              <span className="text-[10px] font-bold text-slate-500 dark:text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="size-8 rounded-xl p-0 bg-secondary/20 hover:bg-secondary/40 text-card-foreground border border-border/40 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="size-8 rounded-xl p-0 bg-secondary/20 hover:bg-secondary/40 text-card-foreground border border-border/40 flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* USER DETAIL DIALOG - Opens when click on user row */}
      <Dialog open={!!detailUserId} onOpenChange={(open) => !open && setDetailUserId(null)}>
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
                {/* Chỉ cho phép Ban/Unban tài khoản Admin khác nếu người đang thao tác là System Admin */}
                {!(userDetail.role === "AD" && !isSystemAdmin) && (
                  <>
                    {userDetail.status === "BANNED" ? (
                      <Button
                        onClick={() => handleOpenAction(userDetail, "UNBAN")}
                        disabled={unbanMutation.isPending}
                        className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        {t("admin.unbanAction", "Unban Account")}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenAction(userDetail, "BAN")}
                        disabled={banMutation.isPending}
                        className="w-full sm:w-auto font-black text-xs px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
                      >
                        <UserX className="h-3.5 w-3.5" />
                        {t("admin.banAction", "Ban Account")}
                      </Button>
                    )}
                  </>
                )}

                {/* Nút Đổi Vai Trò (Promote/Demote) - Chỉ hiển thị cho System Admin */}
                {isSystemAdmin && (
                  <Button
                    onClick={() => {
                      setRoleTargetUser(userDetail);
                      setNewRole(userDetail.role === "AD" ? "US" : "AD");
                    }}
                    disabled={updateRoleMutation.isPending}
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
              onClick={() => setDetailUserId(null)}
              className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer ml-auto"
            >
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

