import { NAVIGATE_KEY } from "@/configs/router";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
import { ROUTE } from "@/models/routePath";
import { ArrowLeft } from "lucide-react";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { AvatarDropdown } from "./AvatarDropdown";

function Header() {
  const navigate = useNavigate();

  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border bg-card/70  px-10 shadow-sm backdrop-blur-xl">
      {/* logo 1/4 */}
      <div className="flex items-center">
        <img
          onClick={() => navigate(ROUTE.HOME)}
          src="/img/LOGO.png"
          alt="ASH Logo"
          className="cursor-pointer h-14 w-auto object-contain transition duration-300 hover:scale-105"
        />

        <h1 className="ml-3 text-[28px] font-bold text-primary">
          AI Study Hub
        </h1>
      </div>

      {/* navbar 2/4 */}
      <nav className="w-1/2 flex justify-center items-center">
        <ul className="flex items-center gap-8 text-[15px] font-semibold">
          {NAVIGATE_KEY.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="relative font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-primary after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* menu 1/4 */}
      <div className="flex items-center gap-3">
        {isAuthPage ? (
          <>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTE.HOME)}
              className="cursor-pointer gap-2 rounded-lg border-border bg-card/70 transition-all duration-300 hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary hover:shadow-lg active:scale-95"
            >
              <ArrowLeft className="ml-2 size-4" />
              Back to Home
            </Button>
          </>
        ) : user ? (
          <AvatarDropdown user={user} />
        ) : (
          <>
            <Button
              onClick={() => navigate(`${ROUTE.AUTH}/${ROUTE.LOGIN}`)}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-primary-start to-primary-end px-7 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:from-primary-start-hover hover:to-primary-end-hover hover:shadow-lg active:scale-95"
            >
              Login
            </Button>

            <Button
              onClick={() => navigate(`${ROUTE.AUTH}/${ROUTE.REGISTER}`)}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-success-start to-success-end px-7 py-2.5 text-sm font-semibold text-success-foreground transition-all duration-300 hover:scale-105 hover:from-success-start-hover hover:to-success-end-hover hover:shadow-lg active:scale-95"
            >
              Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
