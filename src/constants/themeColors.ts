export interface ThemeColor {
  id: string;
  nameKey: string;
  colorClass: string;
  primaryColor: string; // Tailwind class cho hiển thị nút màu sắc
}

export const THEME_COLORS: ThemeColor[] = [
  { id: "blue", nameKey: "settings.appearance.colors.blue", colorClass: "theme-blue", primaryColor: "bg-sky-600" },
  { id: "indigo", nameKey: "settings.appearance.colors.indigo", colorClass: "theme-indigo", primaryColor: "bg-indigo-600" },
  { id: "purple", nameKey: "settings.appearance.colors.purple", colorClass: "theme-purple", primaryColor: "bg-purple-600" },
  { id: "emerald", nameKey: "settings.appearance.colors.emerald", colorClass: "theme-emerald", primaryColor: "bg-emerald-600" },
  { id: "teal", nameKey: "settings.appearance.colors.teal", colorClass: "theme-teal", primaryColor: "bg-teal-600" },
  { id: "orange", nameKey: "settings.appearance.colors.orange", colorClass: "theme-orange", primaryColor: "bg-orange-600" },
  { id: "amber", nameKey: "settings.appearance.colors.amber", colorClass: "theme-amber", primaryColor: "bg-amber-500" },
  { id: "rose", nameKey: "settings.appearance.colors.rose", colorClass: "theme-rose", primaryColor: "bg-rose-600" },
  { id: "pink", nameKey: "settings.appearance.colors.pink", colorClass: "theme-pink", primaryColor: "bg-pink-500" },
  { id: "slate", nameKey: "settings.appearance.colors.slate", colorClass: "theme-slate", primaryColor: "bg-slate-500" }
];
