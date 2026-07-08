import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTE } from "@/models/routePath";
import type { MyDocumentResponse } from "@/types/document.type";

interface RecentDocsTableProps {
  documents: MyDocumentResponse[];
}

export default function RecentDocsTable({ documents }: RecentDocsTableProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Sort and take 5 most recent documents
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING":
      case "UPLOADING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "FAILED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-secondary/40 text-muted-foreground border-border/50";
    }
  };

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground">
            {t("dashboard.recentDocs.title")}
          </h3>
          {documents.length > 0 && (
            <Link 
              to={`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`}
              className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline"
            >
              {t("dashboard.recentDocs.viewAll")}
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {recentDocuments.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border/50 text-[10px] uppercase font-black tracking-wider text-muted-foreground bg-secondary/10">
                  <th className="py-3 px-6">{t("dashboard.recentDocs.cols.title")}</th>
                  <th className="py-3 px-6">{t("dashboard.recentDocs.cols.date")}</th>
                  <th className="py-3 px-6">{t("dashboard.recentDocs.cols.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentDocuments.map((doc) => (
                  <tr 
                    key={doc.documentId}
                    className="hover:bg-secondary/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.DOCUMENT_DETAIL.replace(":id", String(doc.documentId))}`)}
                  >
                    <td className="py-3 px-6 min-w-[200px]">
                      <div className="font-bold text-xs text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {doc.title}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">
                        {doc.subjectName}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-xs text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </td>
                    <td className="py-3 px-6">
                      <Badge 
                        className={`rounded-full text-[10px] font-black tracking-wider px-2.5 py-0.5 border ${getStatusBadgeVariant(doc.uploadStatus)}`}
                      >
                        {doc.uploadStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center border border-dashed border-border/60 rounded-2xl bg-secondary/5">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-40 mb-2" />
            <p className="text-xs text-muted-foreground font-medium">
              {t("dashboard.recentDocs.empty")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
