import {
  Award,
  Bookmark,
  Download,
  Edit,
  FileText,
  Mail,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/types/user.type";
import PointCoin from "@/components/PointCoin";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";

function formatNumber(value?: number | null) {
  if (!value) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function formatDate(date?: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
}

function getRankTitle(totalScore?: number | null) {
  const score = totalScore ?? 0;

  if (score >= 700) return "Elite Scholar";
  if (score >= 301) return "Gold Mentor";
  if (score >= 101) return "Silver Contributor";
  return "Bronze Student";
}

function ProfilePage() {
  const user = useSelector(
    (state: { user: UserResponse | null }) => state.user,
  );

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

  const storageUsed = user.storageUsed ?? 0;
  const storageLimit = user.storageLimit ?? 0;

  const storagePercent =
    storageLimit > 0
      ? Math.min(100, Math.round((storageUsed / storageLimit) * 100))
      : 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <User className="h-5 w-5" />
            My Profile
          </p>

          <h1 className="mt-2 text-4xl font-bold text-card-foreground">
            Personal Information
          </h1>

          <p className="mt-3 text-muted-foreground">
            Manage your account, storage usage, reputation points, and learning
            activity.
          </p>
        </div>

        <Button variant="outline" className="h-11 rounded-xl font-bold cursor-pointer">
          <Edit className="mr-2 h-4 w-4 " />
          Edit Profile
        </Button>
      </div>

      <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="grid gap-8 p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="flex items-center gap-6">
            <AvatarFrame
              score={user.totalScore}
              avatarUrl={user.avatarUrl}
              fullName={user.fullName}
              size="lg"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-card-foreground">
                  {user.fullName || "Unknown User"}
                </h2>

                {user.status === "ACTIVE" && (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
              </div>

              <p className="mt-1 flex items-center gap-2 font-bold text-yellow-500">
                <Award className="h-4 w-4" />
                {getRankTitle(user.totalScore)}
              </p>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email || ""}
                </p>

                <p>
                  Joined{" "}
                  <span className="font-semibold">
                    {formatDate(user.createdAt)}
                  </span>
                </p>

                <p>
                  Role:{" "}
                  <span className="font-semibold text-card-foreground">
                    {user.role}
                  </span>
                </p>

                <p>
                  Status:{" "}
                  <span className="font-semibold text-card-foreground">
                    {user.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-secondary/60 p-6">
            <p className="text-sm font-bold text-muted-foreground">
              Cloud Storage
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-black text-card-foreground">
                {storageUsed} MB
              </p>

              <p className="text-sm text-muted-foreground">
                / {storageLimit} MB
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-start to-primary-end"
                style={{ width: `${storagePercent}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {storagePercent}% storage used
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        <ProfileStat
          icon={<FileText className="h-6 w-6" />}
          value="0"
          label="Documents"
        />

        <ProfileStat
          icon={<Download className="h-6 w-6" />}
          value="0"
          label="Downloads"
        />

        <ProfileStat
          icon={<Bookmark className="h-6 w-6" />}
          value="0"
          label="Bookmarks"
        />

        <ProfileStat
          icon={<PointCoin size={28} />}
          value={formatNumber(user.totalScore)}
          label="Reputation Points"
        />

        <ProfileStat
          icon={<Trophy className="h-6 w-6" />}
          value="-"
          label="Leaderboard Rank"
        />
      </div>
    </section>
  );
}

function ProfileStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="rounded-3xl border border-border bg-card shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-black text-card-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
