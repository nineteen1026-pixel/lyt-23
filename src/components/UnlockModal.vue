<script setup lang="ts">
interface UnlockItem {
  type: 'decoration' | 'apron';
  name: string;
  emoji?: string;
  color?: string;
  stripe?: string | null;
}

defineProps<{
  newItems: UnlockItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}

function getApronStyle(item: UnlockItem) {
  const color = item.color || '#FFF8F0';
  const stripe = item.stripe;

  if (!stripe) {
    return { background: color };
  }

  switch (stripe) {
    case 'gingham':
      return {
        background: `
          linear-gradient(45deg, ${color} 25%, transparent 25%),
          linear-gradient(-45deg, ${color} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${color} 75%),
          linear-gradient(-45deg, transparent 75%, ${color} 75%),
          #FFF8F0
        `,
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
      };
    case 'stripe':
      return {
        background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 10px, #FFF8F0 10px, #FFF8F0 20px)`,
      };
    case 'denim':
      return {
        background: `
          linear-gradient(135deg, #6B8EAE 25%, #5A7D9C 25%, #5A7D9C 50%, #6B8EAE 50%, #6B8EAE 75%, #5A7D9C 75%)
        `,
        backgroundSize: '8px 8px',
      };
    case 'cherry':
      return {
        background: `
          radial-gradient(circle at 30% 30%, #E63946 2px, transparent 3px),
          radial-gradient(circle at 70% 70%, #E63946 2px, transparent 3px),
          #FFF8F0
        `,
        backgroundSize: '20px 20px',
      };
    case 'rainbow':
      return {
        background: `linear-gradient(135deg, #FF6B6B 0%, #FFE66D 20%, #A7C957 40%, #4ECDC4 60%, #6B8EAE 80%, #DDA0DD 100%)`,
      };
    default:
      return { background: color };
  }
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
              🎉 解锁新奖励！
            </h2>
            <p class="text-brown-800/70 text-sm">
              继续加油，收集更多可爱装饰～
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div
              v-for="(item, index) in newItems"
              :key="index"
              class="card-soft p-4 flex flex-col items-center gap-2 animate-pop-in hover:-translate-y-1 hover:shadow-card transition-all duration-300"
              :class="getDelayClass(index)"
            >
              <div
                v-if="item.type === 'decoration'"
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
              >
                {{ item.emoji }}
              </div>
              <div
                v-else
                class="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-inner border-2 border-white/80"
              >
                <div
                  class="absolute inset-0"
                  :style="getApronStyle(item)"
                />
                <svg
                  class="relative w-10 h-10"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 12 L28 8 L36 8 L44 12 L42 24 L46 32 L46 56 L18 56 L18 32 L22 24 Z"
                    fill="white"
                    fill-opacity="0.35"
                    stroke="white"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M28 8 Q28 4 32 4 Q36 4 36 8"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M20 12 L10 10 M44 12 L54 10"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>

              <div class="text-center">
                <span
                  class="inline-block text-xs px-2 py-0.5 rounded-full mb-1"
                  :class="item.type === 'decoration'
                    ? 'bg-matcha-400/30 text-matcha-600'
                    : 'bg-apricot-400/30 text-apricot-600'"
                >
                  {{ item.type === 'decoration' ? '装饰' : '围裙' }}
                </span>
                <h4 class="text-display text-brown-900 text-sm leading-tight">
                  {{ item.name }}
                </h4>
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
            <span>太棒了！去看看</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
