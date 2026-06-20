<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/stores/locale';
import { LOCALE_OPTIONS } from '@/i18n/types';
import type { Locale } from '@/i18n/types';
import { setI18nLocale } from '@/i18n';

const { t } = useI18n();
const localeStore = useLocaleStore();

const currentOption = computed(() => localeStore.currentOption);

function handleLocaleChange(locale: Locale) {
  localeStore.setLocale(locale);
  setI18nLocale(locale);
}

function toggleLocale() {
  const newLocale = localeStore.currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
  handleLocaleChange(newLocale);
}
</script>

<template>
  <div class="language-selector">
    <div class="flex items-center gap-3">
      <button
        v-for="option in LOCALE_OPTIONS"
        :key="option.value"
        class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border-2"
        :class="{
          'bg-matcha-500 border-matcha-600 text-white shadow-lg shadow-matcha-500/30 scale-105':
            localeStore.currentLocale === option.value,
          'bg-white border-cream-300 text-brown-800 hover:border-matcha-400 hover:bg-matcha-50':
            localeStore.currentLocale !== option.value,
        }"
        @click="handleLocaleChange(option.value)"
      >
        <span class="text-xl">{{ option.flag }}</span>
        <span class="font-medium">{{ option.label }}</span>
      </button>
    </div>

    <div class="mt-4 text-sm text-brown-800/60">
      {{ t('settings.currentLanguage') }}: 
      <span class="font-medium text-brown-900">{{ currentOption.flag }} {{ currentOption.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  @apply p-4 bg-cream-50 rounded-2xl border-2 border-cream-200;
}
</style>
