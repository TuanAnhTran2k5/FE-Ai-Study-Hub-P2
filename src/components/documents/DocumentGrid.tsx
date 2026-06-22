// import type { DocumentResponse } from "@/types/document.type";
// import DocumentCard from "./DocumentCard";

// interface DocumentGridProps {
//   documents: DocumentResponse[];
//   onView?: (document: DocumentResponse) => void;
// }

// function DocumentGrid({ documents, onView }: DocumentGridProps) {
//   if (documents.length === 0) {
//     return (
//       <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
//         <p className="text-lg font-semibold text-card-foreground">
//           No documents found
//         </p>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Try searching with another keyword or filter.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//       {documents.map((document) => (
//         <DocumentCard key={document.id} document={document} onView={onView} />
//       ))}
//     </div>
//   );
// }

// export default DocumentGrid;


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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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