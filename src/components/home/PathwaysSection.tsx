import { useTranslation } from "react-i18next";
import { Award } from "lucide-react";

function PathwaysSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: t("home.pathway.step1.title"),
      desc: t("home.pathway.step1.desc"),
    },
    {
      number: 2,
      title: t("home.pathway.step2.title"),
      desc: t("home.pathway.step2.desc"),
    },
    {
      number: 3,
      title: t("home.pathway.step3.title"),
      desc: t("home.pathway.step3.desc"),
    },
    {
      number: 4,
      title: t("home.pathway.step4.title"),
      desc: t("home.pathway.step4.desc"),
    },
    {
      number: 5,
      title: t("home.pathway.step5.title"),
      desc: t("home.pathway.step5.desc"),
    },
    {
      number: 6,
      title: t("home.pathway.step6.title"),
      desc: t("home.pathway.step6.desc"),
      isSpecial: true,
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-10 text-center">
        {/* Title */}
        <h2 className="text-3xl font-black text-card-foreground">
          {t("home.pathway.title")}
        </h2>

        {/* Steps Grid */}
        <div className="mt-12 flex flex-col md:flex-row flex-wrap md:flex-nowrap justify-between gap-8 md:gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center flex-1 min-w-[140px] relative"
            >
              {/* Desktop Connector Line */}
              {idx < steps.length - 1 && (
                <div className="absolute top-6 left-[50%] right-[-50%] hidden h-[2px] bg-border md:block -z-10 group-hover:bg-primary/30 transition-colors duration-300" />
              )}

              {/* Step Circle */}
              {step.isSpecial ? (
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition duration-300 group-hover:scale-110">
                  <Award className="size-6" />
                </div>
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary bg-card text-base font-bold text-primary shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  {step.number}
                </div>
              )}

              {/* Text info */}
              <div className="mt-4 space-y-1">
                <h4 className="text-sm font-bold text-card-foreground">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PathwaysSection;
