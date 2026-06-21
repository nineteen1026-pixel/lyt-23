import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type SpeechRate = 'slow' | 'normal' | 'fast';
export type HighContrastMode = 'off' | 'light' | 'dark';

export const SPEECH_RATE_OPTIONS: { value: SpeechRate; label: string; rate: number }[] = [
  { value: 'slow', label: '慢速', rate: 0.7 },
  { value: 'normal', label: '正常', rate: 1.0 },
  { value: 'fast', label: '快速', rate: 1.3 },
];

export const HIGH_CONTRAST_OPTIONS: { value: HighContrastMode; label: string }[] = [
  { value: 'off', label: '关闭' },
  { value: 'light', label: '高对比亮色' },
  { value: 'dark', label: '高对比暗色' },
];

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const speechEnabled = ref(true);
    const speechRate = ref<SpeechRate>('normal');
    const speechPitch = ref(1.0);
    const speechVolume = ref(1.0);

    const highContrastMode = ref<HighContrastMode>('off');
    const reducedMotion = ref(false);
    const keyboardNavigation = ref(true);
    const focusVisible = ref(true);
    const largeText = ref(false);

    const speechRateValue = computed(() => {
      const option = SPEECH_RATE_OPTIONS.find((o) => o.value === speechRate.value);
      return option ? option.rate : 1.0;
    });

    const isHighContrast = computed(() => highContrastMode.value !== 'off');

    function toggleSpeech(): void {
      speechEnabled.value = !speechEnabled.value;
    }

    function setSpeechEnabled(enabled: boolean): void {
      speechEnabled.value = enabled;
    }

    function setSpeechRate(rate: SpeechRate): void {
      speechRate.value = rate;
    }

    function setSpeechPitch(pitch: number): void {
      speechPitch.value = Math.max(0.5, Math.min(2, pitch));
    }

    function setSpeechVolume(volume: number): void {
      speechVolume.value = Math.max(0, Math.min(1, volume));
    }

    function setHighContrastMode(mode: HighContrastMode): void {
      highContrastMode.value = mode;
    }

    function toggleHighContrast(): void {
      if (highContrastMode.value === 'off') {
        highContrastMode.value = 'dark';
      } else if (highContrastMode.value === 'dark') {
        highContrastMode.value = 'light';
      } else {
        highContrastMode.value = 'off';
      }
    }

    function setReducedMotion(enabled: boolean): void {
      reducedMotion.value = enabled;
    }

    function toggleReducedMotion(): void {
      reducedMotion.value = !reducedMotion.value;
    }

    function setKeyboardNavigation(enabled: boolean): void {
      keyboardNavigation.value = enabled;
    }

    function setFocusVisible(enabled: boolean): void {
      focusVisible.value = enabled;
    }

    function toggleFocusVisible(): void {
      focusVisible.value = !focusVisible.value;
    }

    function setLargeText(enabled: boolean): void {
      largeText.value = enabled;
    }

    function toggleLargeText(): void {
      largeText.value = !largeText.value;
    }

    function resetSettings(): void {
      speechEnabled.value = true;
      speechRate.value = 'normal';
      speechPitch.value = 1.0;
      speechVolume.value = 1.0;
      highContrastMode.value = 'off';
      reducedMotion.value = false;
      keyboardNavigation.value = true;
      focusVisible.value = true;
      largeText.value = false;
    }

    function applyHighContrastToDocument(): void {
      const html = document.documentElement;
      html.classList.remove('hc-light', 'hc-dark', 'reduced-motion', 'large-text');

      if (highContrastMode.value === 'light') {
        html.classList.add('hc-light');
      } else if (highContrastMode.value === 'dark') {
        html.classList.add('hc-dark');
      }

      if (reducedMotion.value) {
        html.classList.add('reduced-motion');
      }

      if (largeText.value) {
        html.classList.add('large-text');
      }

      if (focusVisible.value) {
        html.classList.add('focus-visible-enabled');
      }
    }

    watch(
      [highContrastMode, reducedMotion, largeText, focusVisible],
      () => {
        applyHighContrastToDocument();
      },
      { immediate: true },
    );

    return {
      speechEnabled,
      speechRate,
      speechPitch,
      speechVolume,
      speechRateValue,
      highContrastMode,
      reducedMotion,
      keyboardNavigation,
      focusVisible,
      largeText,
      isHighContrast,
      toggleSpeech,
      setSpeechEnabled,
      setSpeechRate,
      setSpeechPitch,
      setSpeechVolume,
      setHighContrastMode,
      toggleHighContrast,
      setReducedMotion,
      toggleReducedMotion,
      setKeyboardNavigation,
      setFocusVisible,
      toggleFocusVisible,
      setLargeText,
      toggleLargeText,
      resetSettings,
      applyHighContrastToDocument,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-settings',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
