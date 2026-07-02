import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Bookmark,
  CalendarDays,
  Database,
  Download,
  FileText,
  Mail,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import PointCoin from "@/components/PointCoin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBookmarks, getMyDocuments } from "@/services/documentService";
import { getTopWeeklyUsers } from "@/services/leaderboardService";
import type { UserResponse } from "@/types/user.type";

const DEFAULT_STORAGE_LIMIT_BYTES = 2 * 1024 * 1024 * 1024;
const GOLD_STORAGE_LIMIT_BYTES = 3 * 1024 * 1024 * 1024;

function formatNumber(value?: number | null) {
  if (!value) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

function formatDate(date?: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN");
}

function formatStorage(bytes?: number | null) {
  const value = bytes ?? 0;

  if (value <= 0) return "0 B";

  if (value >= 1024 * 1024 * 1024) {
    return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  if (value >= 1024 * 1024) {
    return `${(value / 1024 / 1024).toFixed(2)} MB`;
  }

  if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} KB`;
  }

  return `${value} B`;
}

function getStorageLimit(user: UserResponse) {
  const rankName = user.rank?.rank?.rankName?.toLowerCase() || "";
  const score = user.totalScore ?? 0;

  const isGoldOrHigher =
    rankName.includes("gold") ||
    rankName.includes("elite") ||
    score >= 301;

  const fallbackLimit = isGoldOrHigher
    ? GOLD_STORAGE_LIMIT_BYTES
    : DEFAULT_STORAGE_LIMIT_BYTES;

  return user.storageLimit && user.storageLimit > 0
    ? Math.max(user.storageLimit, fallbackLimit)
    : fallbackLimit;
}

function getRankTitle(user: UserResponse) {
  if (user.rank?.rank?.rankName) return user.rank.rank.rankName;

  const score = user.totalScore ?? 0;

  if (score >= 700) return "Elite Scholar";
  if (score >= 301) return "Gold Mentor";
  if (score >= 101) return "Silver Contributor";
  return "Bronze Student";
}

function getRoleLabel(role: UserResponse["role"]) {
  return role === "AD" ? "Admin" : "User";
}

function getStatusClassName(status: UserResponse["status"]) {
  if (status === "ACTIVE") return "text-emerald-400 border-emerald-400/40";
  if (status === "PENDING") return "text-yellow-400 border-yellow-400/40";
  return "text-red-400 border-red-400/40";
}

function ProfilePage() {
  const user = useSelector(
    (state: { user: UserResponse | null }) => state.user,
  );

  const { data: myDocuments = [] } = useQuery({
    queryKey: ["profile-my-documents"],
    queryFn: getMyDocuments,
    enabled: !!user,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["profile-bookmarks"],
    queryFn: getBookmarks,
    enabled: !!user,
  });

  const { data: weeklyUsers = [] } = useQuery({
    queryKey: ["profile-top-weekly-users"],
    queryFn: () => getTopWeeklyUsers(100),
    enabled: !!user,
  });

  const leaderboardRank = useMemo(() => {
    if (!user) return "-";

    const currentUserId = Number(user.userId);

    const index = weeklyUsers.findIndex(
      (weeklyUser) => weeklyUser.userId === currentUserId,
    );

    return index >= 0 ? `#${index + 1}` : "-";
  }, [weeklyUsers, user]);

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

  const totalDocuments = myDocuments.length;

  const totalDownloads = myDocuments.reduce(
    (total, document) => total + (document.downloadCount ?? 0),
    0,
  );

  const totalBookmarks = bookmarks.length;

  const storageUsed = user.storageUsed ?? 0;
  const storageLimit = getStorageLimit(user);
  const storageRemaining = Math.max(storageLimit - storageUsed, 0);

  const storagePercent =
    storageLimit > 0
      ? Math.min(100, Number(((storageUsed / storageLimit) * 100).toFixed(1)))
      : 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <User className="h-5 w-5" />
            My Profile
          </p>

          <h1 className="mt-2 text-4xl font-black text-card-foreground">
            Personal Information
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Manage your account, cloud storage, reputation points, badges, and
            learning activity.
          </p>
        </div>

        <EditProfileDialog user={user} />
      </div>

      <Card className="mb-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <AvatarFrame
              score={user.totalScore}
              avatarUrl={user.avatarUrl}
              fullName={user.fullName}
              size="lg"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black uppercase text-card-foreground md:text-3xl">
                  {user.fullName || "Unknown User"}
                </h2>

                {user.status === "ACTIVE" && (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="rounded-full bg-yellow-500/15 px-3 py-1 font-bold text-yellow-500 hover:bg-yellow-500/15">
                  <Award className="mr-1 h-4 w-4" />
                  {getRankTitle(user)}
                </Badge>

                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Role: {getRoleLabel(user.role)}
                </Badge>

                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 ${getStatusClassName(
                    user.status,
                  )}`}
                >
                  {user.status}
                </Badge>
              </div>

              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {user.email || "No email"}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Joined{" "}
                  <span className="font-semibold text-card-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-secondary/50 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Cloud Storage
                </p>
                <p className="text-xs text-muted-foreground">
                  Default 2GB, Gold rank and higher get 3GB
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StorageInfo
                label="Used"
                value={formatStorage(storageUsed)}
                highlight
              />

              <StorageInfo label="Limit" value={formatStorage(storageLimit)} />

              <StorageInfo
                label="Remaining"
                value={formatStorage(storageRemaining)}
              />
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-start to-primary-end"
                style={{ width: `${storagePercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{storagePercent}% used</span>
              <span>
                {formatStorage(storageUsed)} / {formatStorage(storageLimit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <ProfileStat
          icon={<FileText className="h-6 w-6" />}
          value={totalDocuments}
          label="Documents"
        />

        <ProfileStat
          icon={<Download className="h-6 w-6" />}
          value={totalDownloads}
          label="Downloads"
        />

        <ProfileStat
          icon={<Bookmark className="h-6 w-6" />}
          value={totalBookmarks}
          label="Bookmarks"
        />

        <ProfileStat
          icon={<PointCoin size={28} />}
          value={formatNumber(user.totalScore)}
          label="Reputation Points"
        />

        <ProfileStat
          icon={<Trophy className="h-6 w-6" />}
          value={leaderboardRank}
          label="Leaderboard Rank"
        />
      </div>

      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-black text-card-foreground">
              Earned Badges
            </h3>
            <p className="text-sm text-muted-foreground">
              Badges you have unlocked through learning activities.
            </p>
          </div>

          {user.badges && user.badges.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {user.badges.map((item) => (
                <div
                  key={item.userBadgeId}
                  className="rounded-2xl border border-border bg-secondary/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      {item.badge.iconUrl ? (
                        <img
                          src={item.badge.iconUrl}
                          alt={item.badge.badgeName}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <Award className="h-6 w-6 text-primary" />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-card-foreground">
                        {item.badge.badgeName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.achievedAt)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {item.badge.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <Award className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-bold text-card-foreground">
                No badges yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload documents, get downloads, and earn reputation points to
                unlock badges.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function StorageInfo({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-black ${
          highlight ? "text-primary" : "text-card-foreground"
        }`}
      >
        {value}
      </p>
    </div>
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
    <Card className="rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
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