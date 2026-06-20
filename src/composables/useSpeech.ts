import { ref, computed, onUnmounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

export function useSpeech() {
  const settingsStore = useSettingsStore();
  const isSpeaking = ref(false);
  const isSupported = ref(typeof window !== 'undefined' && 'speechSynthesis' in window);

  let currentUtterance: SpeechSynthesisUtterance | null = null;

  const canSpeak = computed(() => isSupported.value && settingsStore.speechEnabled);

  function speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): void {
    if (!isSupported.value || !settingsStore.speechEnabled || !text.trim()) {
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = options?.rate ?? settingsStore.speechRateValue;
    utterance.pitch = options?.pitch ?? settingsStore.speechPitch;
    utterance.volume = options?.volume ?? settingsStore.speechVolume;

    utterance.onstart = () => {
      isSpeaking.value = true;
    };

    utterance.onend = () => {
      isSpeaking.value = false;
      currentUtterance = null;
    };

    utterance.onerror = () => {
      isSpeaking.value = false;
      currentUtterance = null;
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stop(): void {
    if (!isSupported.value) return;
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
    currentUtterance = null;
  }

  function pause(): void {
    if (!isSupported.value) return;
    window.speechSynthesis.pause();
    isSpeaking.value = false;
  }

  function resume(): void {
    if (!isSupported.value) return;
    window.speechSynthesis.resume();
    isSpeaking.value = true;
  }

  function speakStep(stepIndex: number, dishName?: string): void {
    const stepTexts = [
      dishName ? `第一步，清洗食材。一起来洗干净${dishName}吧！` : '第一步，清洗食材。',
      '第二步，切菜环节。把食材切好备用。',
      '第三步，调味环节。根据口味添加适量调味料。',
      '第四步，烹饪环节。耐心等待美食出炉。',
    ];
    const text = stepTexts[stepIndex] || '';
    if (text) {
      speak(text);
    }
  }

  onUnmounted(() => {
    stop();
  });

  return {
    isSpeaking,
    isSupported,
    canSpeak,
    speak,
    stop,
    pause,
    resume,
    speakStep,
  };
}
