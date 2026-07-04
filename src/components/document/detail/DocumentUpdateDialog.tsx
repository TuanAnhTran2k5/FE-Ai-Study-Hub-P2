import { useEffect, useMemo, useState } from "react";
import { Globe2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisibilityStatus } from "@/models/document.enum";
import type { SubjectResponse } from "@/types/academic.type";
import type { DocumentResponse } from "@/types/document.type";

type DocumentUpdateDialogProps = {
  document: DocumentResponse;
  subjects: SubjectResponse[];
  isOpen: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function DocumentUpdateDialog({
  document,
  subjects,
  isOpen,
  isSaving,
  onOpenChange,
  onSubmit,
}: DocumentUpdateDialogProps) {
  const currentSubject = useMemo(
    () =>
      subjects.find(
        (subject) => Number(subject.subjectId) === Number(document.subjectId),
      ),
    [document.subjectId, subjects],
  );

  const [visibility, setVisibility] = useState<VisibilityStatus>(
    document.visibilityStatus === VisibilityStatus.PUBLIC
      ? VisibilityStatus.PUBLIC
      : VisibilityStatus.PRIVATE,
  );

  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    String(document.subjectId),
  );

  const semesterOptions = useMemo(() => {
    const semesterMap = new Map<string, number | string>();

    subjects.forEach((subject) => {
      if (subject.semesterId === undefined || subject.semesterId === null) {
        return;
      }

      semesterMap.set(
        String(subject.semesterId),
        subject.semesterNo ?? subject.semesterId,
      );
    });

    return Array.from(semesterMap.entries()).map(
      ([semesterId, semesterNo]) => ({
        semesterId,
        semesterNo,
      }),
    );
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    if (!selectedSemesterId) return [];

    return subjects.filter(
      (subject) => String(subject.semesterId) === selectedSemesterId,
    );
  }, [selectedSemesterId, subjects]);

  useEffect(() => {
    if (!isOpen) return;

    setVisibility(
      document.visibilityStatus === VisibilityStatus.PUBLIC
        ? VisibilityStatus.PUBLIC
        : VisibilityStatus.PRIVATE,
    );

    const initialSemesterId =
      currentSubject?.semesterId !== undefined &&
      currentSubject?.semesterId !== null
        ? String(currentSubject.semesterId)
        : "";

    setSelectedSemesterId(initialSemesterId);
    setSelectedSubjectId(String(document.subjectId));
  }, [currentSubject, document, isOpen]);

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);

    const firstSubjectInSemester = subjects.find(
      (subject) => String(subject.semesterId) === semesterId,
    );

    setSelectedSubjectId(
      firstSubjectInSemester ? String(firstSubjectInSemester.subjectId) : "",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Update Document</DialogTitle>
            <DialogDescription>
              Edit document information and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="update-title">Title *</Label>
              <Input
                id="update-title"
                name="title"
                defaultValue={document.title}
                placeholder="Enter document title"
                className="h-11"
                disabled={isSaving}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Semester *</Label>
                <Select
                  value={selectedSemesterId}
                  onValueChange={handleSemesterChange}
                  disabled={isSaving}
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>

                  <SelectContent>
                    {semesterOptions.map((semester) => (
                      <SelectItem
                        key={semester.semesterId}
                        value={semester.semesterId}
                      >
                        Semester {semester.semesterNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  name="subjectId"
                  value={selectedSubjectId}
                  onValueChange={setSelectedSubjectId}
                  disabled={isSaving || !selectedSemesterId}
                  required
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue
                      placeholder={
                        selectedSemesterId
                          ? "Select subject"
                          : "Select semester first"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredSubjects.map((subject) => (
                      <SelectItem
                        key={subject.subjectId}
                        value={String(subject.subjectId)}
                      >
                        {subject.subjectCode} - {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility *</Label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isSaving}
                  className={`rounded-2xl border p-4 text-left transition ${
                    visibility === VisibilityStatus.PUBLIC
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                  onClick={() => setVisibility(VisibilityStatus.PUBLIC)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Globe2 className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-card-foreground">
                        Public
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Visible to everyone
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  className={`rounded-2xl border p-4 text-left transition ${
                    visibility === VisibilityStatus.PRIVATE
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                  onClick={() => setVisibility(VisibilityStatus.PRIVATE)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Lock className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-card-foreground">
                        Private
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Only visible to you
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <input
                type="hidden"
                name="visibilityStatus"
                value={visibility}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentUpdateDialog;