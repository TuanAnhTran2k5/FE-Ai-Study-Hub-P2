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
import type {
  ComboSubjectResponse,
  SubjectResponse,
} from "@/types/curriculum.type";

interface DeletedHistoryTableProps {
  combos: ComboSubjectResponse[];
  subjects: SubjectResponse[];
  isLoading: boolean;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onRestoreCombo: (id: number) => void;
  onRestoreSubject: (id: number) => void;
  isRestoring: boolean;
}

export default function DeletedHistoryTable({
  combos,
  subjects,
  isLoading,
  searchKeyword,
  onSearchChange,
  onRestoreCombo,
  onRestoreSubject,
  isRestoring,
}: DeletedHistoryTableProps) {
  const sortedSubjects = [...subjects].sort(
    (a, b) => a.semesterId - b.semesterId,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm">Loading deleted history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex max-w-md items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deleted combos or subjects..."
            value={searchKeyword}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <Badge variant="outline" className="h-11 rounded-xl px-3 py-3">
          Total: {combos.length + subjects.length}
        </Badge>
      </div>

      {combos.length === 0 && subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 font-bold text-card-foreground">
            No Deleted History
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Deleted combos and subjects will appear here.
          </p>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="font-black text-card-foreground">
              Deleted Combos ({combos.length})
            </h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="w-[160px] font-bold">Combo Code</TableHead>
                    <TableHead className="font-bold">Combo Name</TableHead>
                    <TableHead className="w-[160px] font-bold">Subjects</TableHead>
                    <TableHead className="w-[130px] text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No deleted combos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    combos.map((combo) => (
                      <TableRow key={combo.comboId} className="bg-muted/20 opacity-60">
                        <TableCell className="font-bold text-primary">{combo.comboCode}</TableCell>
                        <TableCell className="font-semibold">{combo.comboName}</TableCell>
                        <TableCell>{combo.subjects.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isRestoring}
                            onClick={() => onRestoreCombo(combo.comboId)}
                            className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-black text-card-foreground">
              Deleted Subjects ({subjects.length})
            </h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="w-[130px] font-bold">Subj Code</TableHead>
                    <TableHead className="font-bold">Subject Name</TableHead>
                    <TableHead className="w-[120px] font-bold">Type</TableHead>
                    <TableHead className="w-[120px] font-bold">Semester</TableHead>
                    <TableHead className="w-[130px] text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No deleted subjects.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedSubjects.map((subject) => (
                      <TableRow key={subject.subjectId} className="bg-muted/20 opacity-60">
                        <TableCell className="font-bold text-primary">{subject.subjectCode}</TableCell>
                        <TableCell className="font-semibold">{subject.subjectName}</TableCell>
                        <TableCell>{subject.subjectType}</TableCell>
                        <TableCell>{subject.semesterNo || `Sem ${subject.semesterId}`}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isRestoring}
                            onClick={() => onRestoreSubject(subject.subjectId)}
                            className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
