import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PanelRightClose, PanelRightOpen, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  CommunityFilters,
  type FilterState,
} from "@/components/community/CommunityFilters";
import { TopContributors } from "@/components/community/TopContributors";
import { TrendingSubjects } from "@/components/community/TrendingSubjects";
import DocumentGrid from "@/components/document/DocumentGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import { getAllAcademicSubjects } from "@/services/academicService";
import { searchPublicDocuments } from "@/services/documentService";
import type { SubjectResponse } from "@/types/academic.type";

function CommunityPage() {
  const navigate = useNavigate();

  // NOTE AUTH: Lay user hien tai de biet document nao la cua minh.
  // Community van hien tat ca public documents, ke ca cua minh va cua user khac.
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );

  // NOTE FE: keyword la chu user dang go, searchKeyword la gia tri da submit de call API.
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // NOTE FE: Bat/tat panel filter ben phai.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // NOTE FE: Bo loc dang xu ly o frontend vi backend chua co API filter public document day du.
  const [filters, setFilters] = useState<FilterState>({
    subject: "ALL",
    semester: "ALL",
    documentType: "ALL",
    fileType: "ALL",
    rating: 0,
  });

  const isAuthenticated = !!localStorage.getItem("accessToken");
  const authUserId = localStorage.getItem("authUserId");

  // NOTE API: Lay public documents tu backend theo keyword.
  // Endpoint hien tai nam duoi /user nen chi enable khi da co token/user.
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicDocuments", authUserId, searchKeyword],
    queryFn: () => searchPublicDocuments(searchKeyword),
    enabled: isAuthenticated && !!authUserId,
  });

  // NOTE API: Lay subject/semester tu backend de bo sung thong tin cho card va filter.
  const { data: academicSubjects = [] } = useQuery({
    queryKey: ["communityAcademicSubjects", authUserId],
    queryFn: getAllAcademicSubjects,
    enabled: isAuthenticated && !!authUserId,
  });

  // NOTE DATA: Map subjectId -> subject de ghep document response voi subject detail.
  const subjectMap = useMemo(() => {
    return new Map<number, SubjectResponse>(
      academicSubjects.map((subject) => [subject.subjectId, subject]),
    );
  }, [academicSubjects]);

  // NOTE DATA: Bo sung subjectCode, subjectName, semesterNo, comboName cho document.
  // Khong filter owner o day vi Community can hien tat ca tai lieu public.
  const hydratedDocuments = useMemo(() => {
    return documents.map((document) => {
      const subject = subjectMap.get(document.subjectId);

      return {
        ...document,
        subjectCode: document.subjectCode ?? subject?.subjectCode,
        subjectName: document.subjectName ?? subject?.subjectName,
        semesterNo: document.semesterNo ?? subject?.semesterNo ?? null,
        comboCode: document.comboCode ?? subject?.comboCode ?? null,
        comboName: document.comboName ?? subject?.comboName ?? null,
      };
    });
  }, [documents, subjectMap]);

  // NOTE DATA: Filter tren frontend theo subject, semester, fileType va rating.
  const filteredDocuments = useMemo(() => {
    return hydratedDocuments.filter((document) => {
      const matchesSubject =
        filters.subject === "ALL" ||
        String(document.subjectId) === filters.subject;

      const matchesSemester =
        filters.semester === "ALL" ||
        String(document.semesterNo ?? "") === filters.semester;

      const matchesFileType =
        filters.fileType === "ALL" ||
        String(document.fileType).toUpperCase() === filters.fileType;

      const rating = Math.round(document.averageRating ?? 0);
      const matchesRating = filters.rating === 0 || rating >= filters.rating;

      return (
        matchesSubject && matchesSemester && matchesFileType && matchesRating
      );
    });
  }, [hydratedDocuments, filters]);

  const subjectOptions = useMemo(() => {
    // NOTE UI DATA: Chuan hoa subject options cho CommunityFilters.
    return academicSubjects.map((subject) => ({
      code: String(subject.subjectId),
      name: `${subject.subjectCode ?? subject.subjectId} - ${
        subject.subjectName ?? "Subject"
      }`,
    }));
  }, [academicSubjects]);

  const semesterOptions = useMemo(() => {
    // NOTE UI DATA: Lay danh sach hoc ky duy nhat tu academic subjects de dua vao dropdown.
    const values = academicSubjects
      .map((subject) => Number(subject.semesterNo))
      .filter((semester) => Number.isFinite(semester));

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [academicSubjects]);

  const handleSearch = () => {
    // NOTE ACTION: Chi khi bam Search/Enter moi cap nhat searchKeyword de goi lai API.
    setSearchKeyword(keyword.trim());
  };

  const handleViewDocument = (documentId: number) => {
    const selectedDocument = hydratedDocuments.find(
      (document) => document.documentId === documentId,
    );
    const isMyDocument =
      Number(selectedDocument?.ownerId) === Number(currentUser?.userId);

    // NOTE NAVIGATION: Document cua minh -> My Documents detail de co edit/delete.
    // Document cua nguoi khac -> Community detail de co save/bookmark/rating/report.
    navigate(
      `/${ROUTE.APP}/${
        isMyDocument ? ROUTE.MY_DOCUMENTS : ROUTE.COMMUNITY
      }/${documentId}`,
    );
  };

  if (!isAuthenticated) {
    // NOTE GUARD: Chua dang nhap thi khong goi API Community, chi yeu cau login.
    return (
      <div className="p-10">
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-card-foreground">
            Community Documents
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Please login to search public documents, bookmark, rate and report
            community documents.
          </p>
          <Button
            type="button"
            className="mt-6 rounded-2xl px-8 font-bold"
            onClick={() => navigate(`/${ROUTE.AUTH}/${ROUTE.LOGIN}`)}
          >
            Login to continue
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    // NOTE UI STATE: Trang thai cho API public documents.
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }

  if (isError) {
    // NOTE UI STATE: Loi thuong do token/API backend public document chua chay dung.
    return <div className="p-10 text-destructive">Failed to load data</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8 p-5 lg:flex-row">
      <div className="min-w-0 flex-1 transition-all duration-300">
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

        <div className="relative mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="text"
              placeholder="Search public documents by title..."
              className="h-14 rounded-2xl border-border bg-card pl-12 text-base shadow-sm"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
            />
          </div>

          <Button
            type="button"
            onClick={handleSearch}
            className="h-14 rounded-2xl px-6 font-bold"
          >
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            className={`h-14 cursor-pointer rounded-2xl border-border px-5 shadow-sm transition-colors ${
              !isSidebarOpen
                ? "border-primary/30 bg-primary/10 text-primary"
                : "bg-card"
            }`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <PanelRightOpen className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {filteredDocuments.length}
          </span>{" "}
          documents
        </div>

        {/* NOTE RENDER: DocumentGrid chi render card. Du lieu da search/filter/hydrate o CommunityPage. */}
        <DocumentGrid
          documents={filteredDocuments}
          onView={(document) => handleViewDocument(document.documentId)}
        />
      </div>

      {isSidebarOpen && (
        /* NOTE SIDEBAR: Cac component phu tach rieng de de sua UI filter, trending subject, contributor. */
        <div className="w-full shrink-0 space-y-6 lg:w-80">
          <CommunityFilters
            filters={filters}
            onFilterChange={setFilters}
            subjects={subjectOptions}
            semesters={semesterOptions}
          />
          <TrendingSubjects />
          <TopContributors />
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
