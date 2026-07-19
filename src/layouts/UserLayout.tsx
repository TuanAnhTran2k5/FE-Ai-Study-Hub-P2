import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ROUTE } from "@/models/routePath";

function UserLayout() {
  const currentUser = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem("accessToken");

  if (!token || !currentUser) {
    return <Navigate to={ROUTE.HOME} replace />;
  }

  return (
    <SidebarProvider>
      <main className="flex h-screen w-full flex-col overflow-hidden bg-background">
        <Header />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <AppSidebar />

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background">
            <Outlet />
          </main>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default UserLayout;