<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import {
  getNextThresholdReward,
  getProgressInfo,
  type NextThresholdReward,
  type PreviewUnlockItem,
} from '@/data/unlocks';

interface UnlockItem {
  type: 'decoration' | 'apron' | 'background' | 'counter';
  name: string;
  emoji?: string;
  color?: string;
  stripe?: string | null;
}

const props = defineProps<{
  newItems: UnlockItem[];
  totalDays: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const showSparkles = ref(true);
const confettiParticles = ref<Array<{ id: number; left: number; delay: number; color: string; rotate: number }>>([]);
const sparklePositions = ref<Array<{ id: number; top: string; left: string; delay: number; emoji: string }>>([]);

const CONFETTI_COLORS = ['#FF8C42', '#FFA66D', '#A7C957', '#BFD87A', '#FFB7C5', '#FFD4B3', '#FFE66D', '#4ECDC4'];
const SPARKLE_EMOJIS = ['✨', '⭐', '💫', '🌟', '✨', '⭐'];

onMounted(() => {
  confettiParticles.value = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
  }));

  sparklePositions.value = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 60 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    delay: Math.random() * 1.2,
    emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
  }));

  setTimeout(() => {
    showSparkles.value = false;
  }, 2500);
});

const nextReward = computed<NextThresholdReward | null>(() => {
  return getNextThresholdReward(props.totalDays);
});

const progressInfo = computed(() => {
  return getProgressInfo(props.totalDays);
});

const visibleThresholds = computed(() => {
  const { thresholds } = progressInfo.value;
  const currentIdx = thresholds.findIndex((t) => t > props.totalDays);
  const startIdx = Math.max(0, currentIdx - 2);
  return thresholds.slice(startIdx, startIdx + 5);
});

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}

function getApronStyle(item: UnlockItem | PreviewUnlockItem) {
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

function getItemTypeLabel(type: string): string {
  switch (type) {
    case 'decoration': return '装饰';
    case 'apron': return '围裙';
    case 'background': return '背景';
    case 'counter': return '台面';
    default: return type;
  }
}

function getThresholdPercent(threshold: number): number {
  return (threshold / progressInfo.value.maxThreshold) * 100;
}

function isCurrentThreshold(threshold: number): boolean {
  return threshold <= props.totalDays && (
    visibleThresholds.value.find((t) => t > threshold) === undefined ||
    visibleThresholds.value.find((t) => t > threshold)! > props.totalDays
  );
}

function getThresholdIcon(threshold: number): string {
  const next = nextReward.value;
  if (next && next.threshold === threshold && next.items.length > 0) {
    return next.items[0].emoji || '🎁';
  }
  if (threshold <= props.totalDays) return '✅';
  return '🔒';
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
    <div
      v-for="p in confettiParticles"
      :key="`confetti-${p.id}`"
      class="unlock-confetti animate-confetti-fall"
      :style="{
        left: `${p.left}%`,
        top: '-20px',
        backgroundColor: p.color,
        animationDelay: `${p.delay}s`,
        transform: `rotate(${p.rotate}deg)`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        width: `${Math.random() * 6 + 6}px`,
        height: `${Math.random() * 6 + 6}px`,
      }"
    />

    <div
      class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
      @click="emit('close')"
    />

    <div class="relative w-full max-w-md animate-pop-in">
      <div
        v-for="s in sparklePositions"
        :key="`sparkle-${s.id}`"
        class="unlock-sparkle text-2xl animate-unlock-sparkle"
        :style="{
          top: s.top,
          left: s.left,
          animationDelay: `${s.delay}s`,
        }"
      >
        {{ s.emoji }}
      </div>

      <div class="unlock-ring w-48 h-48 -top-16 left-1/2 -translate-x-1/2 animate-unlock-burst" />
      <div class="unlock-ring w-40 h-40 -top-12 left-1/2 -translate-x-1/2 animate-unlock-burst" style="animation-delay: 0.15s;" />

      <div class="card-soft overflow-hidden animate-unlock-glow unlock-glow-border">
        <div class="relative p-7 pb-5">
          <span
            class="particle animate-float"
            style="top: 10%; left: 10%; font-size: 1.4rem; animation-delay: 0s;"
          >🎊</span>
          <span
            class="particle animate-float"
            style="top: 6%; right: 14%; font-size: 1.2rem; animation-delay: 0.5s;"
          >🎉</span>
          <span
            class="particle animate-float"
            style="top: 16%; left: 22%; font-size: 1rem; animation-delay: 1s;"
          >✨</span>
          <span
            class="particle animate-float"
            style="top: 12%; right: 26%; font-size: 0.9rem; animation-delay: 0.3s;"
          >🌟</span>
          <span
            class="particle animate-float"
            style="top: 4%; left: 46%; font-size: 1.2rem; animation-delay: 0.8s;"
          >🎈</span>

          <div class="text-center relative z-10 mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 animate-bounce-soft" style="background: linear-gradient(135deg, #FFA66D, #FF8C42);">
              <span class="text-3xl">🏆</span>
            </div>
            <h2 class="text-display text-3xl mb-1 unlock-shine-text">
              🎉 解锁新奖励！
            </h2>
            <p class="text-brown-800/70 text-sm">
              已累计打卡 <span class="font-bold text-apricot-600">{{ totalDays }}</span> 天，继续加油～
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div
              v-for="(item, index) in newItems"
              :key="index"
              class="card-soft p-4 flex flex-col items-center gap-2 animate-unlock-reveal hover:-translate-y-1 hover:shadow-card transition-all duration-300 relative overflow-hidden"
              :class="getDelayClass(index)"
            >
              <div
                v-if="showSparkles"
                class="absolute inset-0 pointer-events-none"
                style="background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%); background-size: 200% 100%; animation: unlockShine 1.5s ease-in-out infinite;"
              />

              <div
                v-if="item.type === 'decoration'"
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl animate-unlock-glow"
                style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
              >
                {{ item.emoji }}
              </div>
              <div
                v-else-if="item.type === 'background'"
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ring-2 ring-white/80 animate-unlock-glow"
                :style="{ background: `linear-gradient(135deg, ${item.color || '#FFE8D6'}, ${item.color || '#FFF8F0'}88)` }"
              >
                {{ item.emoji }}
              </div>
              <div
                v-else-if="item.type === 'counter'"
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ring-2 ring-white/80 animate-unlock-glow"
                :style="{ background: item.color || 'linear-gradient(180deg, #DEB887 0%, #D2B48C 100%)' }"
              >
                {{ item.emoji }}
              </div>
              <div
                v-else
                class="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-inner border-2 border-white/80 animate-unlock-glow"
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
                  :class="{
                    'bg-matcha-400/30 text-matcha-600': item.type === 'decoration',
                    'bg-apricot-400/30 text-apricot-600': item.type === 'apron',
                    'bg-blue-400/30 text-blue-600': item.type === 'background',
                    'bg-purple-400/30 text-purple-600': item.type === 'counter',
                  }"
                >
                  {{ getItemTypeLabel(item.type) }}
                </span>
                <h4 class="text-display text-brown-900 text-sm leading-tight">
                  {{ item.name }}
                </h4>
              </div>
            </div>
          </div>

          <div class="card-soft p-4 mb-5 bg-gradient-to-br from-cream-50 to-cream-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📊</span>
                <span class="text-display text-sm text-brown-900 font-bold">解锁进度</span>
              </div>
              <span class="text-xs text-brown-800/70">第 {{ totalDays }} / {{ progressInfo.maxThreshold }} 天</span>
            </div>

            <div class="relative pt-6 pb-2 px-1">
              <div
                class="absolute left-1 right-1 top-8 h-3 rounded-full a11y-progress-track"
                style="background: #FFE8D6;"
              />
              <div
                class="absolute left-1 top-8 h-3 rounded-full transition-all duration-700 ease-out animate-progress-glow"
                :style="{
                  width: `calc(${progressInfo.overallPercent}% - ${progressInfo.overallPercent > 0 ? '0.25rem' : '0'})`,
                  background: 'linear-gradient(90deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%)',
                }"
              />

              <div
                v-for="threshold in visibleThresholds"
                :key="threshold"
                class="absolute top-4 -translate-x-1/2 flex flex-col items-center"
                :style="{ left: `calc(${(getThresholdPercent(threshold) - getThresholdPercent(visibleThresholds[0])) / (getThresholdPercent(visibleThresholds[visibleThresholds.length - 1]) - getThresholdPercent(visibleThresholds[0])) * 96 + 2}% )` }"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 z-10 border-2"
                  :class="[
                    threshold <= totalDays
                      ? 'bg-apricot-500 border-apricot-400 shadow-md'
                      : nextReward && nextReward.threshold === threshold
                        ? 'bg-cream-100 border-matcha-400 animate-progress-glow progress-dot-pulse'
                        : 'bg-white border-cream-300',
                  ]"
                >
                  <span v-if="threshold <= totalDays">{{ getThresholdIcon(threshold) }}</span>
                  <span v-else-if="nextReward && nextReward.threshold === threshold" class="text-sm">{{ getThresholdIcon(threshold) }}</span>
                  <span v-else class="text-brown-800/40 text-xs">🔒</span>
                </div>
                <span
                  class="mt-1 text-[10px] font-medium whitespace-nowrap"
                  :class="threshold <= totalDays ? 'text-apricot-600' : nextReward && nextReward.threshold === threshold ? 'text-matcha-600 font-bold' : 'text-brown-800/40'"
                >
                  {{ threshold }}天
                </span>
              </div>
            </div>
          </div>

          <div v-if="nextReward && nextReward.items.length > 0" class="mb-2">
            <div class="flex items-center justify-between mb-3 px-1">
              <div class="flex items-center gap-2">
                <span class="text-lg animate-float">🎁</span>
                <span class="text-display text-sm text-brown-900 font-bold">下一档奖励</span>
              </div>
              <span class="chip bg-matcha-400/30 text-matcha-600">
                还差 {{ nextReward.daysRemaining }} 天
              </span>
            </div>

            <div class="mb-3 px-1">
              <div class="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-matcha-400 to-matcha-500 transition-all duration-500"
                  :style="{ width: `${nextReward.progressPercent}%` }"
                />
              </div>
              <div class="text-[11px] text-brown-800/50 mt-1 text-right">
                {{ Math.round(nextReward.progressPercent) }}%
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(item, index) in nextReward.items.slice(0, 4)"
                :key="`next-${item.id}`"
                class="card-soft p-3 flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity"
                :class="getDelayClass(index)"
              >
                <div
                  v-if="item.type === 'decoration'"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 grayscale"
                  style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
                >
                  {{ item.emoji }}
                </div>
                <div
                  v-else-if="item.type === 'background'"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner ring-1 ring-white/60 grayscale"
                  :style="{ background: `linear-gradient(135deg, ${item.color || '#FFE8D6'}, ${item.color || '#FFF8F0'}88)` }"
                >
                  {{ item.emoji }}
                </div>
                <div
                  v-else-if="item.type === 'counter'"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner ring-1 ring-white/60 grayscale"
                  :style="{ background: item.color || 'linear-gradient(180deg, #DEB887 0%, #D2B48C 100%)' }"
                >
                  {{ item.emoji }}
                </div>
                <div
                  v-else
                  class="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-white/60 grayscale"
                >
                  <div
                    class="absolute inset-0"
                    :style="getApronStyle(item)"
                  />
                  <svg
                    class="relative w-6 h-6"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path
                      d="M20 12 L28 8 L36 8 L44 12 L42 24 L46 32 L46 56 L18 56 L18 32 L22 24 Z"
                      fill="white"
                      fill-opacity="0.35"
                      stroke="white"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <span
                    class="inline-block text-[10px] px-1.5 py-0.5 rounded-full mb-0.5"
                    :class="{
                      'bg-matcha-400/20 text-matcha-600': item.type === 'decoration',
                      'bg-apricot-400/20 text-apricot-600': item.type === 'apron',
                      'bg-blue-400/20 text-blue-600': item.type === 'background',
                      'bg-purple-400/20 text-purple-600': item.type === 'counter',
                    }"
                  >
                    {{ getItemTypeLabel(item.type) }}
                  </span>
                  <h5 class="text-display text-brown-900 text-xs leading-tight truncate">
                    {{ item.name }}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="mb-2 px-1">
            <div class="flex items-center gap-2 py-3 px-3 rounded-2xl bg-matcha-400/20">
              <span class="text-xl">🏅</span>
              <div>
                <div class="text-display text-sm text-matcha-600 font-bold">太棒了！已解锁全部奖励！</div>
                <div class="text-xs text-matcha-600/70">你是最棒的烹饪小能手～</div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-7 pb-7">
          <button
            class="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden animate-unlock-glow"
            style="background: linear-gradient(135deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%); box-shadow: 0 6px 0 rgba(245, 124, 46, 0.4);"
            @click="emit('close')"
          >
            <div
              class="absolute inset-0 pointer-events-none"
              style="background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%); background-size: 200% 100%; animation: unlockShine 2s ease-in-out infinite;"
            />
            <span class="relative z-10">太棒了！去看看</span>
            <span class="relative z-10">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
