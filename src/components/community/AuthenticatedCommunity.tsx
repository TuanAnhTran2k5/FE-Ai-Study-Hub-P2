import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommunityFilters,
  type FilterState,
} from "@/components/community/CommunityFilters";
import DocumentGrid from "@/components/document/DocumentGrid";
import type { SubjectResponse } from "@/types/academic.type";

function normalizeSearchText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const selectContentClassName =
  "z-[80] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2";

const selectItemClassName = "cursor-pointer truncate rounded-xl py-2.5";

const communityDocumentGridClassName =
  "mx-auto max-w-[1600px] grid-cols-[repeat(auto-fill,382px)] justify-start";

interface AuthenticatedCommunityProps {
  documents: any[];
  academicSubjects: SubjectResponse[];
  onViewDocument: (documentId: number) => void;
}

export function AuthenticatedCommunity({
  documents,
  academicSubjects,
  onViewDocument,
}: AuthenticatedCommunityProps) {
  const [filters, setFilters] = useState<FilterState>({
    subject: "ALL",
    semester: "ALL",
    documentType: "ALL",
    fileType: "ALL",
    rating: 0,
  });
  const [communitySearchInput, setCommunitySearchInput] = useState("");
  const [communitySearchKeyword, setCommunitySearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset pagination to page 1 when filters or search keywords change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, communitySearchKeyword]);

  const subjectOptions = useMemo(() => {
    return academicSubjects
      .filter(
        (subject) =>
          filters.semester === "ALL" ||
          String(subject.semesterNo) === filters.semester,
      )
      .map((subject) => ({
        code: String(subject.subjectId),
        name: `${subject.subjectCode ?? "Subject"} - ${subject.subjectName ?? ""}`,
        semesterNo: subject.semesterNo,
      }));
  }, [academicSubjects, filters.semester]);

  const semesterOptions = useMemo(() => {
    const values = academicSubjects
      .map((subject) => Number(subject.semesterNo))
      .filter((semester) => Number.isFinite(semester));

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [academicSubjects]);

  const filteredDocuments = useMemo(() => {
    const normalizedCommunityKeyword = normalizeSearchText(
      communitySearchKeyword,
    );

    return documents.filter((document) => {
      const searchableText = [
        document.title,
        document.fileName,
        document.description,
        document.subjectCode,
        document.subjectName,
        document.comboCode,
        document.comboName,
        document.ownerName,
      ]
        .filter(Boolean)
        .join(" ");

      const matchesSearch =
        !normalizedCommunityKeyword ||
        normalizeSearchText(searchableText).includes(
          normalizedCommunityKeyword,
        );

      const matchesSubject =
        filters.subject === "ALL" ||
        String(document.subjectId) === filters.subject;

      const matchesSemester =
        filters.semester === "ALL" ||
        String(document.semesterNo ?? "") === filters.semester;

      const rating = document.averageRating ?? 0;
      const matchesRating =
        filters.rating === 0 ||
        (rating >= filters.rating &&
          (filters.rating === 5 || rating < filters.rating + 1));

      return matchesSearch && matchesSubject && matchesSemester && matchesRating;
    });
  }, [documents, filters, communitySearchKeyword]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedDocuments = useMemo(() => {
    return filteredDocuments.slice(
      (activePage - 1) * itemsPerPage,
      activePage * itemsPerPage,
    );
  }, [filteredDocuments, activePage]);

  const handleSearch = () => {
    setCommunitySearchKeyword(communitySearchInput.trim());
  };

  return (
    <div className="w-full p-5">
      <div className="min-w-0 transition-all duration-300">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-card-foreground">
              Community Documents
            </h1>

            <p className="mt-2 text-muted-foreground">
              Discover and learn from public documents shared by the community.
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="grid gap-4 h-14 lg:grid-cols-[1fr_300px_180px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Search documents, subjects, or uploader..."
                className="h-full rounded-2xl border-border bg-card pl-12 text-base text-card-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                value={communitySearchInput}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setCommunitySearchInput(nextValue);
                  setCommunitySearchKeyword(nextValue);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
              />
            </div>

            <Select
              value={filters.subject}
              onValueChange={(value) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  subject: value,
                }))
              }
            >
              <SelectTrigger className="!h-full w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={8} className={selectContentClassName}>
                <SelectItem value="ALL" className={selectItemClassName}>
                  All Subjects
                </SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem
                    key={subject.code}
                    value={subject.code}
                    className={selectItemClassName}
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.semester}
              onValueChange={(value) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  semester: value,
                  subject: "ALL",
                }))
              }
            >
              <SelectTrigger className="!h-full w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={8} className={selectContentClassName}>
                <SelectItem value="ALL" className={selectItemClassName}>
                  All Semesters
                </SelectItem>
                {semesterOptions.map((semester) => (
                  <SelectItem
                    key={semester}
                    value={String(semester)}
                    className={selectItemClassName}
                  >
                    Semester {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <CommunityFilters filters={filters} onFilterChange={setFilters} />

        <div className="mb-6 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {paginatedDocuments.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-card-foreground">
            {filteredDocuments.length}
          </span>{" "}
          documents
        </div>

        <DocumentGrid
          documents={paginatedDocuments}
          onView={(document) => onViewDocument(document.documentId)}
          gridClassName={communityDocumentGridClassName}
        />

        {/* Pagination Section */}
        {filteredDocuments.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-card-foreground">{paginatedDocuments.length}</span> of{" "}
              <span className="font-bold text-card-foreground">{filteredDocuments.length}</span> documents
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activePage === 1}
                onClick={() => setCurrentPage(activePage - 1)}
                className="h-10 rounded-xl px-4 font-bold"
              >
                Previous
              </Button>

              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={activePage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-xl font-bold ${
                      activePage === page
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(activePage + 1)}
                className="h-10 rounded-xl px-4 font-bold"
              >
                Next
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Go to page:</span>
              <Select
                value={String(activePage)}
                onValueChange={(val) => setCurrentPage(Number(val))}
              >
                <SelectTrigger className="h-10 w-28 rounded-xl border border-border bg-card px-3 text-sm shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="z-[80] rounded-xl border border-border bg-popover shadow-xl"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <SelectItem
                      key={page}
                      value={String(page)}
                      className="cursor-pointer rounded-lg text-sm"
                    >
                      Page {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
