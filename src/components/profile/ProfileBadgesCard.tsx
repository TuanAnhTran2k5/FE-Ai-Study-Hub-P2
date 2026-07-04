import { Award } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { UserBadge } from "@/types/user.type";

interface ProfileBadgesCardProps {
  badges: UserBadge[];
}

function formatDate(date?: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN");
}

function ProfileBadgesCard({ badges }: ProfileBadgesCardProps) {
  return (
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

        {badges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {badges.map((item) => (
              <div
                key={item.userBadgeId}
                className="rounded-2xl border border-border bg-secondary/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                    {item.badge.iconUrl ? (
                      <img
                        src={item.badge.iconUrl}
                        alt={item.badge.badgeName}
                        className="h-full w-full object-cover"
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
  );
}

export default ProfileBadgesCard;