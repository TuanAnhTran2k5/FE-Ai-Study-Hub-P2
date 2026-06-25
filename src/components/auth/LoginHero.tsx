import {
  CloudUpload,
  FileText,
  MessageCircle,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

function LoginHero() {
  return (
    <div className="relative flex h-full min-h-[650px] flex-col overflow-hidden rounded-3xl p-2">
      {/* Background glow */}
      <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-link-hover/20 blur-3xl" />

      {/* Header Text */}
      <div className="relative z-10">
        <h1 className="text-[34px] font-black leading-tight tracking-tight text-card-foreground">
          Welcome Back! <span>👋</span>
          <br />
          Login to <span className="text-link">Your Account</span>
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-foreground">
          Login to continue discovering, sharing and learning with AI Study Hub
          community.
        </p>
      </div>

      {/* Logo image */}
      <div className="relative z-10 mt-8 flex justify-center">
        <div className="relative">
          <img
            src="/img/LoginHero_BG.png"
            alt="AI Study Hub"
            className="h-full  w-full object-contain drop-shadow-xl"
          />

          {/* Floating stats */}
          <div className="absolute -left-0 top-8 space-y-3">
            <StatCard
              icon={<FileText size={16} />}
              value="12K+"
              label="Documents"
            />
            <StatCard
              icon={<MessageCircle size={16} />}
              value="25K+"
              label="AI Chats"
            />
            <StatCard
              icon={<Users size={16} />}
              value="5K+"
              label="Active Users"
            />
          </div>

          {/* Cloud */}
          <div className="absolute -right-1 top-12 flex size-16 items-center justify-center rounded-2xl bg-link text-primary-foreground shadow-lg">
            <CloudUpload size={30} />
          </div>
        </div>
      </div>

      {/* Feature Card */}
      <div className="relative z-10 mt-auto rounded-3xl border border-border bg-accent/50 p-5 shadow-sm backdrop-blur">
        <FeatureItem
          icon={<ShieldCheck size={20} />}
          title="Secure & Private"
          desc="Your data is encrypted and always protected."
          color="bg-primary-bg-hover text-link"
        />
        <FeatureItem
          icon={<CloudUpload size={20} />}
          title="Access Anywhere"
          desc="Access your documents and AI assistant anytime, anywhere."
          color="bg-success/15 text-success"
        />
        <FeatureItem
          icon={<Users size={20} />}
          title="Join Community"
          desc="Connect with thousands of students and share knowledge."
          color="bg-chart-4/15 text-chart-4"
        />
        <FeatureItem
          icon={<Trophy size={20} />}
          title="Earn & Grow"
          desc="Earn reputation, badges and climb the leaderboard."
          color="bg-link-hover/15 text-link-hover"
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex w-[118px] items-center gap-2 rounded-xl border border-border bg-card/90 p-2 shadow-md backdrop-blur">
      <div className="text-link">{icon}</div>
      <div>
        <p className="text-xs font-bold text-card-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
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
    <div className="flex gap-3 py-2">
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

export default LoginHero;
