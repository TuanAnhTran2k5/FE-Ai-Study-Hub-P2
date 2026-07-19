import { Calendar, Mail, Users, ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AdminUserResponse } from "@/types/adminDashboard.type";

interface UserTableProps {
  users: AdminUserResponse[];
  currentUserId?: number;
  isSystemAdmin: boolean;
  isLoading: boolean;
  onViewDetail: (userId: number) => void;
  onBan: (user: AdminUserResponse) => void;
  onUnban: (user: AdminUserResponse) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function UserTable({
  users,
  currentUserId,
  isSystemAdmin,
  isLoading,
  onViewDetail,
  onBan,
  onUnban,
  page,
  totalPages,
  onPageChange,
}: UserTableProps) {
  const { t } = useTranslation();

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
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">
                    {t("admin.userColName", "User Details")}
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">
                    {t("admin.userColStatus", "Status")}
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80">
                    {t("admin.userColJoined", "Joined Date")}
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-muted-foreground/80 text-right">
                    {t("admin.userColActions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-border/30">
                {users.map((u) => (
                  <tr
                    key={u.userId}
                    className="hover:bg-secondary/5 transition-colors cursor-pointer"
                    onClick={() => onViewDetail(u.userId)}
                  >
                    {/* Name and avatar info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0 overflow-hidden">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-card-foreground truncate leading-snug">
                              {u.fullName}
                            </h4>
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
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 border rounded-full ${getStatusBadge(
                          u.status,
                        )}`}
                      >
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
                            onClick={() => onUnban(u)}
                            className="h-8 rounded-xl font-bold text-xs bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white flex items-center gap-1 px-3.5 cursor-pointer"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            {t("admin.unbanAction", "Unban")}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => onBan(u)}
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
                onClick={() => onPageChange(Math.max(0, page - 1))}
                className="size-8 rounded-xl p-0 bg-secondary/20 hover:bg-secondary/40 text-card-foreground border border-border/40 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                className="size-8 rounded-xl p-0 bg-secondary/20 hover:bg-secondary/40 text-card-foreground border border-border/40 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
