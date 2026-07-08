import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookOpen, MessageSquare, Trophy, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE } from "@/models/routePath";

export default function QuickActionsCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground mb-4">
          {t("dashboard.quickActions.title")}
        </h3>
        
        <div className="space-y-2">
          {/* 1. Upload Doc */}
          <button
            onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-all text-xs font-bold animate-pulse"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t("dashboard.quickActions.upload")}
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* 2. Chat AI */}
          <button
            onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.AI_CHAT}`)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/40 text-card-foreground hover:bg-secondary/30 hover:border-primary/20 transition-all text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              {t("dashboard.quickActions.aiChat")}
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* 3. Leaderboard */}
          <button
            onClick={() => navigate(`/${ROUTE.APP}/${ROUTE.LEADERBOARD}`)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/40 text-card-foreground hover:bg-secondary/30 hover:border-primary/20 transition-all text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              {t("dashboard.quickActions.leaderboard")}
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
