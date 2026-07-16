import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Eye, ShieldCheck, Trash2, Calendar, MessageSquare, ShieldAlert, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { getPendingReportCases, getReportsByCase, resolveReportCase, getHistoryReportCases, refundAppealCase } from "@/services/adminReportService";
import type { ReportCaseAdminResponse, ReportDetailResponse, AdminDecision } from "@/types/adminReport.type";
import type { UserResponse } from "@/types/user.type";

interface AdminReportListProps {
  currentUser: UserResponse;
}

export default function AdminReportList({ currentUser }: AdminReportListProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCase, setSelectedCase] = useState<ReportCaseAdminResponse | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [decision, setDecision] = useState<AdminDecision>("REJECT_REPORT");

  const [subTab, setSubTab] = useState<"PENDING" | "HISTORY">("PENDING");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundNote, setRefundNote] = useState("");
  const [selectedRefundCaseId, setSelectedRefundCaseId] = useState<number | null>(null);

  // Fetch pending report cases
  const { data: pendingCases = [], isLoading: isLoadingPending } = useQuery<ReportCaseAdminResponse[]>({
    queryKey: ["admin-pending-reports"],
    queryFn: getPendingReportCases,
    enabled: subTab === "PENDING",
  });

  // Fetch history report cases
  const { data: historyCases = [], isLoading: isLoadingHistory } = useQuery<ReportCaseAdminResponse[]>({
    queryKey: ["admin-history-reports"],
    queryFn: getHistoryReportCases,
    enabled: subTab === "HISTORY",
  });

  const reportCases = subTab === "PENDING" ? pendingCases : historyCases;
  const isLoading = subTab === "PENDING" ? isLoadingPending : isLoadingHistory;

  // Fetch details (reporters and comments) for the active dialog case
  const { data: caseReports = [], isLoading: isLoadingDetails } = useQuery<ReportDetailResponse[]>({
    queryKey: ["report-case-details", selectedCase?.caseId],
    queryFn: () => getReportsByCase(selectedCase!.caseId),
    enabled: !!selectedCase,
  });

  // Resolve case mutation
  const resolveMutation = useMutation({
    mutationFn: (data: { caseId: number; decision: AdminDecision; note: string }) =>
      resolveReportCase(data.caseId, {
        adminId: currentUser.userId,
        decision: data.decision,
        note: data.note,
      }),
    onSuccess: () => {
      toast.success(t("admin.resolveSuccess", "Report resolved successfully!"));
      setSelectedCase(null);
      setAdminNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-reports"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-moderation-summary"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t("admin.resolveFailed", "Failed to resolve report case"));
    },
  });

  const refundMutation = useMutation({
    mutationFn: (data: { caseId: number; note: string }) =>
      refundAppealCase(data.caseId, currentUser.userId, data.note),
    onSuccess: () => {
      toast.success(t("admin.refundSuccess", "Kháng nghị thành công! Tài liệu đã mở khóa, gỡ ban và hoàn lại điểm phạt."));
      setShowRefundModal(false);
      setRefundNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-history-reports"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-moderation-summary"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t("admin.refundFailed", "Không thể thực hiện hoàn trả điểm phạt"));
    }
  });

  const handleResolve = () => {
    if (!selectedCase) return;
    resolveMutation.mutate({
      caseId: selectedCase.caseId,
      decision,
      note: adminNote,
    });
  };

  const handleConfirmRefund = () => {
    if (selectedRefundCaseId === null || !refundNote.trim()) return;
    refundMutation.mutate({ caseId: selectedRefundCaseId, note: refundNote });
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 3) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (level === 2) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-sky-500/10 text-sky-500 border-sky-500/20";
  };

  return (
    <>
      <Card className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border/50 pb-4">
            <div className="flex gap-2 p-1 bg-secondary/15 rounded-xl border border-border/40 w-fit">
              <Button
                variant={subTab === "PENDING" ? "default" : "ghost"}
                onClick={() => setSubTab("PENDING")}
                className="h-8 rounded-lg text-[11px] font-black uppercase px-3 cursor-pointer"
              >
                {t("admin.pendingQueue", "Pending Queue")}
              </Button>
              <Button
                variant={subTab === "HISTORY" ? "default" : "ghost"}
                onClick={() => setSubTab("HISTORY")}
                className="h-8 rounded-lg text-[11px] font-black uppercase px-3 cursor-pointer"
              >
                {t("admin.historyQueue", "History Queue")}
              </Button>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 self-start sm:self-auto">
              {reportCases.length} {t("admin.cases", "Cases")}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center animate-pulse">
                  <div className="size-10 rounded-2xl bg-secondary/15 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4.5 bg-secondary/15 rounded-md w-2/3" />
                    <div className="h-3 bg-secondary/15 rounded-md w-1/3" />
                  </div>
                  <div className="h-8 bg-secondary/15 rounded-md w-16" />
                </div>
              ))}
            </div>
          ) : reportCases.length > 0 ? (
            <div className="space-y-3">
              {reportCases.map((rc) => (
                <div 
                  key={rc.caseId}
                  onClick={() => subTab === "PENDING" && setSelectedCase(rc)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-secondary/5 hover:border-border transition-all duration-300 hover:shadow-sm ${subTab === "PENDING" ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${getLevelBadgeColor(rc.caseLevel)}`}>
                        Level {rc.caseLevel}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 border border-purple-500/15 rounded-md">
                        {rc.reasonName}
                      </span>
                      {subTab === "HISTORY" && (
                        rc.caseStatus === "REJECTED" ? (
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-500/10 px-2 py-0.5 border border-slate-500/15 rounded-md">
                            {t("admin.statusRejected", "REJECTED")}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider text-teal-500 bg-teal-500/10 px-2 py-0.5 border border-teal-500/15 rounded-md">
                            {t("admin.statusResolved", "RESOLVED")}
                          </span>
                        )
                      )}
                      <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(rc.openedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-card-foreground truncate max-w-md">
                      {rc.documentTitle}
                    </h4>

                    {subTab === "PENDING" ? (
                      <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {rc.reportCount} / {rc.requiredThreshold} {t("admin.reportCountHint", "Reports received")}
                      </p>
                    ) : (
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-muted-foreground font-semibold">
                          {t("admin.resolvedBy", "Resolved by")}: <strong className="text-card-foreground">{rc.resolvedByName || "System"}</strong> {rc.resolvedByEmail && `(${rc.resolvedByEmail})`}
                        </p>
                        {rc.adminNote && (
                          <p className="text-[9px] text-amber-600 dark:text-amber-500 font-semibold truncate max-w-md">
                            {t("admin.adminNotePrefix", "Note")}: {rc.adminNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {subTab === "PENDING" ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCase(rc);
                      }}
                      className="h-8 rounded-xl font-bold text-xs bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("admin.reviewCase", "Review")}
                    </Button>
                  ) : (
                    rc.caseStatus === "RESOLVED" ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRefundCaseId(rc.caseId);
                          setShowRefundModal(true);
                        }}
                        className="h-8 rounded-xl font-black text-xs bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        {t("admin.refundAppealAction", "Hoàn điểm phạt")}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="h-8 rounded-xl font-bold text-xs bg-secondary text-muted-foreground/60 border border-border flex items-center gap-1.5 shrink-0 select-none opacity-60"
                      >
                        {t("admin.refundAppealDone", "Đã gỡ khóa / Hoàn điểm")}
                      </Button>
                    )
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-border/50 rounded-2xl bg-secondary/5">
              <ShieldCheck className="mx-auto h-9 w-9 text-teal-500 opacity-60 mb-2.5" />
              <p className="text-xs text-muted-foreground font-bold">
                {t("admin.noPendingReports", "Clean Inbox! No pending reports to review.")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RESOLVE CASE DIALOG */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-2xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {selectedCase && (
            <>
              <DialogHeader className="space-y-3 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shrink-0">
                    <ShieldAlert className="h-5.5 w-5.5 text-red-500" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[9px] uppercase font-black tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15">
                      Case #{selectedCase.caseId} • {selectedCase.reasonName}
                    </span>
                    <DialogTitle className="text-sm font-black text-card-foreground mt-1 text-left leading-snug truncate max-w-lg">
                      {selectedCase.documentTitle}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              {/* View Reports Details & Evidence */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2 pr-1 min-h-[150px] max-h-[350px]">
                <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                  {t("admin.reportersEvidence", "Reporters & Evidence")} ({caseReports.length})
                </h4>

                {isLoadingDetails ? (
                  <div className="space-y-3">
                    <div className="h-4.5 bg-secondary/15 rounded-md w-full animate-pulse" />
                    <div className="h-4.5 bg-secondary/15 rounded-md w-3/4 animate-pulse" />
                  </div>
                ) : caseReports.length > 0 ? (
                  <div className="space-y-3">
                    {caseReports.map((report) => (
                      <div 
                        key={report.reportId}
                        className="p-3.5 bg-secondary/10 border border-border/40 rounded-2xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                          <span>{report.reporterName}</span>
                          <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-semibold text-card-foreground/90 leading-relaxed">
                          {report.description || t("admin.noDescription", "No description provided")}
                        </p>
                        {report.evidenceUrl && (
                          <a 
                            href={report.evidenceUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold"
                          >
                            Evidence Link
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {t("admin.noReportDetails", "No detailed report tickets found.")}
                  </p>
                )}
              </div>

              {/* ADMIN ACTION PANEL - Form to Resolve */}
              <div className="space-y-4 pt-3 border-t border-border/40">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t("admin.selectDecision", "Select Administrative Decision")}
                  </label>
                  
                  {/* Select box styled in glassmorphism */}
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as AdminDecision)}
                    className="w-full h-10 px-3.5 rounded-2xl border border-border bg-background text-xs font-bold text-card-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="REJECT_REPORT">
                      🟢 {t("admin.decisionReject", "Bác bỏ báo cáo (Giữ lại tài liệu)")}
                    </option>
                    <option value="REMOVE_DOCUMENT">
                      🔴 {t("admin.decisionRemove", "Đồng ý báo cáo (Gỡ bỏ tài liệu)")}
                    </option>
                    <option value="WARNING_1">
                      🟡 {t("admin.decisionWarning1", "Cảnh cáo tác giả cấp 1 (Warning 1)")}
                    </option>
                    <option value="WARNING_2">
                      🟠 {t("admin.decisionWarning2", "Cảnh cáo tác giả cấp 2 (Warning 2)")}
                    </option>
                  </select>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t("admin.decisionNote", "Administrative Note")}
                  </label>
                  <Textarea
                    placeholder={t("admin.notePlaceholder", "Enter reason, context, or feedback for this decision...")}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="min-h-[70px] max-h-[120px] rounded-2xl border border-border bg-background text-xs font-bold p-3 text-card-foreground focus:border-primary placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  onClick={handleResolve}
                  disabled={resolveMutation.isPending}
                  className={`w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl ${
                    decision === "REMOVE_DOCUMENT" 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : decision.includes("WARNING") 
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  {decision === "REMOVE_DOCUMENT" ? (
                    <Trash2 className="h-3.5 w-3.5" />
                  ) : decision.includes("WARNING") ? (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {t("admin.submitDecision", "Submit Decision")}
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={() => setSelectedCase(null)}
                  disabled={resolveMutation.isPending}
                  className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl"
                >
                  {t("common.close", "Close")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* APPEAL REFUND DIALOG */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card/98 backdrop-blur-xl w-[92vw] max-w-md p-6 shadow-2xl overflow-hidden flex flex-col text-left z-50">
          <DialogHeader className="space-y-3 pb-3 border-b border-border/40 text-left">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 shrink-0">
                <RotateCcw className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[9px] uppercase font-black tracking-wider text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/15">
                  Kháng nghị #{selectedRefundCaseId}
                </span>
                <DialogTitle className="text-sm font-black text-card-foreground mt-1 text-left leading-snug">
                  Duyệt Kháng Nghị & Hoàn Điểm Phạt
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-left">
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Hệ thống sẽ thực hiện khôi phục tài khoản của tác giả về trạng thái hoạt động (ACTIVE), chuyển tài liệu về bình thường (NORMAL), gỡ bỏ cảnh cáo và hoàn trả toàn bộ điểm phạt đã trừ trong lịch sử của vụ việc này.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Ghi chú giải quyết kháng nghị
              </label>
              <Textarea
                placeholder="Nhập lý do gỡ khóa tài khoản, khôi phục tài liệu hoặc phản hồi kháng nghị..."
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                className="min-h-[90px] max-h-[150px] rounded-2xl border border-border bg-background text-xs font-bold p-3 text-card-foreground focus:border-primary placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button
              onClick={handleConfirmRefund}
              disabled={refundMutation.isPending || !refundNote.trim()}
              className="w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Xác nhận & Hoàn điểm
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowRefundModal(false);
                setRefundNote("");
              }}
              disabled={refundMutation.isPending}
              className="w-full sm:w-auto font-bold text-xs px-4 py-2 border border-border bg-secondary hover:bg-secondary-foreground/10 text-card-foreground rounded-2xl cursor-pointer"
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
