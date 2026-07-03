import { Star } from "lucide-react";

// NOTE TYPE: CommunityPage giu state filter; component nay chi render UI va bao nguoc thay doi.
export interface FilterState {
  subject: string;
  semester: string;
  documentType: string;
  fileType: string;
  rating: number;
}

interface CommunityFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function CommunityFilters({
  filters,
  onFilterChange,
}: CommunityFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string | number) => {
    onFilterChange({
      ...filters,
      [key]: value,
      ...(key === "semester" ? { subject: "ALL" } : {}),
    });
  };

  return (
    <section className="mb-6 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-black text-card-foreground">Rating</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Filter documents by average rating.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "5", value: 5 },
          { label: "4 & up", value: 4 },
          { label: "3 & up", value: 3 },
          { label: "All", value: 0 },
        ].map((rating) => (
          <button
            key={rating.value}
            type="button"
            onClick={() => updateFilter("rating", rating.value)}
            className={`flex h-9 cursor-pointer items-center gap-1 rounded-full border px-4 text-xs font-bold transition-colors ${
              filters.rating === rating.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {rating.value > 0 && <Star className="size-3 fill-current" />}
            {rating.label}
          </button>
        ))}
      </div>
    </section>
  );
}
