interface EliteAvatarFrameProps {
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
  },
  lg: {
    wrapper: "h-36 w-36",
    avatar: "h-[116px] w-[116px]",
    label: "text-xs px-4 py-1",
  },
};

function EliteAvatarFrame({
  avatarUrl,
  fullName = "User",
  size = "md",
  isOnline = false,
}: EliteAvatarFrameProps) {
  const classes = sizeClass[size];

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName,
  )}&background=4f46e5&color=ffffff`;

  return (
    <div
      className={`relative flex items-center justify-center ${classes.wrapper}`}
    >
      {/* Aura ngoài */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-violet-500 to-indigo-700 opacity-90 blur-[1px] shadow-[0_0_40px_rgba(99,102,241,0.8)]" />

      {/* Ring 1 */}
      <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-cyan-200 via-violet-400 to-indigo-600" />

      {/* Ring 2 */}
      <div className="absolute inset-[6px] rounded-full border-2 border-cyan-200/80" />

      {/* Ring 3 */}
      <div className="absolute inset-[10px] rounded-full border border-white/80" />

      {/* Crown */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
        👑
      </div>

      {/* Crystal nodes */}
      <div className="absolute top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

      <div className="absolute bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-violet-300 shadow-[0_0_15px_rgba(167,139,250,0.9)]" />

      <div className="absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

      <div className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-violet-300 shadow-[0_0_15px_rgba(167,139,250,0.9)]" />

      {/* Sparkles */}
      <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-white shadow-[0_0_15px_white]" />
      <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_cyan]" />
      <div className="absolute bottom-5 left-5 h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_12px_violet]" />

      {/* Avatar */}
      <div className="relative overflow-hidden rounded-full border-4 border-white bg-card">
        <img
          src={avatarUrl || fallbackAvatar}
          alt={fullName}
          className={`${classes.avatar} rounded-full object-cover`}
        />
      </div>

      {/* Label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div
          className={`rounded-full border border-cyan-300 bg-gradient-to-r from-cyan-100 via-white to-violet-200 font-black tracking-widest text-indigo-700 shadow-[0_0_18px_rgba(99,102,241,0.55)] ${classes.label}`}
        >
          ELITE
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

export default EliteAvatarFrame;
