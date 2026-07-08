import { useTranslation } from "react-i18next";
import { BookOpen, Download, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsGridProps {
  docCount: number;
  downloadCount: number;
  globalRank: string;
  weeklyRank: string | null;
}

export default function DashboardStatsGrid({
  docCount,
  downloadCount,
  globalRank,
  weeklyRank,
}: DashboardStatsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* STAT 1: UPLOADS - Purple/Pink Gradient */}
      <Card className="rounded-3xl border border-pink-200 dark:border-pink-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-pink-500/5 dark:from-purple-900/40 dark:via-pink-900/25 dark:to-purple-950/20 backdrop-blur-sm hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 size-20 rounded-full bg-pink-500/15 dark:bg-pink-500/5 blur-xl group-hover:bg-pink-500/25 transition-colors" />
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
              {t("dashboard.stats.uploads")}
            </span>
            <h2 className="text-3xl font-black text-card-foreground tracking-tight">
              {docCount}
            </h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* STAT 2: DOWNLOADS - Teal/Blue Gradient */}
      <Card className="rounded-3xl border border-teal-200 dark:border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-blue-500/5 dark:from-teal-900/40 dark:via-blue-900/25 dark:to-teal-950/20 backdrop-blur-sm hover:border-teal-300 dark:hover:border-teal-500/40 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 size-20 rounded-full bg-teal-500/15 dark:bg-teal-500/5 blur-xl group-hover:bg-teal-500/25 transition-colors" />
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {t("dashboard.stats.downloads")}
            </span>
            <h2 className="text-3xl font-black text-card-foreground tracking-tight">
              {downloadCount}
            </h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0">
            <Download className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* STAT 3: GLOBAL RANK - Gold/Orange Gradient */}
      <Card className="rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-orange-500/5 dark:from-amber-900/40 dark:via-orange-900/25 dark:to-amber-950/20 backdrop-blur-sm hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 size-20 rounded-full bg-amber-500/15 dark:bg-amber-500/5 blur-xl group-hover:bg-amber-500/25 transition-colors" />
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {t("dashboard.stats.rank")}
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-card-foreground tracking-tight">
                {globalRank}
              </h2>
              {weeklyRank && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/15">
                  {weeklyRank} Weekly
                </span>
              )}
            </div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
