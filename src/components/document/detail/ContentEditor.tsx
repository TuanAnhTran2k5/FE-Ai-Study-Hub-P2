import { useState } from "react";
import { FileText, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";

type ContentEditorProps = {
  initialContent: string;
  isSaving: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
  fileName: string;
};

function ContentEditor({
  initialContent,
  isSaving,
  onSave,
  onCancel,
  fileName,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const { t } = useTranslation();

  const isMarkdown = fileName.toLowerCase().endsWith(".md");

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      {/* Editor Header / Tab Selection */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-muted/40 px-5 sticky top-0 z-10">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs text-card-foreground">
            {fileName}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary shrink-0">
            {isMarkdown ? "Markdown" : "Plain Text"}
          </span>
        </div>

        {isMarkdown && (
          <div className="flex items-center gap-1 rounded-xl bg-secondary/80 p-0.5">
            <button
              type="button"
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("edit")}
            >
              <Edit3 className="h-3.5 w-3.5" />
              {t("document.editTab", "Edit")}
            </button>
            <button
              type="button"
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="h-3.5 w-3.5" />
              {t("document.previewTab", "Preview")}
            </button>
          </div>
        )}
      </div>

      {/* Editor Body - Configured for exactly 1 scrollbar styled with scrollbar-thin */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-5">
        {activeTab === "edit" || !isMarkdown ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
            placeholder="Write your document content here..."
            className="flex-1 w-full resize-none border-0 bg-transparent font-mono text-sm leading-6 outline-none focus:ring-0 text-foreground scrollbar-thin overflow-y-auto"
          />
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin prose prose-sm dark:prose-invert max-w-none text-left p-2">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic text-center py-10">
                {t("document.noPreviewMarkdown", "Nothing to preview. Start typing in the edit tab!")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-5 py-4 sticky bottom-0">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onCancel}
          className="h-10 rounded-xl"
        >
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          type="button"
          disabled={isSaving || content === initialContent}
          onClick={handleSave}
          className="h-10 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95"
        >
          {isSaving ? t("document.savingChanges", "Saving changes...") : t("document.btnSave", "Save Changes")}
        </Button>
      </div>
    </div>
  );
}

export default ContentEditor;
