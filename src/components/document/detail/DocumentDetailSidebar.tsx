import {
  Bookmark,
  CalendarDays,
  Download,
  Flag,
  Star,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentResponse } from "@/types/document.type";

type DocumentDetailSidebarProps = {
  document: DocumentResponse;
  averageRating: number;
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

// Sidebar hiển thị thông tin người upload, thống kê và ngày tạo tài liệu.
function DocumentDetailSidebar({
  document,
  averageRating,
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
  const uploadedByName =
    document.originalUploaderName ?? document.ownerName ?? "Unknown owner";

  const uploadedById =
    document.originalUploaderId ?? document.ownerId;

  const uploadedByAvatar =
    document.originalUploaderAvatar ?? document.ownerAvatar ?? null;

  return (
    <aside className="space-y-3">
      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-base font-black text-card-foreground">
            Uploaded By
          </h3>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-lg font-black text-white">
              {uploadedByAvatar ? (
  <img
    src={uploadedByAvatar}
    alt={uploadedByName}
    className="h-full w-full object-cover"
  />
) : uploadedByName ? (
  uploadedByName.charAt(0).toUpperCase()
) : (
  <UserRound className="h-6 w-6" />
)}
            </div>

            <div className="min-w-0">
              <p className="truncate font-black text-card-foreground">
  {uploadedByName}
</p>
<p className="text-sm text-muted-foreground">
  Original uploader ID: {uploadedById}
</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isOwner && (
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-black text-card-foreground">
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
                disabled={isBookmarking}
                onClick={onBookmark}
              >
                <Bookmark
                  className={`mr-2 h-4 w-4 ${
                    isBookmarked ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
                {isBookmarking
                  ? isBookmarked
                    ? "Removing..."
                    : "Saving..."
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
                        className="cursor-pointer text-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isRating}
                        onClick={() => onRate(value)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= selectedRating
                              ? "fill-current"
                              : "opacity-40"
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
                className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
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
          <h3 className="text-base font-black text-card-foreground">
            Document Info
          </h3>

          <div className="mt-5 space-y-5">
            <InfoRow
              label="Subject"
              value={document.subjectName ?? document.subjectCode ?? "N/A"}
            />

            <InfoRow
              label="Semester"
              value={
                document.semesterNo
                  ? `Semester ${document.semesterNo}`
                  : "N/A"
              }
            />

            <InfoRow
              label="File Size"
              value={formatFileSize(document.fileSize)}
            />

            <InfoRow
              label="Course Code"
              value={document.subjectCode ?? `Subject ${document.subjectId}`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-base font-black text-card-foreground">
            Statistics
          </h3>

          <div className="mt-5 space-y-3">
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

            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-card-foreground">
                  Rating
                </span>
                <span className="font-black text-card-foreground">
                  {averageRating} / 5
                </span>
              </div>

              <div className="flex items-center gap-2">
                <RatingStars value={averageRating} />

                <span className="text-sm text-muted-foreground">
                  ({document.ratingCount ?? 0} ratings)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-base font-black text-card-foreground">
            Created
          </h3>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{new Date(document.createdAt).toLocaleString("vi-VN")}</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function RatingStars({ value }: { value: number }) {
  const rating = Math.max(0, Math.min(5, value));

  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }).map((_, index) => {
        const fillPercent = Math.max(0, Math.min(1, rating - index)) * 100;

        return (
          <span key={index} className="relative inline-flex h-5 w-5">
            <Star className="h-5 w-5 opacity-30" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="h-5 w-5 fill-current" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[78px_1fr] gap-3 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="font-bold leading-5 text-card-foreground">{value}</span>
    </div>
  );
}

// Dòng thống kê dùng chung trong sidebar, ví dụ downloads và bookmarks.
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
    <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <span className="font-black text-card-foreground">{value}</span>
    </div>
  );
}

export default DocumentDetailSidebar;