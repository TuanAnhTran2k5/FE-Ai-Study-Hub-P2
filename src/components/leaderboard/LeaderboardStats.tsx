import { Award, Medal, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardStatsProps {
  totalUsers: number;
  totalRanks: number;
  totalBadges: number;
}

function LeaderboardStats({
  totalUsers,
  totalRanks,
  totalBadges,
}: LeaderboardStatsProps) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm lg:col-span-2">
      <CardContent className="grid gap-4 p-6 md:grid-cols-3">
        <StatItem
          icon={<Users className="h-6 w-6" />}
          label={t("leaderboard.totalUsers", "Total Users")}
          value={totalUsers}
        />

        <StatItem
          icon={<Medal className="h-6 w-6" />}
          label={t("leaderboard.ranks", "Ranks")}
          value={totalRanks}
        />

        <StatItem
          icon={<Award className="h-6 w-6" />}
          label={t("leaderboard.badges", "Badges")}
          value={totalBadges}
        />
      </CardContent>
    </Card>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-black text-card-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default LeaderboardStats;