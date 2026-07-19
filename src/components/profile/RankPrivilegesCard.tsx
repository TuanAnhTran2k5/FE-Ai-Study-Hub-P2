import { useTranslation } from "react-i18next";
import { Cpu, HardDrive, ShieldCheck, Sparkles, Trophy, Crown, Milestone, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getRankStyle } from "@/components/dashboard/rankIconHelper";
import type { UserRank, RankProgress } from "@/types/user.type";
import PointCoin from "@/components/PointCoin";

interface RankPrivilegesCardProps {
  currentRank?: UserRank | null;
  rankProgress?: RankProgress | null;
}

// Get correct Lucide Icon for Rank
const getRankIcon = (rankName?: string) => {
  const name = rankName?.toLowerCase() ?? "";
  if (name.includes("bronze")) return ShieldCheck;
  if (name.includes("silver")) return Sparkles;
  if (name.includes("gold")) return Trophy;
  if (name.includes("elite")) return Crown;
  return ShieldAlert;
};

// Format storage bonus from bytes to GB/MB dynamically
function formatStorageBonus(bytes: number, t: any) {
  if (!bytes || bytes <= 0) return `+0 GB ${t("profile.storageBonusLabel", "Bonus")}`;
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `+${gb.toFixed(1).replace(".0", "")} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `+${mb.toFixed(0)} MB`;
}

// Helper to format dynamic XP Range cleanly (e.g. 701 - 2147483647 -> 700+)
function formatXPRange(min: number, max: number) {
  if (max >= 2147483647) {
    const base = min > 0 ? min - 1 : 0;
    return `${base}+ XP`;
  }
  return `${min} - ${max} XP`;
}

// Get estimated privileges for next rank preview
const getRankPrivilegePreview = (rankName?: string) => {
  const name = rankName?.toLowerCase() ?? "";
  if (name.includes("bronze")) {
    return {
      storage: "2.00 GB",
      priority: "Level 1",
    };
  }
  if (name.includes("silver")) {
    return {
      storage: "2.50 GB (+500 MB Bonus)",
      priority: "Level 2",
    };
  }
  if (name.includes("gold")) {
    return {
      storage: "3.00 GB (+1.00 GB Bonus)",
      priority: "Level 3",
    };
  }
  if (name.includes("elite")) {
    return {
      storage: "4.00 GB (+2.00 GB Bonus)",
      priority: "Level 4",
    };
  }
  return null;
};

export default function RankPrivilegesCard({ currentRank, rankProgress }: RankPrivilegesCardProps) {
  const { t } = useTranslation();

  if (!currentRank?.rank) return null;

  const rank = currentRank.rank;
  const RankIcon = getRankIcon(rank.rankName);
  const rankStyle = getRankStyle(rank.rankName);

  // Next rank information
  const nextRankName = rankProgress?.nextRank;
  const nextRankStyle = nextRankName ? getRankStyle(nextRankName) : null;
  const nextPrivilege = nextRankName ? getRankPrivilegePreview(nextRankName) : null;

  return (
    <Card 
      className={`rounded-3xl border bg-card text-card-foreground backdrop-blur-md shadow-sm transition-all duration-300 relative overflow-hidden ${rankStyle.glowClass}`}
      style={{ 
        borderColor: rankStyle.color,
      }}
    >
      {/* Decorative gradient corner matching rank color */}
      <div 
        className="absolute -right-12 -top-12 size-28 rounded-full opacity-10 dark:opacity-20 blur-2xl transition-colors duration-500"
        style={{ backgroundColor: rankStyle.color }}
      />

      <CardContent className="p-6 space-y-6">
        {/* Header - Rank Info */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              {t("profile.rankPrivileges", "Rank Privileges")}
            </h3>
            <div className="flex items-baseline gap-2">
              <span 
                className="text-lg font-black uppercase tracking-wider transition-colors"
                style={{ color: rankStyle.color }}
              >
                {rank.rankName}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary/35 dark:bg-secondary/10 border border-border/40">
                {t("profile.activeStatus", "Active Status")}
              </span>
            </div>
          </div>

          <div 
            className="flex size-12 items-center justify-center rounded-2xl border transition-all"
            style={{ 
              borderColor: rankStyle.color,
              backgroundColor: rankStyle.badgeColor,
              color: rankStyle.color
            }}
          >
            <RankIcon className="h-6 w-6" />
          </div>
        </div>

        {/* DYNAMIC PRIVILEGES & METRICS FROM API */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          {/* Metric 1: Storage Bonus */}
          <div className="flex items-center gap-3 p-4 bg-secondary/10 dark:bg-secondary/5 rounded-2xl border border-border/50 hover:border-border transition-colors">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
              <HardDrive className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block truncate">
                {t("profile.storageBonus", "Storage Bonus")}
              </span>
              <span className="text-sm font-bold text-card-foreground">
                {formatStorageBonus(rank.storageBonus, t)}
              </span>
            </div>
          </div>

          {/* Metric 2: Review Priority */}
          <div className="flex items-center gap-3 p-4 bg-secondary/10 dark:bg-secondary/5 rounded-2xl border border-border/50 hover:border-border transition-colors">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block truncate">
                {t("profile.approvalPriority", "Review Priority")}
              </span>
              <span className="text-sm font-bold text-card-foreground">
                {rank.displayPriority || "Level 1"}
              </span>
            </div>
          </div>

          {/* Metric 3: XP Requirements Range (Clean calculation, automatic min-1 for max ranks) */}
          <div className="flex items-center gap-3 p-4 bg-secondary/10 dark:bg-secondary/5 rounded-2xl border border-border/50 hover:border-border transition-colors">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <PointCoin size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block truncate">
                {t("profile.xpRange", "XP Requirements")}
              </span>
              <span className="text-xs font-bold text-card-foreground block truncate">
                {formatXPRange(rank.minScore, rank.maxScore)}
              </span>
            </div>
          </div>

        </div>

        {/* 🌟 NEXT RANK PRIVILEGES PREVIEW (Gamification Idea) */}
        {nextRankName && nextPrivilege && nextRankStyle && (
          <div className="mt-4 p-3.5 bg-sky-500/[0.04] dark:bg-sky-500/[0.02] border border-sky-500/20 dark:border-sky-500/10 rounded-2xl flex items-center justify-between text-xs text-muted-foreground gap-3">
            <div className="flex items-center gap-2.5">
              <div 
                className="flex size-8 items-center justify-center rounded-lg border text-[10px] font-black shrink-0"
                style={{ 
                  borderColor: nextRankStyle.color,
                  backgroundColor: nextRankStyle.badgeColor,
                  color: nextRankStyle.color
                }}
              >
                <Milestone className="h-4 w-4" />
              </div>
              <p className="leading-normal text-[11px]">
                {t("profile.nextRankPreviewText", "Upgrade to next rank")} <strong className="text-sky-600 dark:text-sky-400 font-extrabold uppercase tracking-wide">{nextRankName}</strong> {t("profile.nextRankBenefitText", "to expand storage to")} <strong className="text-card-foreground font-black">{nextPrivilege.storage}</strong> {t("profile.nextRankPriorityText", "and upgrade to")} <strong className="text-card-foreground font-black">{nextPrivilege.priority}</strong>!
              </p>
            </div>
          </div>
        )}

        {/* Small dynamic footer showing XP threshold context from API */}
        <p className="text-[10px] text-muted-foreground/80 leading-relaxed italic border-t border-border/30 pt-3">
          💡 {t("profile.privilegesFooterHint", "This rank status is calculated automatically based on your total XP points. Reaching higher XP brackets unlocks superior privileges.")}
        </p>
      </CardContent>
    </Card>
  );
}
