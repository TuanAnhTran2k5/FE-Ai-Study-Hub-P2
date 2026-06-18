import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VisibilityStatus } from "@/models/document.enum";
import type { DocumentResponse } from "@/types/document.type";
import {
  Bookmark,
  Download,
  Eye,
  FileText,
  Globe,
  Lock,
  Star,
  UserRound,
} from "lucide-react";

interface DocumentCardProps {
  document: DocumentResponse;
  onView?: (document: DocumentResponse) => void;
}

function DocumentCard({ document, onView }: DocumentCardProps) {
  const rating = Math.min(5, Math.round(document.averageRating));

  return (
    <Card className="group flex h-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex w-full flex-col">
        <div className="relative h-40 bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary-bg-hover to-card" />

          <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <FileText className="h-6 w-6" />
          </div>

          <div className="absolute right-5 top-5 flex gap-2">
  <Badge className="rounded-full bg-card px-3 py-1 text-xs font-bold text-primary shadow-sm hover:bg-card">
    {document.fileType}
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

        <CardContent className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
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

            <Badge
              variant="secondary"
              className="max-w-[170px] truncate rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
            >
              {document.subjectCode}
            </Badge>
          </div>

          <h3 className="line-clamp-2 min-h-[60px] text-[22px] font-black leading-tight text-card-foreground">
            {document.title}
          </h3>

          <p className="mt-3 line-clamp-2 min-h-[52px] text-base leading-7 text-muted-foreground">
            {document.description}
          </p>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
                  {document.ownerAvatar ? (
                    <img
                      src={document.ownerAvatar}
                      alt={document.ownerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    Uploaded by
                  </p>
                  <p className="truncate text-sm font-bold text-card-foreground">
                    {document.ownerName}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Semester
                </p>
                <p className="text-sm font-black text-card-foreground">
                  {document.semesterNo}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              {document.downloadCount}
            </span>

            <span className="flex items-center gap-1.5">
              <Bookmark className="h-4 w-4" />
              {document.bookmarkCount}
            </span>

            <span>{document.fileSize} MB</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-5 h-12 w-full cursor-pointer rounded-2xl border border-primary/30 bg-secondary text-base font-bold text-secondary-foreground shadow-sm transition hover:bg-primary-bg-hover hover:text-primary"
            onClick={() => onView?.(document)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Document 
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}

export default DocumentCard;