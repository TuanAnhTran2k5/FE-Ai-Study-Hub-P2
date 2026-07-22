import { Bookmark, Download, FileText, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

import PointCoin from "@/components/PointCoin";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/types/user.type";

interface ProfileStatsGridProps {
  user: UserResponse;
}

function formatNumber(value?: number | null) {
  if (!value) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function ProfileStatsGrid({ user }: ProfileStatsGridProps) {
  const { t } = useTranslation();
  const statistics = user.statistics;

  const totalDocuments = statistics?.documents ?? 0;
  const totalDownloads = statistics?.downloads ?? 0;
  const totalBookmarks = statistics?.bookmarks ?? 0;

  const globalRank = user.leaderboard?.globalRank
    ? `#${user.leaderboard.globalRank}`
    : "-";

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-5">
      <ProfileStat
        icon={<FileText className="h-6 w-6" />}
        value={totalDocuments}
        label={t("profile.documents", "Documents")}
      />

      <ProfileStat
        icon={<Download className="h-6 w-6" />}
        value={totalDownloads}
        label={t("profile.downloads", "Downloads")}
      />

      <ProfileStat
        icon={<Bookmark className="h-6 w-6" />}
        value={totalBookmarks}
        label={t("profile.bookmarks", "Bookmarks")}
      />

      <ProfileStat
        icon={<PointCoin size={28} />}
        value={formatNumber(user.totalScore)}
        label={t("profile.reputationPoints", "Reputation Points")}
      />

      <ProfileStat
        icon={<Trophy className="h-6 w-6" />}
        value={globalRank}
        label={t("profile.globalRank", "Global Rank")}
      />
    </div>
  );
}

function ProfileStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-black text-card-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileStatsGrid;