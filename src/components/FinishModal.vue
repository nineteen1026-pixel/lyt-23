<script setup lang="ts">
import { ref, computed } from 'vue';
import { Flame } from 'lucide-vue-next';
import NutritionModal from './NutritionModal.vue';
import { useNutrition } from '@/composables/useNutrition';
import type { Dish } from '@/data/dishes';
import type { DishNutrition } from '@/data/nutrition';

const props = defineProps<{
  dishEmoji: string;
  dishName: string;
  isCheckedInToday: boolean;
  canMakeupCheckInYesterday?: boolean;
  protectionCount?: number;
  durationSeconds?: number;
  shareText?: string;
  plateDecorations?: string[];
  dish: Dish;
}>();

const emit = defineEmits<{
  (e: 'checkIn'): void;
  (e: 'makeupCheckIn'): void;
  (e: 'backHome'): void;
  (e: 'cookMore'): void;
  (e: 'writeNote'): void;
}>();

const { calculateDishNutrition, formatNutrientValue } = useNutrition();

const copied = ref(false);
const showNutritionModal = ref(false);

const nutrition = computed<DishNutrition>(() => calculateDishNutrition(props.dish));

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} 分 ${s} 秒` : `${m} 分钟`;
}

async function handleCopy() {
  const text = props.shareText ?? `${props.dishEmoji} 今天做了一道「${props.dishName}」！`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
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
            <p class="text-display text-xl text-apricot-600 mb-4">
              完成啦！🍽️
            </p>

            <div
              v-if="plateDecorations && plateDecorations.length > 0"
              class="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-matcha-50 to-cream-50 border border-matcha-200 animate-fade-slide"
            >
              <span class="text-xs text-matcha-700 font-medium">盛盘装饰</span>
              <div class="flex items-center gap-1">
                <span
                  v-for="(deco, i) in plateDecorations"
                  :key="'finish-deco-' + i"
                  class="text-lg animate-pop-in"
                  :style="{ animationDelay: `${i * 0.1}s` }"
                >
                  {{ deco }}
                </span>
              </div>
            </div>

            <div
              v-if="durationSeconds != null && durationSeconds > 0"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100 border border-cream-200 mb-3"
            >
              <span class="text-sm">⏱️</span>
              <span class="text-sm font-medium text-brown-800">本次用时 {{ formatDuration(durationSeconds) }}</span>
            </div>

            <div
              class="flex items-center justify-center gap-4 mb-4 animate-fade-slide"
              style="animation-delay: 0.2s"
            >
              <button
                class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-apricot-50 to-amber-50 border border-apricot-200 hover:shadow-soft transition-all active:scale-[0.98]"
                @click="showNutritionModal = true"
              >
                <Flame :size="18" class="text-apricot-500" />
                <span class="text-sm font-medium text-apricot-600">
                  约 {{ nutrition.totalCalories }} 千卡
                </span>
                <span class="text-xs text-brown-800/50">
                  蛋白{{ formatNutrientValue(nutrition.totalProtein) }}g · 碳水{{ formatNutrientValue(nutrition.totalCarbs) }}g · 脂肪{{ formatNutrientValue(nutrition.totalFat) }}g
                </span>
              </button>
            </div>

            <div class="mb-6 space-y-2">
              <div
                v-if="isCheckedInToday"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream-200 text-brown-800/60 font-medium border border-cream-300"
              >
                <span>✓</span>
                <span>今日已打卡</span>
              </div>
              <button
                v-else
                class="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isCheckedInToday"
                style="background: linear-gradient(135deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%); box-shadow: 0 6px 0 rgba(245, 124, 46, 0.4);"
                @click="emit('checkIn')"
              >
                📅 立即打卡！
              </button>

              <button
                v-if="canMakeupCheckInYesterday"
                class="w-full py-3 rounded-2xl text-sm font-medium shadow-md active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                style="background: linear-gradient(135deg, #A7C957 0%, #6BCB77 100%); color: white; box-shadow: 0 4px 0 rgba(107, 203, 119, 0.4);"
                @click="emit('makeupCheckIn')"
              >
                <span>🛡️</span>
                <span>补签昨日（消耗 1 次保护）</span>
                <span class="text-xs bg-white/25 px-2 py-0.5 rounded-full">
                  剩余 {{ protectionCount }} 次
                </span>
              </button>
              <div
                v-else-if="protectionCount != null && protectionCount <= 0"
                class="text-xs text-brown-800/50 text-center flex items-center justify-center gap-1"
              >
                <span>🛡️</span>
                <span>保护次数已用完</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-8 pb-3">
          <button
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-cream-50 border-2 border-amber-300 text-amber-700 font-medium text-sm hover:shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            @click="handleCopy"
          >
            <span>{{ copied ? '✅' : '🔗' }}</span>
            <span>{{ copied ? '已复制分享文案' : '复制分享文案' }}</span>
          </button>
        </div>

        <div class="px-8 pb-3">
          <button
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-matcha-50 to-cream-50 border-2 border-matcha-300 text-matcha-700 font-medium text-sm hover:shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            @click="emit('writeNote')"
          >
            <span>📝</span>
            <span>写改良心得</span>
          </button>
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

    <NutritionModal
      :show="showNutritionModal"
      :dish-name="dishName"
      :dish-emoji="dishEmoji"
      :nutrition="nutrition"
      @close="showNutritionModal = false"
    />
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
