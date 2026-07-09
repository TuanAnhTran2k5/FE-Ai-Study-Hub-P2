import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/userService";
import { getMyDocuments } from "@/services/documentService";

// Import Dashboard Sub-components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RankProgressCard from "@/components/dashboard/RankProgressCard";
import CloudStorageCard from "@/components/dashboard/CloudStorageCard";
import RecentDocsTable from "@/components/dashboard/RecentDocsTable";
import RecentActivitiesList from "@/components/dashboard/RecentActivitiesList";
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

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 space-y-6">
      
      {/* 1. WELCOME HEADER */}
      <DashboardHeader 
        fullName={user.fullName} 
        currentRank={user.currentRank} 
      />

      {/* MAIN CONTENT LAYOUT */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* COLUMN LEFT (8 COLS) - Hướng về tiến trình học tập và tài liệu đăng */}
        <div className="md:col-span-8 space-y-6">
          {/* 2. RANK ROADMAP TIMELINE */}
          <RankProgressCard 
            totalScore={user.totalScore}
            rankProgress={user.rankProgress}
            currentRank={user.currentRank}
          />

          {/* 3. RECENT UPLOADED DOCUMENTS */}
          <RecentDocsTable documents={documents} />
        </div>

        {/* COLUMN RIGHT (4 COLS) - Hướng về lưu trữ, tương tác động & phím tắt */}
        <div className="md:col-span-4 space-y-6">
          {/* 4. CLOUD STORAGE RADIAL PROGRESS */}
          <CloudStorageCard 
            storageUsed={user.storageUsed ?? 0}
            storageLimit={user.storageLimit ?? 104857600}
          />

          {/* 5. RECENT ACTIVITIES / NOTIFICATIONS (ĐỘNG) */}
          <RecentActivitiesList />

          {/* 6. QUICK SHORTCUT ACTIONS */}
          <QuickActionsCard />
        </div>

      </div>
    </section>
  );
}
