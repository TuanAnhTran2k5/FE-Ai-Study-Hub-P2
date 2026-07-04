import { Card, CardContent } from "@/components/ui/card";
import type { RankProgress } from "@/types/user.type";

interface ProfileRankProgressCardProps {
  rankProgress?: RankProgress | null;
}

function formatPercent(value?: number | null) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function ProfileRankProgressCard({
  rankProgress,
}: ProfileRankProgressCardProps) {
  if (!rankProgress) return null;

  const progress = Math.min(100, Number(rankProgress.progressPercent ?? 0));

  return (
    <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-card-foreground">
              Rank Progress
            </h3>

            <p className="text-sm text-muted-foreground">
              Next rank: {rankProgress.nextRank || "Max rank"}
            </p>
          </div>

          <p className="text-sm font-bold text-primary">
            {formatPercent(progress)}
          </p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-start to-primary-end"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Remaining score: {rankProgress.remainingScore ?? 0}
        </p>
      </CardContent>
    </Card>
  );
}

export default ProfileRankProgressCard;