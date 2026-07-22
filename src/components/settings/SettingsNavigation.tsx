import { GraduationCap, Palette, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SettingsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "general",
      label: t("settings.navigation.general", "Chung & Học tập"),
      icon: <GraduationCap className="h-4.5 w-4.5" />
    },
    {
      id: "appearance",
      label: t("settings.navigation.appearance", "Giao diện & Màu sắc"),
      icon: <Palette className="h-4.5 w-4.5" />
    },
    {
      id: "cache",
      label: t("settings.navigation.cache", "Bộ nhớ tạm"),
      icon: <Trash2 className="h-4.5 w-4.5" />
    }
  ];

  return (
    <nav className="flex flex-row md:flex-col gap-1.5 p-1 bg-secondary/10 dark:bg-secondary/5 md:bg-transparent rounded-2xl md:rounded-none overflow-x-auto md:overflow-x-visible scrollbar-none shrink-0 border border-border/40 md:border-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs rounded-xl font-bold transition-all duration-200 cursor-pointer whitespace-nowrap md:w-full md:justify-start ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground hover:bg-secondary/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
