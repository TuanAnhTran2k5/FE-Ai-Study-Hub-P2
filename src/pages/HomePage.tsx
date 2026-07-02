import HeroSection from "../components/home/HeroSection";
import TopSubjectsSection from "@/components/home/TopSubjectsSection";
import { useSelector } from "react-redux";
import type { UserResponse } from "@/types/user.type";
import { ROUTE } from "@/models/routePath";
import { Navigate } from "react-router-dom";
import FeatureOverviewSection from "@/components/home/FeatureOverviewSection";

function HomePage() {
  const user = useSelector(
    (state: { user: UserResponse | null }) => state.user,
  );

  if (user) {
    return <Navigate to={`/${ROUTE.APP}/${ROUTE.MY_DOCUMENTS}`} replace />;
  }
  return (
    <div className="px-10">
      <HeroSection />

      <FeatureOverviewSection />

      
      <TopSubjectsSection />
    </div>
  );
}

export default HomePage;
