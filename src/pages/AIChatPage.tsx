import { useState } from "react";

import ChatArea from "@/components/ai-chat/ChatArea";
import ChatHistorySidebar from "@/components/ai-chat/ChatHistorySidebar";
import ContextSidebar from "@/components/ai-chat/ContextSidebar";

function AIChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [clearSignal, setClearSignal] = useState(0);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setSelectedDocumentIds([]);
    setPendingPrompt("");
    setClearSignal((prev) => prev + 1);
  };

  const handleClearChat = () => {
    setPendingPrompt("");
    setClearSignal((prev) => prev + 1);
  };

  const handleSelectSession = (sessionId: number, documentIds: number[]) => {
    setActiveSessionId(sessionId);
    setSelectedDocumentIds(documentIds);
    setPendingPrompt("");
  };

  return (
    <div className="flex h-full w-full gap-4 bg-transparent p-4">
      <div
        className={`h-full shrink-0 transition-all duration-300 ${
          isHistoryCollapsed ? "w-[76px]" : "w-72"
        }`}
      >
        <ChatHistorySidebar
          activeSessionId={activeSessionId}
          isCollapsed={isHistoryCollapsed}
          onToggleCollapse={() => setIsHistoryCollapsed((prev) => !prev)}
          onSelectSession={handleSelectSession}
          onDeletedActiveSession={handleNewChat}
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
        />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <ChatArea
          activeSessionId={activeSessionId}
          selectedDocumentIds={selectedDocumentIds}
          pendingPrompt={pendingPrompt}
          clearSignal={clearSignal}
          onPendingPromptConsumed={() => setPendingPrompt("")}
          onSessionCreated={setActiveSessionId}
        />
      </div>

      <div className="hidden h-full w-80 shrink-0 flex-col xl:flex">
        <ContextSidebar
          activeSessionId={activeSessionId}
          selectedDocumentIds={selectedDocumentIds}
          onSelectedDocumentIdsChange={setSelectedDocumentIds}
          onPromptClick={setPendingPrompt}
        />
      </div>
    </div>
  );
}

export default AIChatPage;