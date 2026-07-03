import type { DocumentResponse } from "@/types/document.type";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentResponse[];
  onView?: (document: DocumentResponse) => void;
}

function DocumentGrid({ documents, onView }: DocumentGridProps) {
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
    <div className="grid justify-start gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),360px))]">
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
