import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { ROUTE } from "@/models/routePath";

function TopRatedBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        
        {/* Left side: Title & Description */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-primary">
            <Star className="size-4 fill-primary" />
            <span>TOP-RATED</span>
          </div>
          <h2 className="text-2xl font-black text-card-foreground">
            {t("home.topRated.title")}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t("home.topRated.description")}
          </p>
        </div>

        {/* Left side: Button */}
        <div className="flex shrink-0">
          <Button
            onClick={() => navigate(`/${ROUTE.COMMUNITY}`)}
            type="button"
            className="h-12 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-primary-start to-primary-end px-6 text-sm font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:from-primary-start-hover hover:to-primary-end-hover"
          >
            {t("home.topRated.exploreButton")}
            <ArrowRight className="size-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}

export default TopRatedBanner;
