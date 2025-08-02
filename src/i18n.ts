import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ca", // Idioma por defecto
    supportedLngs: ["en", "es", "ca"],
    debug: true,
    interpolation: {
      escapeValue: false, // React ya lo hace por defecto
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json"
    }
  });

export default i18n;
