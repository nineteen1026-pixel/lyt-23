<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';
import { useTimerStore } from '@/stores/timer';

const store = useTimerStore();

const visibleAlerts = computed(() => store.pendingAlerts.slice(0, 3));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="store.pendingAlerts.length > 0"
        class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full"
      >
        <TransitionGroup name="alert-slide">
          <div
            v-for="alert in visibleAlerts"
            :key="alert.id"
            class="card-soft p-4 shadow-lg ring-2 ring-matcha-400/50 animate-shake"
          >
            <div class="flex items-start gap-3">
              <div class="text-3xl animate-bounce-soft shrink-0">{{ alert.emoji }}</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-brown-900 mb-0.5">
                  ⏰ {{ alert.label }} 到时啦！
                </div>
                <div class="text-xs text-brown-800/60">
                  {{ Math.floor(alert.durationSeconds / 60) }}分钟计时已完成
                </div>
              </div>
              <button
                class="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-brown-800/50 hover:bg-red-100 hover:text-red-500 transition-all shrink-0"
                @click="store.dismissAlert(alert.id)"
              >
                <X :size="14" />
              </button>
            </div>

            <div class="flex gap-2 mt-3">
              <button
                class="btn-primary !py-1.5 !px-3 text-xs flex-1"
                @click="store.dismissAlert(alert.id); store.resetTimer(alert.id)"
              >
                ✅ 知道了
              </button>
              <button
                class="btn-secondary !py-1.5 !px-3 text-xs"
                @click="store.dismissAlert(alert.id); store.startTimer(alert.id)"
              >
                🔄 再计一次
              </button>
            </div>
          </div>
        </TransitionGroup>

        <div
          v-if="store.pendingAlerts.length > 3"
          class="text-center text-xs text-brown-800/50"
        >
          还有 {{ store.pendingAlerts.length - 3 }} 个提醒...
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.alert-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.alert-slide-leave-active {
  transition: all 0.3s ease-in;
}
.alert-slide-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}
.alert-slide-leave-to {
  transform: translateX(80px) scale(0.8);
  opacity: 0;
}
</style>
