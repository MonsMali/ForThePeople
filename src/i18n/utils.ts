import { defaultLang, type Lang } from './languages';
import { ui } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  // Strip existing language prefix and re-add
  const stripped = path.replace(/^\/(en|pt)/, '');
  return `/${lang}${stripped || '/'}`;
}
