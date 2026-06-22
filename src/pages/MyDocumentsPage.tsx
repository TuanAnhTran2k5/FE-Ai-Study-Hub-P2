import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentSearch from "@/components/documents/DocumentSearch";
import { Button } from "@/components/ui/button";
import { getMyDocuments } from "@/services/documentService";

function MyDocumentsPage() {
  const [keyword, setKeyword] = useState("");
  const [subjectCode, setSubjectCode] = useState("ALL");
  const [semesterNo, setSemesterNo] = useState("ALL");
  const [visibilityStatus, setVisibilityStatus] = useState("ALL");

  const navigate = useNavigate();

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myDocuments"],
    queryFn: getMyDocuments,
  });

  const subjects = useMemo(() => {
    const subjectMap = new Map<string, string>();

    documents.forEach((document) => {
      const code = document.subjectCode ?? String(document.subjectId);
      const name = document.subjectName ?? `Subject ${document.subjectId}`;

      subjectMap.set(code, name);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectCode, subjectName]) => ({
        subjectCode,
        subjectName,
      }),
    );
  }, [documents]);

  const semesters = useMemo(() => {
    return Array.from(
      new Set(
        documents
          .map((document) => document.semesterNo)
          .filter((semester): semester is number => typeof semester === "number"),
      ),
    ).sort((a, b) => a - b);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return documents.filter((document) => {
      const subjectCodeValue = document.subjectCode ?? String(document.subjectId);
      const subjectNameValue = document.subjectName ?? "";
      const descriptionValue = document.description ?? "";
      const comboNameValue = document.comboName ?? "";
      const comboCodeValue = document.comboCode ?? "";
      const ownerNameValue = document.ownerName ?? "";

      const matchesKeyword =
        !q ||
        document.title.toLowerCase().includes(q) ||
        document.fileName.toLowerCase().includes(q) ||
        descriptionValue.toLowerCase().includes(q) ||
        subjectNameValue.toLowerCase().includes(q) ||
        subjectCodeValue.toLowerCase().includes(q) ||
        comboNameValue.toLowerCase().includes(q) ||
        comboCodeValue.toLowerCase().includes(q) ||
        ownerNameValue.toLowerCase().includes(q);

      const matchesSubject =
        subjectCode === "ALL" || subjectCodeValue === subjectCode;

      const matchesSemester =
        semesterNo === "ALL" || document.semesterNo === Number(semesterNo);

      const matchesVisibility =
        visibilityStatus === "ALL" ||
        document.visibilityStatus === visibilityStatus;

      return (
        matchesKeyword && matchesSubject && matchesSemester && matchesVisibility
      );
    });
  }, [documents, keyword, subjectCode, semesterNo, visibilityStatus]);

  const handleViewDocument = (documentId: number) => {
    navigate(`/app/mydocuments/${documentId}`);
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
            Please check BE API or server connection.
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
            My Documents
          </p>

          <h1 className="mt-2 text-4xl font-bold text-card-foreground">
            Manage Your Documents
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            View, organize, and manage all documents you have uploaded to AI
            Study Hub.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Button
            type="button"
            className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-primary-start to-primary-end px-5 font-bold text-primary-foreground shadow-sm hover:from-primary-start-hover hover:to-primary-end-hover"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-card-foreground">
              {filteredDocuments.length}
            </span>{" "}
            documents
          </div>
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

      <DocumentGrid
        documents={filteredDocuments}
        onView={(document) => handleViewDocument(document.documentId)}
      />
    </section>
  );
}

export default MyDocumentsPage;