import { Award, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import ProfileStorageCard from "@/components/profile/ProfileStorageCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/types/user.type";

interface ProfileOverviewCardProps {
  user: UserResponse;
}

function formatDate(date?: string | null, language?: string) {
  if (!date) return "N/A";
  const locale = language === "vi" ? "vi-VN" : "en-US";
  return new Date(date).toLocaleDateString(locale);
}


function getStatusLabel(user: UserResponse) {
  return user.displayStatus || user.status;
}

function getStatusClassName(status: UserResponse["status"]) {
  if (status === "ACTIVE") return "text-emerald-400 border-emerald-400/40";
  if (status === "PENDING") return "text-yellow-400 border-yellow-400/40";
  return "text-red-400 border-red-400/40";
}

function getRankName(user: UserResponse, fallback: string) {
  return user.currentRank?.rank.rankName || fallback;
}

function ProfileOverviewCard({ user }: ProfileOverviewCardProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "vi";

  return (
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
                {user.fullName || t("profile.unknownUser", "Unknown User")}
              </h2>

              {user.status === "ACTIVE" && (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-yellow-500/15 px-3 py-1 font-bold text-yellow-500 hover:bg-yellow-500/15">
                <Award className="mr-1 h-4 w-4" />
                {getRankName(user, t("profile.noRank", "No Rank"))}
              </Badge>



              <Badge
                variant="outline"
                className={`rounded-full px-3 py-1 ${getStatusClassName(
                  user.status,
                )}`}
              >
                {getStatusLabel(user)}
              </Badge>
            </div>

            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {user.email || t("profile.noEmail", "No email")}
              </p>

              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {t("profile.joined", "Joined")}{" "}
                <span className="font-semibold text-card-foreground">
                  {formatDate(user.createdAt, currentLanguage)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <ProfileStorageCard user={user} />
      </CardContent>
    </Card>
  );
}

export default ProfileOverviewCard;