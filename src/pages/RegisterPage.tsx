import React from "react";
import RegisterHero from "../components/auths/RegisterHero";
import { Outlet } from "react-router-dom";

function RegisterPage() {
  return (
    <>
      <aside className="min-h-[650px]">
        <RegisterHero />
      </aside>

      <div className="flex min-h-[650px] items-center justify-center">
        <div className="w-full p-2">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
