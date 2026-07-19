import { useTranslation } from "react-i18next";
import { FileText, CheckCircle2, Bot, MoreVertical, Send, Sparkles } from "lucide-react";

function AIChatTeaser() {
  const { t } = useTranslation();

  const mockDocs = [
    t("home.teaser.mockDocs.doc1"),
    t("home.teaser.mockDocs.doc2"),
    t("home.teaser.mockDocs.doc3"),
  ];

  const bullets = [
    t("home.teaser.bullet1"),
    t("home.teaser.bullet3"),
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="grid gap-12 items-center lg:grid-cols-2">

          {/* Left Side: Info & Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black leading-tight text-card-foreground">
                {t("home.teaser.title")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
                {t("home.teaser.description")}
              </p>
            </div>

            {/* Document Badges */}
            <div className="flex flex-wrap gap-3">
              {mockDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400"
                >
                  <FileText className="size-3.5" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>

            {/* Bullet Points */}
            <div className="space-y-3.5 pt-2">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-blue-500 mt-0.5" />
                  <p className="text-sm font-semibold text-card-foreground">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Mock Chat Widget */}
          <div className="relative mx-auto w-full max-w-[500px]">
            {/* Outer Box */}
            <div className="flex flex-col h-[480px] rounded-3xl border-4 border-slate-900 bg-card shadow-2xl overflow-hidden dark:border-slate-800">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-card-foreground">
                      ASH AI Assistant
                    </h4>
                    <p className="mt-0.5 flex items-center text-[10px] font-bold text-emerald-500">
                      <span className="mr-1 size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t("home.teaser.chat.status")}
                    </p>
                  </div>
                </div>
                <button type="button" className="text-muted-foreground hover:text-card-foreground cursor-pointer">
                  <MoreVertical className="size-4" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4 dark:bg-slate-950/20 text-xs">

                {/* AI Hello Message */}
                <div className="flex flex-col gap-1 items-start max-w-[85%]">
                  <div className="rounded-2xl rounded-tl-none bg-slate-100 p-3.5 text-card-foreground leading-relaxed dark:bg-slate-900/60">
                    {t("home.teaser.chat.greeting")}
                  </div>
                </div>

                {/* User Request */}
                <div className="flex flex-col gap-1 items-end max-w-[85%] ml-auto">
                  <div className="rounded-2xl rounded-tr-none bg-blue-600 p-3 font-bold text-white shadow-sm">
                    {t("home.teaser.chat.userMessage")}
                  </div>
                </div>

                {/* AI Summary Block */}
                <div className="flex flex-col gap-1 items-start max-w-[90%]">
                  <div className="w-full rounded-2xl rounded-tl-none border border-border bg-card p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold dark:text-amber-500">
                      <Sparkles className="size-3.5" />
                      <span>{t("home.teaser.chat.summaryTitle")}</span>
                    </div>

                    <ul className="space-y-1.5 list-disc list-inside text-muted-foreground font-medium pl-1 leading-relaxed">
                      <li>{t("home.teaser.chat.sum1")}</li>
                      <li>{t("home.teaser.chat.sum2")}</li>
                      <li>{t("home.teaser.chat.sum3")}</li>
                    </ul>

                    {/* Quick action buttons inside response */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                      <button className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted hover:text-card-foreground transition">
                        {t("home.teaser.chat.conceptBtn")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Blinking loader dots */}
                <div className="flex items-center gap-1 pl-2">
                  <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-100"></span>
                  <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-200"></span>
                  <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-300"></span>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border/60 bg-card p-3 flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-border bg-slate-50/50 px-3 py-2 text-muted-foreground select-none cursor-not-allowed dark:bg-slate-900/60">
                  {t("home.teaser.chat.inputPlaceholder")}
                </div>
                <button type="button" className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition cursor-not-allowed">
                  <Send className="size-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AIChatTeaser;
