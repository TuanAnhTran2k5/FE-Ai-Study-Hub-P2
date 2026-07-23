import { MessageSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RagChatSessionResponse } from "@/types/rag.type";

interface ChatHistoryDialogProps {
  open: boolean;
  sessions: RagChatSessionResponse[];
  activeSessionId: number | null;
  onOpenChange: (open: boolean) => void;
  onSelectSession: (sessionId: number, documentIds: number[]) => void;
  onDeleteSession: (sessionId: number) => void;
}

function ChatHistoryDialog({
  open,
  sessions,
  activeSessionId,
  onOpenChange,
  onSelectSession,
  onDeleteSession,
}: ChatHistoryDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{t("chat.allHistory", "All Chat History")}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("chat.noHistory", "No chat history yet.")}
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.sessionId}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors ${
                  activeSessionId === session.sessionId
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectSession(session.sessionId, session.documentIds ?? []);
                    onOpenChange(false);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {session.sessionTitle || "Untitled chat"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSession(session.sessionId)}
                  className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatHistoryDialog;