import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

function LeaderboardHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        <Trophy className="h-5 w-5" />
        {t("leaderboard.title", "Leaderboard")}
      </p>

      <h1 className="mt-2 text-4xl font-bold text-card-foreground">
        {t("leaderboard.topContributors", "Top Contributors")}
      </h1>

      <p className="mt-3 max-w-2xl text-muted-foreground">
        {t("leaderboard.description", "Ranking students by contribution score, weekly activity, ranks and achievement badges in AI Study Hub.")}
      </p>
    </div>
  );
}

export default LeaderboardHeader;