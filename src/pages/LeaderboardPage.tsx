import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  Crown,
  Download,
  FileText,
  Medal,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useSelector } from "react-redux";

import PointCoin from "@/components/PointCoin";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard } from "@/services/leaderboardService";
import type { UserResponse } from "@/types/user.type";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";

function formatNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function LeaderboardPage() {
  const currentLoginUser = useSelector(
    (state: { user: UserResponse | null }) => state.user,
  );

  const { data: users = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  const currentUser = useMemo(() => {
    if (!currentLoginUser) return null;

    return users.find((user) => user.id === currentLoginUser.id) ?? null;
  }, [users, currentLoginUser]);

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
          Ranking students by reputation points, uploaded documents, downloads,
          bookmarks, and community contribution.
        </p>
      </div>

      {currentUser && (
        <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[300px_1fr_1fr_1fr_1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                #{currentUser.rank}
              </div>

              <AvatarFrame
                score={currentUser.points}
                avatarUrl={currentUser.avatarUrl}
                fullName={currentUser.fullName}
                size="md"
              />

              <div>
                <p className="text-sm font-bold text-primary">Your Rank</p>
                <h2 className="text-2xl font-black text-card-foreground">
                  #{currentUser.rank}
                </h2>
                <p className="text-sm font-semibold text-yellow-500">
                  {currentUser.title}
                </p>
              </div>
            </div>

            <Stat
              icon={<PointCoin size={30} />}
              value={currentUser.points}
              label="Points"
            />

            <Stat
              icon={<FileText />}
              value={currentUser.documents}
              label="Documents"
            />

            <Stat
              icon={<Bookmark />}
              value={currentUser.bookmarks}
              label="Bookmarks"
            />

            <Stat
              icon={<Download />}
              value={currentUser.downloads}
              label="Downloads"
            />
          </CardContent>
        </Card>
      )}

      {/* Rank Rewards */}
      <div className="mb-8 grid gap-4 lg:grid-cols-4">
        <RankRewardCard
          title="Bronze Student"
          score="0 - 100"
          reward="Bronze Avatar Frame"
          borderColor="border-amber-500/40"
          icon={<Shield className="h-6 w-6" />}
        />

        <RankRewardCard
          title="Silver Contributor"
          score="101 - 300"
          reward="Silver Frame • Name Color • Extra Storage"
          borderColor="border-slate-400/50"
          icon={<Sparkles className="h-6 w-6" />}
        />

        <RankRewardCard
          title="Gold Mentor"
          score="301 - 700"
          reward="Gold Frame • Featured Document • Priority Profile"
          borderColor="border-yellow-500/50"
          icon={<Trophy className="h-6 w-6" />}
        />

        <RankRewardCard
          title="Elite Scholar"
          score="700+"
          reward="Elite Frame • Hall Of Fame • Special Effects"
          borderColor="border-purple-500/50"
          icon={<Crown className="h-6 w-6" />}
        />
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr] border-b border-border px-6 py-4 text-sm font-bold text-muted-foreground">
          <span>Rank</span>
          <span>User</span>
          <span>Points</span>
          <span>Documents</span>
          <span>Bookmarks</span>
          <span>Downloads</span>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className={`grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr] items-center border-b border-border px-6 py-5 last:border-b-0 hover:bg-secondary/40 ${
              currentLoginUser?.id === user.id ? "bg-primary/5" : ""
            }`}
          >
            <div className="font-black text-card-foreground">
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
              ) : (
                user.rank
              )}
            </div>

            <div className="flex items-center gap-3">
              <AvatarFrame
                score={user.points}
                avatarUrl={user.avatarUrl}
                fullName={user.fullName}
                size="sm"
              />

              <div>
                <p className="font-bold text-card-foreground">
                  {user.fullName}
                </p>

                <p className="text-sm text-muted-foreground">{user.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-card-foreground">
              <PointCoin size={22} />
              {formatNumber(user.points)}
            </div>

            <div className="text-card-foreground">
              {formatNumber(user.documents)}
            </div>

            <div className="text-card-foreground">
              {formatNumber(user.bookmarks)}
            </div>

            <div className="text-card-foreground">
              {formatNumber(user.downloads)}
            </div>
          </div>
        ))}
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

function RankRewardCard({
  title,
  score,
  reward,
  borderColor,
}: {
  title: string;
  score: string;
  reward: string;
  borderColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-3xl border-2
        ${borderColor}
        bg-card p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4">
          <AvatarFrame
            score={
              title === "Bronze Student"
                ? 50
                : title === "Silver Contributor"
                  ? 200
                  : title === "Gold Mentor"
                    ? 500
                    : 1000
            }
            avatarUrl="/img/LOGO.png"
            fullName={title}
            size="md"
          />
        </div>

        <h3 className="text-lg font-black text-card-foreground">{title}</h3>

        <p className="mt-1 text-sm font-bold text-primary">{score} Points</p>

        <div className="mt-4 rounded-2xl bg-secondary p-3">
          <p className="text-sm leading-6 text-muted-foreground">{reward}</p>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
