import { ShieldCheck, Sparkles, Trophy, Crown, Medal } from "lucide-react";

// Map Rank Name to correct Lucide Icon (Khớp 100% với thiết kế rank)
export const getRankIcon = (rankName?: string) => {
  const name = rankName?.toLowerCase() ?? "";
  if (name.includes("bronze")) return ShieldCheck; // Bronze: Shield Icon
  if (name.includes("silver")) return Sparkles;    // Silver: Sparkles Icon
  if (name.includes("gold")) return Trophy;        // Gold: Trophy Icon
  if (name.includes("elite")) return Crown;        // Elite: Crown Icon
  return Medal;                                    // Default fallback
};

// Map Rank Name to Vibrant Style & Glow Effect (Khắc phục lỗi Rank cao bị mờ nhạt từ Backend)
export const getRankStyle = (rankName?: string) => {
  const name = rankName?.toLowerCase() ?? "";
  if (name.includes("bronze")) {
    return {
      color: "#d97706", // Amber-600: Cam đồng rực rỡ
      badgeColor: "rgba(217, 119, 6, 0.15)",
      glowClass: "shadow-[0_0_12px_rgba(217,119,6,0.4)]",
      borderClass: "border-amber-500/30"
    };
  }
  if (name.includes("silver")) {
    return {
      color: "#06b6d4", // Cyan-500: Xanh ngọc cyan lấp lánh (Màu bạc phát sáng cực kỳ sang trọng)
      badgeColor: "rgba(6, 182, 212, 0.15)",
      glowClass: "shadow-[0_0_12px_rgba(6,182,212,0.45)]",
      borderClass: "border-cyan-500/30"
    };
  }
  if (name.includes("gold")) {
    return {
      color: "#eab308", // Yellow-500: Vàng hoàng kim sáng rực
      badgeColor: "rgba(234, 179, 8, 0.15)",
      glowClass: "shadow-[0_0_12px_rgba(234, 179, 8, 0.45)]",
      borderClass: "border-yellow-500/30"
    };
  }
  if (name.includes("elite")) {
    return {
      color: "#a855f7", // Purple-500: Tím tinh anh phát sáng neon
      badgeColor: "rgba(168, 85, 247, 0.15)",
      glowClass: "shadow-[0_0_15px_rgba(168, 85, 247, 0.5)]",
      borderClass: "border-purple-500/30"
    };
  }
  // Default primary color fallback
  return {
    color: "var(--primary)",
    badgeColor: "rgba(var(--primary), 0.15)",
    glowClass: "shadow-[0_0_8px_rgba(59,130,246,0.3)]",
    borderClass: "border-primary/20"
  };
};
