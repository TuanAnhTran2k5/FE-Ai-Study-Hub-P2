import { useTranslation } from "react-i18next";
import { Award, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserBadge } from "@/types/user.type";

interface LatestBadgesCardProps {
  badges?: UserBadge[];
}

export default function LatestBadgesCard({ badges }: LatestBadgesCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground mb-4">
          {t("dashboard.badges.title")}
        </h3>

        {badges && badges.length > 0 ? (
          <div className="space-y-3">
            {badges.slice(-3).reverse().map((item) => (
              <div 
                key={item.userBadgeId}
                className="flex items-center gap-3 p-2 bg-secondary/15 rounded-2xl border border-border/30 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/30 p-1 text-primary shrink-0 border border-border/30 overflow-hidden">
                  {item.badge.iconUrl ? (
                    <img 
                      src={
                        item.badge.iconUrl.startsWith("data:")
                          ? item.badge.iconUrl
                          : `${item.badge.iconUrl}?t=${Date.now()}`
                      } 
                      alt={item.badge.badgeName} 
                      className="size-full object-contain"
                    />
                  ) : (
                    <Medal className="h-5 w-5 opacity-80" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-card-foreground truncate">
                    {item.badge.badgeName}
                  </h4>
                  <p className="text-[9px] text-muted-foreground truncate mt-0.5">
                    {item.badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-border/60 rounded-xl bg-secondary/5">
            <Award className="mx-auto h-7 w-7 text-muted-foreground opacity-40 mb-1" />
            <p className="text-[10px] text-muted-foreground font-medium">
              {t("dashboard.badges.empty")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
