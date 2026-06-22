interface SilverAvatarFrameProps {
  avatarUrl?: string | null;
  fullName?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

const sizeClass = {
  sm: {
    wrapper: "h-10 w-10",
    avatar: "h-[30px] w-[30px]",
    label: "hidden",
    nodeHorizontal: "h-1 w-3",
    nodeVertical: "h-3 w-1",
  },
  md: {
    wrapper: "h-28 w-28",
    avatar: "h-[88px] w-[88px]",
    label: "text-[10px] px-3 py-1",
    nodeHorizontal: "h-3 w-8",
    nodeVertical: "h-8 w-3",
  },
  lg: {
    wrapper: "h-36 w-36",
    avatar: "h-[116px] w-[116px]",
    label: "text-xs px-4 py-1",
    nodeHorizontal: "h-3.5 w-10",
    nodeVertical: "h-10 w-3.5",
  },
};

function SilverAvatarFrame({
  avatarUrl,
  fullName = "User",
  size = "md",
  isOnline = false,
}: SilverAvatarFrameProps) {
  const classes = sizeClass[size];

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName,
  )}&background=0369a1&color=ffffff`;

  return (
    <div
      className={`relative flex items-center justify-center ${classes.wrapper}`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-50 via-slate-300 to-sky-300 shadow-[0_0_24px_rgba(2,132,199,0.35)] dark:from-slate-200 dark:via-slate-400 dark:to-sky-400 dark:shadow-[0_0_28px_rgba(56,189,248,0.5)]" />

      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/90 via-slate-200/80 to-sky-200/80 dark:from-slate-200/80 dark:via-slate-400/40 dark:to-sky-400/50" />

      <div className="absolute inset-[6px] rounded-full border-2 border-sky-300/80 shadow-inner dark:border-sky-300/70" />

      <div className="absolute inset-[11px] rounded-full border border-white/90 dark:border-white/50" />

      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.75)] dark:from-sky-200 dark:to-sky-400 dark:shadow-[0_0_16px_rgba(56,189,248,0.9)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-xl bg-gradient-to-t from-sky-300 to-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.75)] dark:from-sky-200 dark:to-sky-400 dark:shadow-[0_0_16px_rgba(56,189,248,0.9)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r-xl bg-gradient-to-r from-sky-300 to-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.75)] dark:from-sky-200 dark:to-sky-400 dark:shadow-[0_0_16px_rgba(56,189,248,0.9)] ${classes.nodeVertical}`}
      />

      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-l-xl bg-gradient-to-l from-sky-300 to-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.75)] dark:from-sky-200 dark:to-sky-400 dark:shadow-[0_0_16px_rgba(56,189,248,0.9)] ${classes.nodeVertical}`}
      />

      <div className="relative overflow-hidden rounded-full border-4 border-white bg-card shadow-[inset_0_0_16px_rgba(15,23,42,0.18)] dark:border-slate-100/80 dark:bg-card">
        <img
          src={avatarUrl || fallbackAvatar}
          alt={fullName}
          className={`${classes.avatar} rounded-full object-cover`}
        />
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div
          className={`rounded-full border border-sky-300 bg-gradient-to-r from-slate-100 via-white to-slate-200 font-black tracking-widest text-slate-700 shadow-[0_0_14px_rgba(14,165,233,0.35)] dark:border-sky-300/80 dark:from-slate-200 dark:via-white dark:to-sky-100 dark:text-slate-800 dark:shadow-[0_0_18px_rgba(56,189,248,0.65)] ${classes.label}`}
        >
          SILVER
        </div>
      </div>

      <div className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] dark:bg-sky-100" />
      <div className="pointer-events-none absolute bottom-5 right-4 h-1.5 w-1.5 rounded-full bg-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />

      {isOnline && (
        <span className="absolute bottom-0 right-1 z-20 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-card bg-green-500 shadow-sm" />
        </span>
      )}
    </div>
  );
}

export default SilverAvatarFrame;
