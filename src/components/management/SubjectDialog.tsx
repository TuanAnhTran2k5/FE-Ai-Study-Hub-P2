import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ERROR_CODE } from "@/constants/errorCode";
import type {
  SubjectRequest,
  SubjectResponse,
  SemesterResponse,
  SubjectType,
} from "@/types/curriculum.type";

interface SubjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSubject: { subject: SubjectResponse | null } | null;
  semesters: SemesterResponse[];
  onSubmit: (data: SubjectRequest) => void;
  isPending: boolean;
}

export default function SubjectDialog({
  isOpen,
  onOpenChange,
  editingSubject,
  semesters,
  onSubmit,
  isPending,
}: SubjectDialogProps) {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType>("COMBO");
  const [semesterId, setSemesterId] = useState<number>(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingSubject && editingSubject.subject) {
      const sub = editingSubject.subject;
      setSubjectCode(sub.subjectCode);
      setSubjectName(sub.subjectName);
      setSubjectType(sub.subjectType);
      setSemesterId(sub.semesterId);
      setDescription(sub.description || "");
    } else {
      setSubjectCode("");
      setSubjectName("");
      setSubjectType("COMBO");
      setSemesterId(semesters.length > 0 ? semesters[0].semesterId : 0);
      setDescription("");
    }
  }, [editingSubject, isOpen, semesters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode.trim()) {
      toast.error(ERROR_CODE.SUBJECT_CODE_REQUIRED);
      return;
    }
    if (!subjectName.trim()) {
      toast.error(ERROR_CODE.SUBJECT_NAME_REQUIRED);
      return;
    }
    if (!semesterId) {
      toast.error(ERROR_CODE.SEMESTER_SELECT_REQUIRED);
      return;
    }

    onSubmit({
      subjectCode: subjectCode.trim(),
      subjectName: subjectName.trim(),
      subjectType,
      semesterId,
      description: description.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-card-foreground">
            {editingSubject?.subject ? "Edit Subject" : "Quick Add Subject"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectCode" className="font-bold">
              Subject Code
            </Label>
            <Input
              id="subjectCode"
              placeholder="e.g. PRN211"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="h-11 rounded-xl"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectName" className="font-bold">
              Subject Name
            </Label>
            <Input
              id="subjectName"
              placeholder="e.g. C# .NET Programming"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="h-11 rounded-xl"
              disabled={isPending}
              required
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label className="font-bold">Type</Label>
              <Select
                value={subjectType}
                onValueChange={(val) => setSubjectType(val as SubjectType)}
                disabled={isPending}
              >
                <SelectTrigger className="h-11 w-full rounded-xl bg-card border-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border rounded-xl">
                  <SelectItem value="CORE">CORE</SelectItem>
                  <SelectItem value="COMBO">COMBO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Semester</Label>
              <Select
                value={String(semesterId)}
                onValueChange={(val) => setSemesterId(Number(val))}
                disabled={isPending}
              >
                <SelectTrigger className="h-11 w-full rounded-xl bg-card border-input">
                  <SelectValue placeholder="Select semester" />
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Details about this subject..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl min-h-[80px]"
              disabled={isPending}
            />
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
