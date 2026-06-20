export type Locale = 'zh-CN' | 'en-US';

export interface LocaleOption {
  value: Locale;
  label: string;
  flag: string;
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
];

export const DEFAULT_LOCALE: Locale = 'zh-CN';
