import ChatArea from "@/components/aichat/ChatArea";
import ChatHistorySidebar from "@/components/aichat/ChatHistorySidebar";
import ContextSidebar from "@/components/aichat/ContextSidebar";


function AIChatPage() {
  return (
    <div className="flex h-full w-full gap-6 bg-transparent p-5">
      <div className="w-64 flex-shrink-0 flex flex-col h-full">
        <ChatHistorySidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatArea />
      </div>
      <div className="w-72 flex-shrink-0 flex flex-col h-full">
        <ContextSidebar />
      </div>
    </div>
  );
}

export default AIChatPage;