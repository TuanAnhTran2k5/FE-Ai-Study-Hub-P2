import { Plus, Edit2, Trash2, Search, BookOpen, Loader2, FileText, RotateCcw, } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { SubjectResponse } from "@/types/curriculum.type";

interface SubjectTableProps {
  subjects: SubjectResponse[];
  isLoading: boolean;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onAddClick: () => void;
  onEditClick: (subject: SubjectResponse) => void;
  onDeleteClick: (id: number, identifier: string) => void;
  onRestoreClick: (id: number) => void;
  onManageSyllabusClick: (subject: SubjectResponse) => void;
}

export default function SubjectTable({
  subjects,
  isLoading,
  searchKeyword,
  onSearchChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onRestoreClick,
  onManageSyllabusClick,
}: SubjectTableProps) {
  // Sắp xếp danh sách môn học theo Học kỳ (semesterId) tăng dần
  const sortedSubjects = [...subjects].sort((a, b) => a.semesterId - b.semesterId);

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects by code or name..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 rounded-xl pl-10"
            />
          </div>
          <Badge
            variant="outline"
            className="h-11 px-3 rounded-xl border border-border font-bold text-xs bg-secondary/10 flex items-center justify-center shrink-0"
          >
            Total: {subjects.filter((subject) => !subject.isDeleted).length}
          </Badge>
        </div>

        <Button
          onClick={onAddClick}
          className="cursor-pointer rounded-xl font-bold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">Loading subjects database...</p>
        </div>
      ) : sortedSubjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 font-bold text-card-foreground">No Subjects Found</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            No subjects found matching your search.
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
                <TableHead className="w-[120px] font-bold">Syllabus</TableHead>
                <TableHead className="w-[120px] text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubjects.map((subj) => (
                <TableRow
                  key={subj.subjectId}
                  className={subj.isDeleted ? "bg-muted/20 opacity-50" : undefined}
                >
                  <TableCell className="font-bold text-primary">
                    {subj.subjectCode}
                  </TableCell>
                  <TableCell className="font-semibold text-card-foreground">
                    {subj.subjectName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        subj.subjectType === "CORE"
                          ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 rounded-full"
                          : "bg-purple-500/10 text-purple-500 hover:bg-purple-500/10 rounded-full"
                      }
                    >
                      {subj.subjectType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-semibold">
                    {subj.semesterNo || `Sem ${subj.semesterId}`}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {subj.description || "No description provided."}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManageSyllabusClick(subj)}
                      className="cursor-pointer h-7 rounded-lg text-xs font-bold gap-1 hover:bg-primary hover:text-primary-foreground border-primary/30"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Syllabus
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
  {subj.isDeleted ? (
    <Button
      variant="ghost"
      size="icon"
      title="Restore subject"
      onClick={() => onRestoreClick(subj.subjectId)}
      className="cursor-pointer rounded-xl text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  ) : (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="Edit subject"
        onClick={() => onEditClick(subj)}
        className="cursor-pointer rounded-xl hover:bg-primary/10 hover:text-primary"
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="Delete subject"
        onClick={() =>
          onDeleteClick(subj.subjectId, subj.subjectCode)
        }
        className="cursor-pointer rounded-xl hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )}
</div>
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
