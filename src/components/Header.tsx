import { NAVIGATE_KEY } from "@/configs/router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button } from "./ui/button";
import { ROUTE } from "@/models/routePath";
import type { RootState } from "@/redux/store";
import { AvatarDropdown } from "./AvatarDropdown";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ui/ThemeToggle";

interface HeaderProps {
  sticky?: boolean;
}

function Header({ sticky = true }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");
  const isUserPage = location.pathname.startsWith("/app");
  const user = useSelector((state: RootState) => state.user);

  return (
    <header
      className={`z-50 flex h-20 w-full items-center justify-between border-b border-border bg-card/70 px-10 shadow-sm backdrop-blur-xl ${
        sticky ? "sticky top-0" : ""
      }`}
    >
      <div className="flex items-center">
        <img
          src="/img/LOGO.png"
          alt="ASH Logo"
          className="h-14 w-auto cursor-pointer object-contain transition duration-300 hover:scale-105"
        />

        <h1 className="ml-3 text-[28px] font-bold text-primary">
          AI Study Hub
        </h1>
      </div>

      {!isUserPage && (
        <nav className="flex w-1/2 items-center justify-center">
          <ul className="flex items-center gap-8 text-[15px] font-semibold">
            {NAVIGATE_KEY.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-primary after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {t(item.nameKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-3">
        {isAuthPage ? (
          <Button
            variant="outline"
            onClick={() => navigate(ROUTE.HOME)}
            className="cursor-pointer gap-2 rounded-lg border-border bg-card/70 transition-all duration-300 hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary hover:shadow-lg active:scale-95"
          >
            <ArrowLeft className="ml-2 size-4" />
            {t("common.backToHome")}
          </Button>
        ) : user ? (
          <>
            <NotificationBell />
            <ThemeToggle />
            <AvatarDropdown user={user} />
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate(`${ROUTE.AUTH}/${ROUTE.LOGIN}`)}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-primary-start to-primary-end px-7 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:from-primary-start-hover hover:to-primary-end-hover hover:shadow-lg active:scale-95"
            >
              {t("auth.login")}
            </Button>

            <Button
              onClick={() => navigate(`${ROUTE.AUTH}/${ROUTE.REGISTER}`)}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-success-start to-success-end px-7 py-2.5 text-sm font-semibold text-success-foreground transition-all duration-300 hover:scale-105 hover:from-success-start-hover hover:to-success-end-hover hover:shadow-lg active:scale-95"
            >
              {t("auth.register")}
            </Button>

            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;