import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';
import type { Locale } from './types';
import { DEFAULT_LOCALE } from './types';

type I18nMessages = typeof zhCN;

declare module 'vue-i18n' {
  interface DefineLocaleMessage extends I18nMessages {}
}

function getStoredLocale(): Locale {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem('cozy-cooking-locale');
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored;
  }
  return DEFAULT_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStoredLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  } as unknown as Record<Locale, I18nMessages>,
  datetimeFormats: {
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
  },
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY',
      },
    },
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
  },
});

export function setI18nLocale(locale: Locale): void {
  (i18n.global.locale as { value: Locale }).value = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export function useI18nTyped() {
  return i18n.global as unknown as {
    t: (key: string, params?: Record<string, unknown>) => string;
    locale: { value: Locale };
  };
}
