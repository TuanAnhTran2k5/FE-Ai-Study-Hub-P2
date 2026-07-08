import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  type: "semester" | "combo" | "subject" | "badge" | null;
  identifier: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
  type,
  identifier,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-card-foreground">
            Are you absolutely sure?
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-muted-foreground">
          <p>
            This action cannot be undone. You are about to delete the{" "}
            <span className="font-bold text-card-foreground">
              {type === "semester" && "Semester"}
              {type === "combo" && "Combo Subject"}
              {type === "subject" && "Subject"}
              {type === "badge" && "Badge"}
            </span>
            : <span className="font-black text-destructive">{identifier}</span>.
          </p>
          {type === "combo" && (
            <p className="mt-2 text-xs text-amber-500 font-semibold">
              * Note: All subjects belonging to this combo will also be
              soft-deleted.
            </p>
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
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer rounded-xl font-bold"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
