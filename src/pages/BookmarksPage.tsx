import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Bookmark,
  CheckSquare,
  LayoutGrid,
  List,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import DocumentGrid from "@/components/document/DocumentGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type {
  BookmarkResponse,
  DocumentResponse,
} from "@/types/document.type";
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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [isBulkRemoveOpen, setIsBulkRemoveOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    () =>
      (localStorage.getItem("bookmarks-view") as "grid" | "list") || "grid",
  );

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
    queryKey: ["bookmarks", currentUserId],
    queryFn: getBookmarks,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // Bookmark API currently returns only the document's basic owner fields.
  // Reuse the richer public-document payload so the uploader popover can show
  // score, rank, document count and download count without another BE endpoint.
  const { data: publicDocuments = [] } = useQuery({
    queryKey: ["bookmarkPublicDocuments"],
    queryFn: () => searchPublicDocuments(""),
    retry: 1,
    staleTime: 0,
    refetchOnMount: "always",
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
      queryClient.setQueriesData<BookmarkResponse[]>(
        { queryKey: ["bookmarks"] },
        (currentBookmarks) =>
          currentBookmarks?.filter(
            (bookmark) =>
              Number(bookmark.document.documentId) !== Number(documentId),
          ),
      );
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

  const bulkRemoveBookmarkMutation = useMutation({
    mutationFn: async (documentIds: number[]) => {
      await Promise.all(documentIds.map((documentId) => removeBookmark(documentId)));
    },
    onSuccess: (_response, documentIds) => {
      toast.success(
        `${documentIds.length} bookmark${documentIds.length === 1 ? "" : "s"} removed successfully`,
      );

      documentIds.forEach((documentId) => {
        queryClient.setQueryData<DocumentResponse>(
          ["document", documentId],
          (currentDocument) =>
            currentDocument
              ? { ...currentDocument, isBookmarked: false }
              : currentDocument,
        );
      });

      queryClient.setQueriesData<BookmarkResponse[]>(
        { queryKey: ["bookmarks"] },
        (currentBookmarks) =>
          currentBookmarks?.filter(
            (bookmark) =>
              !documentIds.includes(Number(bookmark.document.documentId)),
          ),
      );
      queryClient.setQueriesData<DocumentResponse[]>(
        { queryKey: ["publicDocuments"] },
        (currentDocuments) =>
          currentDocuments?.map((document) =>
            documentIds.includes(document.documentId)
              ? { ...document, isBookmarked: false }
              : document,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });
      setSelectedDocumentIds([]);
      setIsSelectionMode(false);
      setIsBulkRemoveOpen(false);
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

  const handleToggleDocumentSelect = (documentId: number) => {
    setSelectedDocumentIds((currentIds) =>
      currentIds.includes(documentId)
        ? currentIds.filter((id) => id !== documentId)
        : [...currentIds, documentId],
    );
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedDocumentIds([]);
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

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap gap-3">
            <div className="flex h-11 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                onClick={() => {
                  setViewMode("list");
                  localStorage.setItem("bookmarks-view", "list");
                }}
                className={`flex w-12 items-center justify-center transition ${
                  viewMode === "list"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                onClick={() => {
                  setViewMode("grid");
                  localStorage.setItem("bookmarks-view", "grid");
                }}
                className={`flex w-12 items-center justify-center border-l border-border transition ${
                  viewMode === "grid"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                isSelectionMode
                  ? handleExitSelectionMode()
                  : setIsSelectionMode(true)
              }
              className="h-11 cursor-pointer rounded-xl px-5 font-bold"
            >
              {isSelectionMode ? (
                <X className="mr-2 h-4 w-4" />
              ) : (
                <CheckSquare className="mr-2 h-4 w-4" />
              )}
              {isSelectionMode
                ? t("common.cancel", "Cancel")
                : t("myDocuments.select", "Select Document")}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {t("bookmarks.showingDocs", { count: filteredBookmarks.length })}
          </div>
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

      {isSelectionMode && filteredDocuments.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-card-foreground">
              {selectedDocumentIds.length} document
              {selectedDocumentIds.length === 1 ? "" : "s"} selected
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select bookmarked documents directly from the cards below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl font-bold"
              onClick={
                selectedDocumentIds.length === filteredDocuments.length
                  ? () => setSelectedDocumentIds([])
                  : () =>
                      setSelectedDocumentIds(
                        filteredDocuments.map((document) => document.documentId),
                      )
              }
            >
              {selectedDocumentIds.length === filteredDocuments.length
                ? "Clear all"
                : "Select all"}
            </Button>

            <Button
              type="button"
              className="h-10 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"
              onClick={() => setIsBulkRemoveOpen(true)}
              disabled={selectedDocumentIds.length === 0}
            >
              <Bookmark className="mr-2 h-4 w-4 fill-current" />
              Remove {selectedDocumentIds.length || ""}
            </Button>
          </div>
        </div>
      )}

      {filteredDocuments.length > 0 ? (
        <DocumentGrid
          documents={filteredDocuments}
          isRemoving={
            removeBookmarkMutation.isPending ||
            bulkRemoveBookmarkMutation.isPending
          }
          getBookmarkedAt={(document) =>
            bookmarkedAtMap.get(document.documentId)
          }
          onView={(document) => handleViewBookmark(document.documentId)}
          onRemove={
            isSelectionMode
              ? undefined
              : (document) => handleRemoveBookmark(document.documentId)
          }
          selectionMode={isSelectionMode}
          selectedDocumentIds={selectedDocumentIds}
          onToggleSelect={(document) =>
            handleToggleDocumentSelect(document.documentId)
          }
          viewMode={viewMode}
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

      <Dialog open={isBulkRemoveOpen} onOpenChange={setIsBulkRemoveOpen}>
        <DialogContent className="overflow-hidden rounded-3xl border border-red-500/20 p-0 shadow-2xl sm:max-w-[520px]">
          <div className="bg-gradient-to-b from-red-500/10 to-card px-8 pb-7 pt-8">
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-500 ring-8 ring-red-500/5">
                <Trash2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-black text-card-foreground">
                Remove Bookmarks
              </DialogTitle>
              <DialogDescription className="max-w-sm text-sm leading-6 text-muted-foreground">
                Remove {selectedDocumentIds.length} selected document
                {selectedDocumentIds.length === 1 ? "" : "s"} from your
                bookmarks? The documents themselves will not be deleted.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 max-h-40 space-y-2 overflow-y-auto rounded-2xl border border-border bg-card/70 p-3">
              {filteredDocuments
                .filter((document) =>
                  selectedDocumentIds.includes(document.documentId),
                )
                .map((document) => (
                  <div
                    key={document.documentId}
                    className="flex items-center gap-3 rounded-xl bg-secondary/70 px-3 py-2"
                  >
                    <Bookmark className="h-4 w-4 shrink-0 fill-primary text-primary" />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-card-foreground">
                      {document.title}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {document.subjectCode ?? `#${document.subjectId}`}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-transparent bg-secondary font-bold"
                onClick={() => setIsBulkRemoveOpen(false)}
                disabled={bulkRemoveBookmarkMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-12 rounded-2xl bg-red-600 font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-700"
                onClick={() =>
                  bulkRemoveBookmarkMutation.mutate(selectedDocumentIds)
                }
                disabled={
                  selectedDocumentIds.length === 0 ||
                  bulkRemoveBookmarkMutation.isPending
                }
              >
                {bulkRemoveBookmarkMutation.isPending
                  ? "Removing..."
                  : `Remove ${selectedDocumentIds.length}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default BookmarksPage;
