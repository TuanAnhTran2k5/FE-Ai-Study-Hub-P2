import { Medal } from "lucide-react";

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
  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-2xl font-black text-card-foreground">
          Global Leaderboard
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Total contribution ranking of all users.
        </p>
      </div>

      <div className="hidden grid-cols-[100px_2fr_1fr_1fr] border-b border-border px-6 py-4 text-sm font-bold text-muted-foreground md:grid">
        <span>Rank</span>
        <span>User</span>
        <span>Total Score</span>
        <span>Rank Name</span>
      </div>

      {isLoading && (
        <div className="px-6 py-8 text-center text-muted-foreground">
          Loading leaderboard...
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="px-6 py-8 text-center text-muted-foreground">
          No leaderboard data.
        </div>
      )}

      {!isLoading &&
    
  users.map((user) => {
    const rankStyle = getRankStyle(user.rankName);

    return (
      <div
        key={user.userId}
        className="grid gap-4 border-b border-border px-6 py-5 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[100px_2fr_1fr_1fr] md:items-center"
      >
        <div className="flex items-center gap-2 font-black text-card-foreground">
          {user.rank <= 3 ? (
            <Medal
              className={`h-7 w-7 ${
                user.rank === 1
                  ? "text-yellow-400"
                  : user.rank === 2
                    ? "text-slate-400"
                    : "text-orange-400"
              }`}
            />
          ) : null}

          <span>#{user.rank}</span>
        </div>

        <div className="flex items-center gap-3">
          <AvatarFrame
            score={user.totalScore}
            avatarUrl={user.avatarUrl}
            fullName={user.fullName}
            size="sm"
          />

          <p className="font-bold text-card-foreground">
            {user.fullName}
          </p>
        </div>

        <div className="flex items-center gap-2 font-bold text-card-foreground">
          <PointCoin size={22} />
          {formatNumber(user.totalScore)}
        </div>

        <div>
          <span
            className="rounded-full px-4 py-1.5 text-sm font-bold"
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
          Previous
        </Button>

        <p className="text-sm text-muted-foreground">
          Page {page + 1} / {totalPages || 1}
        </p>

        <Button
          variant="outline"
          disabled={totalPages === 0 || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}

export default GlobalLeaderboardTable;