import {
  BarChart3,
  Bot,
  Cloud,
  Folder,
  MessageCircle,
  Search,
  Share2,
} from "lucide-react";
import type { ReactNode } from "react";

function ChatAssistantVisual() {
  return (
    <div className="feature-visual chat-visual">
      <div className="chat-header">
        <div className="chat-avatar">
          <Bot className="size-4" />
        </div>
        <div>
          <div className="chat-name">AI Study Assistant</div>
          <div className="chat-status">Online</div>
        </div>
      </div>

      <div className="chat-stream">
        <div className="chat-bubble chat-bubble-left chat-delay-1">
          Summarize this lecture note.
        </div>
        <div className="chat-bubble chat-bubble-right chat-delay-2">
          Sure. I found 4 key ideas.
        </div>
        <div className="chat-bubble chat-bubble-left chat-delay-3">
          Can you make flashcards?
        </div>
        <div className="chat-bubble chat-bubble-right chat-delay-4">
          Done. 12 flashcards created.
        </div>
      </div>
    </div>
  );
}

function SmartSearchVisual() {
  return (
    <div className="smart-search-visual">
      <div className="smart-search-box">
        <Search className="size-5 text-primary" />
        <span className="typing-text" />
      </div>
    </div>
  );
}

function CloudStorageVisual() {
  return (
    <div className="feature-visual cloud-visual">
      <Cloud className="cloud-main" />
      <div className="cloud-file cloud-file-1" />
      <div className="cloud-file cloud-file-2" />
      <div className="cloud-file cloud-file-3" />
      <div className="cloud-sync-ring" />
    </div>
  );
}

function DocumentSharingVisual() {
  return (
    <div className="feature-visual sharing-visual">
      <div className="sharing-folder sharing-folder-left">
        <Folder className="size-9" />
      </div>
      <div className="sharing-folder sharing-folder-right">
        <Folder className="size-9" />
      </div>

      <div className="share-arc share-arc-1" />
      <div className="share-arc share-arc-2" />
      <div className="share-paper share-paper-1" />
      <div className="share-paper share-paper-2" />
      <div className="share-paper share-paper-3" />
    </div>
  );
}

function LearningAnalyticsVisual() {
  return (
    <div className="feature-visual analytics-visual">
      <div className="analytics-bars">
        <span className="analytics-bar analytics-bar-1" />
        <span className="analytics-bar analytics-bar-2" />
        <span className="analytics-bar analytics-bar-3" />
        <span className="analytics-bar analytics-bar-4" />
      </div>
      <div className="analytics-line" />
    </div>
  );
}

function FeatureOverviewSection() {
  return (
    <section className="mx-auto max-w-7xl py-14">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-card-foreground md:text-4xl">
          Powerful Features for Modern Students
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Everything you need to master your curriculum using state-of-the-art
          artificial intelligence.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="feature-card feature-card-large min-h-[360px]">
          <FeatureIcon>
            <MessageCircle className="size-5" />
          </FeatureIcon>
          <h3 className="feature-title">AI Chatbot Assistant</h3>
          <p className="feature-copy">
            Interactive AI that answers questions based specifically on your
            uploaded lecture notes, textbooks, and research papers.
          </p>
          <ChatAssistantVisual />
        </article>

        <article className="feature-card min-h-[330px]">
          <FeatureIcon>
            <Cloud className="size-5" />
          </FeatureIcon>
          <h3 className="feature-title">Cloud Storage</h3>
          <p className="feature-copy">
            Access your study materials from any device, anywhere, anytime with
            secure encrypted storage.
          </p>
          <CloudStorageVisual />
        </article>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <article className="feature-card min-h-[340px]">
          <FeatureIcon>
            <Search className="size-5" />
          </FeatureIcon>
          <h3 className="feature-title">Smart Search</h3>
          <p className="feature-copy">
            Deep search within documents to find exact concepts, formulas, or
            keywords in seconds.
          </p>
          <SmartSearchVisual />
        </article>

        <article className="feature-card min-h-[340px]">
          <FeatureIcon>
            <Share2 className="size-5" />
          </FeatureIcon>
          <h3 className="feature-title">Document Sharing</h3>
          <p className="feature-copy">
            Collaborate with peers by sharing folders and document sets with
            controlled access.
          </p>
          <DocumentSharingVisual />
        </article>

        <article className="feature-card min-h-[340px]">
          <FeatureIcon>
            <BarChart3 className="size-5" />
          </FeatureIcon>
          <h3 className="feature-title">Learning Analytics</h3>
          <p className="feature-copy">
            Track your study progress and see which topics you need to focus on
            more.
          </p>
          <LearningAnalyticsVisual />
        </article>
      </div>

      <style>{`
        .feature-card {
          --feature-card-bg: rgba(255, 255, 255, 0.82);
          --feature-card-border: rgba(14, 116, 144, 0.12);
          --feature-title-color: #0f172a;
          --feature-copy-color: rgba(51, 65, 85, 0.82);
          --feature-icon-bg: rgba(14, 165, 233, 0.12);
          --feature-icon-color: #0284c7;
          --feature-visual-bg: rgba(14, 165, 233, 0.09);
          --feature-visual-border: rgba(14, 165, 233, 0.14);
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--feature-card-border);
          background: var(--feature-card-bg);
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.10);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }

        .dark .feature-card {
          --feature-card-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035));
          --feature-card-border: rgba(148, 163, 184, 0.22);
          --feature-title-color: #f8fafc;
          --feature-copy-color: rgba(226, 232, 240, 0.82);
          --feature-icon-bg: rgba(56, 189, 248, 0.12);
          --feature-icon-color: #7dd3fc;
          --feature-visual-bg: rgba(148, 163, 184, 0.12);
          --feature-visual-border: rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 46px rgba(0, 0, 0, 0.18);
        }

        .feature-title {
          margin-top: 18px;
          font-size: 20px;
          font-weight: 900;
          color: var(--feature-title-color);
        }

        .feature-copy {
          margin-top: 12px;
          margin-bottom: 24px;
          max-width: 620px;
          color: var(--feature-copy-color);
          font-size: 14px;
          line-height: 1.8;
        }

        .feature-icon {
          display: flex;
          height: 48px;
          width: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: var(--feature-icon-bg);
          color: var(--feature-icon-color);
        }

        .feature-visual {
          position: relative;
          margin-top: auto;
          width: 100%;
          min-height: 126px;
          border-radius: 20px;
          background: var(--feature-visual-bg);
          border: 1px solid var(--feature-visual-border);
        }

        .feature-card-large .feature-visual {
          min-height: 172px;
        }

        .chat-visual {
          padding: 16px;
          background: linear-gradient(135deg, #17253f, #0f1b31);
          color: white;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .chat-avatar {
          display: flex;
          height: 34px;
          width: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #3b82f6;
        }

        .chat-name {
          font-size: 13px;
          font-weight: 800;
        }

        .chat-status {
          font-size: 11px;
          color: #9fb5d7;
        }

        .chat-stream {
          display: grid;
          gap: 10px;
        }

        .chat-bubble {
          max-width: 76%;
          border-radius: 14px;
          padding: 9px 12px;
          font-size: 12px;
          line-height: 1.35;
          opacity: 0;
          transform: translateY(10px);
          animation: chatPulse 4.8s infinite;
        }

        .chat-bubble-left {
          justify-self: start;
          background: #22375e;
        }

        .chat-bubble-right {
          justify-self: end;
          background: #4f7cff;
        }

        .chat-delay-1 { animation-delay: 0s; }
        .chat-delay-2 { animation-delay: 0.8s; }
        .chat-delay-3 { animation-delay: 1.6s; }
        .chat-delay-4 { animation-delay: 2.4s; }

        @keyframes chatPulse {
          0%, 12% { opacity: 0; transform: translateY(10px); }
          20%, 72% { opacity: 1; transform: translateY(0); }
          90%, 100% { opacity: 0; transform: translateY(-8px); }
        }

        .smart-search-visual {
          position: relative;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 92px;
          border-radius: 20px;
          background: hsl(var(--primary) / 0.1);
        }

        .smart-search-box {
          display: flex;
          width: min(100%, 340px);
          height: 58px;
          align-items: center;
          gap: 12px;
          border-radius: 999px;
          background: white;
          padding: 0 20px;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.16);
          color: #0f172a;
        }

        .typing-text::before {
          content: "";
          font-weight: 800;
          animation: typeSearch 7s steps(1, end) infinite;
        }

        .typing-text::after {
          content: "";
          display: inline-block;
          width: 1px;
          height: 18px;
          margin-left: 3px;
          background: #0f172a;
          vertical-align: -3px;
          animation: caretBlink 0.9s infinite;
        }

        @keyframes typeSearch {
          0% { content: "S"; }
          5% { content: "Se"; }
          10% { content: "Sea"; }
          15% { content: "Sear"; }
          20% { content: "Search"; }
          25% { content: "Search d"; }
          30% { content: "Search doc"; }
          35% { content: "Search docu"; }
          40% { content: "Search document"; }
          52% { content: "Search document"; }
          58% { content: "Search docu"; }
          64% { content: "Search doc"; }
          70% { content: "Search d"; }
          76% { content: "Search"; }
          82% { content: "Sear"; }
          88% { content: "Se"; }
          94% { content: "S"; }
          96%, 100% { content: ""; }
        }

        @keyframes caretBlink {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: 0; }
        }

        .cloud-visual {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cloud-main {
          position: relative;
          z-index: 2;
          height: 74px;
          width: 74px;
          color: hsl(var(--primary));
          filter: drop-shadow(0 12px 18px rgba(37, 99, 235, 0.25));
          animation: floatCloud 3s ease-in-out infinite;
        }

        .cloud-file {
          position: absolute;
          height: 34px;
          width: 26px;
          border-radius: 6px;
          background: white;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
          animation: orbitFile 4s ease-in-out infinite;
        }

        .cloud-file-1 { left: 22%; top: 22%; animation-delay: 0s; }
        .cloud-file-2 { right: 18%; top: 30%; animation-delay: 0.8s; }
        .cloud-file-3 { left: 42%; bottom: 12%; animation-delay: 1.5s; }

        .cloud-sync-ring {
          position: absolute;
          height: 116px;
          width: 116px;
          border-radius: 999px;
          border: 1px dashed hsl(var(--primary) / 0.4);
          animation: spinRing 7s linear infinite;
        }

        @keyframes floatCloud {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes orbitFile {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.78; }
          50% { transform: translateY(-10px) scale(1.06); opacity: 1; }
        }

        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        .sharing-visual {
          display: flex;
          align-items: end;
          justify-content: space-between;
          padding: 22px 24px;
        }

        .sharing-folder {
          position: relative;
          z-index: 2;
          display: flex;
          height: 74px;
          width: 92px;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          color: white;
          box-shadow: 0 14px 24px rgba(15, 23, 42, 0.16);
        }

        .sharing-folder-left { background: #2563eb; }
        .sharing-folder-right { background: #16a34a; }

        .share-arc {
          position: absolute;
          left: 24%;
          right: 24%;
          border-top: 1px dashed hsl(var(--primary) / 0.45);
          border-radius: 999px 999px 0 0;
        }

        .share-arc-1 { top: 22px; height: 76px; }
        .share-arc-2 { top: 42px; height: 54px; }

        .share-paper {
          position: absolute;
          z-index: 3;
          height: 36px;
          width: 26px;
          border-radius: 5px;
          background: white;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
          animation: flyPaper 3.8s ease-in-out infinite;
        }

        .share-paper::after {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          top: 10px;
          height: 3px;
          border-radius: 99px;
          background: #bfdbfe;
          box-shadow: 0 8px 0 #dbeafe;
        }

        .share-paper-1 { animation-delay: 0s; }
        .share-paper-2 { animation-delay: 1.1s; }
        .share-paper-3 { animation-delay: 2.2s; }

        @keyframes flyPaper {
          0% { left: 24%; top: 70%; transform: rotate(-12deg) scale(0.92); opacity: 0; }
          15% { opacity: 1; }
          50% { left: 49%; top: 15%; transform: rotate(8deg) scale(1); opacity: 1; }
          85% { opacity: 1; }
          100% { left: 72%; top: 70%; transform: rotate(18deg) scale(0.92); opacity: 0; }
        }

        .analytics-visual {
          display: flex;
          align-items: end;
          justify-content: center;
          padding: 24px;
        }

        .analytics-visual::before {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 16px;
          background:
            linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
          background-size: 38px 28px;
        }

        .analytics-bars {
          position: relative;
          z-index: 2;
          display: flex;
          height: 86px;
          align-items: end;
          gap: 14px;
        }

        .analytics-bar {
          display: block;
          width: 24px;
          border-radius: 999px 999px 8px 8px;
          background: linear-gradient(180deg, hsl(var(--primary)), #67e8f9);
          animation: barGrow 2.6s ease-in-out infinite;
        }

        .analytics-bar-1 { height: 38px; animation-delay: 0s; }
        .analytics-bar-2 { height: 68px; animation-delay: 0.25s; }
        .analytics-bar-3 { height: 50px; animation-delay: 0.5s; }
        .analytics-bar-4 { height: 82px; animation-delay: 0.75s; }

        .analytics-line {
          position: absolute;
          z-index: 3;
          left: 20%;
          right: 20%;
          top: 45%;
          height: 2px;
          border-radius: 999px;
          background: hsl(var(--primary) / 0.45);
          transform: rotate(-10deg);
        }

        @keyframes barGrow {
          0%, 100% { transform: scaleY(0.72); transform-origin: bottom; }
          50% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}

function FeatureIcon({ children }: { children: ReactNode }) {
  return <div className="feature-icon">{children}</div>;
}

export default FeatureOverviewSection;
