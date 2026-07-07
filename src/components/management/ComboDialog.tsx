import React, { useState, useEffect } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ERROR_CODE } from "@/constants/errorCode";
import type {
  ComboSubjectRequest,
  ComboSubjectResponse,
  SemesterResponse,
  SubjectRequest,
  SubjectType,
} from "@/types/curriculum.type";

interface ComboDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCombo: ComboSubjectResponse | null;
  semesters: SemesterResponse[];
  onSubmit: (data: ComboSubjectRequest) => void;
  isPending: boolean;
}

export default function ComboDialog({
  isOpen,
  onOpenChange,
  editingCombo,
  semesters,
  onSubmit,
  isPending,
}: ComboDialogProps) {
  const [comboCode, setComboCode] = useState("");
  const [comboName, setComboName] = useState("");
  const [subjects, setSubjects] = useState<SubjectRequest[]>([]);

  const createEmptySubjectRequest = (): SubjectRequest => {
    const defaultSemesterId =
      semesters.length > 0 ? semesters[0].semesterId : 0;
    return {
      subjectCode: "",
      subjectName: "",
      description: "",
      subjectType: "COMBO" as SubjectType,
      semesterId: defaultSemesterId,
    };
  };

  // Sync state with editingCombo changes
  useEffect(() => {
    if (editingCombo) {
      setComboCode(editingCombo.comboCode);
      setComboName(editingCombo.comboName);
      setSubjects(
        editingCombo.subjects.map((sub) => ({
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName,
          description: sub.description || "",
          subjectType: sub.subjectType,
          semesterId: sub.semesterId,
          comboId: sub.comboId,
        })),
      );
    } else {
      setComboCode("");
      setComboName("");
      setSubjects([createEmptySubjectRequest()]);
    }
  }, [editingCombo, isOpen, semesters]);

  const handleAddSubjectField = () => {
    setSubjects((prev) => [...prev, createEmptySubjectRequest()]);
  };

  const handleRemoveSubjectField = (index: number) => {
    setSubjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubjectFieldChange = (
    index: number,
    field: keyof SubjectRequest,
    value: any,
  ) => {
    setSubjects((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comboCode.trim()) {
      toast.error(ERROR_CODE.COMBO_CODE_REQUIRED);
      return;
    }
    if (!comboName.trim()) {
      toast.error(ERROR_CODE.COMBO_NAME_REQUIRED);
      return;
    }

    if (subjects.length === 0) {
      toast.error(ERROR_CODE.COMBO_SUBJECTS_REQUIRED);
      return;
    }

    // Validate each subject row
    for (let i = 0; i < subjects.length; i++) {
      const sub = subjects[i];
      if (!sub.subjectCode.trim()) {
        toast.error(`Subject #${i + 1}: ${ERROR_CODE.SUBJECT_CODE_REQUIRED}`);
        return;
      }
      if (!sub.subjectName.trim()) {
        toast.error(`Subject #${i + 1}: ${ERROR_CODE.SUBJECT_NAME_REQUIRED}`);
        return;
      }
      if (!sub.semesterId) {
        toast.error(
          `Subject #${i + 1}: ${ERROR_CODE.SEMESTER_SELECT_REQUIRED}`,
        );
        return;
      }
    }

    onSubmit({
      comboCode: comboCode.trim(),
      comboName: comboName.trim(),
      subjects: subjects.map((sub) => ({
        ...sub,
        subjectCode: sub.subjectCode.trim(),
        subjectName: sub.subjectName.trim(),
        description: sub.description?.trim() || "",
      })),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-card sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-card-foreground">
            {editingCombo ? "Edit Combo Subject" : "Add Combo Subject"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="comboCode" className="font-bold">
                Combo Code
              </Label>
              <Input
                id="comboCode"
                placeholder="e.g. SE_CS_M1"
                value={comboCode}
                onChange={(e) => setComboCode(e.target.value)}
                className="h-11 rounded-xl"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comboName" className="font-bold">
                Combo Name
              </Label>
              <Input
                id="comboName"
                placeholder="e.g. Software Engineering Core"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                className="h-11 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
          </div>

          {/* Dynamic Subjects List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-card-foreground">
                Subjects List
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubjectField}
                className="cursor-pointer rounded-xl font-bold"
                disabled={isPending}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Subject Line
              </Button>
            </div>

            {subjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                No subjects added yet. Please click "Add Subject Line" to start.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card/30">
                <Table>
                  <TableHeader className="bg-secondary/40">
                    <TableRow>
                      <TableHead className="w-[140px] font-bold">
                        Subj Code *
                      </TableHead>
                      <TableHead className="w-[220px] font-bold">
                        Subject Name *
                      </TableHead>
                      <TableHead className="w-[120px] font-bold">
                        Type
                      </TableHead>
                      <TableHead className="w-[150px] font-bold">
                        Semester *
                      </TableHead>
                      <TableHead className="font-bold">
                        Description (Optional)
                      </TableHead>
                      <TableHead className="w-[60px] text-center font-bold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject, idx) => (
                      <TableRow key={idx} className="hover:bg-transparent">
                        <TableCell className="p-2">
                          <Input
                            placeholder="e.g. HSF302"
                            value={subject.subjectCode}
                            onChange={(e) =>
                              handleSubjectFieldChange(
                                idx,
                                "subjectCode",
                                e.target.value,
                              )
                            }
                            className="h-9 rounded-lg"
                            disabled={isPending}
                            required
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input
                            placeholder="e.g. Working with Spring Framework"
                            value={subject.subjectName}
                            onChange={(e) =>
                              handleSubjectFieldChange(
                                idx,
                                "subjectName",
                                e.target.value,
                              )
                            }
                            className="h-9 rounded-lg"
                            disabled={isPending}
                            required
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Select
                            value={subject.subjectType}
                            onValueChange={(val) =>
                              handleSubjectFieldChange(idx, "subjectType", val)
                            }
                            disabled={isPending}
                          >
                            <SelectTrigger className="h-9 w-full rounded-lg bg-card border-input">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border border-border rounded-xl">
                              <SelectItem value="CORE">CORE</SelectItem>
                              <SelectItem value="COMBO">COMBO</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-2">
                          <Select
                            value={String(subject.semesterId)}
                            onValueChange={(val) =>
                              handleSubjectFieldChange(
                                idx,
                                "semesterId",
                                Number(val),
                              )
                            }
                            disabled={isPending}
                          >
                            <SelectTrigger className="h-9 w-full rounded-lg bg-card border-input">
                              <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border border-border rounded-xl">
                              {semesters.map((sem) => (
                                <SelectItem
                                  key={sem.semesterId}
                                  value={String(sem.semesterId)}
                                >
                                  {sem.semesterNo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-2">
                          <Input
                            placeholder="Short description..."
                            value={subject.description}
                            onChange={(e) =>
                              handleSubjectFieldChange(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            className="h-9 rounded-lg"
                            disabled={isPending}
                          />
                        </TableCell>
                        <TableCell className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSubjectField(idx)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all mx-auto"
                            disabled={isPending}
                            title="Remove Subject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer rounded-xl font-bold"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-xl font-bold"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
