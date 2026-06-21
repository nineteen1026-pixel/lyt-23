import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';

export function useKeyboardNavigation(
  onAction?: () => void,
  onNext?: () => void,
  onPrev?: () => void,
) {
  const settingsStore = useSettingsStore();
  const isFocused = ref(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!settingsStore.keyboardNavigation) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onAction?.();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        onNext?.();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        onPrev?.();
        break;
    }
  };

  const handleFocus = () => {
    isFocused.value = true;
  };

  const handleBlur = () => {
    isFocused.value = false;
  };

  return {
    isFocused,
    handleKeyDown,
    handleFocus,
    handleBlur,
  };
}

export function useAccessibleButton(
  action: () => void,
  label: string,
  disabled?: () => boolean,
) {
  const settingsStore = useSettingsStore();

  const isDisabled = computed(() => disabled?.() ?? false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) return;
    if (!settingsStore.keyboardNavigation) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleClick = () => {
    if (isDisabled.value) return;
    action();
  };

  const buttonProps = computed(() => ({
    role: 'button',
    tabindex: isDisabled.value ? -1 : 0,
    'aria-label': label,
    'aria-disabled': isDisabled.value,
    class: {
      'cursor-pointer': !isDisabled.value,
      'cursor-not-allowed opacity-50': isDisabled.value,
    },
    onKeydown: handleKeyDown,
    onClick: handleClick,
  }));

  return {
    isDisabled,
    buttonProps,
    handleKeyDown,
    handleClick,
  };
}

export function useStepKeyboard(
  currentIndex: number,
  totalSteps: number,
  onStepChange: (index: number) => void,
  onActivate?: () => void,
) {
  const settingsStore = useSettingsStore();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!settingsStore.keyboardNavigation) return;

    switch (event.key) {
      case 'Home':
        event.preventDefault();
        onStepChange(0);
        break;
      case 'End':
        event.preventDefault();
        onStepChange(totalSteps - 1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < totalSteps - 1) {
          onStepChange(currentIndex + 1);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          onStepChange(currentIndex - 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onActivate?.();
        break;
    }
  };

  return {
    handleKeyDown,
  };
}

export function useReducedMotion() {
  const settingsStore = useSettingsStore();

  const motionSafe = computed(() => !settingsStore.reducedMotion);
  const motionReduce = computed(() => settingsStore.reducedMotion);

  return {
    motionSafe,
    motionReduce,
  };
}

export function useHighContrast() {
  const settingsStore = useSettingsStore();

  const isHighContrast = computed(() => settingsStore.isHighContrast);
  const isHighContrastLight = computed(() => settingsStore.highContrastMode === 'light');
  const isHighContrastDark = computed(() => settingsStore.highContrastMode === 'dark');
  const contrastMode = computed(() => settingsStore.highContrastMode);

  return {
    isHighContrast,
    isHighContrastLight,
    isHighContrastDark,
    contrastMode,
  };
}

export function useKeyboardEnabled() {
  const settingsStore = useSettingsStore();

  const keyboardEnabled = computed(() => settingsStore.keyboardNavigation);

  const ifKeyboardEnabled = (handler: (e: KeyboardEvent) => void) => {
    return (event: KeyboardEvent) => {
      if (!settingsStore.keyboardNavigation) return;
      handler(event);
    };
  };

  return {
    keyboardEnabled,
    ifKeyboardEnabled,
  };
}

let skipLinkShown = false;

export function useSkipLink(targetId: string) {
  const showSkipLink = ref(false);

  const handleFocus = () => {
    showSkipLink.value = true;
  };

  const handleBlur = () => {
    showSkipLink.value = false;
  };

  const skipToContent = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    showSkipLink,
    handleFocus,
    handleBlur,
    skipToContent,
  };
}

export function useLiveRegion() {
  const liveRegionRef = ref<HTMLDivElement | null>(null);
  const message = ref('');

  const announce = (msg: string, politeness: 'polite' | 'assertive' = 'polite') => {
    message.value = msg;
    if (liveRegionRef.value) {
      liveRegionRef.value.setAttribute('aria-live', politeness);
      liveRegionRef.value.textContent = msg;
    }
  };

  const clear = () => {
    message.value = '';
    if (liveRegionRef.value) {
      liveRegionRef.value.textContent = '';
    }
  };

  return {
    liveRegionRef,
    message,
    announce,
    clear,
  };
}

export function useFocusTrap(containerRef: { value: HTMLElement | null }) {
  const settingsStore = useSettingsStore();

  const getFocusableElements = () => {
    if (!containerRef.value) return [];
    return Array.from(
      containerRef.value.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!settingsStore.keyboardNavigation) return;
    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return {
    handleKeyDown,
    getFocusableElements,
  };
}
