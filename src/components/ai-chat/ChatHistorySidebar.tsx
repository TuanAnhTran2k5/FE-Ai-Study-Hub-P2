import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Maximize2,
  MessageSquare,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import ChatHistoryDialog from "@/components/ai-chat/ChatHistoryDialog";
import {
  deleteRagChatSession,
  getRagChatSessions,
} from "@/services/ragService";
import type { RagChatSessionResponse } from "@/types/rag.type";

interface ChatHistorySidebarProps {
  activeSessionId: number | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectSession: (sessionId: number) => void;
  onDeletedActiveSession: () => void;
  onNewChat: () => void;
  onClearChat: () => void;
}

function ChatHistorySidebar({
  activeSessionId,
  isCollapsed,
  onToggleCollapse,
  onSelectSession,
  onDeletedActiveSession,
  onNewChat,
  onClearChat,
}: ChatHistorySidebarProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleDeleteSession = (sessionId: number) => {
    deleteMutation.mutate(sessionId);
  };

  const handleClearChat = () => {
    if (activeSessionId) {
      queryClient.removeQueries({
        queryKey: ["ragSessionMessages", activeSessionId],
      });
    }
    
    onClearChat();
  };

  const renderSessionItem = (session: RagChatSessionResponse) => {
    const isActive = activeSessionId === session.sessionId;

    return (
      <div
        key={session.sessionId}
        className={`group flex items-center gap-1 rounded-2xl transition-all duration-150 ${
          isActive
            ? "bg-primary/15 text-primary shadow-sm"
            : "hover:bg-primary/5 text-card-foreground"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectSession(session.sessionId)}
          className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
        >
          <MessageSquare
            className={`size-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
          />

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-card-foreground"}`}
              >
                {session.sessionTitle || "Untitled chat"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {new Date(session.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </button>

        {!isCollapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={deleteMutation.isPending}
            onClick={() => handleDeleteSession(session.sessionId)}
            className="mr-1.5 size-7 shrink-0 rounded-xl opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </Button>
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
        {/* Header */}
        <div className="shrink-0 p-4 pb-3">
          <div
            className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            {!isCollapsed && (
              <p className="text-base font-black text-card-foreground">
                Chat History
              </p>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="size-8 shrink-0 rounded-xl hover:bg-primary/10 hover:text-primary"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {!isCollapsed && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onNewChat}
                className="h-9 rounded-2xl border border-primary/25 bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <PlusCircle className="mr-1.5 size-3.5" />
                New
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleClearChat}
                className="h-9 rounded-2xl border border-destructive/25 bg-destructive/10 text-xs font-bold text-destructive hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Clear
              </Button>
            </div>
          )}

          {!isCollapsed && <div className="mt-3 h-px bg-border/50" />}
        </div>

        {/* Session List */}
        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
          ) : latestSessions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-muted/50">
                <History className="size-5 opacity-50" />
              </div>
              {!isCollapsed && (
                <p className="text-xs font-medium">No chat history yet.</p>
              )}
            </div>
          ) : (
            latestSessions.map(renderSessionItem)
          )}
        </div>

        {/* Footer — View All */}
        {!isCollapsed && (
          <div className="shrink-0 border-t border-border/40 p-3">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 text-xs font-bold text-primary shadow-none hover:bg-primary/20"
            >
              <Maximize2 className="size-3.5" />
              View All History
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
