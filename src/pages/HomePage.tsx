import HeroSection from "../components/home/HeroSection";
import TopRatedBanner from "../components/home/TopRatedBanner";
import FeaturesSection from "../components/home/FeaturesSection";
import PathwaysSection from "../components/home/PathwaysSection";
import AIChatTeaser from "../components/home/AIChatTeaser";
import { useSelector } from "react-redux";
import type { UserResponse } from "@/types/user.type";
import { ROUTE } from "@/models/routePath";
import { Navigate } from "react-router-dom";

function HomePage() {
  const user = useSelector(
    (state: { user: UserResponse | null }) => state.user,
  );

  if (user) {
    return <Navigate to={`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`} replace />;
  }
  return (
    <div className="w-full pb-16">
      {/* 1. Hero: Đậm */}
      <div className="w-full bg-secondary/30 dark:bg-secondary/10 border-b border-border/20 py-8">
        <HeroSection />
      </div>
      
      {/* 2. Top Rated Banner: Nhạt (bg-card) */}
      <div className="w-full bg-card border-b border-border/20 py-12">
        <TopRatedBanner />
      </div>

      {/* 3. Features: Đậm */}
      <div className="w-full bg-secondary/30 dark:bg-secondary/10 border-b border-border/20 py-12">
        <FeaturesSection />
      </div>

      {/* 4. Pathways: Nhạt (bg-card) */}
      <div className="w-full bg-card border-b border-border/20 py-12">
        <PathwaysSection />
      </div>

      {/* 5. AI Chat Teaser: Đậm */}
      <div className="w-full bg-secondary/30 dark:bg-secondary/10 border-b border-border/20 py-12">
        <AIChatTeaser />
      </div>

      {/* <TopSubjectsSection />  */}
    </div>
  );
}

export default HomePage;
