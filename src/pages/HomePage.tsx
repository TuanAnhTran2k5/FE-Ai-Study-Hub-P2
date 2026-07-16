import HeroSection from "../components/home/HeroSection";
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
    <div className="px-10">
      <HeroSection />

      {/* <TopSubjectsSection />  */}
    </div>
  );
}

export default HomePage;
