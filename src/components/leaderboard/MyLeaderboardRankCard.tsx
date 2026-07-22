import { Crown, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import type { GlobalLeaderboardResponse } from "@/types/leaderboard.type";

interface MyLeaderboardRankCardProps {
  myRank?: GlobalLeaderboardResponse;
}

function MyLeaderboardRankCard({ myRank }: MyLeaderboardRankCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm lg:col-span-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Crown className="h-7 w-7" />
          </div>

          <div>
            <p className="text-sm font-bold text-primary">{t("leaderboard.myRank", "Your Global Rank")}</p>

            <h2 className="mt-1 text-3xl font-black text-card-foreground">
              #{myRank?.rank ?? "N/A"}
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {t("leaderboard.totalUsers", "Total Users")}: {myRank?.totalUsers ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyLeaderboardRankCard;