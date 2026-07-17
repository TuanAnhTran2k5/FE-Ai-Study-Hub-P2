import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Users, FileText, Download, Cpu, Sparkles, Activity, RefreshCw, BarChart2, ShieldCheck, TrendingUp, TrendingDown, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminReportList from "@/components/dashboard/AdminReportList";
import AdminUserManagement from "@/components/dashboard/AdminUserManagement";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { getSystemStatistics, getSubjectDistribution, getSystemHealth, getModerationSummary } from "@/services/adminDashboardService";
import type { UserResponse } from "@/types/user.type";
import type { MyDocumentResponse } from "@/types/document.type";

interface AdminDashboardProps {
  user: UserResponse;
  documents: MyDocumentResponse[];
}

type ViewMode = "SYSTEM" | "PERSONAL";
type AdminTab = "OVERVIEW" | "USERS";

export default function AdminDashboard({ user, documents }: AdminDashboardProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("SYSTEM");
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");
  const [openTooltipIdx, setOpenTooltipIdx] = useState<number | null>(null);

  // Fetch real Backend system statistics
  const { data: stats } = useQuery({
    queryKey: ["admin-system-statistics"],
    queryFn: getSystemStatistics,
    enabled: viewMode === "SYSTEM" && activeTab === "OVERVIEW",
    refetchInterval: 60000,
  });

  // Fetch real Backend subject distribution
  const { data: subjectDist = [] } = useQuery({
    queryKey: ["admin-subject-distribution"],
    queryFn: getSubjectDistribution,
    enabled: viewMode === "SYSTEM" && activeTab === "OVERVIEW",
  });

  // Fetch real Backend system health check
  const { data: health } = useQuery({
    queryKey: ["admin-system-health"],
    queryFn: getSystemHealth,
    enabled: viewMode === "SYSTEM" && activeTab === "OVERVIEW",
    refetchInterval: 30000,
  });

  // Fetch real Backend moderation summary (for banned users count)
  const { data: modSummary } = useQuery({
    queryKey: ["admin-moderation-summary"],
    queryFn: getModerationSummary,
    enabled: viewMode === "SYSTEM" && activeTab === "OVERVIEW",
  });

  // If view mode is PERSONAL, render the standard student personal dashboard
  if (viewMode === "PERSONAL") {
    return (
      <div className="space-y-4">
        {/* Switch back panel banner */}
        <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border-b border-sky-500/20 py-3 px-6">
          <div className="mx-auto w-full max-w-7xl flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 animate-pulse" />
              {t("admin.personalModeActive", "You are viewing your Personal Space (XP progress, storage limits).")}
            </p>
            <Button 
              onClick={() => setViewMode("SYSTEM")}
              className="h-8 rounded-xl font-black text-[11px] px-3.5 bg-card border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3 animate-spin-slow" />
              {t("admin.switchToSystem", "Switch to System Dashboard")}
            </Button>
          </div>
        </div>

        <UserDashboard user={user} documents={documents} />
      </div>
    );
  }

  // Format statistics grid with dynamic data from BE API
  const systemStats = [
    {
      title: t("admin.totalUsers", "Total Active Students"),
      value: stats?.totalActiveUsers?.value?.toLocaleString() ?? "0",
      growth: stats?.totalActiveUsers?.growthRate,
      icon: <Users className="h-6 w-6 text-cyan-500" />,
      colorClass: "from-cyan-500 to-blue-600",
      glowColor: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      borderColor: "border-cyan-500/30"
    },
    {
      title: t("admin.totalDocs", "Total Curated Documents"),
      value: stats?.totalDocuments?.value?.toLocaleString() ?? "0",
      growth: stats?.totalDocuments?.growthRate,
      icon: <FileText className="h-6 w-6 text-emerald-500" />,
      colorClass: "from-emerald-500 to-teal-600",
      glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      borderColor: "border-emerald-500/30"
    },
    {
      title: t("admin.totalDownloads", "Total Material Downloads"),
      value: stats?.totalDownloads?.value?.toLocaleString() ?? "0",
      growth: stats?.totalDownloads?.growthRate,
      icon: <Download className="h-6 w-6 text-purple-500" />,
      colorClass: "from-purple-500 to-indigo-600",
      glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      borderColor: "border-purple-500/30"
    },
    {
      title: t("admin.aiChats", "AI Queries / Token Usage"),
      value: stats?.totalAiQueries?.value?.toLocaleString() ?? "0",
      growth: stats?.totalAiQueries?.growthRate,
      icon: <Cpu className="h-6 w-6 text-amber-500" />,
      colorClass: "from-amber-500 to-orange-600",
      glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      borderColor: "border-amber-500/30"
    }
  ];

  // Helper to render growth rate badge dynamically
  const renderGrowthBadge = (growth?: string) => {
    if (!growth) return null;
    const isNegative = growth.includes("-");
    return (
      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
        isNegative 
          ? "text-red-500 bg-red-500/10 border-red-500/20" 
          : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      }`}>
        {isNegative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {growth}
      </span>
    );
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 space-y-6">
      
      {/* HEADER SECTION - Switch View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
            {t("admin.adminPanel", "ADMIN DASHBOARD")}
          </h2>
          <h1 className="text-2xl font-black text-card-foreground leading-tight mt-1.5">
            {t("admin.welcomeBack", "System Overview & Administration")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-muted-foreground/80 font-semibold mt-1">
            {t("admin.subTitle", "Monitor system health, check usage metrics, and resolve reports.")}
          </p>
        </div>

        {/* SWITCH TO PERSONAL SPACE BUTTON */}
        <Button 
          onClick={() => setViewMode("PERSONAL")}
          className="h-10 rounded-2xl font-black text-xs px-5 bg-card border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 flex items-center gap-2 self-start sm:self-auto shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] transition-all duration-300 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 animate-spin-slow" />
          {t("admin.switchToPersonal", "Switch to Personal Space")}
        </Button>
      </div>

      {/* ADMIN TABS SELECTOR */}
      <div className="flex gap-2 p-1 bg-secondary/15 rounded-2xl w-fit border border-border/40">
        <Button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
            activeTab === "OVERVIEW" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-transparent text-slate-500 hover:text-card-foreground hover:bg-secondary/10 dark:text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          {t("admin.tabSystemOverview", "System Overview")}
        </Button>
        <Button
          onClick={() => setActiveTab("USERS")}
          className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
            activeTab === "USERS" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-transparent text-slate-500 hover:text-card-foreground hover:bg-secondary/10 dark:text-muted-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          {t("admin.tabUsersDirectory", "User Directory")}
        </Button>
      </div>

      {/* VIEW CONDITIONAL RENDERING */}
      {activeTab === "OVERVIEW" ? (
        <div className="space-y-6">
          {/* STATS GRID - Bound to real BE API */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systemStats.map((stat, i) => (
              <Card 
                key={i} 
                className={`rounded-3xl border bg-card text-card-foreground shadow-sm transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md ${stat.glowColor} ${stat.borderColor}`}
              >
                <div className={`absolute -right-8 -top-8 size-20 rounded-full opacity-5 group-hover:opacity-10 blur-xl transition-opacity bg-gradient-to-br ${stat.colorClass}`} />
                
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 group-hover:scale-105 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-muted-foreground/80 tracking-wider block truncate">
                      {stat.title}
                    </span>
                    <div className="flex items-baseline justify-between mt-1 gap-2 flex-wrap">
                      <span className="text-2xl font-black text-card-foreground leading-none">
                        {stat.value}
                      </span>
                      {renderGrowthBadge(stat.growth)}
                    </div>
                    {/* Render detailed status distribution if it is the Active Users stat card */}
                    {i === 0 && (
                      <div className="flex gap-2.5 mt-3 border-t border-slate-200/60 dark:border-border/30 pt-2.5 text-[9px] font-bold text-slate-500/90 dark:text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
                          <span>{t("admin.filterActive", "Active")}: {stats?.totalActiveUsers?.value ?? 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          <span>{t("admin.filterBanned", "Banned")}: {modSummary?.totalBannedUsersCount ?? 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          <span>{t("admin.filterPending", "Pending")}: {modSummary?.totalPendingUsersCount ?? "--"}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* SYSTEM MAIN CONTENT LAYOUT */}
          <div className="grid gap-6 md:grid-cols-12">
            
            {/* COLUMN LEFT (8 COLS) - Pending Reports Queue */}
            <div className="md:col-span-8">
              <AdminReportList currentUser={user} />
            </div>

            {/* COLUMN RIGHT (4 COLS) - Subject Distribution & Health Diagnostics */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Document Distribution (Dynamic API) */}
              <Card className="rounded-3xl border border-slate-300 dark:border-border/60 bg-card shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground flex items-center gap-1.5 mb-5">
                    <BarChart2 className="h-4.5 w-4.5 text-primary" />
                    {t("admin.subjectsDistribution", "Document Distribution")}
                  </h3>

                  {subjectDist.length > 0 ? (
                    <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-secondary/30 scrollbar-track-transparent">
                      {subjectDist.map((sub, idx) => (
                        <div key={idx} className="space-y-1.5 pr-0.5">
                          <div className="flex justify-between text-[11px] font-bold text-card-foreground items-center">
                            {/* Dùng Tooltip của Shadcn để hiển thị tên môn học đầy đủ khi hover sau 3 giây HOẶC click hiện ngay */}
                            <TooltipProvider delayDuration={3000}>
                              <Tooltip 
                                open={openTooltipIdx === idx} 
                                onOpenChange={(open) => setOpenTooltipIdx(open ? idx : null)}
                              >
                                <TooltipTrigger asChild>
                                  <span 
                                    onClick={() => setOpenTooltipIdx(idx)}
                                    className="truncate max-w-[190px] cursor-pointer hover:text-primary transition-colors"
                                  >
                                    {sub.subjectName}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border border-border p-2.5 rounded-xl shadow-lg max-w-[280px] font-bold text-xs leading-relaxed z-50">
                                  <p>{sub.subjectName}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">{sub.documentCount.toLocaleString()} docs</span>
                          </div>
                          {/* Progress bar container */}
                          <div className="h-2 w-full bg-secondary/15 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 bg-sky-500 shadow-[0_0_8px_rgba(var(--primary),0.2)]"
                              style={{ width: `${sub.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-muted-foreground italic text-center py-4">
                      {t("admin.noSubjectData", "No distribution data available.")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Security & Health diagnostics (Dynamic API) */}
              <Card className="rounded-3xl border border-slate-300 dark:border-border/60 bg-card shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-teal-500" />
                    {t("admin.systemStatus", "Security & System Health")}
                  </h3>

                  <div className="space-y-3.5 text-xs font-semibold">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-slate-500 dark:text-muted-foreground">API Gateway Status</span>
                      <span className={`font-extrabold flex items-center gap-1.5 ${
                        health?.apiGatewayStatus?.toUpperCase() === "ONLINE" 
                          ? "text-teal-600 dark:text-teal-400" 
                          : "text-red-500"
                      }`}>
                        <span className={`size-2 rounded-full ${
                          health?.apiGatewayStatus?.toUpperCase() === "ONLINE" ? "bg-teal-500 animate-ping" : "bg-red-500"
                        }`} />
                        {health?.apiGatewayStatus ?? "OFFLINE"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-slate-500 dark:text-muted-foreground">Qdrant Active Nodes</span>
                      <span className="text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-1">
                        <span className="size-2 rounded-full bg-teal-500 animate-ping" />
                        {health?.activeRagNodes ?? 0} {t("admin.nodes", "Active")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-muted-foreground">Hikari Connection Pool</span>
                        <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                          {health?.poolAvailablePercent ?? 0}% {t("admin.healthy", "Healthy")}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/15 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 bg-teal-500"
                          style={{ width: `${health?.poolAvailablePercent ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      ) : (
        /* Tab 2: User management */
        <AdminUserManagement currentUserId={user.userId} />
      )}

    </section>
  );
}
