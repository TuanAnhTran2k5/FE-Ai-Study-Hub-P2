import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// NOTE TYPE: State filter duoc CommunityPage giu.
// Component nay chi render control va bao nguoc thay doi, khong tu loc document.
export interface FilterState {
  subject: string;
  semester: string;
  documentType: string;
  fileType: string;
  rating: number;
}

// NOTE PROPS: subjects/semesters da duoc CommunityPage chuan hoa tu API academic subjects.
interface CommunityFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  subjects: { code: string; name: string }[];
  semesters: number[];
}

const selectContentClassName =
  "z-[80] max-h-64 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-xl border border-border bg-popover shadow-xl";

const selectItemClassName = "cursor-pointer truncate py-2";

export function CommunityFilters({
  filters,
  onFilterChange,
  subjects,
  semesters,
}: CommunityFiltersProps) {
  // NOTE ACTION: Reset tat ca filter ve trang thai "All".
  const handleReset = () => {
    onFilterChange({
      subject: "ALL",
      semester: "ALL",
      documentType: "ALL",
      fileType: "ALL",
      rating: 0,
    });
  };

  // NOTE ACTION: Dung chung cho tat ca select/star de cap nhat dung 1 field filter.
  const updateFilter = (key: keyof FilterState, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-card-foreground">Filter</h3>
        <button
          type="button"
          onClick={handleReset}
          className="cursor-pointer text-xs font-semibold text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Subjects
          </label>
          <Select
            value={filters.subject}
            onValueChange={(val) => updateFilter("subject", val)}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/50 px-3">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className={selectContentClassName}
            >
              <SelectItem className={selectItemClassName} value="ALL">
                All Subjects
              </SelectItem>
              {subjects.map((s) => (
                <SelectItem
                  key={s.code}
                  className={selectItemClassName}
                  value={s.code}
                >
                  {s.code} - {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Semesters
          </label>
          <Select
            value={filters.semester}
            onValueChange={(val) => updateFilter("semester", val)}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/50 px-3">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className={selectContentClassName}
            >
              <SelectItem className={selectItemClassName} value="ALL">
                All Semesters
              </SelectItem>
              {semesters.map((sem) => (
                <SelectItem
                  key={sem}
                  className={selectItemClassName}
                  value={sem.toString()}
                >
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            File Type
          </label>
          <Select
            value={filters.fileType}
            onValueChange={(val) => updateFilter("fileType", val)}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/50 px-3">
              <SelectValue placeholder="All File Types" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className={selectContentClassName}
            >
              <SelectItem className={selectItemClassName} value="ALL">
                All File Types
              </SelectItem>
              <SelectItem className={selectItemClassName} value="PDF">
                PDF
              </SelectItem>
              <SelectItem className={selectItemClassName} value="DOCX">
                DOCX
              </SelectItem>
              <SelectItem className={selectItemClassName} value="PPTX">
                PPTX
              </SelectItem>
              <SelectItem className={selectItemClassName} value="XLSX">
                XLSX
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Rating
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "5", value: 5 },
              { label: "4 & up", value: 4 },
              { label: "3 & up", value: 3 },
              { label: "All", value: 0 },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => updateFilter("rating", r.value)}
                className={`flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filters.rating === r.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {r.value > 0 && <Star className="h-3 w-3 fill-current" />}
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="mt-4 w-full cursor-pointer rounded-xl font-bold"
          onClick={() => {}}
        >
          {/* NOTE UI: Filter ap dung ngay khi doi select/star. Nut nay giu de dung thiet ke. */}
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
