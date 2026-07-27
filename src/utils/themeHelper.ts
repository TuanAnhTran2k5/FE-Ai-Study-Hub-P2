import { THEME_COLORS } from "@/constants/themeColors";

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Chuẩn hóa chuỗi hex
  const cleanHex = hex.replace("#", "");
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function applyThemeColor(colorId: string, customHex?: string) {
  const root = document.documentElement;

  // 1. Loại bỏ tất cả class màu preset hiện tại
  const themeClasses = THEME_COLORS.map((color) => color.colorClass);
  themeClasses.forEach((cls) => root.classList.remove(cls));

  if (colorId === "custom" && customHex) {
    const rgb = hexToRgb(customHex);
    if (rgb) {
      // 2. Gán các biến CSS variables trực tiếp trên document root style
      root.style.setProperty("--primary", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      root.style.setProperty("--primary-hover", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85)`);
      root.style.setProperty("--primary-bg-hover", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
      root.style.setProperty("--ring", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
    }
  } else {
    // 3. Xóa các biến CSS variables tùy chỉnh nếu chọn preset
    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-hover");
    root.style.removeProperty("--primary-bg-hover");
    root.style.removeProperty("--ring");

    // 4. Thêm class preset tương ứng
    root.classList.add(`theme-${colorId}`);
  }
}
