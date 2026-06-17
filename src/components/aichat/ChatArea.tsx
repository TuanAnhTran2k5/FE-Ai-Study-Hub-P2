import { Button } from "@/components/ui/button";

import { 
  Bot, 
  PlusCircle, 
  Trash2, 
  Paperclip, 
  Send, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2 
} from "lucide-react";

function ChatArea() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-6 pt-2 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
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
          <Button variant="ghost" className="text-sm font-semibold rounded-full bg-white/50 hover:bg-white text-primary shadow-sm border border-border/50">
            <PlusCircle className="mr-2 size-4" />
            New Chat
          </Button>
          <Button variant="ghost" className="text-sm font-semibold rounded-full bg-white/50 hover:bg-white text-destructive hover:text-destructive shadow-sm border border-destructive/20">
            <Trash2 className="mr-2 size-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Empty State / No Messages */}
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
          <Bot className="size-12 mb-4" />
          <p className="text-sm">Start a new conversation...</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 pt-2 px-2 pb-2">
        <div className="relative bg-card border border-border shadow-md rounded-[2rem] p-4 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Ask anything about your study materials..." 
            className="w-full bg-transparent border-none outline-none text-[15px] placeholder:text-muted-foreground px-2"
          />
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Button size="sm" className="h-9 rounded-full text-xs bg-primary/10 hover:bg-primary/20 text-primary shadow-none font-semibold">
                <Paperclip className="mr-1.5 size-4" />
                Attach Document
              </Button>
              <Button size="sm" className="h-9 rounded-full text-xs bg-primary/10 hover:bg-primary/20 text-primary shadow-none font-semibold">
                <PlusCircle className="mr-1.5 size-4" />
                Add Context
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground hidden sm:inline-block">Press Enter to send</span>
              <Button size="icon" className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
                <Send className="size-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}

export default ChatArea;
