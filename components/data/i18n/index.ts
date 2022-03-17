import i18n, { use } from "i18next"
import translationEN from "public/static/locales/en/common.json"
import translationFR from "public/static/locales/fr/common.json"
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"

const languages = ["en", "it", "fr"]

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
  fr: {
    translation: translationFR,
  },
}

use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
