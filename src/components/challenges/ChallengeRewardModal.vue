<script setup lang="ts">
import type { ChallengeBadge } from '@/data/challenges';

defineProps<{
  badges: ChallengeBadge[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
      @click="emit('close')"
    />

    <div class="relative w-full max-w-md animate-pop-in">
      <div class="card-soft overflow-hidden">
        <div class="relative p-7 pb-5">
          <span
            class="particle animate-float"
            style="top: 10%; left: 10%; font-size: 1.2rem; animation-delay: 0s;"
          >🎊</span>
          <span
            class="particle animate-float"
            style="top: 6%; right: 14%; font-size: 1rem; animation-delay: 0.5s;"
          >🎉</span>
          <span
            class="particle animate-float"
            style="top: 16%; left: 22%; font-size: 0.9rem; animation-delay: 1s;"
          >✨</span>
          <span
            class="particle animate-float"
            style="top: 12%; right: 26%; font-size: 0.8rem; animation-delay: 0.3s;"
          >🌟</span>
          <span
            class="particle animate-float"
            style="top: 4%; left: 46%; font-size: 1rem; animation-delay: 0.8s;"
          >🎈</span>

          <div class="text-center relative z-10 mb-6">
            <h2 class="text-display text-3xl text-brown-900 mb-1 text-shadow-soft">
              🏆 挑战完成！
            </h2>
            <p class="text-brown-800/70 text-sm">
              恭喜你获得了新的徽章～
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div
              v-for="(badge, index) in badges"
              :key="badge.id"
              class="card-soft p-4 flex flex-col items-center gap-2 animate-pop-in hover:-translate-y-1 hover:shadow-card transition-all duration-300"
              :class="getDelayClass(index)"
            >
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner"
                style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
              >
                {{ badge.emoji }}
              </div>

              <div class="text-center">
                <span class="inline-block text-xs px-2 py-0.5 rounded-full mb-1 bg-apricot-400/30 text-apricot-600">
                  徽章
                </span>
                <h4 class="text-display text-brown-900 text-sm leading-tight mb-1">
                  {{ badge.name }}
                </h4>
                <p class="text-xs text-brown-800/50 leading-tight">
                  {{ badge.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-7 pb-7">
          <button
            class="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            style="background: linear-gradient(135deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%); box-shadow: 0 6px 0 rgba(245, 124, 46, 0.4);"
            @click="emit('close')"
          >
            <span>太棒了！继续加油</span>
            <span>💪</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
