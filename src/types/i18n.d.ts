import "react-i18next";
import vi from "@/locales/vi.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof vi;
    };
  }
}
