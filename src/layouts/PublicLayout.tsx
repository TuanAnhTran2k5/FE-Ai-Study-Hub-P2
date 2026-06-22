import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    //khách tham quan = Home  Documents public, Community 
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
