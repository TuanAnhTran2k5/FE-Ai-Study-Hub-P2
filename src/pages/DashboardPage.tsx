import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/userService";
import { getMyDocuments } from "@/services/documentService";

// Import Dashboard Sub-components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import RankProgressCard from "@/components/dashboard/RankProgressCard";
import CloudStorageCard from "@/components/dashboard/CloudStorageCard";
import RecentDocsTable from "@/components/dashboard/RecentDocsTable";
import LatestBadgesCard from "@/components/dashboard/LatestBadgesCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  // Fetch User Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getUserProfile,
  });

  // Fetch User Documents
  const { data: documents = [], isLoading: isDocsLoading } = useQuery({
    queryKey: ["my-documents"],
    queryFn: getMyDocuments,
  });

  if (isProfileLoading || isDocsLoading) {
    return <DashboardSkeleton />;
  }

  const user = profile;
  if (!user) return null;

  // Extract Stats
  const docCount = user.statistics?.documents ?? 0;
  const downloadCount = user.statistics?.downloads ?? 0;
  const globalRank = user.leaderboard?.globalRank ? `#${user.leaderboard.globalRank}` : "N/A";
  const weeklyRank = user.leaderboard?.weeklyRank ? `#${user.leaderboard.weeklyRank}` : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 space-y-6">
      
      {/* 1. WELCOME HEADER */}
      <DashboardHeader 
        fullName={user.fullName} 
        currentRank={user.currentRank} 
      />

      {/* 2. QUICK GRADIENT STATS GRID */}
      <DashboardStatsGrid 
        docCount={docCount}
        downloadCount={downloadCount}
        globalRank={globalRank}
        weeklyRank={weeklyRank}
      />

      {/* MAIN CONTENT LAYOUT */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* COLUMN LEFT (8 COLS) */}
        <div className="md:col-span-8 space-y-6">
          {/* 3. RANK ROADMAP TIMELINE */}
          <RankProgressCard 
            totalScore={user.totalScore}
            rankProgress={user.rankProgress}
            currentRank={user.currentRank}
          />

          {/* 4. RECENT UPLOADED DOCUMENTS */}
          <RecentDocsTable documents={documents} />
        </div>

        {/* COLUMN RIGHT (4 COLS) */}
        <div className="md:col-span-4 space-y-6">
          {/* 5. CLOUD STORAGE RADIAL PROGRESS */}
          <CloudStorageCard 
            storageUsed={user.storageUsed ?? 0}
            storageLimit={user.storageLimit ?? 104857600}
          />

          {/* 6. LATEST BADGES RECEIVED */}
          <LatestBadgesCard badges={user.badges} />

          {/* 7. QUICK SHORTCUT ACTIONS */}
          <QuickActionsCard />
        </div>

      </div>
    </section>
  );
}
