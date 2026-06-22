interface GoldAvatarFrameProps {
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

function GoldAvatarFrame({
  avatarUrl,
  fullName = "User",
  size = "md",
  isOnline = false,
}: GoldAvatarFrameProps) {
  const classes = sizeClass[size];

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName,
  )}&background=ca8a04&color=ffffff`;

  return (
    <div
      className={`relative flex items-center justify-center ${classes.wrapper}`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-700 shadow-[0_0_26px_rgba(234,179,8,0.45)] dark:from-yellow-200 dark:via-yellow-500 dark:to-amber-600 dark:shadow-[0_0_32px_rgba(250,204,21,0.65)]" />

      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-yellow-50/90 via-yellow-300/80 to-amber-500/80 dark:from-yellow-200/90 dark:via-yellow-500/60 dark:to-amber-600/80" />

      <div className="absolute inset-[6px] rounded-full border-2 border-yellow-300/90 shadow-inner dark:border-yellow-200/80" />

      <div className="absolute inset-[11px] rounded-full border border-white/90 dark:border-yellow-100/70" />

      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-gradient-to-b from-yellow-200 to-amber-500 shadow-[0_0_14px_rgba(234,179,8,0.85)] dark:from-yellow-100 dark:to-yellow-500 dark:shadow-[0_0_18px_rgba(250,204,21,0.95)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-xl bg-gradient-to-t from-yellow-200 to-amber-500 shadow-[0_0_14px_rgba(234,179,8,0.85)] dark:from-yellow-100 dark:to-yellow-500 dark:shadow-[0_0_18px_rgba(250,204,21,0.95)] ${classes.nodeHorizontal}`}
      />

      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r-xl bg-gradient-to-r from-yellow-200 to-amber-500 shadow-[0_0_14px_rgba(234,179,8,0.85)] dark:from-yellow-100 dark:to-yellow-500 dark:shadow-[0_0_18px_rgba(250,204,21,0.95)] ${classes.nodeVertical}`}
      />

      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-l-xl bg-gradient-to-l from-yellow-200 to-amber-500 shadow-[0_0_14px_rgba(234,179,8,0.85)] dark:from-yellow-100 dark:to-yellow-500 dark:shadow-[0_0_18px_rgba(250,204,21,0.95)] ${classes.nodeVertical}`}
      />

      <div className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.95)] dark:bg-yellow-50" />
      <div className="pointer-events-none absolute right-4 top-5 h-2 w-2 rounded-full bg-yellow-100 shadow-[0_0_14px_rgba(250,204,21,0.9)]" />
      <div className="pointer-events-none absolute bottom-5 left-4 h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.9)]" />

      <div className="relative overflow-hidden rounded-full border-4 border-yellow-50 bg-card shadow-[inset_0_0_16px_rgba(120,53,15,0.25)] dark:border-yellow-100/90">
        <img
          src={avatarUrl || fallbackAvatar}
          alt={fullName}
          className={`${classes.avatar} rounded-full object-cover`}
        />
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div
          className={`rounded-full border border-yellow-400 bg-gradient-to-r from-yellow-100 via-white to-amber-200 font-black tracking-widest text-amber-700 shadow-[0_0_16px_rgba(234,179,8,0.45)] dark:border-yellow-300 dark:from-yellow-100 dark:via-white dark:to-yellow-300 dark:text-amber-800 dark:shadow-[0_0_20px_rgba(250,204,21,0.7)] ${classes.label}`}
        >
          GOLD
        </div>
      </div>

      {isOnline && (
        <span className="absolute bottom-0 right-1 z-20 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-card bg-green-500 shadow-sm" />
        </span>
      )}
    </div>
  );
}

export default GoldAvatarFrame;
