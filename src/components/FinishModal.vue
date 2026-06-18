<script setup lang="ts">
defineProps<{
  dishEmoji: string;
  dishName: string;
  isCheckedInToday: boolean;
}>();

const emit = defineEmits<{
  (e: 'checkIn'): void;
  (e: 'backHome'): void;
  (e: 'cookMore'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
      @click="emit('backHome')"
    />

    <div class="relative w-full max-w-sm animate-pop-in">
      <div class="card-soft overflow-hidden">
        <div class="relative p-8 pb-6">
          <span
            class="particle animate-float"
            style="top: 12%; left: 8%; font-size: 1rem; animation-delay: 0s;"
          >⭐</span>
          <span
            class="particle animate-float"
            style="top: 8%; right: 12%; font-size: 0.9rem; animation-delay: 0.4s;"
          >✨</span>
          <span
            class="particle animate-float"
            style="top: 22%; left: 18%; font-size: 0.8rem; animation-delay: 0.8s;"
          >💛</span>
          <span
            class="particle animate-float"
            style="top: 18%; right: 20%; font-size: 1rem; animation-delay: 1.2s;"
          >⭐</span>
          <span
            class="particle animate-float"
            style="top: 6%; left: 42%; font-size: 0.7rem; animation-delay: 0.6s;"
          >✨</span>
          <span
            class="particle animate-float"
            style="bottom: 38%; left: 6%; font-size: 0.9rem; animation-delay: 1s;"
          >💕</span>
          <span
            class="particle animate-float"
            style="bottom: 42%; right: 8%; font-size: 0.8rem; animation-delay: 0.3s;"
          >🌟</span>
          <span
            class="particle animate-float"
            style="bottom: 35%; left: 30%; font-size: 0.7rem; animation-delay: 1.4s;"
          >💫</span>

          <div class="relative flex justify-center mb-6">
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-32 h-32 rounded-full bg-apricot-400/30 animate-breath-ring"
              />
              <div
                class="absolute w-40 h-40 rounded-full bg-apricot-400/15 animate-breath-ring"
                style="animation-delay: 0.6s;"
              />
            </div>
            <div
              class="relative text-8xl drop-shadow-2xl animate-bounce-soft z-10"
              style="animation-duration: 1.2s; animation-iteration-count: infinite;"
            >
              {{ dishEmoji }}
            </div>
          </div>

          <div class="text-center relative z-10">
            <h2 class="text-display text-3xl text-brown-900 mb-2 text-shadow-soft">
              {{ dishName }}
            </h2>
            <p class="text-display text-xl text-apricot-600 mb-6">
              完成啦！🍽️
            </p>

            <div class="mb-6">
              <div
                v-if="isCheckedInToday"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream-200 text-brown-800/60 font-medium border border-cream-300"
              >
                <span>✓</span>
                <span>今日已打卡</span>
              </div>
              <button
                v-else
                class="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:translate-y-0.5 transition-all duration-200"
                style="background: linear-gradient(135deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%); box-shadow: 0 6px 0 rgba(245, 124, 46, 0.4);"
                @click="emit('checkIn')"
              >
                📅 立即打卡！
              </button>
            </div>
          </div>
        </div>

        <div class="px-8 pb-8 flex gap-3">
          <button
            class="flex-1 btn-secondary flex items-center justify-center gap-2"
            @click="emit('backHome')"
          >
            <span>🏠</span>
            <span>回首页</span>
          </button>
          <button
            class="flex-1 btn-primary flex items-center justify-center gap-2"
            @click="emit('cookMore')"
          >
            <span>🍳</span>
            <span>再做一道</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounceSoft {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.03);
  }
}
</style>
