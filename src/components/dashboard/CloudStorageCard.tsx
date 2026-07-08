import { useTranslation } from "react-i18next";
import { Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CloudStorageCardProps {
  storageUsed: number;
  storageLimit: number;
}

// Helper function to format bytes to human readable format with fixed decimals
function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || isNaN(bytes)) return "0 MB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 2) {
    return (bytes / (k * k)).toFixed(dm) + " MB";
  }
  return (bytes / Math.pow(k, i)).toFixed(dm) + " " + sizes[i];
}

export default function CloudStorageCard({ storageUsed, storageLimit }: CloudStorageCardProps) {
  const { t } = useTranslation();

  // Cloud Storage Variables
  const storagePercent = Math.min(100, (storageUsed / storageLimit) * 100);
  
  // Format Storage Percent cleanly (e.g. 0.15% -> 0.2% to match profile page)
  const storagePercentFormatted = storagePercent > 0 && storagePercent < 0.1
    ? "0.1"
    : storagePercent % 1 === 0
      ? storagePercent.toFixed(0)
      : storagePercent.toFixed(1);

  // Circular progress SVG values (Phóng to vòng tròn từ bán kính 38 lên 50)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (storagePercent / 100) * circumference;

  return (
    <Card className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
      <CardContent className="p-6 space-y-5 flex flex-col items-center">
        <div className="flex items-center gap-2 self-start w-full">
          <Database className="h-5 w-5 text-teal-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-card-foreground">
            {t("dashboard.storage.title")}
          </h3>
        </div>

        {/* RADIAL PROGRESS GAUGE */}
        <div className="relative flex items-center justify-center size-44">
          <svg className="size-full transform -rotate-90">
            <defs>
              <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            
            {/* Track circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              strokeWidth="9"
              stroke="currentColor"
              className="text-muted-foreground/15 dark:text-secondary/30"
              fill="transparent"
            />
            
            {/* Active progress circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              strokeWidth="10"
              stroke="url(#storageGradient)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Text centered inside circular gauge */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-2xl font-black text-card-foreground tracking-tighter">
              {storagePercentFormatted}%
            </span>
            <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground/80 mt-0.5">
              {t("dashboard.storage.used")}
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-card-foreground">
            {formatBytes(storageUsed, 2)} <span className="text-muted-foreground font-medium">/ {formatBytes(storageLimit, 2)}</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight italic">
            💡 {t("dashboard.storage.remaining")}: {formatBytes(Math.max(0, storageLimit - storageUsed), 2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
