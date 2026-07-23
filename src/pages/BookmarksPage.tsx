import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Bookmark, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import DocumentGrid from "@/components/document/DocumentGrid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAcademicSubjects } from "@/services/academicService";
import {
  getBookmarks,
  removeBookmark,
  searchPublicDocuments,
} from "@/services/documentService";
import { ERROR_CODE } from "@/constants/errorCode";
import { ROUTE } from "@/models/routePath";
import type { SubjectResponse } from "@/types/academic.type";
import type { DocumentResponse } from "@/types/document.type";
import type { RootState } from "@/redux/store";
import type { User } from "@/models/user";

type BookmarkSort = "newest" | "oldest";
type BookmarkOwnerFilter = "all" | "mine" | "others";

function BookmarksPage() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<BookmarkSort>("newest");
  const [ownerFilter, setOwnerFilter] =
    useState<BookmarkOwnerFilter>("all");

  const currentUser = useSelector(
    (state: RootState) => state.user as User | null,
  );
  const currentUserId =
    currentUser?.userId ?? Number(localStorage.getItem("authUserId"));

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: bookmarks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
  });

  // Bookmark API currently returns only the document's basic owner fields.
  // Reuse the richer public-document payload so the uploader popover can show
  // score, rank, document count and download count without another BE endpoint.
  const { data: publicDocuments = [] } = useQuery({
    queryKey: ["bookmarkPublicDocuments"],
    queryFn: () => searchPublicDocuments(""),
    retry: 1,
  });

  const { data: academicSubjects = [] } = useQuery({
    queryKey: ["academic", "subjects"],
    queryFn: getAllAcademicSubjects,
    retry: 1,
  });

  const subjectMap = useMemo(() => {
    return new Map<number, SubjectResponse>(
      academicSubjects.map((subject) => [subject.subjectId, subject]),
    );
  }, [academicSubjects]);

  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,

    onSuccess: (_response, documentId) => {
      toast.success("Bookmark removed successfully");
      queryClient.setQueryData<DocumentResponse>(
        ["document", documentId],
        (currentDocument) =>
          currentDocument
            ? {
                ...currentDocument,
                isBookmarked: false,
              }
            : currentDocument,
      );
      queryClient.setQueriesData<DocumentResponse[]>(
        { queryKey: ["publicDocuments"] },
        (currentDocuments) =>
          currentDocuments?.map((currentDocument) =>
            currentDocument.documentId === documentId
              ? {
                  ...currentDocument,
                  isBookmarked: false,
                }
              : currentDocument,
          ),
      );
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", documentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["publicDocuments"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || t(ERROR_CODE.SERVER_ERROR));
    },
  });

  const filteredBookmarks = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    const matchedBookmarks = bookmarks.filter((bookmark) => {
      const matchesKeyword =
        !q || bookmark.document.title.toLowerCase().includes(q);
      const isMine =
        Number(bookmark.document.ownerId) === Number(currentUserId);
      const matchesOwner =
        ownerFilter === "all" ||
        (ownerFilter === "mine" && isMine) ||
        (ownerFilter === "others" && !isMine);

      return matchesKeyword && matchesOwner;
    });

    return [...matchedBookmarks].sort((firstBookmark, secondBookmark) => {
      const firstTime = new Date(firstBookmark.bookmarkedAt).getTime();
      const secondTime = new Date(secondBookmark.bookmarkedAt).getTime();

      return sortOrder === "newest"
        ? secondTime - firstTime
        : firstTime - secondTime;
    });
  }, [bookmarks, currentUserId, keyword, ownerFilter, sortOrder]);

  const filteredDocuments = useMemo(() => {
    const publicDocumentMap = new Map(
      publicDocuments.map((document) => [document.documentId, document]),
    );
    const publicOwnerMap = new Map(
      publicDocuments.map((document) => [Number(document.ownerId), document]),
    );

    return filteredBookmarks.map((bookmark) => {
      const document = bookmark.document;
      const publicDocument =
        publicDocumentMap.get(document.documentId) ??
        publicOwnerMap.get(Number(document.ownerId));
      const subject = subjectMap.get(document.subjectId);

      return {
        ...document,
        ownerName: document.ownerName ?? publicDocument?.ownerName,
        ownerAvatar: document.ownerAvatar ?? publicDocument?.ownerAvatar,
        ownerTotalScore:
          document.ownerTotalScore ?? publicDocument?.ownerTotalScore,
        ownerCurrentRank:
          document.ownerCurrentRank ?? publicDocument?.ownerCurrentRank,
        ownerDocumentCount:
          document.ownerDocumentCount ?? publicDocument?.ownerDocumentCount,
        ownerDownloadCount:
          document.ownerDownloadCount ?? publicDocument?.ownerDownloadCount,
        subjectCode: document.subjectCode ?? subject?.subjectCode,
        subjectName: document.subjectName ?? subject?.subjectName,
        semesterNo: document.semesterNo ?? subject?.semesterNo ?? null,
        comboCode: document.comboCode ?? subject?.comboCode ?? null,
        comboName: document.comboName ?? subject?.comboName ?? null,
      };
    });
  }, [filteredBookmarks, publicDocuments, subjectMap]);

  const bookmarkedAtMap = useMemo(() => {
    return new Map<number, string>(
      filteredBookmarks.map((bookmark) => [
        bookmark.document.documentId,
        bookmark.bookmarkedAt,
      ]),
    );
  }, [filteredBookmarks]);

  const handleRemoveBookmark = (documentId: number) => {
    removeBookmarkMutation.mutate(documentId);
  };

  const handleViewBookmark = (documentId: number) => {
    navigate(`/${ROUTE.APP}/${ROUTE.COMMUNITY}/${documentId}`);
  };

  if (isLoading) {
    return (
      <section className="w-full px-8 py-10">
        <p className="text-muted-foreground">{t("bookmarks.loading", "Loading bookmarks...")}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-8 py-10">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            {t("bookmarks.failed", "Failed to load bookmarks")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("bookmarks.failedDesc", "Please check BE API or server connection.")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-8 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            {t("bookmarks.label", "Bookmarks")}
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold text-card-foreground">
            <Bookmark className="h-8 w-8 text-primary" />
            {t("bookmarks.title", "Saved Documents")}
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("bookmarks.description", "View and manage all study documents you have bookmarked.")}
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("bookmarks.showingDocs", { count: filteredBookmarks.length })}
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-card p-5 shadow-sm">
        <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_220px_240px]">
          <div className="relative h-14">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("bookmarks.searchPlaceholder", "Search bookmarked documents...")}
              className="h-full rounded-2xl border-border bg-card pl-12 text-base text-card-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as BookmarkSort)}
          >
            <SelectTrigger className="!h-14 w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
              <SelectValue placeholder={t("bookmarks.sortBy", "Sort by")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">{t("bookmarks.newest", "Newest saved")}</SelectItem>
              <SelectItem value="oldest">{t("bookmarks.oldest", "Oldest saved")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ownerFilter}
            onValueChange={(value) =>
              setOwnerFilter(value as BookmarkOwnerFilter)
            }
          >
            <SelectTrigger className="!h-14 w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
              <SelectValue placeholder={t("bookmarks.owner", "Document owner")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">{t("bookmarks.all", "All documents")}</SelectItem>
              <SelectItem value="mine">{t("bookmarks.mine", "My documents")}</SelectItem>
              <SelectItem value="others">
                {t("bookmarks.others", "Other people's documents")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <DocumentGrid
          documents={filteredDocuments}
          isRemoving={removeBookmarkMutation.isPending}
          getBookmarkedAt={(document) =>
            bookmarkedAtMap.get(document.documentId)
          }
          onView={(document) => handleViewBookmark(document.documentId)}
          onRemove={(document) => handleRemoveBookmark(document.documentId)}
        />
      ) : (
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-bold text-card-foreground">
            {t("bookmarks.emptyTitle", "No bookmarked documents")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("bookmarks.emptyDesc", "Documents you bookmark will appear here.")}
          </p>
        </div>
      )}
    </section>
  );
}

export default BookmarksPage;
