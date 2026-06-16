import LoginHero from "../components/auths/LoginHero";
import LoginForm from "../components/auths/LoginForm";

function LoginPage() {
  return (
    <>
      {/* Left Hero - 45% */}
      <aside className="min-h-[650px]">
        <LoginHero />
      </aside>

      {/* Right Form Area - 55% */}
      <div className="flex min-h-[650px] items-center justify-center">
        <div className="w-full p-2">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default LoginPage;
