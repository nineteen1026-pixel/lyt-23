import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type SpeechRate = 'slow' | 'normal' | 'fast';

export const SPEECH_RATE_OPTIONS: { value: SpeechRate; label: string; rate: number }[] = [
  { value: 'slow', label: '慢速', rate: 0.7 },
  { value: 'normal', label: '正常', rate: 1.0 },
  { value: 'fast', label: '快速', rate: 1.3 },
];

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const speechEnabled = ref(true);
    const speechRate = ref<SpeechRate>('normal');
    const speechPitch = ref(1.0);
    const speechVolume = ref(1.0);

    const speechRateValue = computed(() => {
      const option = SPEECH_RATE_OPTIONS.find((o) => o.value === speechRate.value);
      return option ? option.rate : 1.0;
    });

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

    function resetSettings(): void {
      speechEnabled.value = true;
      speechRate.value = 'normal';
      speechPitch.value = 1.0;
      speechVolume.value = 1.0;
    }

    return {
      speechEnabled,
      speechRate,
      speechPitch,
      speechVolume,
      speechRateValue,
      toggleSpeech,
      setSpeechEnabled,
      setSpeechRate,
      setSpeechPitch,
      setSpeechVolume,
      resetSettings,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-settings',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
