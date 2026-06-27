import { useState } from "react";

import ChatArea from "@/components/ai-chat/ChatArea";
import ChatHistorySidebar from "@/components/ai-chat/ChatHistorySidebar";
import ContextSidebar from "@/components/ai-chat/ContextSidebar";

function AIChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);

  const handleNewChat = () => {
    setActiveSessionId(null);
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
          onSelectSession={setActiveSessionId}
          onDeletedActiveSession={handleNewChat}
        />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <ChatArea
          activeSessionId={activeSessionId}
          selectedDocumentIds={selectedDocumentIds}
          onSessionCreated={setActiveSessionId}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="hidden h-full w-80 shrink-0 flex-col xl:flex">
        <ContextSidebar
          selectedDocumentIds={selectedDocumentIds}
          onSelectedDocumentIdsChange={setSelectedDocumentIds}
        />
      </div>
    </div>
  );
}

export default AIChatPage;