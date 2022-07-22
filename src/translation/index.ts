import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as resources from './resources'

const { languageDetectorPlugin } = require('./plugins/languageDetectorPlugin.ts')

const i18n = i18next.use(initReactI18next).use(languageDetectorPlugin)

i18n.init({
  compatibilityJSON: 'v3',
  resources: {
    ...Object.entries(resources).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          translation: value,
        },
      }),
      {}
    ),
  },
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
  lng: i18n.options.lng,
  fallbackLng: 'en',
})

export default i18n
