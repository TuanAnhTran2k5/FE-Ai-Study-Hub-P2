import { useState } from "react";
import { Award, Calendar, Medal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import type { UserBadge } from "@/types/user.type";

interface ProfileBadgesCardProps {
  badges: UserBadge[];
}

export default function ProfileBadgesCard({ badges }: ProfileBadgesCardProps) {
  const { t, i18n } = useTranslation();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* CARD HEADER */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-card-foreground">
              {t("profile.badges.title")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("profile.badges.subtitle")}
            </p>
          </div>
        </div>

        {/* BADGES GRID */}
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {badges.map((item) => {
              const badgeId = item.badge.badgeId;
              const hasError = imageErrors[badgeId];

              return (
                <div
                  key={item.userBadgeId}
                  className="group w-full sm:w-[320px] shrink-0 rounded-3xl border border-border/60 bg-secondary/10 hover:bg-secondary/20 hover:border-primary/30 transition-all duration-300 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden"
                >
                  {/* Decorative background glow on hover */}
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      {/* Logo Icon Wrapper */}
                      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary/25 border border-border/40 p-1.5 text-primary">
                        {hasError || !item.badge.iconUrl ? (
                          <Medal className="h-7 w-7 opacity-75 animate-pulse" />
                        ) : (
                          <img
                            src={
                              item.badge.iconUrl.startsWith("data:")
                                ? item.badge.iconUrl
                                : `${item.badge.iconUrl}?t=${Date.now()}`
                            }
                            alt={item.badge.badgeName}
                            className="size-full object-contain transition-transform duration-500 group-hover:scale-110"
                            onError={() => {
                              setImageErrors((prev) => ({
                                ...prev,
                                [badgeId]: true,
                              }));
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-card-foreground truncate">
                          {item.badge.badgeName}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 bg-secondary/35 w-fit px-2 py-0.5 rounded-lg border border-border/30">
                          <Calendar className="h-3 w-3 text-primary/75" />
                          <span>
                            {t("profile.badges.achievedAt")}: {formatDate(item.achievedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border py-12 text-center bg-secondary/5">
            <Award className="mx-auto h-12 w-12 text-muted-foreground opacity-50 animate-bounce" />
            <h4 className="mt-4 font-bold text-card-foreground text-sm">
              {t("profile.badges.emptyTitle")}
            </h4>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              {t("profile.badges.emptyDesc")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}