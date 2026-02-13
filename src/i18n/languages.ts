export const languages = {
  en: 'English',
  pt: 'Português',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;
