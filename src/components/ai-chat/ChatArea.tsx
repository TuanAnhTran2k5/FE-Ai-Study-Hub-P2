import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  FileText,
  Loader2,
  PlusCircle,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { ERROR_CODE } from "@/constants/errorCode";
import {
  askRagQuestion,
  askRagSessionQuestion,
  createRagChatSession,
  getRagSessionMessages,
} from "@/services/ragService";
import type {
  RagChatMessagesPageResponse,
  RagChatRequest,
  RagChatResponse,
  RagChatSessionResponse,
  RagSessionAskResponse,
} from "@/types/rag.type";

interface ChatAreaProps {
  activeSessionId: number | null;
  selectedDocumentIds: number[];
  onSessionCreated: (sessionId: number) => void;
  onNewChat: () => void;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

function ChatArea({
  activeSessionId,
  selectedDocumentIds,
  onSessionCreated,
  onNewChat,
}: ChatAreaProps) {
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const hasActiveSession = activeSessionId !== null;

  const {
    data: sessionMessagesPage,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
  } = useQuery<RagChatMessagesPageResponse>({
    queryKey: ["ragSessionMessages", activeSessionId],
    queryFn: () => getRagSessionMessages(activeSessionId as number, 0, 50),
    enabled: hasActiveSession,
  });

  const sessionMessages = useMemo<ChatMessage[]>(() => {
    if (!sessionMessagesPage?.content) return [];

    return sessionMessagesPage.content.map((message) => ({
      id: message.messageId,
      role: message.senderType === "USER" ? "user" : "assistant",
      content: message.content,
    }));
  }, [sessionMessagesPage]);

  const messages = hasActiveSession ? sessionMessages : localMessages;

  useEffect(() => {
    if (hasActiveSession) {
      setLocalMessages([]);
    }
  }, [hasActiveSession]);

  const askWithoutSessionMutation = useMutation<
    RagChatResponse,
    Error,
    RagChatRequest
  >({
    mutationFn: askRagQuestion,

    onSuccess: (data) => {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const createSessionMutation = useMutation<
    RagChatSessionResponse,
    Error,
    { documentIds: number[] }
  >({
    mutationFn: createRagChatSession,
  });

  const askInSessionMutation = useMutation<
    RagSessionAskResponse,
    Error,
    { sessionId: number; question: string }
  >({
    mutationFn: ({ sessionId, question }) =>
      askRagSessionQuestion(sessionId, { question }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ragSessionMessages", variables.sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["ragChatSessions"],
      });
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const isSending =
    askWithoutSessionMutation.isPending ||
    createSessionMutation.isPending ||
    askInSessionMutation.isPending;

  const handleSendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) return;

    setQuestion("");

    if (!activeSessionId && selectedDocumentIds.length === 0) {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "user",
          content: trimmedQuestion,
        },
      ]);

      askWithoutSessionMutation.mutate({
        question: trimmedQuestion,
      });

      return;
    }

    try {
      let sessionId = activeSessionId;

      if (!sessionId) {
        const createdSession = await createSessionMutation.mutateAsync({
          documentIds: selectedDocumentIds,
        });

        sessionId = createdSession.sessionId;
        onSessionCreated(createdSession.sessionId);

        queryClient.invalidateQueries({
          queryKey: ["ragChatSessions"],
        });
      }

      await askInSessionMutation.mutateAsync({
        sessionId,
        question: trimmedQuestion,
      });
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    }
  };

  const handleEnterSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setLocalMessages([]);
    setQuestion("");
  };

  const handleNewChat = () => {
    setLocalMessages([]);
    setQuestion("");
    onNewChat();
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl bg-white/30">
      <div className="flex shrink-0 items-center justify-between border-b border-white/40 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <Bot className="size-6 text-primary" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-card-foreground">
              AI Study Assistant
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              Ask questions based on your study materials.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleNewChat}
            className="rounded-full border border-border/60 bg-card/80 px-4 text-sm font-semibold text-primary shadow-sm hover:bg-card"
          >
            <PlusCircle className="mr-2 size-4" />
            New Chat
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleClearChat}
            className="rounded-full border border-destructive/20 bg-card/80 px-4 text-sm font-semibold text-destructive shadow-sm hover:bg-card hover:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {isLoadingMessages || isFetchingMessages ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="mb-3 size-8 animate-spin" />
            <p className="text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <div className="mb-4 flex size-16 items-center justify-center rounded-3xl bg-card/70 shadow-sm">
              <Sparkles className="size-8 text-primary" />
            </div>

            <h3 className="text-base font-bold text-card-foreground">
              Start learning with AI
            </h3>

            <p className="mt-1 max-w-md text-sm">
              Choose context documents, then ask AI to explain, summarize, or
              create quizzes from your materials.
            </p>

            {selectedDocumentIds.length > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                <FileText className="size-4" />
                {selectedDocumentIds.length} document(s) selected
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Bot className="size-5 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/70 bg-card text-card-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 border-t border-border/60 pt-2">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground">
                        Sources
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <span
                            key={`${source}-${index}`}
                            className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary">
                    <User className="size-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <Bot className="size-5 text-primary" />
                </div>

                <div className="flex items-center gap-2 rounded-3xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  <Loader2 className="size-4 animate-spin" />
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 px-5 pb-5">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-border/70 bg-card p-3 shadow-lg">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleEnterSend}
            placeholder="Ask anything about your study materials..."
            disabled={isSending}
            className="w-full border-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />

          <div className="mt-2 flex items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground sm:flex">
                <FileText className="size-4" />
                {selectedDocumentIds.length} context docs
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] text-muted-foreground md:inline-block">
                Press Enter to send
              </span>

              <Button
                type="button"
                size="icon"
                disabled={isSending || !question.trim()}
                onClick={handleSendMessage}
                className="size-10 rounded-full bg-primary hover:bg-primary/90"
              >
                {isSending ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  <Send className="size-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}

export default ChatArea;