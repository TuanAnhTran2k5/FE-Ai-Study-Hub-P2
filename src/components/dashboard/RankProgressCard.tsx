import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getRankIcon, getRankStyle } from "./rankIconHelper";
import type { UserRank, RankProgress } from "@/types/user.type";

interface RankProgressCardProps {
  totalScore: number;
  rankProgress?: RankProgress | null;
  currentRank?: UserRank | null;
}

export default function RankProgressCard({
  totalScore,
  rankProgress,
  currentRank,
}: RankProgressCardProps) {
  const { t } = useTranslation();

  if (!rankProgress) return null;

  // Format Progress Percent cleanly (e.g. 9.9% instead of 9.900990099009901%)
  const progressPercent = rankProgress.progressPercent ?? 0;
  const progressPercentFormatted = progressPercent.toFixed(1);

  // Get Rank Icons & Styles
  const CurrentRankIcon = getRankIcon(currentRank?.rank.rankName);
  const NextRankIcon = getRankIcon(rankProgress.nextRank ?? undefined);

  const currentRankStyle = getRankStyle(currentRank?.rank.rankName);
  const nextRankStyle = getRankStyle(rankProgress.nextRank ?? undefined);

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground">
              {t("dashboard.rank.title")}
            </h3>
          </div>
          <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20">
            {totalScore} XP Points
          </span>
        </div>

        {/* ROADMAP TIMELINE */}
        <div className="flex items-center justify-between gap-1 pt-6 pb-2 px-2 w-full">
          {/* Left Node: Current Rank */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 w-20 relative z-10">
            <div 
              className={`flex size-11 items-center justify-center rounded-2xl bg-card border-2 transition-all duration-300 ${currentRankStyle.glowClass}`}
              style={{ 
                borderColor: currentRankStyle.color,
              }}
            >
              <CurrentRankIcon 
                className="h-5.5 w-5.5" 
                style={{ color: currentRankStyle.color }} 
              />
            </div>
            <span className="text-[10px] font-bold text-card-foreground text-center truncate w-full">
              {currentRank?.rank.rankName}
            </span>
            <span className="text-[8px] font-black uppercase tracking-wider text-primary">
              Current
            </span>
          </div>

          {/* Middle: Progress Line Container */}
          <div className="flex-1 relative h-12 flex items-center mx-2">
            {/* Background line */}
            <div className="w-full h-1.5 rounded-full bg-muted-foreground/20 dark:bg-secondary/80" />
            
            {/* Active line */}
            <div 
              className="absolute left-0 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Sliding percentage bubble (Chạy trượt và có mũi tên nhỏ chỉ xuống) */}
            <div 
              className="absolute bg-primary text-primary-foreground text-[10px] font-black tracking-wider px-2 py-0.5 rounded-lg shadow-md transition-all duration-700 ease-out after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-primary"
              style={{ 
                left: `${progressPercent}%`,
                transform: "translate(-50%, -36px)"
              }}
            >
              {progressPercentFormatted}%
            </div>
          </div>

          {/* Right Node: Next Rank */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 w-20 relative z-10">
            <div 
              className="flex size-11 items-center justify-center rounded-2xl bg-card border border-dashed border-border/80 shadow-sm transition-all duration-300"
              style={{
                borderColor: rankProgress.nextRank ? nextRankStyle.color : 'rgba(var(--border), 0.8)',
              }}
            >
              <NextRankIcon 
                className="h-5.5 w-5.5" 
                style={{ 
                  color: rankProgress.nextRank ? nextRankStyle.color : 'var(--muted-foreground)',
                  opacity: rankProgress.nextRank ? 0.7 : 0.4
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground text-center truncate w-full">
              {rankProgress.nextRank || "Max Rank"}
            </span>
            <span className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/60">
              Next Rank
            </span>
          </div>
        </div>

        {rankProgress.remainingScore !== null && rankProgress.remainingScore !== undefined && rankProgress.remainingScore > 0 && (
          <p className="text-xs text-muted-foreground leading-relaxed italic border-t border-border/40 pt-4">
            ✨ {t("dashboard.rank.remaining")}: <strong className="text-card-foreground not-italic">{rankProgress.remainingScore}</strong> {t("dashboard.rank.pointsToNext")} <strong>{rankProgress.nextRank}</strong>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
