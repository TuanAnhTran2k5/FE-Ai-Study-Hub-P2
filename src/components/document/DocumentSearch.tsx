import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisibilityStatus } from "@/models/document.enum";

interface DocumentSearchProps {
  keyword: string;
  subjectCode: string;
  semesterNo: string;
  visibilityStatus: string;

  subjects: {
    subjectCode: string;
    subjectName: string;
  }[];

  semesters: Array<number | string>;

  onKeywordChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onVisibilityChange: (value: string) => void;
}

function DocumentSearch({
  keyword,
  subjectCode,
  semesterNo,
  visibilityStatus,
  subjects,
  semesters,
  onKeywordChange,
  onSubjectChange,
  onSemesterChange,
  onVisibilityChange,
}: DocumentSearchProps) {
  return (
    <section className="mb-8">
      <div className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="grid gap-4 h-14 lg:grid-cols-[1fr_180px_180px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Search documents, subjects, or uploader..."
              className="h-full rounded-2xl border-border bg-card pl-12 text-base text-card-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Select value={subjectCode} onValueChange={onSubjectChange}>
            <SelectTrigger className="!h-full w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>

            <SelectContent className="max-h-72 rounded-2xl bg-popover text-popover-foreground">
              <SelectItem className="h-10 rounded-xl text-base" value="ALL">
                All Subjects
              </SelectItem>

              {subjects.map((subject) => (
                <SelectItem
                  key={subject.subjectCode}
                  value={subject.subjectCode}
                >
                  {subject.subjectCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={semesterNo} onValueChange={onSemesterChange}>
            <SelectTrigger className="!h-full w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>

            <SelectContent className="max-h-72 rounded-2xl bg-popover text-popover-foreground">
              <SelectItem className="h-10 rounded-xl text-base" value="ALL">
                All Semesters
              </SelectItem>

              {semesters.map((semester) => (
                <SelectItem key={semester} value={String(semester)}>
                  Semester {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibilityStatus} onValueChange={onVisibilityChange}>
            <SelectTrigger className="!h-full w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Visibility</SelectItem>
              <SelectItem value={VisibilityStatus.PUBLIC}>Public</SelectItem>
              <SelectItem value={VisibilityStatus.PRIVATE}>Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

export default DocumentSearch;
