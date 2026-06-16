import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentSearch from "@/components/documents/DocumentSearch";
import { VisibilityStatus } from "@/models/document.enum";
import { getDocuments } from "@/services/documentService";

function DocumentsPage() {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subjectCode, setSubjectCode] = useState("ALL");
  const [semesterNo, setSemesterNo] = useState("ALL");

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const publicDocuments = useMemo(() => {
    return documents.filter(
      (document) => document.visibilityStatus === VisibilityStatus.PUBLIC,
    );
  }, [documents]);

  const subjects = useMemo(() => {
    const subjectMap = new Map<string, string>();

    publicDocuments.forEach((document) => {
      subjectMap.set(document.subjectCode, document.subjectName);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectCode, subjectName]) => ({
        subjectCode,
        subjectName,
      }),
    );
  }, [publicDocuments]);

  const semesters = useMemo(() => {
    return Array.from(
      new Set(publicDocuments.map((document) => document.semesterNo)),
    ).sort((a, b) => a - b);
  }, [publicDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = searchKeyword.trim().toLowerCase();

    return publicDocuments.filter((document) => {
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

      return matchesKeyword && matchesSubject && matchesSemester;
    });
  }, [publicDocuments, searchKeyword, subjectCode, semesterNo]);

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  const handleViewDocument = (documentId: string) => {
    console.log("View document:", documentId);
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading documents...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            Failed to load documents
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
            Documents
          </p>

          <h1 className="mt-2 text-4xl font-bold text-card-foreground">
            Explore Study Documents
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse public study materials shared by students in AI Study Hub.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {filteredDocuments.length}
          </span>{" "}
          documents
        </div>
      </div>

      <DocumentSearch
        keyword={keyword}
        subjectCode={subjectCode}
        semesterNo={semesterNo}
        subjects={subjects}
        semesters={semesters}
        onKeywordChange={setKeyword}
        onSubjectChange={setSubjectCode}
        onSemesterChange={setSemesterNo}
        onSearch={handleSearch}
      />

      <DocumentGrid
        documents={filteredDocuments}
        onView={(document) => handleViewDocument(document.id)}
      />
    </section>
  );
}

export default DocumentsPage;
