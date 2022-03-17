import i18n, { use } from "i18next"
import translationEN from "public/static/locales/en/common.json"
/* Quamm Update */
import translationFR from "public/static/locales/fr/common.json"
/* ./Quamm Update */
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"

/* Quamm Update */
const languages = ["en", "it", "fr"]
/* ./Quamm Update */

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
  /* Quamm Update */
  fr: {
    translation: translationFR,
  },
  /* ./Quamm Update */
}

use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
