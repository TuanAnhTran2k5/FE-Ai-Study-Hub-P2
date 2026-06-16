import React from "react";
import RegisterForm from "../components/auths/RegisterForm";
import RegisterHero from "../components/auths/RegisterHero";

function RegisterPage() {
  return (
    <>
      <aside className="min-h-[650px]">
        <RegisterHero />
      </aside>

      <div className="flex min-h-[650px] items-center justify-center">
        <div className="w-full p-2">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
