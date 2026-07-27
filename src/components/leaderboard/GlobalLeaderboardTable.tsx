import { Medal } from "lucide-react";
import { useTranslation } from "react-i18next";

import PointCoin from "@/components/PointCoin";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LeaderboardResponse } from "@/types/leaderboard.type";
import { getRankStyle } from "@/components/dashboard/rankIconHelper";

interface GlobalLeaderboardTableProps {
  users: LeaderboardResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function formatNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function GlobalLeaderboardTable({
  users,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: GlobalLeaderboardTableProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-2xl font-black text-card-foreground">
          {t("leaderboard.globalTitle", "Global Leaderboard")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("leaderboard.globalDesc", "Total contribution ranking of all users.")}
        </p>
      </div>

      <div className="flex flex-col">
        <div className="hidden grid-cols-[60px_1fr_auto_auto] items-center gap-2 border-b border-border px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[100px_2fr_1fr_1fr] md:gap-4 md:px-6 md:py-2.5">
          <span>{t("leaderboard.rankCol", "Rank")}</span>
          <span>{t("leaderboard.userCol", "User")}</span>
          <span>{t("leaderboard.totalScoreCol", "Total Score")}</span>
          <div className="text-right md:text-left">{t("leaderboard.rankNameCol", "Rank Name")}</div>
        </div>

        {isLoading && (
          <div className="px-6 py-8 text-center text-muted-foreground">
            {t("leaderboard.loading", "Loading leaderboard...")}
          </div>
        )}

        {!isLoading && users.length === 0 && (
          <div className="px-6 py-8 text-center text-muted-foreground">
            {t("leaderboard.empty", "No leaderboard data.")}
          </div>
        )}

        {!isLoading &&
          users.map((user) => {
            const rankStyle = getRankStyle(user.rankName);

            return (
              <div
                key={user.userId}
                className="grid grid-cols-[60px_1fr_auto_auto] items-center gap-2 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[100px_2fr_1fr_1fr] md:gap-4 md:px-6 md:py-3"
              >
                <div className="flex items-center gap-1.5 font-black text-card-foreground md:gap-2">
                  {user.rank <= 3 ? (
                    <Medal
                      className={`h-5 w-5 md:h-7 md:w-7 ${
                        user.rank === 1
                          ? "text-yellow-400"
                          : user.rank === 2
                            ? "text-slate-400"
                            : "text-orange-400"
                      }`}
                    />
                  ) : null}

                  <span className="text-sm md:text-base">#{user.rank}</span>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <AvatarFrame
                    score={user.totalScore}
                    avatarUrl={user.avatarUrl}
                    fullName={user.fullName}
                    size="sm"
                  />

                  <p className="font-bold text-card-foreground truncate text-sm md:text-base">
                    {user.fullName}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-card-foreground whitespace-nowrap">
                  <PointCoin size={20} />
                  <span className="text-sm md:text-base">{formatNumber(user.totalScore)}</span>
                </div>

                <div className="flex items-center justify-end md:justify-start">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap md:px-4 md:py-1.5 md:text-sm"
                    style={{
                      backgroundColor: rankStyle.badgeColor,
                      color: rankStyle.color,
                    }}
                  >
                    {user.rankName}
                  </span>
                </div>
              </div>
            );
          })}

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="outline"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          >
            {t("community.guest.previous", "Previous")}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t("community.guest.page", "Page")} {page + 1} / {totalPages || 1}
          </p>

          <Button
            variant="outline"
            disabled={totalPages === 0 || page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            {t("community.guest.next", "Next")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default GlobalLeaderboardTable;