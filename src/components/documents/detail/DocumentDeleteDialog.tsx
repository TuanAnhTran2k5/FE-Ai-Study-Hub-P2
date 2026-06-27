import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DocumentDeleteDialogProps = {
  documentTitle: string;
  isOpen: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
};

// Modal xác nhận xóa tài liệu; chỉ gọi API khi người dùng bấm Delete Document.
function DocumentDeleteDialog({
  documentTitle,
  isOpen,
  isDeleting,
  onOpenChange,
  onConfirmDelete,
}: DocumentDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border border-red-100 p-0 shadow-2xl sm:max-w-[500px]">
        <div className="bg-gradient-to-b from-red-50 to-white px-8 pb-7 pt-8">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
              <Trash2 className="h-6 w-6" />
            </div>

            <DialogTitle className="text-xl font-black text-card-foreground">
              Delete Document
            </DialogTitle>
            <DialogDescription className="max-w-sm text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete "{documentTitle}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border-transparent bg-secondary font-bold text-secondary-foreground hover:bg-secondary/80"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="h-12 rounded-2xl bg-red-600 font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-700"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentDeleteDialog;
