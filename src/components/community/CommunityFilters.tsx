import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
  subjects: { code: string; name: string }[];
  semesters: number[];
}

export function CommunityFilters({
  filters,
  onFilterChange,
  subjects,
  semesters,
}: CommunityFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      subject: "ALL",
      semester: "ALL",
      documentType: "ALL",
      fileType: "ALL",
      rating: 0,
    });
  };

  const updateFilter = (key: keyof FilterState, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-card-foreground">Filter</h3>
        <button
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
            <SelectTrigger className="w-full bg-secondary/50 border-border">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.code} value={s.code}>
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
            <SelectTrigger className="w-full bg-secondary/50 border-border">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Semesters</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
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
            <SelectTrigger className="w-full bg-secondary/50 border-border">
              <SelectValue placeholder="All File Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All File Types</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="DOCX">DOCX</SelectItem>
              <SelectItem value="PPTX">PPTX</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
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
                onClick={() => updateFilter("rating", r.value)}
                className={`cursor-pointer flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${filters.rating === r.value
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

        <Button className="cursor-pointer w-full mt-4 font-bold rounded-xl" onClick={() => { }}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
