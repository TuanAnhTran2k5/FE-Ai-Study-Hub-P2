import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documentService";
import { VisibilityStatus } from "@/models/document.enum";
import DocumentGrid from "@/components/documents/DocumentGrid";
import {
  CommunityFilters,
  type FilterState,
} from "@/components/community/CommunityFilters";
import { TrendingSubjects } from "@/components/community/TrendingSubjects";
import { TopContributors } from "@/components/community/TopContributors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PanelRightClose, PanelRightOpen } from "lucide-react";

function CommunityPage() {
  const [keyword, setKeyword] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    subject: "ALL",
    semester: "ALL",
    documentType: "ALL",
    fileType: "ALL",
    rating: 0,
  });

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
        code: subjectCode,
        name: subjectName,
      }),
    );
  }, [publicDocuments]);

  const semesters = useMemo(() => {
    return Array.from(
      new Set(publicDocuments.map((document) => document.semesterNo)),
    ).sort((a, b) => a - b);
  }, [publicDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return publicDocuments.filter((document) => {
      const matchesKeyword =
        !q ||
        document.title.toLowerCase().includes(q) ||
        document.description.toLowerCase().includes(q) ||
        document.subjectName.toLowerCase().includes(q) ||
        document.subjectCode.toLowerCase().includes(q) ||
        document.ownerName.toLowerCase().includes(q);

      const matchesSubject =
        filters.subject === "ALL" || document.subjectCode === filters.subject;

      const matchesSemester =
        filters.semester === "ALL" ||
        document.semesterNo === Number(filters.semester);

      const matchesFileType =
        filters.fileType === "ALL" || document.fileType === filters.fileType;

      const rating = Math.min(5, Math.round(document.averageRating || 0));
      const matchesRating = filters.rating === 0 || rating >= filters.rating;

      return (
        matchesKeyword &&
        matchesSubject &&
        matchesSemester &&
        matchesFileType &&
        matchesRating
      );
    });
  }, [publicDocuments, keyword, filters]);

  const handleViewDocument = (documentId: string) => {
    console.log("View document:", documentId);
  };

  if (isLoading) {
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }

  if (isError) {
    return <div className="p-10 text-destructive">Failed to load data</div>;
  }

  return (
    <div className="flex w-full flex-col lg:flex-row gap-8 p-5">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 transition-all duration-300">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-card-foreground">
              Community Documents
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discover and learn from documents shared by the community.
            </p>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search documents by title, subject, or owner..."
              className="pl-12 h-14 rounded-2xl bg-card border-border shadow-sm text-base"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className={`cursor-pointer h-14 px-5 rounded-2xl border-border shadow-sm transition-colors ${
              !isSidebarOpen ? "bg-primary/10 text-primary border-primary/30" : "bg-card"
            }`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <PanelRightOpen className="h-5 w-5" />
            )}
            <span className="ml-2 hidden sm:inline font-semibold">
              {isSidebarOpen ? "Hide Panel" : "Filters & Stats"}
            </span>
          </Button>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {filteredDocuments.length}
          </span>{" "}
          documents
        </div>

        {/* Document Grid */}
        <DocumentGrid
          documents={filteredDocuments}
          onView={(doc) => handleViewDocument(doc.id)}
        />
      </div>

      {/* RIGHT SIDEBAR */}
      {isSidebarOpen && (
        <div className="w-full lg:w-80 shrink-0 space-y-6 animate-in slide-in-from-right-8 duration-300">
          <CommunityFilters
            filters={filters}
            onFilterChange={setFilters}
            subjects={subjects}
            semesters={semesters}
          />
          <TrendingSubjects />
          <TopContributors />
        </div>
      )}
    </div>
  );
}

export default CommunityPage;