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
  Check,
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

import { getFormattedTitle } from "@/utils/documentHelper";

interface DocumentCardProps {
  document: DocumentResponse;
  onView?: (document: DocumentResponse) => void;
  onRemove?: (document: DocumentResponse) => void;
  isRemoving?: boolean;
  bookmarkedAt?: string;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (document: DocumentResponse) => void;
  viewMode?: "grid" | "list";
  isPublic?: boolean;
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

function getFileTypeTheme(fileType: string) {
  switch (fileType) {
    case "PDF":
      return {
        background: "from-red-950/90 via-red-900/60 to-card",
        accent: "bg-red-400/15 text-red-300 ring-red-300/20",
        glow: "bg-red-400/20",
      };
    case "DOCX":
      return {
        background: "from-blue-950/90 via-blue-900/60 to-card",
        accent: "bg-blue-400/15 text-blue-300 ring-blue-300/20",
        glow: "bg-blue-400/20",
      };
    case "PPTX":
      return {
        background: "from-orange-950/90 via-orange-900/60 to-card",
        accent: "bg-orange-400/15 text-orange-300 ring-orange-300/20",
        glow: "bg-orange-400/20",
      };
    case "XLS":
    case "XLSX":
      return {
        background: "from-emerald-950/90 via-emerald-900/60 to-card",
        accent: "bg-emerald-400/15 text-emerald-300 ring-emerald-300/20",
        glow: "bg-emerald-400/20",
      };
    case "TXT":
      return {
        background: "from-slate-800/90 via-slate-700/60 to-card",
        accent: "bg-slate-300/15 text-slate-200 ring-slate-200/20",
        glow: "bg-slate-300/20",
      };
    default:
      return {
        background: "from-cyan-950/90 via-primary/30 to-card",
        accent: "bg-cyan-400/15 text-cyan-300 ring-cyan-300/20",
        glow: "bg-cyan-400/20",
      };
  }
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

function hasValidDescription(desc?: string | null, fileName?: string) {
  if (!desc) return false;
  const normalizedDesc = desc.trim().toLowerCase();
  const normalizedFile = fileName?.trim().toLowerCase();

  // If description matches filename exactly, hide it
  if (normalizedDesc === normalizedFile) return false;

  // If description is just a file name format (ends with document extensions)
  const isFileFormat = /\.(pdf|docx|doc|xlsx|xls|png|jpg|jpeg|pptx|ppt|zip|rar|txt)$/i.test(normalizedDesc);
  if (isFileFormat) return false;

  return true;
}

function DocumentCard({
  document,
  onView,
  onRemove,
  isRemoving,
  bookmarkedAt,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  viewMode = "grid",
  isPublic = false,
}: DocumentCardProps) {
  const fileType = formatFileType(document.fileType);
  const fileTheme = getFileTypeTheme(fileType);

  if (viewMode === "list") {
    return (
      <Card
        className={`group relative rounded-none border-x-0 border-t-0 bg-card shadow-none transition-colors last:border-b-0 hover:bg-secondary/50 ${
          isSelected
            ? "border-b border-primary bg-primary/10"
            : "border-b border-border"
        }`}
      >
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_150px_110px_110px_190px] items-center gap-5 px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {selectionMode && (
              <button
                type="button"
                aria-label={isSelected ? "Deselect document" : "Select document"}
                aria-pressed={isSelected}
                onClick={() => onToggleSelect?.(document)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-primary"
                }`}
              >
                {isSelected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded border-2 border-current" />
                )}
              </button>
            )}

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${fileTheme.accent}`}
            >
              <FileText className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-card-foreground">
                  {getFormattedTitle(document.title, document.fileName)}
                </h3>
                <span className={`shrink-0 text-[9px] font-black ${fileTheme.accent.split(" ").find((className) => className.startsWith("text-")) ?? "text-primary"}`}>
                  {fileType}
                </span>
              </div>
              {!isPublic && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {document.fileName}
                </p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <AvatarFrame
              score={getOwnerScore(document)}
              avatarUrl={document.ownerAvatar}
              fullName={document.ownerName ?? `User ${document.ownerId}`}
              size="sm"
            />
            <span className="truncate text-sm text-card-foreground">
              {document.ownerName ?? `User ${document.ownerId}`}
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-card-foreground">
              {document.subjectCode ?? `Subject ${document.subjectId}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Semester {document.semesterNo ?? "-"}
            </p>
          </div>

          <Badge
            className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black ${
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

          <span className="text-sm text-muted-foreground">
            {formatFileSize(document.fileSize)}
          </span>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-primary/30 bg-secondary px-3 font-bold"
              onClick={() => onView?.(document)}
              disabled={selectionMode}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              View
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isRemoving}
                className="h-9 rounded-lg border-destructive/30 px-3 font-bold text-destructive hover:bg-destructive hover:text-white"
                onClick={() => onRemove(document)}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`group relative flex h-full min-w-0 overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isSelected
          ? "border-2 border-primary ring-4 ring-primary/10"
          : "border border-border"
      }`}
    >
      {selectionMode && (
        <button
          type="button"
          aria-label={isSelected ? "Deselect document" : "Select document"}
          aria-pressed={isSelected}
          onClick={() => onToggleSelect?.(document)}
          className={`absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md transition hover:scale-105 ${
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-white/30 bg-card/85 text-muted-foreground hover:text-primary"
          }`}
        >
          {isSelected ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="h-4 w-4 rounded border-2 border-current" />
          )}
        </button>
      )}

      <div className="flex w-full flex-col flex-1">
        <div className="relative h-40 overflow-hidden bg-secondary">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${fileTheme.background}`}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            className={`absolute -bottom-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl ${fileTheme.glow}`}
          />

          <div className="absolute inset-x-0 bottom-[-18px] flex justify-center">
            <div
              className="relative h-[118px] w-[172px] -rotate-2 overflow-hidden rounded-t-2xl border border-white/20 bg-card/90 p-4 shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-0 group-hover:scale-[1.03]"
              aria-hidden="true"
            >
              <div
                className={`absolute inset-y-0 left-0 w-1.5 ${fileTheme.glow}`}
              />

              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${fileTheme.accent}`}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <span className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {document.subjectCode ?? `Subject ${document.subjectId}`}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 [overflow-wrap:anywhere] text-left text-[11px] font-black leading-[1.25] text-card-foreground">
                {document.title}
              </p>

              <div className="mt-2 space-y-1.5 opacity-40">
                <div className="h-1 w-full rounded-full bg-muted-foreground" />
                <div className="h-1 w-4/5 rounded-full bg-muted-foreground" />
                <div className="h-1 w-2/3 rounded-full bg-muted-foreground" />
              </div>

              <span
                className={`absolute bottom-2 right-3 text-[9px] font-black tracking-[0.18em] ${fileTheme.accent.split(" ").find((className) => className.startsWith("text-")) ?? "text-primary"}`}
              >
                {fileType}
              </span>
            </div>
          </div>

          <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <FileText className="h-6 w-6" />
          </div>

          <div className="absolute right-4 top-5 flex max-w-[calc(100%-5.5rem)] flex-wrap justify-end gap-2">
            <Badge className="max-w-[90px] truncate rounded-full bg-card px-3 py-1 text-xs font-bold text-primary shadow-sm hover:bg-card">
              {fileType}
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

          <h3 className="line-clamp-2 min-h-[32px] text-xl font-black leading-tight text-card-foreground sm:text-[22px]">
            {getFormattedTitle(document.title, document.fileName)}
          </h3>

          {(!isPublic || hasValidDescription(document.description, document.fileName)) && (
            <p className="mt-1.5 line-clamp-2 min-h-[52px] whitespace-normal [overflow-wrap:anywhere] text-base leading-7 text-muted-foreground">
              {isPublic ? document.description : (document.description || document.fileName)}
            </p>
          )}

          <div className="mt-auto border-t border-border pt-4">
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
                          {document.ownerCurrentRank?.rank.rankName ??
                            document.ownerRankName ??
                            "N/A"}
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
              disabled={selectionMode}
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
