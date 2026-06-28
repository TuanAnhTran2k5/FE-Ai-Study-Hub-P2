import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisibilityStatus } from "@/models/document.enum";
import type { DocumentResponse } from "@/types/document.type";

type DocumentUpdateDialogProps = {
  document: DocumentResponse;
  isOpen: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

// Modal cập nhật title và visibility của tài liệu.
function DocumentUpdateDialog({
  document,
  isOpen,
  isSaving,
  onOpenChange,
  onSubmit,
}: DocumentUpdateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Update Document</DialogTitle>
          <DialogDescription>
            Edit the document title and visibility.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="document-title">Title</Label>
            <Input
              id="document-title"
              name="title"
              defaultValue={document.title}
              placeholder="Enter document title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-visibility">Visibility</Label>
            <select
              id="document-visibility"
              name="visibilityStatus"
              defaultValue={document.visibilityStatus}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value={VisibilityStatus.PRIVATE}>Private</option>
              <option value={VisibilityStatus.PUBLIC}>Public</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="rounded-xl" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentUpdateDialog;
