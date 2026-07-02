import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, FileText, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import AvtAI from "/img/AvtAI.png";

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
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import AvatarFrame from "../avatarFrame/AvatarFrame";
import type { User } from "@/models/user";

interface ChatAreaProps {
  activeSessionId: number | null;
  selectedDocumentIds: number[];
  pendingPrompt: string;
  onPendingPromptConsumed: () => void;
  onSessionCreated: (sessionId: number) => void;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

interface CreateSessionVariables {
  documentIds: number[];
}

interface AskInSessionVariables {
  sessionId: number;
  question: string;
}

function ChatArea({
  activeSessionId,
  selectedDocumentIds,
  pendingPrompt,
  onPendingPromptConsumed,
  onSessionCreated,
}: ChatAreaProps) {
  const queryClient = useQueryClient();
  const currentUser = useSelector(
    (state: RootState) => state.user,
  ) as User | null;

  const [question, setQuestion] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasActiveSession = activeSessionId !== null;

  const {
    data: sessionMessagesPage,
    isLoading: isLoadingMessages,
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

  const messages = hasActiveSession
    ? optimisticMessages.length > 0
      ? [...sessionMessages, ...optimisticMessages]
      : sessionMessages
    : localMessages;

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
    CreateSessionVariables
  >({
    mutationFn: createRagChatSession,
  });

  const askInSessionMutation = useMutation<
    RagSessionAskResponse,
    Error,
    AskInSessionVariables
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

  useEffect(() => {
    if (messages.length === 0) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages.length]);

  useEffect(() => {
    setQuestion("");
    setOptimisticMessages([]);
    setLocalMessages([]);
  }, [activeSessionId]);

  const sendMessage = async (messageContent: string) => {
    const trimmedQuestion = messageContent.trim();

    if (!trimmedQuestion || isSending) return;

    setQuestion("");

    const optimisticUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    if (!activeSessionId && selectedDocumentIds.length === 0) {
      setLocalMessages((prev) => [...prev, optimisticUserMessage]);
      askWithoutSessionMutation.mutate({ question: trimmedQuestion });
      return;
    }

    setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);

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

      setOptimisticMessages([]);
    } catch (error: any) {
      setOptimisticMessages((prev) =>
        prev.filter((message) => message.id !== optimisticUserMessage.id),
      );

      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    }
  };

  useEffect(() => {
    const prompt = pendingPrompt.trim();

    if (!prompt || isSending) return;

    setQuestion(prompt);
    onPendingPromptConsumed();

    const timeoutId = window.setTimeout(() => {
      sendMessage(prompt);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pendingPrompt, isSending, onPendingPromptConsumed]);

  const handleSendMessage = () => {
    sendMessage(question);
  };

  const handleEnterSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-xl backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
            <p className="text-sm font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-5 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
              <Sparkles className="size-9 text-primary" />
            </div>

            <h3 className="text-xl font-black text-card-foreground">
              AI Study Assistant
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Choose documents from the sidebar, then ask AI to explain,
              summarize, or quiz you on your materials.
            </p>

            {selectedDocumentIds.length > 0 && (
              <div className="mt-5 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
                <FileText className="size-3.5" />
                {selectedDocumentIds.length} document(s) ready
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-card shadow-[0_0_10px_rgba(34,211,238,0.35)]">
                      <img
                        src={AvtAI}
                        alt="AI Study Assistant"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex max-w-[75%] flex-col gap-1">
                  <div
                    className={`rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "rounded-bl-lg border border-border/60 bg-card text-card-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 border-t border-border/40 pt-2.5">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Sources
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {message.sources.map((source, index) => (
                            <span
                              key={`${source}-${index}`}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                            >
                              <FileText className="size-2.5" />
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="shrink-0">
                    <AvatarFrame
                      score={currentUser?.totalScore ?? 0}
                      avatarUrl={currentUser?.avatarUrl}
                      fullName={currentUser?.fullName}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-end gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                  <Bot className="size-4 text-primary" />
                </div>

                <div className="rounded-3xl rounded-bl-lg border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border/40 px-6 pb-6 pt-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-lg backdrop-blur-sm transition-all focus-within:border-primary/50 focus-within:shadow-primary/10">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleEnterSend}
              placeholder="Ask anything about your study materials..."
              disabled={isSending}
              className="min-h-[2.5rem] flex-1 border-none bg-transparent px-2 py-1.5 text-sm text-card-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />

            <Button
              type="button"
              size="icon"
              disabled={isSending || !question.trim()}
              onClick={handleSendMessage}
              className="size-10 shrink-0 rounded-xl bg-primary shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-40"
            >
              <Send className="size-4 text-white" />
            </Button>
          </div>

          <div className="mt-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              <span>
                {selectedDocumentIds.length > 0
                  ? `${selectedDocumentIds.length} context doc(s) selected`
                  : "No context docs — general AI mode"}
              </span>
            </div>

            <span className="hidden text-[10px] text-muted-foreground md:block">
              Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
