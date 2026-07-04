import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import MyLeaderboardRankCard from "@/components/leaderboard/MyLeaderboardRankCard";
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import GlobalLeaderboardTable from "@/components/leaderboard/GlobalLeaderboardTable";
import WeeklyLeaderboardTable from "@/components/leaderboard/WeeklyLeaderboardTable";
import RankRewardCard from "@/components/leaderboard/RankRewardCard";
import BadgeCard from "@/components/leaderboard/BadgeCard";

import {
  getBadges,
  getGlobalLeaderboard,
  getMyLeaderboardRank,
  getRanks,
  getTopWeeklyUsers,
} from "@/services/leaderboardService";

function LeaderboardPage() {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: globalLeaderboard, isLoading: isGlobalLoading } = useQuery({
    queryKey: ["globalLeaderboard", page, size],
    queryFn: () => getGlobalLeaderboard(page, size),
  });

  const { data: myRank } = useQuery({
    queryKey: ["myLeaderboardRank"],
    queryFn: getMyLeaderboardRank,
  });

  const { data: weeklyUsers = [] } = useQuery({
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

  const users = globalLeaderboard?.content ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <LeaderboardHeader />

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <MyLeaderboardRankCard myRank={myRank} />
        <LeaderboardStats
          totalUsers={myRank?.totalUsers ?? globalLeaderboard?.totalElements ?? 0}
          totalRanks={ranks.length}
          totalBadges={badges.length}
        />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-4">
        {ranks
          .slice()
          .sort((a, b) => a.minScore - b.minScore)
          .map((rank) => (
            <RankRewardCard key={rank.rankId} rank={rank} />
          ))}
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <BadgeCard key={badge.badgeId} badge={badge} />
        ))}
      </div>

      <GlobalLeaderboardTable
        users={users}
        isLoading={isGlobalLoading}
        page={page}
        totalPages={globalLeaderboard?.totalPages ?? 0}
        onPageChange={setPage}
      />

      <WeeklyLeaderboardTable users={weeklyUsers} />
    </section>
  );
}

export default LeaderboardPage;