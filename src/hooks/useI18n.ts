import { useTranslation } from 'react-i18next';
import * as localeResource from '../translation/resources';

export type TLocationParamsList = keyof typeof localeResource;

export function useI18n() {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: TLocationParamsList) => {
    try {
      await i18n.changeLanguage(lng);
    } catch {}
  };

  return { changeLanguage };
}
