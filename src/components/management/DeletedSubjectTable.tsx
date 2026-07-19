import { BookOpen, Loader2, RotateCcw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubjectResponse } from "@/types/curriculum.type";

interface DeletedSubjectTableProps {
  subjects: SubjectResponse[];
  isLoading: boolean;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onRestoreClick: (id: number) => void;
  isRestoring: boolean;
}

export default function DeletedSubjectTable({
  subjects,
  isLoading,
  searchKeyword,
  onSearchChange,
  onRestoreClick,
  isRestoring,
}: DeletedSubjectTableProps) {
  const sortedSubjects = [...subjects].sort(
    (a, b) => a.semesterId - b.semesterId,
  );

  return (
    <div className="space-y-6">
      <div className="flex max-w-md items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deleted subjects..."
            value={searchKeyword}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>

        <Badge
          variant="outline"
          className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/10 px-3 text-xs font-bold"
        >
          Total: {subjects.length}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">Loading deleted subjects...</p>
        </div>
      ) : sortedSubjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 font-bold text-card-foreground">
            No Deleted History
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Deleted subjects will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="w-[120px] font-bold">Subj Code</TableHead>
                <TableHead className="font-bold">Subject Name</TableHead>
                <TableHead className="w-[120px] font-bold">Type</TableHead>
                <TableHead className="w-[120px] font-bold">Semester</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="w-[120px] text-right font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedSubjects.map((subject) => (
                <TableRow
                  key={subject.subjectId}
                  className="bg-muted/20 opacity-60"
                >
                  <TableCell className="font-bold text-primary">
                    {subject.subjectCode}
                  </TableCell>
                  <TableCell className="font-semibold text-card-foreground">
                    {subject.subjectName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        subject.subjectType === "CORE"
                          ? "rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/10"
                          : "rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/10"
                      }
                    >
                      {subject.subjectType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">
                    {subject.semesterNo || `Sem ${subject.semesterId}`}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {subject.description || "No description provided."}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRestoring}
                      onClick={() => onRestoreClick(subject.subjectId)}
                      className="cursor-pointer rounded-xl text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
