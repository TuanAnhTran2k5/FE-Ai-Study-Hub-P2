import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import ProfileBadgesCard from "@/components/profile/ProfileBadgesCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverviewCard from "@/components/profile/ProfileOverviewCard";
import RankPrivilegesCard from "@/components/profile/RankPrivilegesCard";
import ProfileStatsGrid from "@/components/profile/ProfileStatsGrid";
import { Card, CardContent } from "@/components/ui/card";
import { updateProfile } from "@/redux/features/userSlice";
import type { RootState } from "@/redux/store";
import { getUserProfile } from "@/services/userService";

function ProfilePage() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getUserProfile,
    enabled: !!reduxUser,
  });

  useEffect(() => {
    if (profile) {
      dispatch(updateProfile(profile));
    }
  }, [profile, dispatch]);

  const user = profile ?? reduxUser;

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="font-bold text-card-foreground">
              Please login to view your profile.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isLoading && !profile) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="font-bold text-card-foreground">
              Loading profile...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 space-y-6">
      
      {/* 1. Header (My Profile / Edit button) */}
      <ProfileHeader user={user} />

      {/* 2. Overview Card (Personal Information & Storage Details) */}
      <ProfileOverviewCard user={user} />

      {/* 3. Statistics Grid (Tổng số tài liệu, lượt tải, bookmark tĩnh - Đưa lên trên) */}
      <ProfileStatsGrid user={user} />

      {/* 4. Rank Privileges Card (Đặc quyền Hạng thành viên - Đưa xuống dưới) */}
      <RankPrivilegesCard 
        currentRank={user.currentRank} 
        rankProgress={user.rankProgress} 
      />

      {/* 5. Full Badges Card (Tôn vinh toàn bộ danh hiệu đã đạt được) */}
      <ProfileBadgesCard badges={user.badges ?? []} />
      
    </section>
  );
}

export default ProfilePage;