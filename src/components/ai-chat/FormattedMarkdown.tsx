import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-border/40 bg-zinc-950 shadow-md">
      <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
        <span className="font-mono uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t("aiChat.copied", "Copied")}</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>{t("aiChat.copyCode", "Copy Code")}</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed scrollbar-thin overflow-x-auto">
        <SyntaxHighlighter
          language={language || "javascript"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none text-card-foreground/90 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="border-l-4 border-primary pl-3 py-0.5 mt-5 mb-3 font-extrabold text-foreground text-base tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="border-l-4 border-primary pl-3 py-0.5 mt-4 mb-3 font-extrabold text-foreground text-base tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="border-l-2 border-primary/50 pl-2.5 mt-3.5 mb-2.5 font-bold text-foreground/90 text-[14px]">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-3 mb-2 font-bold text-foreground/90 text-sm">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-3 mb-2 font-bold text-foreground/80 text-xs">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-3 mb-2 font-bold text-foreground/75 text-[11px] uppercase tracking-wider">
              {children}
            </h6>
          ),
          strong: ({ children }) => (
            <strong className="font-extrabold text-foreground dark:text-zinc-50 font-sans mx-0.5">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1.5 marker:text-primary font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed pl-0.5 font-normal text-card-foreground/90">
              {children}
            </li>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-3 last:mb-0">
              {children}
            </p>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-border/60 bg-card/30 shadow-sm scrollbar-thin">
              <table className="min-w-full divide-y divide-border/60 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary/5 text-primary">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/40 bg-transparent">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-primary/5 transition-all duration-150">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-primary border-b border-border/40">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-card-foreground/90 leading-relaxed font-normal">
              {children}
            </td>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code className="bg-muted dark:bg-muted/80 text-foreground px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-border/40 font-semibold">
                  {children}
                </code>
              );
            }

            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            return <CodeBlock language={language} code={codeString} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedMarkdown;
