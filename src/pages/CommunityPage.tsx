import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  CommunityFilters,
  type FilterState,
} from "@/components/community/CommunityFilters";
import DocumentGrid from "@/components/document/DocumentGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTE } from "@/models/routePath";
import type { User } from "@/models/user";
import type { RootState } from "@/redux/store";
import { getAllAcademicSubjects } from "@/services/academicService";
import { searchPublicDocuments } from "@/services/documentService";
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

function CommunityPage() {
  const navigate = useNavigate();

  // NOTE AUTH: Lay user hien tai de biet document nao la cua minh.
  // Community van hien tat ca public documents, ke ca cua minh va cua user khac.
  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );

  // NOTE FE: Bo loc dang xu ly o frontend vi backend chua co API filter public document day du.
  const [filters, setFilters] = useState<FilterState>({
    subject: "ALL",
    semester: "ALL",
    documentType: "ALL",
    fileType: "ALL",
    rating: 0,
  });
  const [communitySearchInput, setCommunitySearchInput] = useState("");
  const [communitySearchKeyword, setCommunitySearchKeyword] = useState("");
  const [guestSubjectInput, setGuestSubjectInput] = useState("");
  const [guestSubjectKeyword, setGuestSubjectKeyword] = useState("");
  const [isGuestSubjectDropdownOpen, setIsGuestSubjectDropdownOpen] =
    useState(false);
  const [selectedGuestSubject, setSelectedGuestSubject] =
    useState<SubjectResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [guestPage, setGuestPage] = useState(1);

  // Reset pagination to page 1 when filters or search keywords change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, communitySearchKeyword]);

  // Reset guest pagination to page 1 when search keyword changes
  useEffect(() => {
    setGuestPage(1);
  }, [guestSubjectKeyword]);

  const accessToken = localStorage.getItem("accessToken");
  const authUserId =
    currentUser?.userId != null
      ? String(currentUser.userId)
      : localStorage.getItem("authUserId");
  const isAuthenticated = !!accessToken || !!currentUser?.userId;

  // NOTE API: Lay public documents tu backend theo keyword.
  // Endpoint hien tai nam duoi /user nen chi enable khi da co token/user.
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "publicDocuments",
      isAuthenticated ? (authUserId ?? "current-user") : "guest",
    ],
    queryFn: () => searchPublicDocuments(""),
  });

  // NOTE API: Lay subject/semester tu backend de bo sung thong tin cho card va filter.
  const { data: academicSubjects = [] } = useQuery({
    queryKey: ["communityAcademicSubjects", authUserId ?? "current-user"],
    queryFn: getAllAcademicSubjects,
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
    return documents
      .filter((document) => !document.moderationStatus || document.moderationStatus === "NORMAL")
      .map((document) => {
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

  // NOTE DATA: Filter tren frontend theo search, subject, semester va rating.
  const filteredDocuments = useMemo(() => {
    const normalizedCommunityKeyword = normalizeSearchText(
      communitySearchKeyword,
    );

    return hydratedDocuments.filter((document) => {
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
  }, [hydratedDocuments, filters, communitySearchKeyword]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedDocuments = useMemo(() => {
    return filteredDocuments.slice(
      (activePage - 1) * itemsPerPage,
      activePage * itemsPerPage,
    );
  }, [filteredDocuments, activePage]);



  const guestTopRatedDocuments = useMemo(() => {
    if (selectedGuestSubject) {
      return hydratedDocuments
        .filter((document) => document.subjectId === selectedGuestSubject.subjectId)
        .sort((firstDocument, secondDocument) => {
          return (
            (secondDocument.averageRating ?? 0) -
            (firstDocument.averageRating ?? 0)
          );
        });
    }

    const normalizedSubjectKeyword = normalizeSearchText(guestSubjectKeyword);
    if (!normalizedSubjectKeyword) {
      return hydratedDocuments.sort((firstDocument, secondDocument) => {
        return (
          (secondDocument.averageRating ?? 0) -
          (firstDocument.averageRating ?? 0)
        );
      });
    }

    const words = normalizedSubjectKeyword.split(/\s+/).filter(Boolean);

    return hydratedDocuments
      .filter((document) => {
        return words.every((word) => {
          const subjectCode = (document.subjectCode ?? "").toLowerCase();
          const comboCode = (document.comboCode ?? "").toLowerCase();
          const subjectName = (document.subjectName ?? "").toLowerCase();
          const comboName = (document.comboName ?? "").toLowerCase();

          if (subjectCode.startsWith(word)) return true;
          if (comboCode.startsWith(word)) return true;

          const nameWords = subjectName.split(/\s+/).filter(Boolean);
          if (nameWords.some((nw) => nw.startsWith(word))) return true;

          const comboNameWords = comboName.split(/\s+/).filter(Boolean);
          if (comboNameWords.some((cnw) => cnw.startsWith(word))) return true;

          if (/^\d+$/.test(word)) {
            if (subjectCode.includes(word)) return true;
            if (comboCode.includes(word)) return true;
          }

          return false;
        });
      })
      .sort((firstDocument, secondDocument) => {
        return (
          (secondDocument.averageRating ?? 0) -
          (firstDocument.averageRating ?? 0)
        );
      });
  }, [hydratedDocuments, guestSubjectKeyword, selectedGuestSubject]);

  const totalGuestPages = Math.ceil(guestTopRatedDocuments.length / itemsPerPage);
  const activeGuestPage = Math.max(1, Math.min(guestPage, totalGuestPages || 1));

  const paginatedGuestDocuments = useMemo(() => {
    return guestTopRatedDocuments.slice(
      (activeGuestPage - 1) * itemsPerPage,
      activeGuestPage * itemsPerPage,
    );
  }, [guestTopRatedDocuments, activeGuestPage]);

  const guestSubjectSuggestions = useMemo(() => {
    const normalizedInput = normalizeSearchText(guestSubjectInput);

    if (!normalizedInput) {
      return [];
    }

    const words = normalizedInput.split(/\s+/).filter(Boolean);

    return academicSubjects
      .filter((subject) => {
        return words.every((word) => {
          const subjectCode = (subject.subjectCode ?? "").toLowerCase();
          const comboCode = (subject.comboCode ?? "").toLowerCase();
          const subjectName = (subject.subjectName ?? "").toLowerCase();
          const comboName = (subject.comboName ?? "").toLowerCase();

          if (subjectCode.startsWith(word)) return true;
          if (comboCode.startsWith(word)) return true;

          const nameWords = subjectName.split(/\s+/).filter(Boolean);
          if (nameWords.some((nw) => nw.startsWith(word))) return true;

          const comboNameWords = comboName.split(/\s+/).filter(Boolean);
          if (comboNameWords.some((cnw) => cnw.startsWith(word))) return true;

          if (/^\d+$/.test(word)) {
            if (subjectCode.includes(word)) return true;
            if (comboCode.includes(word)) return true;
          }

          return false;
        });
      })
      .slice(0, 8);
  }, [academicSubjects, guestSubjectInput]);

  const subjectOptions = useMemo(() => {
    // NOTE UI DATA: Neu da chon semester thi dropdown Subject chi hien mon thuoc semester do.
    return academicSubjects
      .filter(
        (subject) =>
          filters.semester === "ALL" ||
          String(subject.semesterNo) === filters.semester,
      )
      .map((subject) => ({
        code: String(subject.subjectId),
        name: `${subject.subjectCode ?? "Subject"} - ${subject.subjectName ?? ""
          }`,
        semesterNo: subject.semesterNo,
      }));
  }, [academicSubjects, filters.semester]);

  const semesterOptions = useMemo(() => {
    // NOTE UI DATA: Lay danh sach hoc ky duy nhat tu academic subjects de dua vao dropdown.
    const values = academicSubjects
      .map((subject) => Number(subject.semesterNo))
      .filter((semester) => Number.isFinite(semester));

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [academicSubjects]);

  const handleSearch = () => {
    // NOTE ACTION: Search Community tren frontend theo title, file, subject va uploader.
    setCommunitySearchKeyword(communitySearchInput.trim());
  };

  const handleGuestSubjectSearch = () => {
    setGuestSubjectKeyword(guestSubjectInput.trim());
    setIsGuestSubjectDropdownOpen(false);
  };

  const handleViewDocument = (documentId: number) => {
    if (!isAuthenticated) {
      navigate(`/${ROUTE.AUTH}/${ROUTE.LOGIN}`);
      return;
    }

    const selectedDocument = hydratedDocuments.find(
      (document) => document.documentId === documentId,
    );
    const isMyDocument =
      Number(selectedDocument?.ownerId) === Number(currentUser?.userId);

    // NOTE NAVIGATION: Document cua minh -> My Documents detail de co edit/delete.
    // Document cua nguoi khac -> Community detail de co save/bookmark/rating/report.
    navigate(
      `/${ROUTE.APP}/${isMyDocument ? ROUTE.MY_DOCUMENTS : ROUTE.COMMUNITY
      }/${documentId}`,
    );
  };

  if (!isAuthenticated) {
    // NOTE GUEST: Chua dang nhap van xem duoc danh sach public/top-rated.
    // Khi bam View Document se dieu huong sang trang login.
    return (
      <div className="space-y-8 p-10">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-black text-card-foreground">
            Top Rated Documents
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Search by subject to explore highly rated public documents.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by subject code or subject name..."
                className="h-14 rounded-2xl border-border bg-background pl-12 text-base shadow-sm"
                value={guestSubjectInput}
                onFocus={() => setIsGuestSubjectDropdownOpen(true)}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setGuestSubjectInput(nextValue);
                  setGuestSubjectKeyword(nextValue);
                  setIsGuestSubjectDropdownOpen(true);
                  setSelectedGuestSubject(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleGuestSubjectSearch();
                  }
                }}
              />

              {isGuestSubjectDropdownOpen &&
                guestSubjectSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-72 overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-xl">
                    {guestSubjectSuggestions.map((subject) => {
                      const subjectLabel = `${subject.subjectCode} - ${subject.subjectName}`;

                      return (
                        <button
                          key={subject.subjectId}
                          type="button"
                          className="flex w-full cursor-pointer flex-col rounded-xl px-4 py-3 text-left transition hover:bg-secondary"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setGuestSubjectInput(subjectLabel);
                            setGuestSubjectKeyword(subjectLabel);
                            setSelectedGuestSubject(subject);
                            setIsGuestSubjectDropdownOpen(false);
                          }}
                        >
                          <span className="font-bold text-popover-foreground">
                            {subject.subjectCode}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {subject.subjectName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>

            <Button
              type="button"
              className="h-14 rounded-2xl px-8 font-bold"
              onClick={handleGuestSubjectSearch}
            >
              Search
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-5 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-card-foreground">
              {paginatedGuestDocuments.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-card-foreground">
              {guestTopRatedDocuments.length}
            </span>{" "}
            public documents
          </div>

          <DocumentGrid
            documents={paginatedGuestDocuments}
            onView={(document) => handleViewDocument(document.documentId)}
            gridClassName={communityDocumentGridClassName}
          />

          {/* Guest Pagination Section */}
          {guestTopRatedDocuments.length > 0 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-card-foreground">{paginatedGuestDocuments.length}</span> of{" "}
                <span className="font-bold text-card-foreground">{guestTopRatedDocuments.length}</span> documents
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeGuestPage === 1}
                  onClick={() => setGuestPage(activeGuestPage - 1)}
                  className="h-10 rounded-xl px-4 font-bold"
                >
                  Previous
                </Button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalGuestPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={activeGuestPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGuestPage(page)}
                      className={`h-10 w-10 rounded-xl font-bold ${
                        activeGuestPage === page
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
                  disabled={activeGuestPage === totalGuestPages}
                  onClick={() => setGuestPage(activeGuestPage + 1)}
                  className="h-10 rounded-xl px-4 font-bold"
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Go to page:</span>
                <Select
                  value={String(activeGuestPage)}
                  onValueChange={(val) => setGuestPage(Number(val))}
                >
                  <SelectTrigger className="h-10 w-28 rounded-xl border border-border bg-card px-3 text-sm shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-[80] rounded-xl border border-border bg-popover shadow-xl"
                  >
                    {Array.from({ length: totalGuestPages }, (_, i) => i + 1).map((page) => (
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

  if (isLoading) {
    // NOTE UI STATE: Trang thai cho API public documents.
    return <div className="p-10 text-muted-foreground">Loading...</div>;
  }

  if (isError) {
    // NOTE UI STATE: Loi thuong do token/API backend public document chua chay dung.
    return <div className="p-10 text-destructive">Failed to load data</div>;
  }

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
          {/* NOTE UI: Thanh search/filter chinh cua Community. Search loc realtime, Enter de confirm lai keyword. */}
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

        {/* NOTE UI: Rating duoc tach xuong duoi thanh search/filter de nhin gon hon. */}
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

        {/* NOTE RENDER: DocumentGrid chi render card. Du lieu da search/filter/hydrate o CommunityPage. */}
        <DocumentGrid
          documents={paginatedDocuments}
          onView={(document) => handleViewDocument(document.documentId)}
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

export default CommunityPage;
