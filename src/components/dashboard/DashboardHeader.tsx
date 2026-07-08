import { useTranslation } from "react-i18next";
import { Sparkles, Shield } from "lucide-react";
import { getRankIcon, getRankStyle } from "./rankIconHelper";
import type { UserRank } from "@/types/user.type";

interface DashboardHeaderProps {
  fullName: string;
  currentRank?: UserRank | null;
}

export default function DashboardHeader({ fullName, currentRank }: DashboardHeaderProps) {
  const { t } = useTranslation();
  
  // Get active Rank Icon and Style
  const WelcomeRankIcon = currentRank ? getRankIcon(currentRank.rank.rankName) : Shield;
  const rankStyle = getRankStyle(currentRank?.rank.rankName);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10 dark:bg-secondary/5 rounded-3xl border border-border/60 dark:border-border/40 p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-card-foreground flex items-center gap-2">
          {t("dashboard.welcome")}{" "}
          <span className="text-primary">{fullName}</span>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Display Rank name in Welcome header - Áp dụng màu sắc rực rỡ và phát sáng */}
      {currentRank?.rank && (
        <div 
          className={`flex items-center gap-2 px-4.5 py-2 rounded-2xl border bg-card dark:bg-secondary/20 shadow-sm w-fit shrink-0 ${rankStyle.glowClass}`}
          style={{ 
            borderColor: rankStyle.color,
          }}
        >
          <WelcomeRankIcon 
            className="h-5 w-5 animate-bounce" 
            style={{ color: rankStyle.color }} 
          />
          <span 
            className="font-bold text-xs uppercase tracking-wider"
            style={{ color: rankStyle.color }}
          >
            {currentRank.rank.rankName}
          </span>
        </div>
      )}
    </div>
  );
}
