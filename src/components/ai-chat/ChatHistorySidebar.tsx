import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  Maximize2,
  MessageSquare,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import ChatHistoryDialog from "@/components/ai-chat/ChatHistoryDialog";
import {
  deleteRagChatSession,
  getRagChatSessions,
  updateRagSessionTitle,
} from "@/services/ragService";
import type { RagChatSessionResponse } from "@/types/rag.type";

interface ChatHistorySidebarProps {
  activeSessionId: number | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectSession: (sessionId: number, documentIds: number[]) => void;
  onDeletedActiveSession: () => void;
  onNewChat: () => void;
}

function ChatHistorySidebar({
  activeSessionId,
  isCollapsed,
  onToggleCollapse,
  onSelectSession,
  onDeletedActiveSession,
  onNewChat,
}: ChatHistorySidebarProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["ragChatSessions"],
    queryFn: getRagChatSessions,
  });

  const latestSessions = useMemo(() => {
    return [...sessions]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 8);
  }, [sessions]);

  const deleteMutation = useMutation({
    mutationFn: deleteRagChatSession,

    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({
        queryKey: ["ragSessionMessages", sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["ragChatSessions"],
      });

      if (activeSessionId === sessionId) {
        onDeletedActiveSession();
      }

      toast.success("Chat deleted successfully.");
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "Cannot delete chat.");
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: number; title: string }) =>
      updateRagSessionTitle(sessionId, { sessionTitle: title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ragChatSessions"] });
      setEditingSessionId(null);
      setNewTitle("");
      toast.success("Chat renamed successfully.");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "Cannot rename chat.");
    },
  });

  const handleDeleteSession = (sessionId: number) => {
    deleteMutation.mutate(sessionId);
  };

  const handleStartRename = (sessionId: number, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setNewTitle(currentTitle || "");
  };

  const handleRenameSubmit = (sessionId: number) => {
    const title = newTitle.trim();
    if (!title) {
      toast.warn("Title cannot be empty");
      return;
    }
    renameMutation.mutate({ sessionId, title });
  };



  const renderSessionItem = (session: RagChatSessionResponse) => {
    const isActive = activeSessionId === session.sessionId;
    const isEditing = editingSessionId === session.sessionId;

    return (
      <div
        key={session.sessionId}
        className={`group flex items-center gap-1 rounded-2xl transition-all duration-150 ${
          isActive
            ? "bg-primary/15 text-primary shadow-sm"
            : "text-card-foreground hover:bg-primary/5"
        }`}
      >
        {isEditing ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameSubmit(session.sessionId);
                } else if (e.key === "Escape") {
                  setEditingSessionId(null);
                }
              }}
              autoFocus
              className="h-8 min-w-0 flex-1 rounded-xl border border-primary/30 bg-background/50 px-2.5 text-xs font-semibold text-card-foreground outline-none focus:border-primary/60"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={renameMutation.isPending}
              onClick={() => handleRenameSubmit(session.sessionId)}
              className="size-7 rounded-lg text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
            >
              <Check className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setEditingSessionId(null)}
              className="size-7 rounded-lg text-muted-foreground hover:bg-muted-foreground/10 cursor-pointer"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                onSelectSession(session.sessionId, session.documentIds ?? [])
              }
              className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer"
            >
              <MessageSquare
                className={`size-4 shrink-0 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isActive ? "text-primary" : "text-card-foreground"
                    }`}
                  >
                    {session.sessionTitle || t("aiChat.untitledChat", "Untitled chat")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <div className="mr-1.5 flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartRename(session.sessionId, session.sessionTitle)}
                  className="size-7 opacity-0 transition-opacity hover:bg-primary/10 hover:text-primary group-hover:opacity-100 cursor-pointer"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleDeleteSession(session.sessionId)}
                  className="size-7 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-xl backdrop-blur-sm transition-all duration-300 ${
          isCollapsed ? "w-14" : "w-full"
        }`}
      >
        <div className="shrink-0 p-4 pb-3">
          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <p className="text-base font-black text-card-foreground">
                {t("aiChat.chatHistory", "Chat History")}
              </p>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="size-8 shrink-0 rounded-xl hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {!isCollapsed && (
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onNewChat}
                className="h-9 w-full rounded-2xl border border-primary/25 bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20 cursor-pointer"
              >
                <PlusCircle className="mr-1.5 size-3.5" />
                {t("aiChat.newChat", "New Chat")}
              </Button>
            </div>
          )}

          {!isCollapsed && <div className="mt-3 h-px bg-border/50" />}
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2 pr-1.5 scrollbar-thin">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">{t("common.loading", "Loading...")}</p>
            </div>
          ) : latestSessions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50">
                <History className="size-5 opacity-50" />
              </div>
              {!isCollapsed && (
                <p className="text-xs font-medium">{t("aiChat.emptyHistory", "No chat history yet.")}</p>
              )}
            </div>
          ) : (
            latestSessions.map(renderSessionItem)
          )}
        </div>

        {!isCollapsed && (
          <div className="shrink-0 border-t border-border/40 p-3">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 text-xs font-bold text-primary shadow-none hover:bg-primary/20 cursor-pointer"
            >
              <Maximize2 className="size-3.5" />
              {t("aiChat.viewHistory", "View All History")}
            </Button>
          </div>
        )}
      </div>

      <ChatHistoryDialog
        open={isDialogOpen}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onOpenChange={setIsDialogOpen}
        onSelectSession={onSelectSession}
        onDeleteSession={handleDeleteSession}
      />
    </>
  );
}

export default ChatHistorySidebar;