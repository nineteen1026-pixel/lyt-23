<script setup lang="ts">
import { computed } from 'vue';
import { useToastStore, type ToastType } from '@/stores/toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next';

const store = useToastStore();

function getColorClass(type: ToastType) {
  switch (type) {
    case 'success':
      return 'ring-matcha-400/50 bg-white';
    case 'error':
      return 'ring-rose-400/50 bg-white';
    case 'info':
    default:
      return 'ring-apricot-400/50 bg-white';
  }
}

const IconForType = computed(() => {
  return {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };
});

function getIconClass(type: ToastType) {
  switch (type) {
    case 'success':
      return 'text-matcha-500';
    case 'error':
      return 'text-rose-500';
    case 'info':
    default:
      return 'text-apricot-500';
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="store.toasts.length > 0"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 w-full max-w-xs px-4 pointer-events-none"
      >
        <TransitionGroup name="toast-slide">
          <div
            v-for="toast in store.toasts"
            :key="toast.id"
            class="w-full card-soft px-4 py-3 shadow-lg ring-2 pointer-events-auto"
            :class="getColorClass(toast.type)"
          >
            <div class="flex items-start gap-3">
              <div class="shrink-0 mt-0.5">
                <span v-if="toast.emoji" class="text-xl">{{ toast.emoji }}</span>
                <component v-else :is="IconForType[toast.type]" :size="20" :class="getIconClass(toast.type)" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-brown-900 leading-snug whitespace-pre-wrap break-words">
                  {{ toast.message }}
                </div>
              </div>
              <button
                class="w-6 h-6 rounded-full flex items-center justify-center text-brown-800/40 hover:bg-cream-200 hover:text-brown-800/70 transition-all shrink-0 -mr-1 -mt-1"
                @click="store.dismiss(toast.id)"
              >
                <X :size="14" />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-slide-leave-active {
  transition: all 0.25s ease-in;
}
.toast-slide-enter-from {
  transform: translateY(-16px) scale(0.9);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateY(-10px) scale(0.95);
  opacity: 0;
}
</style>
