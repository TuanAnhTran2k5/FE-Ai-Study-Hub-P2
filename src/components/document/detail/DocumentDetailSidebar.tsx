import { Bookmark, Download, Flag, Star, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentResponse } from "@/types/document.type";

type DocumentDetailSidebarProps = {
  document: DocumentResponse;
  averageRating: number;
  rating: number;
  isOwner: boolean;
  isBookmarked: boolean;
  selectedRating: number;
  isSavingToStorage: boolean;
  isBookmarking: boolean;
  isRating: boolean;
  onSaveToStorage: () => void;
  onBookmark: () => void;
  onRate: (ratingValue: number) => void;
  onReport: () => void;
};

// Sidebar chi tiet document:
// - Uploaded By: thong tin nguoi upload.
// - Community Actions: chi hien khi user xem tai lieu cua nguoi khac.
// - Statistics: download, bookmark, rating.
// - Created At: ngay tao tai lieu.
function DocumentDetailSidebar({
  document,
  averageRating,
  rating,
  isOwner,
  isBookmarked,
  selectedRating,
  isSavingToStorage,
  isBookmarking,
  isRating,
  onSaveToStorage,
  onBookmark,
  onRate,
  onReport,
}: DocumentDetailSidebarProps) {
  return (
    <aside className="space-y-6">
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-black text-card-foreground">Uploaded By</h3>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
              {document.ownerAvatar ? (
                <img
                  src={document.ownerAvatar}
                  alt={document.ownerName ?? "Document owner"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold text-card-foreground">
                {document.ownerName ?? "Unknown owner"}
              </p>
              <p className="text-sm text-muted-foreground">
                Owner ID: {document.ownerId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isOwner && (
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-black text-card-foreground">
              Community Actions
            </h3>

            <div className="mt-4 space-y-3">
              <Button
                type="button"
                className="w-full rounded-xl"
                disabled={isSavingToStorage}
                onClick={onSaveToStorage}
              >
                <Download className="mr-2 h-4 w-4" />
                {isSavingToStorage ? "Saving..." : "Save to Storage"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                disabled={isBookmarking || isBookmarked}
                onClick={onBookmark}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {isBookmarking
                  ? "Saving..."
                  : isBookmarked
                    ? "Bookmarked"
                    : "Bookmark"}
              </Button>

              <div className="rounded-2xl bg-secondary p-3">
                <p className="mb-2 text-sm font-bold text-card-foreground">
                  Rate this document
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;

                    return (
                      <button
                        key={value}
                        type="button"
                        className="rounded-lg p-1 text-primary transition hover:bg-primary/10"
                        disabled={isRating}
                        onClick={() => onRate(value)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= selectedRating
                              ? "fill-current"
                              : "opacity-50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={onReport}
              >
                <Flag className="mr-2 h-4 w-4" />
                Report Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-black text-card-foreground">Statistics</h3>

          <div className="mt-4 space-y-4">
            <StatItem
              icon={<Download className="h-4 w-4" />}
              label="Downloads"
              value={document.downloadCount ?? 0}
            />

            <StatItem
              icon={
                <Bookmark
                  className={`h-4 w-4 ${
                    isBookmarked ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              }
              label="Bookmarks"
              value={document.bookmarkCount ?? 0}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Rating
                </span>
                <span className="font-bold text-card-foreground">
                  {averageRating} / 5
                </span>
              </div>

              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < rating ? "fill-current" : "opacity-20"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {document.ratingCount ?? 0} ratings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-black text-card-foreground">Created At</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(document.createdAt).toLocaleString("vi-VN")}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-secondary p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <span className="font-black text-card-foreground">{value}</span>
    </div>
  );
}

export default DocumentDetailSidebar;
