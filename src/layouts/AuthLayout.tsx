import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />

      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-8">
        <div className="grid w-full gap-6 lg:grid-cols-[45%_55%]">
          <Outlet />
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default AuthLayout;