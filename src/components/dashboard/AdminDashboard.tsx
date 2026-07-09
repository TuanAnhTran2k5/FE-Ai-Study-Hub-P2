import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, FileText, Download, Cpu, Sparkles, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminReportList from "@/components/dashboard/AdminReportList";
import UserDashboard from "@/components/dashboard/UserDashboard";
import type { UserResponse } from "@/types/user.type";
import type { MyDocumentResponse } from "@/types/document.type";

interface AdminDashboardProps {
  user: UserResponse;
  documents: MyDocumentResponse[];
}

type ViewMode = "SYSTEM" | "PERSONAL";

export default function AdminDashboard({ user, documents }: AdminDashboardProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("SYSTEM");

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
              className="h-8 rounded-xl font-black text-[11px] px-3.5 bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-1.5 cursor-pointer"
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

  // System Dashboard Statistics (Data is reset to 0 / pending API integration to follow strict non-hardcoded rules)
  const systemStats = [
    {
      title: t("admin.totalUsers", "Total Active Students"),
      value: "0",
      icon: <Users className="h-6 w-6 text-cyan-500" />,
      colorClass: "from-cyan-500 to-blue-600",
      glowColor: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      borderColor: "border-cyan-500/30"
    },
    {
      title: t("admin.totalDocs", "Total Curated Documents"),
      value: "0",
      icon: <FileText className="h-6 w-6 text-emerald-500" />,
      colorClass: "from-emerald-500 to-teal-600",
      glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      borderColor: "border-emerald-500/30"
    },
    {
      title: t("admin.totalDownloads", "Total Material Downloads"),
      value: "0",
      icon: <Download className="h-6 w-6 text-purple-500" />,
      colorClass: "from-purple-500 to-indigo-600",
      glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      borderColor: "border-purple-500/30"
    },
    {
      title: t("admin.aiChats", "AI Queries / Token Usage"),
      value: "0",
      icon: <Cpu className="h-6 w-6 text-amber-500" />,
      colorClass: "from-amber-500 to-orange-600",
      glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      borderColor: "border-amber-500/30"
    }
  ];

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
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            {t("admin.subTitle", "Monitor system health, check usage metrics, and resolve reports.")}
          </p>
        </div>

        {/* NÚT SWITCH VIEW CHUYÊN NGHIỆP */}
        <Button 
          onClick={() => setViewMode("PERSONAL")}
          className="h-10 rounded-2xl font-black text-xs px-5 bg-card/60 backdrop-blur-md border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 flex items-center gap-2 self-start sm:self-auto shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] transition-all duration-300 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 animate-spin-slow" />
          {t("admin.switchToPersonal", "Switch to Personal Space")}
        </Button>
      </div>

      {/* STATS GRID - Values set to 0 (No hardcoded placeholders) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, i) => (
          <Card 
            key={i} 
            className={`rounded-3xl border bg-card text-card-foreground backdrop-blur-md shadow-sm transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md ${stat.glowColor} ${stat.borderColor}`}
          >
            <div className={`absolute -right-8 -top-8 size-20 rounded-full opacity-5 group-hover:opacity-10 blur-xl transition-opacity bg-gradient-to-br ${stat.colorClass}`} />
            
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-card-foreground">
                    {stat.value}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN LAYOUT - Full Width Queue (No hardcoded right column charts/health checks) */}
      <div className="grid gap-6">
        <div className="w-full">
          <AdminReportList currentUser={user} />
        </div>
      </div>

    </section>
  );
}
