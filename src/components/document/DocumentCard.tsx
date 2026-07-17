import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AvatarFrame from "@/components/avatarFrame/AvatarFrame";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VisibilityStatus } from "@/models/document.enum";
import type { DocumentResponse } from "@/types/document.type";
import {
  Bookmark,
  CalendarClock,
  Download,
  Eye,
  FileText,
  Globe,
  Lock,
  Medal,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";

interface DocumentCardProps {
  document: DocumentResponse;
  onView?: (document: DocumentResponse) => void;
  onRemove?: (document: DocumentResponse) => void;
  isRemoving?: boolean;
  bookmarkedAt?: string;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatFileType(fileType?: string) {
  if (!fileType) return "FILE";

  const normalizedType = fileType.toLowerCase();

  if (normalizedType.includes("pdf")) return "PDF";
  if (normalizedType.includes("wordprocessingml") || normalizedType.includes("docx")) {
    return "DOCX";
  }
  if (
    normalizedType.includes("presentationml") ||
    normalizedType.includes("pptx")
  ) {
    return "PPTX";
  }
  if (
    normalizedType.includes("spreadsheetml") ||
    normalizedType.includes("xlsx")
  ) {
    return "XLSX";
  }
  if (
    normalizedType.includes("vnd.ms-excel") ||
    normalizedType.includes("xls")
  ) {
    return "XLS";
  }
  if (normalizedType.includes("text/plain") || normalizedType.includes("txt")) {
    return "TXT";
  }

  return fileType.split("/").pop()?.toUpperCase() || "FILE";
}

function RatingStars({ value }: { value?: number | null }) {
  const rating = Math.max(0, Math.min(5, value ?? 0));

  return (
    <div className="flex text-primary">
      {Array.from({ length: 5 }).map((_, index) => {
        const fillPercent = Math.max(0, Math.min(1, rating - index)) * 100;

        return (
          <span key={index} className="relative inline-flex h-4 w-4">
            <Star className="h-4 w-4 opacity-20" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="h-4 w-4 fill-current" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function getOwnerScore(document: DocumentResponse) {
  return (
    document.ownerTotalScore ??
    document.ownerCurrentRank?.rank.minScore ??
    0
  );
}

function DocumentCard({
  document,
  onView,
  onRemove,
  isRemoving,
  bookmarkedAt,
}: DocumentCardProps) {

  return (
    <Card className="group flex h-full min-w-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex w-full flex-col">
        <div className="relative h-40 bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary-bg-hover to-card" />

          <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <FileText className="h-6 w-6" />
          </div>

          <div className="absolute right-4 top-5 flex max-w-[calc(100%-5.5rem)] flex-wrap justify-end gap-2">
            <Badge className="max-w-[90px] truncate rounded-full bg-card px-3 py-1 text-xs font-bold text-primary shadow-sm hover:bg-card">
              {formatFileType(document.fileType)}
            </Badge>

            <Badge
              className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                document.visibilityStatus === VisibilityStatus.PUBLIC
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-100"
              }`}
            >
              {document.visibilityStatus === VisibilityStatus.PUBLIC ? (
                <Globe className="mr-1 h-3 w-3" />
              ) : (
                <Lock className="mr-1 h-3 w-3" />
              )}

              {document.visibilityStatus}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <RatingStars value={document.averageRating} />

            <Badge
              variant="secondary"
              className="max-w-[170px] truncate rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
            >
              {document.subjectCode ?? `Subject ${document.subjectId}`}
            </Badge>
          </div>

          <h3 className="line-clamp-2 min-h-[58px] text-xl font-black leading-tight text-card-foreground sm:text-[22px]">
            {document.title}
          </h3>

          <p className="mt-3 line-clamp-2 min-h-[52px] text-base leading-7 text-muted-foreground">
            {document.description || document.fileName}
          </p>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 cursor-pointer rounded-full outline-none ring-offset-background transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-label={`View information for ${document.ownerName ?? `User ${document.ownerId}`}`}
                    >
                      <AvatarFrame
                        score={getOwnerScore(document)}
                        avatarUrl={document.ownerAvatar}
                        fullName={document.ownerName ?? `User ${document.ownerId}`}
                        size="sm"
                      />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-64 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <AvatarFrame
                        score={getOwnerScore(document)}
                        avatarUrl={document.ownerAvatar}
                        fullName={document.ownerName ?? `User ${document.ownerId}`}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-card-foreground">
                          {document.ownerName ?? `User ${document.ownerId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">Uploader</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
                      <div className="rounded-xl bg-secondary p-3">
                        <Medal className="h-4 w-4 text-primary" />
                        <p className="mt-2 text-xs text-muted-foreground">Score</p>
                        <p className="font-black text-card-foreground">
                          {document.ownerTotalScore?.toLocaleString() ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <Trophy className="h-4 w-4 text-primary" />
                        <p className="mt-2 text-xs text-muted-foreground">Current rank</p>
                        <p className="truncate font-black text-card-foreground">
                          {document.ownerCurrentRank?.rank.rankName ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <p className="mt-2 text-xs text-muted-foreground">Documents</p>
                        <p className="font-black text-card-foreground">
                          {document.ownerDocumentCount?.toLocaleString() ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <Download className="h-4 w-4 text-primary" />
                        <p className="mt-2 text-xs text-muted-foreground">Downloads</p>
                        <p className="font-black text-card-foreground">
                          {document.ownerDownloadCount?.toLocaleString() ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em]">
                    Uploaded by
                  </p>
                  <p className="truncate text-sm font-bold text-card-foreground">
                    {document.ownerName ?? `User ${document.ownerId}`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em]">
                  Semester
                </p>
                <p className="text-sm font-black text-card-foreground">
                  {document.semesterNo ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              {document.downloadCount ?? 0}
            </span>

            <span className="flex items-center gap-1.5">
              <Bookmark className="h-4 w-4" />
              {document.bookmarkCount ?? 0}
            </span>

            <span>{formatFileSize(document.fileSize)}</span>
          </div>

          {bookmarkedAt && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-muted-foreground">
              <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">
                Bookmarked at {new Date(bookmarkedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}

          <div className={onRemove ? "mt-5 grid grid-cols-2 gap-3" : "mt-5"}>
            <Button
              type="button"
              variant="outline"
              className={`h-12 min-w-0 cursor-pointer rounded-2xl border border-primary/30 bg-secondary px-3 font-bold text-secondary-foreground shadow-sm transition hover:bg-primary-bg-hover hover:text-primary ${
                onRemove ? "text-sm" : "w-full text-base"
              }`}
              onClick={() => onView?.(document)}
            >
              <Eye className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">View Document</span>
            </Button>

            {onRemove && (
              <Button
                type="button"
                variant="outline"
                disabled={isRemoving}
                className="h-12 min-w-0 cursor-pointer rounded-2xl border border-destructive/30 px-3 text-sm font-bold text-destructive shadow-sm transition hover:bg-destructive hover:text-white"
                onClick={() => onRemove(document)}
              >
                <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Remove</span>
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default DocumentCard;
