import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentSearch from "@/components/documents/DocumentSearch";
import { getDocuments } from "@/services/documentService";

function BookmarksPage() {
  const [keyword, setKeyword] = useState("");
  const [subjectCode, setSubjectCode] = useState("ALL");
  const [semesterNo, setSemesterNo] = useState("ALL");
  const [visibilityStatus, setVisibilityStatus] = useState("ALL");

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarked-documents"],
    queryFn: getDocuments,
  });

  const bookmarkedDocuments = useMemo(() => {
    return documents.filter((document) => document.isBookmarked === true);
  }, [documents]);

  const subjects = useMemo(() => {
    const subjectMap = new Map<string, string>();

    bookmarkedDocuments.forEach((document) => {
      subjectMap.set(document.subjectCode, document.subjectName);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectCode, subjectName]) => ({
        subjectCode,
        subjectName,
      }),
    );
  }, [bookmarkedDocuments]);

  const semesters = useMemo(() => {
    return Array.from(
      new Set(bookmarkedDocuments.map((document) => document.semesterNo)),
    ).sort((a, b) => a - b);
  }, [bookmarkedDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return bookmarkedDocuments.filter((document) => {
      const matchesKeyword =
        !q ||
        document.title.toLowerCase().includes(q) ||
        document.description.toLowerCase().includes(q) ||
        document.subjectName.toLowerCase().includes(q) ||
        document.subjectCode.toLowerCase().includes(q) ||
        document.comboName.toLowerCase().includes(q) ||
        document.comboCode.toLowerCase().includes(q) ||
        document.ownerName.toLowerCase().includes(q);

      const matchesSubject =
        subjectCode === "ALL" || document.subjectCode === subjectCode;

      const matchesSemester =
        semesterNo === "ALL" || document.semesterNo === Number(semesterNo);

      const matchesVisibility =
        visibilityStatus === "ALL" ||
        document.visibilityStatus === visibilityStatus;

      return (
        matchesKeyword &&
        matchesSubject &&
        matchesSemester &&
        matchesVisibility
      );
    });
  }, [
    bookmarkedDocuments,
    keyword,
    subjectCode,
    semesterNo,
    visibilityStatus,
  ]);

  const handleViewDocument = (documentId: string) => {
    console.log("View bookmarked document:", documentId);
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading bookmarks...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            Failed to load bookmarks
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check your MockAPI endpoint or internet connection.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Bookmarks
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold text-card-foreground">
            <Bookmark className="h-8 w-8 text-primary" />
            Saved Documents
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            View and manage all study documents you have bookmarked for quick
            access.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {filteredDocuments.length}
          </span>{" "}
          bookmarked documents
        </div>
      </div>

      <DocumentSearch
        keyword={keyword}
        subjectCode={subjectCode}
        semesterNo={semesterNo}
        visibilityStatus={visibilityStatus}
        subjects={subjects}
        semesters={semesters}
        onKeywordChange={setKeyword}
        onSubjectChange={setSubjectCode}
        onSemesterChange={setSemesterNo}
        onVisibilityChange={setVisibilityStatus}
      />

      {filteredDocuments.length > 0 ? (
        <DocumentGrid
          documents={filteredDocuments}
          onView={(document) => handleViewDocument(document.id)}
        />
      ) : (
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold text-card-foreground">
            No bookmarked documents
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Documents you bookmark will appear here.
          </p>
        </div>
      )}
    </section>
  );
}

export default BookmarksPage;