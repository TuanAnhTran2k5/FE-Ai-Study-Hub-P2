import { NAVIGATE_KEY } from "@/configs/router";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-r from-footer-start via-footer-middle to-footer-end text-footer-foreground">
      <div className="mx-auto px-10 p-2">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo + Description */}
          <div className="flex items-center gap-3">
            <img
              src="/img/LOGO.png"
              alt="AI Study Hub"
              className="h-12 w-auto object-contain"
            />

            <div className="flex flex-col justify-center ">
              <h2 className="text-xl font-bold">AI Study Hub</h2>

              <p className="text-sm text-footer-muted">
                Learn smarter with AI.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-footer-link">
            {NAVIGATE_KEY.map((item, index) => (
              <div key={item.path} className="flex items-center gap-3">
                <Link
                  to={item.path}
                  className="relative text-footer-link transition-all duration-300 hover:-translate-y-0.5 hover:text-footer-link-hover after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-footer-link-hover after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>

                {index < NAVIGATE_KEY.length - 1 && (
                  <span className="text-footer-dot">•</span>
                )}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="text-center text-sm text-footer-muted">
            <p>
              <span className="font-medium text-footer-link">Email:</span>{" "}
              aistudyhub@gmail.com
            </p>

            <p className="mt-1">Ho Chi Minh City, Vietnam</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 border-t border-footer-border p-1 text-center text-sm text-footer-copyright">
          © 2026 AI Study Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
