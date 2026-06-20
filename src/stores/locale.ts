import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Locale } from '@/i18n/types';
import { LOCALE_OPTIONS, DEFAULT_LOCALE } from '@/i18n/types';
import { setI18nLocale } from '@/i18n';

function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('en')) return 'en-US';
  
  return DEFAULT_LOCALE;
}

function getInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return getBrowserLocale();
  
  const stored = localStorage.getItem('cozy-cooking-locale');
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored;
  }
  
  return getBrowserLocale();
}

export const useLocaleStore = defineStore(
  'locale',
  () => {
    const currentLocale = ref<Locale>(getInitialLocale());

    const currentOption = computed(() => {
      return LOCALE_OPTIONS.find((o) => o.value === currentLocale.value) ?? LOCALE_OPTIONS[0];
    });

    const isZh = computed(() => currentLocale.value === 'zh-CN');
    const isEn = computed(() => currentLocale.value === 'en-US');

    function setLocale(locale: Locale): void {
      currentLocale.value = locale;
      setI18nLocale(locale);
    }

    function toggleLocale(): void {
      const newLocale = currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
      setLocale(newLocale);
    }

    function resetLocale(): void {
      setLocale(DEFAULT_LOCALE);
    }

    watch(
      currentLocale,
      (newLocale) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('cozy-cooking-locale', newLocale);
        }
        if (typeof document !== 'undefined') {
          document.documentElement.lang = newLocale;
        }
        setI18nLocale(newLocale);
      },
      { immediate: true }
    );

    return {
      currentLocale,
      currentOption,
      isZh,
      isEn,
      setLocale,
      toggleLocale,
      resetLocale,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-locale',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  }
);
