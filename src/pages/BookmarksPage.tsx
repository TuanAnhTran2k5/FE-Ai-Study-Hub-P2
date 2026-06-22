import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookmarks, removeBookmark } from "@/services/documentService";
import { ERROR_CODE } from "@/constants/errorCode";

function BookmarksPage() {
  const [keyword, setKeyword] = useState("");

  const queryClient = useQueryClient();

  const {
    data: bookmarks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: removeBookmark,

    onSuccess: () => {
      toast.success("Bookmark removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || ERROR_CODE.SERVER_ERROR);
    },
  });

  const filteredBookmarks = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return bookmarks;

    return bookmarks.filter((bookmark) =>
      bookmark.documentTitle.toLowerCase().includes(q),
    );
  }, [bookmarks, keyword]);

  const handleRemoveBookmark = (documentId: number) => {
    removeBookmarkMutation.mutate(documentId);
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading bookmarks...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
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
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
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
        <div className="relative h-14">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search bookmarked documents..."
            className="h-full rounded-2xl border-border bg-card pl-12 text-base text-card-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {filteredBookmarks.length > 0 ? (
        <div className="grid gap-5">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.bookmarkId}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    Document #{bookmark.documentId}
                  </span>
                </div>

                <h2 className="truncate text-xl font-black text-card-foreground">
                  {bookmark.documentTitle}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Bookmarked at{" "}
                  {new Date(bookmark.bookmarkedAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={removeBookmarkMutation.isPending}
                onClick={() => handleRemoveBookmark(bookmark.documentId)}
                className="h-11 rounded-xl border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>
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