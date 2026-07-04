import { useState } from "react";
import { Award, Crown, Download, Star, Trophy, Upload } from "lucide-react";

import type { BadgeResponse } from "@/types/leaderboard.type";

interface BadgeCardProps {
  badge: BadgeResponse;
}

function getBadgeIcon(badgeName: string) {
  const name = badgeName.toLowerCase();

  if (name.includes("first") || name.includes("upload")) {
    return <Upload className="h-7 w-7" />;
  }

  if (name.includes("helpful") || name.includes("download")) {
    return <Download className="h-7 w-7" />;
  }

  if (name.includes("trusted")) {
    return <Star className="h-7 w-7" />;
  }

  if (name.includes("weekly") || name.includes("top")) {
    return <Trophy className="h-7 w-7" />;
  }

  if (name.includes("elite")) {
    return <Crown className="h-7 w-7" />;
  }

  return <Award className="h-7 w-7" />;
}

function BadgeCard({ badge }: BadgeCardProps) {
  const [isImageError, setIsImageError] = useState(false);

  const shouldShowImage = Boolean(badge.iconUrl) && !isImageError;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cyan-400/10 text-cyan-400">
          {shouldShowImage ? (
            <img
              src={badge.iconUrl!}
              alt={badge.badgeName}
              className="h-full w-full object-cover"
              onError={() => setIsImageError(true)}
            />
          ) : (
            getBadgeIcon(badge.badgeName)
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-black text-card-foreground">
            {badge.badgeName}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {badge.description}
          </p>

          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
            {badge.conditionText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BadgeCard;