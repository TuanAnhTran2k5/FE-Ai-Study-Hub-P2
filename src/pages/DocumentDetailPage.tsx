import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  Star,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VisibilityStatus } from "@/models/document.enum";
import { getDocumentById } from "@/services/documentService";

function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: document,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(id || ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-muted-foreground">Loading document...</p>
      </section>
    );
  }

  if (isError || !document) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-bold text-card-foreground">
              Document not found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check your document id or MockAPI endpoint.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const rating = Math.min(5, Math.round(document.averageRating));

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-xl  cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={() => window.open(document.fileUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open New Tab
          </Button>

          <Button
            type="button"
            className="rounded-xl bg-gradient-to-r from-primary-start to-primary-end font-bold text-primary-foreground hover:from-primary-start-hover hover:to-primary-end-hover"
            onClick={() => window.open(document.fileUrl, "_blank")}
          >
            <Download className="mr-2 h-4 w-4  cursor-pointer" />
            Download
          </Button>
        </div>
      </div>

      <Card className="mb-6 rounded-3xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <FileText className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground hover:bg-secondary">
                  {document.fileType}
                </Badge>

                <Badge
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
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

                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs font-bold"
                >
                  {document.subjectCode}
                </Badge>
              </div>

              <h1 className="text-3xl font-black text-card-foreground">
                {document.title}
              </h1>

              <p className="mt-3 max-w-4xl text-muted-foreground">
                {document.description}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem label="Subject" value={document.subjectName} />
                <InfoItem
                  label="Semester"
                  value={`Semester ${document.semesterNo}`}
                />
                <InfoItem label="Combo" value={document.comboName} />
                <InfoItem label="File Size" value={`${document.fileSize} MB`} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-black text-card-foreground">
              Document Preview
            </h2>
          </div>

          <div className="h-[760px] w-full bg-muted">
            {document.fileType === "PDF" ? (
              <iframe
                src={document.fileUrl}
                title={document.title}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <FileText className="h-16 w-16 text-muted-foreground" />

                <h2 className="mt-4 text-xl font-bold text-card-foreground">
                  Preview is not available
                </h2>

                <p className="mt-2 max-w-md text-muted-foreground">
                  This file type cannot be previewed directly in the browser.
                  Please open it in a new tab.
                </p>

                <Button
                  type="button"
                  className="mt-5 rounded-xl"
                  onClick={() => window.open(document.fileUrl, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Document
                </Button>
              </div>
            )}
          </div>
        </Card>

        <aside className="space-y-6">
          <Card className="rounded-3xl border border-border bg-card shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-black text-card-foreground">Uploaded By</h3>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
                  {document.ownerAvatar ? (
                    <img
                      src={document.ownerAvatar}
                      alt={document.ownerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-6 w-6" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-card-foreground">
                    {document.ownerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Owner ID: {document.ownerId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border bg-card shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-black text-card-foreground">Statistics</h3>

              <div className="mt-4 space-y-4">
                <StatItem
                  icon={<Download className="h-4 w-4" />}
                  label="Downloads"
                  value={document.downloadCount}
                />

                <StatItem
                  icon={
                    <Bookmark
                      className={`h-4 w-4 ${
                        document.isBookmarked
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }`}
                    />
                  }
                  label="Bookmarks"
                  value={document.bookmarkCount}
                />

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Rating
                    </span>
                    <span className="font-bold text-card-foreground">
                      {document.averageRating} / 5
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
                    {document.ratingCount} ratings
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
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-black text-card-foreground">{value}</p>
    </div>
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

export default DocumentDetailPage;
