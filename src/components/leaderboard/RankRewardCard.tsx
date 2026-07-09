import { Crown, Shield, Sparkles, Trophy } from "lucide-react";

import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import type { RankResponse } from "@/types/leaderboard.type";

interface RankRewardCardProps {
  rank: RankResponse;
}

function formatStorageBonus(bytes: number) {
  if (!bytes || bytes <= 0) return "0 GB";

  const gb = bytes / 1024 / 1024 / 1024;

  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  if (gb >= 1) {
    return `${gb.toFixed(1).replace(".0", "")} GB`;
  }
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(0)} MB`;
}

function RankRewardCard({ rank }: RankRewardCardProps) {
  const isUnlimitedRank = rank.maxScore >= 2147483647;

  const scoreLabel = isUnlimitedRank
    ? `${rank.minScore > 0 ? rank.minScore - 1 : 0}+`
    : `${rank.minScore} - ${rank.maxScore}`;

  const frameScore = isUnlimitedRank ? rank.minScore : rank.maxScore;

  const rankName = rank.rankName.toLowerCase();

  const icon = rankName.includes("elite") ? (
    <Crown className="h-6 w-6" />
  ) : rankName.includes("gold") ? (
    <Trophy className="h-6 w-6" />
  ) : rankName.includes("silver") ? (
    <Sparkles className="h-6 w-6" />
  ) : (
    <Shield className="h-6 w-6" />
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between">
          <AvatarFrame
            score={frameScore}
            avatarUrl={rank.iconUrl ?? "/img/LOGO.png"}
            fullName={rank.rankName}
            size="lg"
          />

          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
            {icon}
          </div>
        </div>

        <h3 className="text-2xl font-black text-card-foreground">
          {rank.rankName}
        </h3>

        <p className="mt-2 text-base font-bold text-cyan-400">
          {scoreLabel} Points
        </p>

        <div className="mt-5 rounded-2xl bg-secondary/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              Storage bonus
            </span>

            <span className="text-sm font-black text-card-foreground">
              {formatStorageBonus(rank.storageBonus)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Priority</span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Level {rank.displayPriority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankRewardCard;