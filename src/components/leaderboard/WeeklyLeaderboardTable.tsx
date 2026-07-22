import { Medal } from "lucide-react";
import { useTranslation } from "react-i18next";

import PointCoin from "@/components/PointCoin";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import { Card } from "@/components/ui/card";
import type { TopWeeklyUserResponse } from "@/types/leaderboard.type";

interface WeeklyLeaderboardTableProps {
  users: TopWeeklyUserResponse[];
}

function formatDate(value?: string, language?: string) {
  if (!value) return "N/A";
  const locale = language === "vi" ? "vi-VN" : "en-US";
  return new Date(value).toLocaleDateString(locale);
}

function WeeklyLeaderboardTable({ users }: WeeklyLeaderboardTableProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "vi";

  return (
    <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-2xl font-black text-card-foreground">
          {t("leaderboard.weeklyTitle", "Weekly Top Contributors")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("leaderboard.weeklyDesc", "Ranking users by weekly score.")}
        </p>
      </div>

      <div className="hidden grid-cols-[80px_2fr_1fr_1fr] border-b border-border px-6 py-4 text-sm font-bold text-muted-foreground md:grid">
        <span>{t("leaderboard.rankCol", "Rank")}</span>
        <span>{t("leaderboard.userCol", "User")}</span>
        <span>{t("leaderboard.scoreCol", "Score")}</span>
        <span>{t("leaderboard.weekStartCol", "Week Start")}</span>
      </div>

      {users.length === 0 && (
        <div className="px-6 py-8 text-center text-muted-foreground">
          {t("leaderboard.emptyWeekly", "No weekly data.")}
        </div>
      )}

      {users.map((user, index) => {
        const rankNumber = index + 1;

        return (
          <div
            key={`${user.userId}-${user.weekStart}`}
            className="grid gap-4 border-b border-border px-6 py-5 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[80px_2fr_1fr_1fr] md:items-center"
          >
            <div className="font-black text-card-foreground">
              {rankNumber <= 3 ? (
                <Medal
                  className={`h-7 w-7 ${
                    rankNumber === 1
                      ? "text-yellow-400"
                      : rankNumber === 2
                        ? "text-slate-400"
                        : "text-orange-400"
                  }`}
                />
              ) : (
                `#${rankNumber}`
              )}
            </div>

            <div className="flex items-center gap-3">
              <AvatarFrame
                score={user.score}
                avatarUrl={user.avatarUrl}
                fullName={user.fullName}
                size="sm"
              />

              <div>
                <p className="font-bold text-card-foreground">
                  {user.fullName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-card-foreground">
              <PointCoin size={22} />
              {user.score}
            </div>

            <div className="text-card-foreground">
              {formatDate(user.weekStart, currentLanguage)}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export default WeeklyLeaderboardTable;