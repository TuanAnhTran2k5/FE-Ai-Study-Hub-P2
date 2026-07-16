import type { DocumentResponse } from "@/types/document.type";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentResponse[];
  onView?: (document: DocumentResponse) => void;
  gridClassName?: string;
}

function DocumentGrid({ documents, onView, gridClassName }: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-card-foreground">
          No documents found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try searching with another keyword or filter.
        </p>
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
        />
      ))}
    </div>
  );
}

export default DocumentGrid;
