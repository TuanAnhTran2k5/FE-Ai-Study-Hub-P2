import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
import { getBookmarks, removeBookmark } from "@/services/documentService";
import { ERROR_CODE } from "@/constants/errorCode";
import { ROUTE } from "@/models/routePath";
import type { SubjectResponse } from "@/types/academic.type";
import type { DocumentResponse } from "@/types/document.type";

type BookmarkSort = "newest" | "oldest";

function BookmarksPage() {
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<BookmarkSort>("newest");

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
      toast.error(error.message || ERROR_CODE.SERVER_ERROR);
    },
  });

  const filteredBookmarks = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    const matchedBookmarks = q
      ? bookmarks.filter((bookmark) =>
          bookmark.document.title.toLowerCase().includes(q),
        )
      : bookmarks;

    return [...matchedBookmarks].sort((firstBookmark, secondBookmark) => {
      const firstTime = new Date(firstBookmark.bookmarkedAt).getTime();
      const secondTime = new Date(secondBookmark.bookmarkedAt).getTime();

      return sortOrder === "newest"
        ? secondTime - firstTime
        : firstTime - secondTime;
    });
  }, [bookmarks, keyword, sortOrder]);

  const filteredDocuments = useMemo(() => {
    return filteredBookmarks.map((bookmark) => {
      const document = bookmark.document;
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
  }, [filteredBookmarks, subjectMap]);

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
        <p className="text-muted-foreground">Loading bookmarks...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-8 py-10">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-card-foreground">
            Failed to load bookmarks
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check BE API or server connection.
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
            Bookmarks
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold text-card-foreground">
            <Bookmark className="h-8 w-8 text-primary" />
            Saved Documents
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            View and manage all study documents you have bookmarked.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-card-foreground">
            {filteredBookmarks.length}
          </span>{" "}
          bookmarked documents
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-card p-5 shadow-sm">
        <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative h-14">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search bookmarked documents..."
              className="h-full rounded-2xl border-border bg-card pl-12 text-base text-card-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as BookmarkSort)}
          >
            <SelectTrigger className="!h-14 w-full rounded-2xl border border-border bg-card px-4 text-base text-card-foreground shadow-none focus:ring-2 focus:ring-ring">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest saved</SelectItem>
              <SelectItem value="oldest">Oldest saved</SelectItem>
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
