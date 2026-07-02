import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { getTrendingSubjects } from "@/services/communityService";

// NOTE COMPONENT: Card phụ ở trang Community, hiển thị các môn học đang có nhiều tài liệu.
// Dữ liệu đi qua communityService để sau này đổi endpoint/backend không phải sửa UI.
export function TrendingSubjects() {
  // NOTE API: React Query gọi service và cache theo key "trendingSubjects".
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["trendingSubjects"],
    queryFn: getTrendingSubjects,
  });

  // NOTE UI: Khi đang load thì hiện skeleton, khi có data thì render danh sách subject.
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-card-foreground">Trending Subjects</h3>
        <button className="cursor-pointer text-xs font-semibold text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading
          // NOTE UI: Skeleton giữ bố cục ổn định trong lúc chờ API.
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          : subjects?.map((subject) => (
              <div key={subject.code} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    <span className="font-bold text-primary mr-1">
                      {subject.code}
                    </span>
                    - {subject.name}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {subject.docCount.toLocaleString()} docs
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
