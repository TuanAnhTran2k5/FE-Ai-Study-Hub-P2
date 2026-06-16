import { Button } from "@/components/ui/button";
import { ROUTE } from "@/models/routePath";
import { ArrowRight, FileText, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const heroStats = [
  {
    value: "12K+",
    label: "Documents",
    icon: FileText,
  },
  {
    value: "5K+",
    label: "Users",
    icon: Users,
  },
  {
    value: "25K+",
    label: "AI Chats",
    icon: MessageCircle,
  },
];

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-4">
      <div className="mx-auto grid items-center gap-5 bg-card/80 py-5 shadow-sm backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="max-w-xl space-y-5">
          <div className="space-y-2">
            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-card-foreground lg:text-[64px]">
              Learn Smarter with{" "}
              <span className="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
                AI Study Hub
              </span>
            </h1>

            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              Upload, discover and learn from thousands of study materials. Get
              AI-powered help anytime, anywhere.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate(`${ROUTE.AUTH}/${ROUTE.LOGIN}`)}
              type="button"
              className="h-12 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-primary-start to-primary-end px-6 text-sm font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:from-primary-start-hover hover:to-primary-end-hover"
            >
              Start Learning
              <ArrowRight className="size-4" />
            </Button>

            <Button
              type="button"
              className=" h-12 cursor-pointer rounded-xl border border-border bg-card px-6 text-sm font-bold text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-bg-hover hover:text-primary"
            >
              Explore Documents
            </Button>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 pt-2">
            {heroStats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-bg-hover"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-secondary-foreground">
                  <Icon className="size-[22px]" />
                </div>

                <div>
                  <p className="text-xl font-black leading-none text-card-foreground">
                    {value}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[600px]">
          <img
            src="/img/HomeHero_BG.png"
            alt="AI Study Hub dashboard preview"
            className="h-auto w-full object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
