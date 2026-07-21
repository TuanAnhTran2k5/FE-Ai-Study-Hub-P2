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
import DocumentGrid from "@/components/document/DocumentGrid";
import { useTranslation } from "react-i18next";
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

const communityDocumentGridClassName =
  "mx-auto max-w-[1600px] grid-cols-[repeat(auto-fill,382px)] justify-start";

interface GuestCommunityProps {
  documents: any[];
  academicSubjects: SubjectResponse[];
  onViewDocument: (documentId: number) => void;
}

export function GuestCommunity({
  documents,
  academicSubjects,
  onViewDocument,
}: GuestCommunityProps) {
  const { t } = useTranslation();
  const [guestSubjectInput, setGuestSubjectInput] = useState("");
  const [guestSubjectKeyword, setGuestSubjectKeyword] = useState("");
  const [isGuestSubjectDropdownOpen, setIsGuestSubjectDropdownOpen] =
    useState(false);
  const [selectedGuestSubject, setSelectedGuestSubject] =
    useState<SubjectResponse | null>(null);
  const [guestPage, setGuestPage] = useState(1);
  const itemsPerPage = 8;

  // Reset guest pagination to page 1 when search keyword changes
  useEffect(() => {
    setGuestPage(1);
  }, [guestSubjectKeyword]);

  const guestTopRatedDocuments = useMemo(() => {
    if (selectedGuestSubject) {
      return documents
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
      return documents.sort((firstDocument, secondDocument) => {
        return (
          (secondDocument.averageRating ?? 0) -
          (firstDocument.averageRating ?? 0)
        );
      });
    }

    const words = normalizedSubjectKeyword.split(/\s+/).filter(Boolean);

    return documents
      .filter((document) => {
        return words.every((word) => {
          const subjectCode = (document.subjectCode ?? "").toLowerCase();
          const comboCode = (document.comboCode ?? "").toLowerCase();
          const subjectName = (document.subjectName ?? "").toLowerCase();
          const comboName = (document.comboName ?? "").toLowerCase();

          if (subjectCode.startsWith(word)) return true;
          if (comboCode.startsWith(word)) return true;

          const nameWords = subjectName.split(/\s+/).filter(Boolean);
          if (nameWords.some((nw: string) => nw.startsWith(word))) return true;

          const comboNameWords = comboName.split(/\s+/).filter(Boolean);
          if (comboNameWords.some((cnw: string) => cnw.startsWith(word))) return true;

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
  }, [documents, guestSubjectKeyword, selectedGuestSubject]);

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
          if (nameWords.some((nw: string) => nw.startsWith(word))) return true;

          const comboNameWords = comboName.split(/\s+/).filter(Boolean);
          if (comboNameWords.some((cnw: string) => cnw.startsWith(word))) return true;

          if (/^\d+$/.test(word)) {
            if (subjectCode.includes(word)) return true;
            if (comboCode.includes(word)) return true;
          }

          return false;
        });
      })
      .slice(0, 8);
  }, [academicSubjects, guestSubjectInput]);

  const handleGuestSubjectSearch = () => {
    setGuestSubjectKeyword(guestSubjectInput.trim());
    setIsGuestSubjectDropdownOpen(false);
  };

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-black text-card-foreground">
          {t("community.guest.topRatedTitle", "Top Rated Documents")}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {t("community.guest.topRatedDesc", "Search by subject to explore highly rated public documents.")}
        </p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("community.guest.searchPlaceholder", "Search by subject code or subject name...")}
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
            {t("community.guest.searchButton", "Search")}
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-5 text-sm text-muted-foreground">
          {t("community.guest.showing", "Showing")}{" "}
          <span className="font-bold text-card-foreground">
            {paginatedGuestDocuments.length}
          </span>{" "}
          {t("community.guest.of", "of")}{" "}
          <span className="font-bold text-card-foreground">
            {guestTopRatedDocuments.length}
          </span>{" "}
          {t("community.guest.publicDocs", "public documents")}
        </div>

        <DocumentGrid
          documents={paginatedGuestDocuments}
          onView={(document) => onViewDocument(document.documentId)}
          gridClassName={communityDocumentGridClassName}
        />

        {/* Guest Pagination Section */}
        {guestTopRatedDocuments.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              {t("community.guest.showing", "Showing")}{" "}
              <span className="font-bold text-card-foreground">{paginatedGuestDocuments.length}</span>{" "}
              {t("community.guest.of", "of")}{" "}
              <span className="font-bold text-card-foreground">{guestTopRatedDocuments.length}</span>{" "}
              {t("community.guest.docs", "documents")}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activeGuestPage === 1}
                onClick={() => setGuestPage(activeGuestPage - 1)}
                className="h-10 rounded-xl px-4 font-bold"
              >
                {t("community.guest.previous", "Previous")}
              </Button>

              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalGuestPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={activeGuestPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGuestPage(page)}
                    className={`h-10 w-10 rounded-xl font-bold ${activeGuestPage === page
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
                {t("community.guest.next", "Next")}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("community.guest.goToPage", "Go to page:")}</span>
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
                      {t("community.guest.page", "Page")} {page}
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
