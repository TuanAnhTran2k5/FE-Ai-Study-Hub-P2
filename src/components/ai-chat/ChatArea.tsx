import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, FileText, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import AvtAI from "/img/AvtAI.png";

import { Button } from "@/components/ui/button";
import { ERROR_CODE } from "@/constants/errorCode";
import {
  askRagSessionQuestion,
  createRagChatSession,
  getRagSessionMessages,
  updateRagSessionDocuments,
} from "@/services/ragService";
import type { RootState } from "@/redux/store";
import type {
  RagChatMessagesPageResponse,
  RagChatSessionResponse,
  RagSessionAskResponse,
} from "@/types/rag.type";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";

interface ChatAreaProps {
  activeSessionId: number | null;
  selectedDocumentIds: number[];
  pendingPrompt: string;
  onPendingPromptConsumed: () => void;
  onSessionCreated: (sessionId: number) => void;
  onAddDocumentClick?: () => void;
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
  documentIds: number[];
}

function ChatArea({
  activeSessionId,
  selectedDocumentIds,
  pendingPrompt,
  onPendingPromptConsumed,
  onSessionCreated,
  onAddDocumentClick,
}: ChatAreaProps) {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user);

  const [question, setQuestion] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentSessionIdRef = useRef<number | null>(activeSessionId);
  const isCreatingSession = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Tự động co giãn chiều cao của Textarea theo nội dung nhập vào
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [question]);

  const hasActiveSession = activeSessionId !== null;

  const { data: sessionMessagesPage, isLoading: isLoadingMessages } =
    useQuery<RagChatMessagesPageResponse>({
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

  const messages = [...sessionMessages, ...optimisticMessages];

  const createSessionMutation = useMutation<
    RagChatSessionResponse,
    Error,
    CreateSessionVariables
  >({
    mutationFn: createRagChatSession,
  });

  const updateDocumentsMutation = useMutation({
    mutationFn: ({
      sessionId,
      documentIds,
    }: {
      sessionId: number;
      documentIds: number[];
    }) =>
      updateRagSessionDocuments(sessionId, {
        documentIds,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ragChatSessions"],
      });
    },

    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
    },
  });

  const askInSessionMutation = useMutation<
    RagSessionAskResponse,
    Error,
    AskInSessionVariables
  >({
    mutationFn: ({ sessionId, question, documentIds }) =>
      askRagSessionQuestion(sessionId, {
        question,
        sessionId,
        documentIds,
      }),

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
    createSessionMutation.isPending ||
    askInSessionMutation.isPending ||
    updateDocumentsMutation.isPending;

  useEffect(() => {
    if (messages.length === 0) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages.length]);

  useEffect(() => {
    setQuestion("");
    if (!isCreatingSession.current) {
      setOptimisticMessages([]);
    }
    currentSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  useEffect(() => {
    if (!activeSessionId) return;

    updateDocumentsMutation.mutate({
      sessionId: activeSessionId,
      documentIds: selectedDocumentIds,
    });
  }, [activeSessionId, selectedDocumentIds]);

  const sendMessage = async (messageContent: string) => {
    const trimmedQuestion = messageContent.trim();

    if (!trimmedQuestion || isSending) return;

    setQuestion("");

    const optimisticUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    // Đẩy tin nhắn của User lên giao diện ngay lập tức
    setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);

    isCreatingSession.current = true;
    // Trì hoãn cuộc gọi API 1 chút để React hoàn tất render tin nhắn của user trước, triệt tiêu cảm giác khựng UI
    setTimeout(async () => {
      try {
        let sessionId = currentSessionIdRef.current;

        if (!sessionId) {
          const createdSession = await createSessionMutation.mutateAsync({
            documentIds: selectedDocumentIds,
          });

          sessionId = createdSession.sessionId;
          currentSessionIdRef.current = createdSession.sessionId;
          onSessionCreated(createdSession.sessionId);

          queryClient.invalidateQueries({
            queryKey: ["ragChatSessions"],
          });
        }

        await askInSessionMutation.mutateAsync({
          sessionId,
          question: trimmedQuestion,
          documentIds: selectedDocumentIds,
        });
      } catch (error: any) {
        setOptimisticMessages((prev) =>
          prev.filter((message) => message.id !== optimisticUserMessage.id),
        );

        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || ERROR_CODE.SERVER_ERROR);
      } finally {
        isCreatingSession.current = false;
        setOptimisticMessages([]);
      }
    }, 50);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isSending && question.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-xl backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
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
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-card shadow-[0_0_10px_rgba(34,211,238,0.35)]">
                    <img
                      src={AvtAI}
                      alt="AI Study Assistant"
                      className="h-full w-full object-cover"
                    />
                  </div>
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

      <div className="shrink-0 border-t border-border/40 px-4 pb-4 pt-2.5">
        <div className="mx-auto max-w-3xl">
          <div
            className={`relative flex border border-border/60 bg-secondary/25 shadow-lg transition-all duration-300 focus-within:border-primary/50 focus-within:bg-secondary/40 focus-within:shadow-primary/5 ${
              question.trim() !== ""
                ? "flex-col rounded-[20px] p-3 pb-12"
                : "flex-row items-center rounded-full py-1 pl-10 pr-12"
            }`}
          >
            {/* Nút cộng bên trái - Luôn cố định trong DOM và trượt vị trí mượt mà */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onAddDocumentClick}
              className={`absolute size-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-all duration-300 ${
                question.trim() !== ""
                  ? "left-3 bottom-2 translate-y-0"
                  : "left-1.5 top-1/2 -translate-y-1/2"
              }`}
              title="Attach study documents"
            >
              <Plus className="size-4" />
            </Button>

            {/* Ô nhập liệu Textarea duy nhất - Giữ nguyên DOM để tránh mất focus */}
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your study materials..."
              disabled={isSending}
              rows={1}
              className="w-full resize-none border-none bg-transparent py-1.5 text-sm text-card-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed scrollbar-thin transition-all duration-300"
            />

            {/* Nút gửi mũi tên hướng lên - Luôn cố định trong DOM và trượt vị trí mượt mà */}
            <Button
              type="button"
              disabled={isSending || question.trim() === ""}
              onClick={handleSendMessage}
              className={`absolute size-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                question.trim() !== ""
                  ? "right-3 bottom-2 translate-y-0 bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-md"
                  : "right-1.5 top-1/2 -translate-y-1/2 bg-muted-foreground/15 text-muted-foreground/35 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
