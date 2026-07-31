import { useTranslation } from "react-i18next";
import type { DocumentResponse } from "@/types/document.type";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentResponse[];
  onView?: (document: DocumentResponse) => void;
  onRemove?: (document: DocumentResponse) => void;
  isRemoving?: boolean;
  getBookmarkedAt?: (document: DocumentResponse) => string | undefined;
  gridClassName?: string;
  selectionMode?: boolean;
  selectedDocumentIds?: number[];
  onToggleSelect?: (document: DocumentResponse) => void;
  viewMode?: "grid" | "list";
  isPublic?: boolean;
}

function DocumentGrid({
  documents,
  onView,
  onRemove,
  isRemoving,
  getBookmarkedAt,
  gridClassName,
  selectionMode,
  selectedDocumentIds = [],
  onToggleSelect,
  viewMode = "grid",
  isPublic = false,
}: DocumentGridProps) {
  const { t } = useTranslation();

  if (documents.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-card-foreground">
          {t("myDocuments.emptyTitle", "No documents found")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("myDocuments.emptyDesc", "Try searching with another keyword or filter.")}
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1020px]">
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_150px_110px_110px_190px] items-center gap-5 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Name</span>
              <span>Owner</span>
              <span>Subject</span>
              <span>Status</span>
              <span>File size</span>
              <span className="text-right">Actions</span>
            </div>

            <div>
              {documents.map((document) => (
                <DocumentCard
                  key={document.documentId}
                  document={document}
                  onView={onView}
                  onRemove={onRemove}
                  isRemoving={isRemoving}
                  bookmarkedAt={getBookmarkedAt?.(document)}
                  selectionMode={selectionMode}
                  isSelected={selectedDocumentIds.includes(document.documentId)}
                  onToggleSelect={onToggleSelect}
                  viewMode="list"
                  isPublic={isPublic}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid w-full gap-6 ${
        gridClassName ??
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {documents.map((document) => (
        <DocumentCard
          key={document.documentId}
          document={document}
          onView={onView}
          onRemove={onRemove}
          isRemoving={isRemoving}
          bookmarkedAt={getBookmarkedAt?.(document)}
          selectionMode={selectionMode}
          isSelected={selectedDocumentIds.includes(document.documentId)}
          onToggleSelect={onToggleSelect}
          viewMode={viewMode}
          isPublic={isPublic}
        />
      ))}
    </div>
  );
}

export default DocumentGrid;
