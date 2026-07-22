import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import SettingsNavigation from "@/components/settings/SettingsNavigation";
import GeneralPanel from "@/components/settings/GeneralPanel";
import AppearancePanel from "@/components/settings/AppearancePanel";
import CachePanel from "@/components/settings/CachePanel";

function SettingsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "general":
        return <GeneralPanel />;
      case "appearance":
        return <AppearancePanel />;
      case "cache":
        return <CachePanel />;
      default:
        return <GeneralPanel />;
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8">
      {/* Header section */}
      <div>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary">
          <Settings className="h-4.5 w-4.5" />
          {t("settings.label", "Cấu hình")}
        </p>

        <h1 className="mt-2 text-3xl font-black text-card-foreground">
          {t("settings.title", "Cài đặt ứng dụng")}
        </h1>

        <p className="mt-2 text-xs text-muted-foreground max-w-2xl font-semibold">
          {t("settings.description", "Quản lý tùy chọn ngôn ngữ, giao diện hiển thị, cấu hình học tập và trải nghiệm ứng dụng.")}
        </p>
      </div>

      {/* Main settings layout */}
      <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-[240px] shrink-0">
          <SettingsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {renderActivePanel()}
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;