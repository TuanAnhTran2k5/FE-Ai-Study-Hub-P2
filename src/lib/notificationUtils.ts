export const getNotificationBadgeStyles = (type?: string) => {
  const t = type?.toUpperCase() ?? "SYSTEM";
  switch (t) {
    case "REWARD":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
    case "SOCIAL":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
    case "REPORT":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30";
    case "SYSTEM":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30";
  }
};
