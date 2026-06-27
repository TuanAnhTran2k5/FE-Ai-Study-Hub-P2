import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Maximize2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

function ChatHistorySidebar({
  activeSessionId,
  isCollapsed,
  onToggleCollapse,
  onSelectSession,
  onDeletedActiveSession,
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
      queryClient.invalidateQueries({ queryKey: ["ragChatSessions"] });

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

  const renderSessionItem = (session: RagChatSessionResponse) => {
    const isActive = activeSessionId === session.sessionId;

    return (
      <div
        key={session.sessionId}
        className={`group flex items-center gap-2 rounded-2xl transition-colors ${
          isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/70"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectSession(session.sessionId)}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
        >
          <MessageSquare className="size-4 shrink-0" />

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {session.sessionTitle || "Untitled chat"}
              </p>
              <p className="text-[11px] text-muted-foreground">
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
            className="mr-1 size-8 opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden border-sidebar-border bg-card shadow-sm">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between p-4 pb-2">
          {!isCollapsed && (
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              Chat History
            </CardTitle>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="size-8"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </CardHeader>

        <CardContent className="flex-1 space-y-2 overflow-y-auto p-3">
          {isLoading ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Loading...
            </p>
          ) : latestSessions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <History className="mb-2 size-8 opacity-50" />
              {!isCollapsed && <p className="text-xs">No chat history yet.</p>}
            </div>
          ) : (
            latestSessions.map(renderSessionItem)
          )}
        </CardContent>

        {!isCollapsed && (
          <div className="shrink-0 p-3">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-primary/15 font-semibold text-primary shadow-none hover:bg-primary/25"
            >
              <Maximize2 className="size-4" />
              View All History
            </Button>
          </div>
        )}
      </Card>

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