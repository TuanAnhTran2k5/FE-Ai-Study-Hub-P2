import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, PlusCircle, Trash2, Paperclip, Send, User } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { askRagQuestion } from "@/services/ragService";

import { ERROR_CODE } from "@/constants/errorCode";
import type { RagChatRequest, RagChatResponse } from "@/types/rag.type";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

function ChatArea() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const askMutation = useMutation<RagChatResponse, Error, RagChatRequest>({
    mutationFn: askRagQuestion,

    onSuccess: (data) => {
      setMessages((prev) => [
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

  const handleSendMessage = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setQuestion("");

    askMutation.mutate({
      question: trimmedQuestion,
    });
  };

  const handleEnterSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !askMutation.isPending) {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setQuestion("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-transparent">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-2 pb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <Bot className="size-6 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-bold">AI Study Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask questions, get explanations, and learn with AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleNewChat}
            className="cursor-pointer rounded-full border border-border/50 bg-white/50 text-sm font-semibold text-primary shadow-sm hover:bg-white"
          >
            <PlusCircle className="mr-2 size-4" />
            New Chat
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleClearChat}
            className="cursor-pointer rounded-full border border-destructive/20 bg-white/50 text-sm font-semibold text-destructive shadow-sm hover:bg-white hover:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
            <Bot className="mb-4 size-12" />
            <p className="text-sm">Start a new conversation...</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="size-4 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-card-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 border-t border-border/60 pt-2">
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">
                        Sources:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <span
                            key={`${source}-${index}`}
                            className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {askMutation.isPending && (
              <div className="flex justify-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>

                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  AI is thinking...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-2 pb-2 pt-2">
        <div className="relative flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-4 shadow-md">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleEnterSend}
            placeholder="Ask anything about your study materials..."
            disabled={askMutation.isPending}
            className="w-full border-none bg-transparent px-2 text-[15px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="sm"
                disabled
                className="h-9 rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-none hover:bg-primary/20"
              >
                <Paperclip className="mr-1.5 size-4" />
                Attach Document
              </Button>

              <Button
                type="button"
                size="sm"
                disabled
                className="h-9 rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-none hover:bg-primary/20"
              >
                <PlusCircle className="mr-1.5 size-4" />
                Add Context
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-muted-foreground sm:inline-block">
                Press Enter to send
              </span>

              <Button
                type="button"
                size="icon"
                disabled={askMutation.isPending || !question.trim()}
                onClick={handleSendMessage}
                className="size-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Send className="size-4 text-white" />
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
