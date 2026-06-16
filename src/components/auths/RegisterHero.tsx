import { Bot, CloudUpload, LockKeyhole, Trophy } from "lucide-react";
function RegisterHero() {
  return (
    <div className="relative flex h-full min-h-[650px] flex-col overflow-hidden rounded-3xl p-2 ">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-bg-hover blur-3xl" />

      {/* Header Text */}
      <div className="relative z-10">
        <h1 className="text-[34px] font-black leading-tight tracking-tight text-card-foreground">
          Join AI Study Hub 🚀
          <br />
          Create <span className="text-link">Your Account</span>
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          Create your account and start discovering, sharing and learning with
          AI Study Hub community.
        </p>
      </div>

      {/* Hero image */}
      <div className="relative z-10 mt-6 flex flex-1 items-center justify-center">
        <img
          src="/img/RegisterHero_BG.png"
          alt="AI Study Hub Register"
          className="h-full w-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Feature Card */}
      <div className="relative z-10 rounded-3xl border border-border bg-accent/50 p-5 shadow-md">
        <FeatureItem
          icon={<CloudUpload size={20} />}
          title="Upload & Share"
          desc="Upload your study materials and share knowledge with others."
          color="bg-secondary text-secondary-foreground"
        />

        <FeatureItem
          icon={<Bot size={20} />}
          title="AI-Powered Learning"
          desc="Chat with AI, get summaries and generate quizzes from documents."
          color="bg-accent text-accent-foreground"
        />

        <FeatureItem
          icon={<Trophy size={20} />}
          title="Earn & Grow"
          desc="Earn reputation, badges and climb the leaderboard."
          color="bg-secondary text-success"
        />

        <FeatureItem
          icon={<LockKeyhole size={20} />}
          title="Secure & Private"
          desc="Your data is safe with us. We value your privacy and security."
          color="bg-primary-bg-hover text-primary"
        />
      </div>
    </div>
  );
}

type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
};

function FeatureItem({ icon, title, desc, color }: FeatureItemProps) {
  return (
    <div className="flex gap-3 py-2.5">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export default RegisterHero;
