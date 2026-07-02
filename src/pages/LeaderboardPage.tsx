import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useSelector } from "react-redux";

import PointCoin from "@/components/PointCoin";
import { Card, CardContent } from "@/components/ui/card";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import {
  getBadges,
  getRanks,
  getTopWeeklyUsers,
} from "@/services/leaderboardService";
import type { RootState } from "@/redux/store";
import type {
  BadgeResponse,
  RankResponse,
  TopWeeklyUserResponse,
} from "@/types/leaderboard.type";

function formatNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("vi-VN");
}

function LeaderboardPage() {
  const currentLoginUser = useSelector((state: RootState) => state.user);

  const { data: users = [] } = useQuery({
    queryKey: ["topWeeklyUsers"],
    queryFn: () => getTopWeeklyUsers(10),
  });

  const { data: ranks = [] } = useQuery({
    queryKey: ["ranks"],
    queryFn: getRanks,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["badges"],
    queryFn: getBadges,
  });

  const currentUserIndex = useMemo(() => {
    if (!currentLoginUser) return -1;

    return users.findIndex(
      (user) => user.userId === Number(currentLoginUser.userId ?? currentLoginUser.id),
    );
  }, [users, currentLoginUser]);

  const currentUser =
    currentUserIndex >= 0 ? users[currentUserIndex] : null;

  const sortedRanks = useMemo(() => {
    return [...ranks].sort((a, b) => a.minScore - b.minScore);
  }, [ranks]);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </p>

        <h1 className="mt-2 text-4xl font-bold text-card-foreground">
          Top Contributors
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ranking students by weekly reputation score and contribution to AI
          Study Hub.
        </p>
      </div>

      {currentUser && (
        <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[300px_1fr_1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                #{currentUserIndex + 1}
              </div>

              <AvatarFrame
                score={currentUser.score}
                avatarUrl={currentUser.avatarUrl}
                fullName={currentUser.fullName}
                size="md"
              />

              <div>
                <p className="text-sm font-bold text-primary">Your Rank</p>
                <h2 className="text-2xl font-black text-card-foreground">
                  #{currentUserIndex + 1}
                </h2>
                <p className="text-sm font-semibold text-yellow-500">
                  Weekly Score
                </p>
              </div>
            </div>

            <Stat
              icon={<PointCoin size={30} />}
              value={currentUser.score}
              label="Score"
            />

            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div>
                <p className="text-xl font-black text-card-foreground">
                  {formatDate(currentUser.weekStart)}
                </p>
                <p className="text-sm text-muted-foreground">Week Start</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-4 lg:grid-cols-4">
        {sortedRanks.map((rank) => (
          <RankRewardCard key={rank.rankId} rank={rank} />
        ))}
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <Award className="h-5 w-5" />
            Badges
          </p>

          <h2 className="mt-2 text-3xl font-bold text-card-foreground">
            Achievement Badges
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Users can unlock badges by completing contribution milestones.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => (
            <BadgeCard key={badge.badgeId} badge={badge} />
          ))}
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[80px_2fr_1fr_1fr] border-b border-border px-6 py-4 text-sm font-bold text-muted-foreground">
          <span>Rank</span>
          <span>User</span>
          <span>Score</span>
          <span>Week Start</span>
        </div>

        {users.map((user: TopWeeklyUserResponse, index) => {
          const rankNumber = index + 1;
          const isCurrentUser =
            currentLoginUser &&
            user.userId === Number(currentLoginUser.userId ?? currentLoginUser.id);

          return (
            <div
              key={user.userId}
              className={`grid grid-cols-[80px_2fr_1fr_1fr] items-center border-b border-border px-6 py-5 last:border-b-0 hover:bg-secondary/40 ${
                isCurrentUser ? "bg-primary/5" : ""
              }`}
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
                  rankNumber
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
                {formatNumber(user.score)}
              </div>

              <div className="text-card-foreground">
                {formatDate(user.weekStart)}
              </div>
            </div>
          );
        })}
      </Card>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 border-l border-border pl-6">
      <div className="flex h-9 w-9 items-center justify-center text-primary">
        {icon}
      </div>

      <div>
        <p className="text-xl font-black text-card-foreground">
          {formatNumber(value)}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function RankRewardCard({ rank }: { rank: RankResponse }) {
  const scoreLabel =
    rank.maxScore > 0
      ? `${rank.minScore} - ${rank.maxScore}`
      : `${rank.minScore}+`;

  const frameScore = rank.maxScore > 0 ? rank.maxScore : rank.minScore;

  const icon =
    rank.rankName.toLowerCase().includes("elite") ? (
      <Crown className="h-6 w-6" />
    ) : rank.rankName.toLowerCase().includes("gold") ? (
      <Trophy className="h-6 w-6" />
    ) : rank.rankName.toLowerCase().includes("silver") ? (
      <Sparkles className="h-6 w-6" />
    ) : (
      <Shield className="h-6 w-6" />
    );

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <AvatarFrame
            score={frameScore}
            avatarUrl="/img/LOGO.png"
            fullName={rank.rankName}
            size="md"
          />

          <div className="text-primary">{icon}</div>
        </div>

        <h3 className="text-lg font-black text-card-foreground">
          {rank.rankName}
        </h3>

        <p className="mt-1 text-sm font-bold text-primary">
          {scoreLabel} Points
        </p>

        <div className="mt-4 rounded-2xl bg-secondary p-3">
          <p className="text-sm leading-6 text-muted-foreground">
            Storage bonus: {formatNumber(rank.storageBonus)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Priority: {rank.displayPriority}
          </p>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: BadgeResponse }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-primary">
          {badge.iconUrl ? (
            <img
              src={badge.iconUrl}
              alt={badge.badgeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Award className="h-7 w-7" />
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

export default LeaderboardPage;