import { useTranslation } from "react-i18next";
import { Cloud, Bot, Users, Award } from "lucide-react";

function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Cloud,
      title: t("home.features.storage.title"),
      description: t("home.features.storage.description"),
      colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Bot,
      title: t("home.features.ai.title"),
      description: t("home.features.ai.description"),
      colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Users,
      title: t("home.features.community.title"),
      description: t("home.features.community.description"),
      colorClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      icon: Award,
      title: t("home.features.rewards.title"),
      description: t("home.features.rewards.description"),
      colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${feature.colorClass}`}>
                  <Icon className="size-6" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
