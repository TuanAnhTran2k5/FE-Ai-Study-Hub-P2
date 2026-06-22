interface BronzeAvatarFrameProps {
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

function BronzeAvatarFrame({
  avatarUrl,
  fullName = "User",
  size = "md",
  isOnline = false,
}: BronzeAvatarFrameProps) {
  const classes = sizeClass[size];

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName,
  )}&background=92400e&color=ffffff`;

  return (
    <div
      className={`relative flex items-center justify-center ${classes.wrapper}`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-yellow-700 shadow-[0_0_22px_rgba(217,119,6,0.35)] dark:from-amber-300 dark:via-orange-500 dark:to-yellow-800 dark:shadow-[0_0_26px_rgba(251,146,60,0.45)]" />

      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-amber-100/90 via-orange-300/80 to-yellow-700/70 dark:from-amber-200/80 dark:via-orange-500/50 dark:to-yellow-800/70" />

      <div className="absolute inset-[6px] rounded-full border-2 border-amber-300/90 shadow-inner dark:border-orange-300/80" />

      <div className="absolute inset-[11px] rounded-full border border-white/80 dark:border-orange-100/60" />

      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-gradient-to-b from-amber-300 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.7)] dark:from-amber-300 dark:to-orange-500 dark:shadow-[0_0_14px_rgba(251,146,60,0.8)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-xl bg-gradient-to-t from-amber-300 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.7)] dark:from-amber-300 dark:to-orange-500 dark:shadow-[0_0_14px_rgba(251,146,60,0.8)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r-xl bg-gradient-to-r from-amber-300 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.7)] dark:from-amber-300 dark:to-orange-500 dark:shadow-[0_0_14px_rgba(251,146,60,0.8)] ${classes.nodeVertical}`}
      />

      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-l-xl bg-gradient-to-l from-amber-300 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.7)] dark:from-amber-300 dark:to-orange-500 dark:shadow-[0_0_14px_rgba(251,146,60,0.8)] ${classes.nodeVertical}`}
      />

      <div className="relative overflow-hidden rounded-full border-4 border-amber-50 bg-card shadow-[inset_0_0_16px_rgba(120,53,15,0.22)] dark:border-orange-100/80">
        <img
          src={avatarUrl || fallbackAvatar}
          alt={fullName}
          className={`${classes.avatar} rounded-full object-cover`}
        />
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div
          className={`rounded-full border border-orange-400 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-200 font-black tracking-widest text-orange-800 shadow-[0_0_14px_rgba(245,158,11,0.35)] dark:border-orange-300 dark:from-amber-200 dark:via-orange-100 dark:to-yellow-300 dark:text-orange-900 dark:shadow-[0_0_16px_rgba(251,146,60,0.55)] ${classes.label}`}
        >
          BRONZE
        </div>
      </div>

      <div className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full bg-amber-50 shadow-[0_0_10px_rgba(255,237,213,0.9)]" />
      <div className="pointer-events-none absolute bottom-5 right-4 h-1.5 w-1.5 rounded-full bg-orange-200 shadow-[0_0_10px_rgba(251,146,60,0.8)]" />

      {isOnline && (
        <span className="absolute bottom-0 right-1 z-20 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-card bg-green-500 shadow-sm" />
        </span>
      )}
    </div>
  );
}

export default BronzeAvatarFrame;
