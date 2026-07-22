import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          <h3 className="text-sm font-black text-card-foreground">{t("community.rating", "Rating")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("community.ratingDesc", "Filter documents by average rating.")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "5", value: 5 },
          { label: "4", value: 4 },
          { label: "3", value: 3 },
          { label: "2", value: 2 },
          { label: "1", value: 1 },
          { label: t("community.ratingAll", "All"), value: 0 },
        ].map((rating) => (
          <button
            key={rating.label}
            type="button"
            onClick={() => updateFilter("rating", rating.value)}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-colors ${
              filters.rating === rating.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {rating.value > 0 ? (
              <div className="flex items-center gap-1 text-base text-current">
                {Array.from({ length: rating.value }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
            ) : (
              <span>{t("community.ratingAll", "All")}</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
