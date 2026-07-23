import { Plus, Edit2, Trash2, Layers, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { SemesterResponse } from "@/types/curriculum.type";

interface SemesterTableProps {
  semesters: SemesterResponse[];
  isLoading: boolean;
  readOnly?: boolean;
  onAddClick?: () => void;
  onEditClick?: (semester: SemesterResponse) => void;
  onDeleteClick?: (id: number, identifier: string) => void;
}

export default function SemesterTable({
  semesters,
  isLoading,
  readOnly = false,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: SemesterTableProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-black text-card-foreground">
          {readOnly ? t("curriculum.tabSemesters", "Semesters List") : t("curriculum.semestersMgmt", "Semesters Management")}
        </h3>
        {!readOnly && onAddClick && (
          <Button
            onClick={onAddClick}
            className="cursor-pointer rounded-xl font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("curriculum.addSemester", "Add Semester")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">{t("curriculum.loadingSemesters", "Loading semesters data...")}</p>
        </div>
      ) : semesters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 font-bold text-card-foreground">
            {t("curriculum.emptySemestersTitle", "No Semesters Found")}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("curriculum.emptySemestersDesc", "Start by creating a new learning semester.")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="w-[200px] font-bold">
                  {t("curriculum.colSemesterCode", "Semester Code/No")}
                </TableHead>
                <TableHead className="font-bold">{t("curriculum.colDescription", "Description")}</TableHead>
                {!readOnly && (
                  <TableHead className="w-[150px] text-right font-bold">
                    {t("curriculum.colActions", "Actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesters.map((semester) => (
                <TableRow key={semester.semesterId}>
                  <TableCell className="font-semibold text-card-foreground">
                    {semester.semesterNo}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {semester.description || t("curriculum.noDescription", "No description provided.")}
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEditClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditClick(semester)}
                            className="cursor-pointer rounded-xl hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onDeleteClick(
                                semester.semesterId,
                                semester.semesterNo,
                              )
                            }
                            className="cursor-pointer rounded-xl hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
