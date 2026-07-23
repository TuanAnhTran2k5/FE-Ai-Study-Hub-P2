import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  BookMarked,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw,
} from "lucide-react";

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
import type { ComboSubjectResponse } from "@/types/curriculum.type";

interface ComboAccordionProps {
  combos: ComboSubjectResponse[];
  isLoading: boolean;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  readOnly?: boolean;
  onAddClick?: () => void;
  onEditClick?: (combo: ComboSubjectResponse) => void;
  onDeleteClick?: (id: number, identifier: string) => void;
  onEditSubjectClick?: (subject: any, combo: ComboSubjectResponse) => void;
  onDeleteSubjectClick?: (subject: any, combo: ComboSubjectResponse) => void;
  onRestoreSubjectClick?: (id: number) => void;
  onAddSubjectClick?: (combo: ComboSubjectResponse) => void;
  onRestoreClick?: (id: number) => void;
  onManageSyllabusClick?: (subject: any) => void;
}

export default function ComboAccordion({
  combos,
  isLoading,
  searchKeyword,
  onSearchChange,
  readOnly = false,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onEditSubjectClick,
  onDeleteSubjectClick,
  onRestoreSubjectClick,
  onAddSubjectClick,
  onRestoreClick,
  onManageSyllabusClick,
}: ComboAccordionProps) {
  const { t } = useTranslation();
  const [expandedComboId, setExpandedComboId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("curriculum.searchCombos", "Search combo subjects by name...")}
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>

        {!readOnly && onAddClick && (
          <Button
            onClick={onAddClick}
            className="cursor-pointer rounded-xl font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("curriculum.addCombo", "Add Combo Subject")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">{t("curriculum.loadingCombos", "Loading combos data...")}</p>
        </div>
      ) : combos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <BookMarked className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 font-bold text-card-foreground">
            {t("curriculum.emptyCombosTitle", "No Combo Subjects Found")}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("curriculum.emptyCombosDesc", "No results found matching your search.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {combos.map((combo) => {
            const isExpanded = expandedComboId === combo.comboId;
            const activeSubjectCount = combo.subjects.filter(
              (subject) => !subject.isDeleted,
            ).length;
            return (
              <div
                key={combo.comboId}
                className={`overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ${
                  combo.isDeleted ? "opacity-50" : ""
                }`}
              >
                <div
                  onClick={() =>
                    setExpandedComboId(isExpanded ? null : combo.comboId)
                  }
                  className="flex cursor-pointer items-center justify-between bg-secondary/20 p-5 hover:bg-secondary/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-primary">
                        {combo.comboCode}
                      </span>
                      <h4 className="text-lg font-black text-card-foreground">
                        {combo.comboName}
                      </h4>
                      <Badge variant="secondary" className="rounded-full">
                        {activeSubjectCount} {t("curriculum.subjectsCount", "Subjects")}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!readOnly && (
                      combo.isDeleted ? (
                        onRestoreClick && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("curriculum.tooltipRestoreCombo", "Restore combo")}
                            onClick={() => onRestoreClick(combo.comboId)}
                            className="cursor-pointer rounded-xl text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )
                      ) : (
                        <>
                          {onEditClick && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title={t("curriculum.tooltipEditCombo", "Edit combo")}
                              onClick={() => onEditClick(combo)}
                              className="cursor-pointer rounded-xl hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}

                          {onDeleteClick && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title={t("curriculum.tooltipDeleteCombo", "Delete combo")}
                              onClick={() =>
                                onDeleteClick(combo.comboId, combo.comboName)
                              }
                              className="cursor-pointer rounded-xl hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedComboId(isExpanded ? null : combo.comboId)
                      }
                      className="cursor-pointer rounded-xl"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expandable subjects list */}
                {isExpanded && (
                  <div className="border-t border-border bg-card/50 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-card-foreground">
                        {t("curriculum.comboBelongTitle", "Subjects belonging to this Combo:")}
                      </h5>
                      {!readOnly && onAddSubjectClick && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddSubjectClick(combo)}
                          className="cursor-pointer rounded-lg text-xs font-bold"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          {t("curriculum.quickAddSubject", "Quick Add Subject")}
                        </Button>
                      )}
                    </div>

                    {combo.subjects.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-6 border border-dashed border-border rounded-xl">
                        {t("curriculum.emptyComboSubjects", "No subjects in this combo. Please click \"Quick Add Subject\" to start.")}
                      </p>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-border bg-card">
                        <Table>
                          <TableHeader className="bg-secondary/30">
                            <TableRow>
                              <TableHead className="w-[120px] font-bold">
                                {t("curriculum.colSubjCode", "Subj Code")}
                              </TableHead>
                              <TableHead className="font-bold">
                                {t("curriculum.colSubjectName", "Subject Name")}
                              </TableHead>
                              <TableHead className="w-[100px] font-bold">
                                {t("curriculum.colType", "Type")}
                              </TableHead>
                              <TableHead className="w-[120px] font-bold">
                                {t("curriculum.colSemester", "Semester")}
                              </TableHead>
                              <TableHead className="font-bold">
                                {t("curriculum.colDescription", "Description")}
                              </TableHead>
                              {!readOnly && (
                                <>
                                  <TableHead className="w-[120px] font-bold">
                                    {t("curriculum.colSyllabus", "Syllabus")}
                                  </TableHead>
                                  <TableHead className="w-[100px] text-right font-bold">
                                    {t("curriculum.colActions", "Actions")}
                                  </TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {combo.subjects.map((subj) => (
                              <TableRow
                                key={subj.subjectId}
                                className={
                                  subj.isDeleted
                                    ? "bg-muted/20 opacity-50"
                                    : undefined
                                }
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
                                  {subj.semesterNo}
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground">
                                  {subj.description || "N/A"}
                                </TableCell>
                                {!readOnly && (
                                  <>
                                    <TableCell>
                                      {onManageSyllabusClick && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => onManageSyllabusClick(subj)}
                                          className="cursor-pointer h-7 rounded-lg text-xs font-bold gap-1 hover:bg-primary hover:text-primary-foreground border-primary/30"
                                        >
                                          <FileText className="h-3.5 w-3.5" />
                                          {t("curriculum.btnSyllabus", "Syllabus")}
                                        </Button>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-1">
                                        {subj.isDeleted ? (
                                          onRestoreSubjectClick && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              title={t("curriculum.tooltipRestore", "Restore subject")}
                                              onClick={() =>
                                                onRestoreSubjectClick(subj.subjectId)
                                              }
                                              className="cursor-pointer h-7 w-7 rounded-md text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                                            >
                                              <RotateCcw className="h-3.5 w-3.5" />
                                            </Button>
                                          )
                                        ) : (
                                          <>
                                            {onEditSubjectClick && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                title={t("curriculum.tooltipEdit", "Edit subject")}
                                                onClick={() =>
                                                  onEditSubjectClick(subj, combo)
                                                }
                                                className="cursor-pointer h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary"
                                              >
                                                <Edit2 className="h-3.5 w-3.5" />
                                              </Button>
                                            )}
                                            {onDeleteSubjectClick && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                title={t("curriculum.tooltipDelete", "Delete subject")}
                                                onClick={() =>
                                                  onDeleteSubjectClick(subj, combo)
                                                }
                                                className="cursor-pointer h-7 w-7 rounded-md hover:bg-destructive/10 hover:text-destructive"
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
