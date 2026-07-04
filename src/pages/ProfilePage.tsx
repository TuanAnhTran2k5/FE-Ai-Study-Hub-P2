import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import ProfileBadgesCard from "@/components/profile/ProfileBadgesCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverviewCard from "@/components/profile/ProfileOverviewCard";
import ProfileRankProgressCard from "@/components/profile/ProfileRankProgressCard";
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
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <ProfileHeader user={user} />

      <ProfileOverviewCard user={user} />

      <ProfileRankProgressCard rankProgress={user.rankProgress} />

      <ProfileStatsGrid user={user} />

      <ProfileBadgesCard badges={user.badges ?? []} />
    </section>
  );
}

export default ProfilePage;