import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  emoji?: string;
  duration: number;
}

let toastIdCounter = 0;

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([]);

  function show(message: string, type: ToastType = 'info', emoji?: string, duration = 2500) {
    const id = `toast_${++toastIdCounter}_${Date.now()}`;
    const toast: ToastItem = { id, message, type, emoji, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }

  function success(message: string, emoji = '✅', duration?: number) {
    return show(message, 'success', emoji, duration);
  }

  function error(message: string, emoji = '❌', duration?: number) {
    return show(message, 'error', emoji, duration);
  }

  function info(message: string, emoji?: string, duration?: number) {
    return show(message, 'info', emoji, duration);
  }

  function dismiss(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx >= 0) {
      toasts.value.splice(idx, 1);
    }
  }

  function clear() {
    toasts.value = [];
  }

  return { toasts, show, success, error, info, dismiss, clear };
});
