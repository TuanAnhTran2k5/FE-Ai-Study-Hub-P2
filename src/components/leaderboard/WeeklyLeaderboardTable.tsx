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
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-2xl font-black text-card-foreground">
          {t("leaderboard.weeklyTitle", "Weekly Top Contributors")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("leaderboard.weeklyDesc", "Ranking users by weekly score.")}
        </p>
      </div>

      <div className="flex flex-col">
        <div className="hidden grid-cols-[60px_1fr_auto_auto] items-center gap-2 border-b border-border px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[80px_2fr_1fr_1fr] md:gap-4 md:px-6 md:py-2.5">
          <span>{t("leaderboard.rankCol", "Rank")}</span>
          <span>{t("leaderboard.userCol", "User")}</span>
          <span>{t("leaderboard.scoreCol", "Score")}</span>
          <div className="text-right md:text-left">{t("leaderboard.weekStartCol", "Week Start")}</div>
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
              className="grid grid-cols-[60px_1fr_auto_auto] items-center gap-2 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[80px_2fr_1fr_1fr] md:gap-4 md:px-6 md:py-3"
            >
              <div className="flex items-center gap-1.5 font-black text-card-foreground md:gap-2">
                {rankNumber <= 3 ? (
                  <Medal
                    className={`h-5 w-5 md:h-7 md:w-7 ${
                      rankNumber === 1
                        ? "text-yellow-400"
                        : rankNumber === 2
                          ? "text-slate-400"
                          : "text-orange-400"
                    }`}
                  />
                ) : null}
                <span className="text-sm md:text-base">#{rankNumber}</span>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <AvatarFrame
                  score={user.score}
                  avatarUrl={user.avatarUrl}
                  fullName={user.fullName}
                  size="sm"
                />

                <div className="min-w-0">
                  <p className="font-bold text-card-foreground truncate text-sm md:text-base">
                    {user.fullName}
                  </p>
                  <p className="hidden text-xs text-muted-foreground truncate md:block">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-card-foreground whitespace-nowrap">
                <PointCoin size={20} />
                <span className="text-sm md:text-base">{user.score}</span>
              </div>

              <div className="flex items-center justify-end md:justify-start text-xs text-card-foreground md:text-sm">
                {formatDate(user.weekStart, currentLanguage)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default WeeklyLeaderboardTable;