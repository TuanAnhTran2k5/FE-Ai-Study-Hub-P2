import { useQuery } from "@tanstack/react-query";
import { getTopContributors } from "@/services/communityService";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopContributors() {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ["topContributors"],
    queryFn: getTopContributors,
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-card-foreground">
          Top Contributors This Week
        </h3>
        <button className="cursor-pointer text-xs font-semibold text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          : contributors?.map((contributor) => (
              <div key={contributor.id} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    contributor.rank === 1
                      ? "bg-primary/20 text-primary"
                      : contributor.rank === 2
                      ? "bg-muted text-muted-foreground"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {contributor.rank}
                </div>
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage
                    src={contributor.avatar}
                    alt={contributor.name}
                  />
                  <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-card-foreground">
                    {contributor.name}
                  </p>
                  <p className="truncate text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                    {contributor.role}
                  </p>
                </div>
                <div className="text-xs font-bold text-card-foreground shrink-0">
                  {contributor.points} pts
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
