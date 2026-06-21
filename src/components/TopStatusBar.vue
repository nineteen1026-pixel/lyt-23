<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarCheck, Flame, Award, User, BarChart3, Timer, Share2 } from 'lucide-vue-next';
import { useCookingStore } from '@/stores/cooking';
import { useProfileStore } from '@/stores/profile';
import { useTimerStore } from '@/stores/timer';
import { unlocks } from '@/data/unlocks';

const emit = defineEmits<{
  (e: 'share'): void;
}>();

const store = useCookingStore();
const profileStore = useProfileStore();
const timerStore = useTimerStore();
const router = useRouter();

const activeApronData = computed(() =>
  unlocks.aprons.find((a) => a.id === store.activeApron) ?? unlocks.aprons[0],
);

const profileSummary = computed(() => {
  const parts: string[] = [];
  if (profileStore.allergens.length > 0) {
    parts.push(`${profileStore.allergens.length} 项过敏源`);
  }
  const pref = profileStore.tastePreference;
  const isDefault =
    pref.spicy === 'none' && pref.salt === 'normal' && pref.sweet === 'normal' && pref.oil === 'normal';
  if (!isDefault || profileStore.allergens.length === 0) {
    parts.push('已设置口味');
  }
  if (parts.length === 0) return '点击设置';
  return parts.join(' · ');
});

function getApronBackground(color: string, stripe: string | null): string {
  switch (stripe) {
    case 'gingham':
      return `repeating-linear-gradient(45deg, ${color}, ${color} 6px, #FFF8F0 6px, #FFF8F0 12px)`;
    case 'stripe':
      return `repeating-linear-gradient(90deg, ${color}, ${color} 8px, #FFF8F0 8px, #FFF8F0 16px)`;
    case 'denim':
      return `linear-gradient(135deg, ${color}, #5A7A96)`;
    case 'cherry':
      return `radial-gradient(circle at 20% 30%, ${color} 4px, transparent 5px), radial-gradient(circle at 70% 60%, ${color} 4px, transparent 5px), #FFF8F0`;
    case 'rainbow':
      return 'linear-gradient(135deg, #FF6B6B, #FFA07A, #FFD93D, #A7C957, #6BCB77, #4D96FF, #9B59B6)';
    default:
      return color;
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-8 animate-fade-slide">
    <div class="flex items-center gap-3 card-soft px-5 py-3">
      <div class="flex items-center gap-2 pr-3 border-r border-cream-300">
        <div class="w-9 h-9 rounded-full bg-apricot-500/15 flex items-center justify-center text-apricot-500">
          <CalendarCheck :size="18" :stroke-width="2.2" />
        </div>
        <div>
          <div class="text-[11px] text-brown-800/60 leading-none">累计打卡</div>
          <div class="text-display text-2xl text-apricot-600 leading-tight">{{ store.totalDays }}<span class="text-sm ml-0.5">天</span></div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-full bg-matcha-500/15 flex items-center justify-center">
          <span v-if="store.streakDays > 0" class="flame-icon text-lg">🔥</span>
          <Flame v-else :size="18" :stroke-width="2.2" class="text-matcha-600" />
        </div>
        <div>
          <div class="text-[11px] text-brown-800/60 leading-none">连续打卡</div>
          <div class="text-display text-2xl leading-tight" :class="store.streakDays > 0 ? 'text-apricot-600' : 'text-matcha-600'">{{ store.streakDays }}<span class="text-sm ml-0.5">天</span></div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-2 card-soft px-4 py-3 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/profile')"
      >
        <div class="w-10 h-10 rounded-full bg-apricot-500/15 flex items-center justify-center text-apricot-500">
          <User :size="18" :stroke-width="2.2" />
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-brown-800 leading-none">饮食档案</div>
          <div class="text-[11px] text-brown-800/60 mt-1">{{ profileSummary }}</div>
        </div>
      </button>

      <button
        class="flex items-center gap-2 card-soft px-4 py-3 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/stats')"
      >
        <div class="w-10 h-10 rounded-full bg-matcha-500/15 flex items-center justify-center text-matcha-600">
          <BarChart3 :size="18" :stroke-width="2.2" />
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-brown-800 leading-none">烹饪统计</div>
          <div class="text-[11px] text-brown-800/60 mt-1">{{ store.cookingHistory.length }} 次记录</div>
        </div>
      </button>

      <button
        class="flex items-center gap-2 card-soft px-4 py-3 hover:shadow-soft transition-all active:scale-95 relative"
        @click="router.push('/timer')"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="timerStore.hasRunningTimers ? 'bg-apricot-500/15 text-apricot-500' : 'bg-cream-200 text-brown-800/40'"
        >
          <Timer :size="18" :stroke-width="2.2" />
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-brown-800 leading-none">厨房计时</div>
          <div class="text-[11px] text-brown-800/60 mt-1">
            {{ timerStore.activeTimerCount > 0 ? `${timerStore.activeTimerCount} 个运行中` : '点击管理' }}
          </div>
        </div>
        <span
          v-if="timerStore.hasRunningTimers"
          class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-apricot-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse"
        >
          {{ timerStore.activeTimerCount }}
        </span>
      </button>

      <button
        class="flex items-center gap-2 card-soft px-4 py-3 hover:shadow-soft transition-all active:scale-95"
        @click="emit('share')"
      >
        <div class="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500">
          <Share2 :size="18" :stroke-width="2.2" />
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-brown-800 leading-none">分享打卡</div>
          <div class="text-[11px] text-brown-800/60 mt-1">邀请好友</div>
        </div>
      </button>

      <button
        class="flex items-center gap-2 card-soft px-5 py-3 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/achievements')"
      >
        <div
          class="w-10 h-10 rounded-full border-2 border-cream-300 flex items-end justify-center overflow-hidden"
          :style="{ background: '#FFE8D6' }"
        >
          <div
            class="w-[80%] h-[65%] rounded-t-lg"
            :style="{ background: getApronBackground(activeApronData.color, activeApronData.stripe) }"
          />
        </div>
        <div class="text-left">
          <div class="text-sm font-medium text-brown-800 leading-none">成就 & 换装</div>
          <div class="text-[11px] text-brown-800/60 mt-1 flex items-center gap-1">
            <Award :size="12" />
            <span>{{ store.unlockedDecorations.length + store.unlockedAprons.length }} 已解锁</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.flame-icon {
  display: inline-block;
  animation: flame-flicker 0.6s ease-in-out infinite alternate,
             flame-glow 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgba(255, 140, 66, 0.6));
  transform-origin: center bottom;
}

@keyframes flame-flicker {
  0% {
    transform: scale(1) rotate(-2deg);
  }
  25% {
    transform: scale(1.05) rotate(1deg);
  }
  50% {
    transform: scale(0.98) rotate(-1deg);
  }
  75% {
    transform: scale(1.02) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes flame-glow {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(255, 140, 66, 0.6))
            drop-shadow(0 0 8px rgba(255, 107, 53, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 140, 66, 0.8))
            drop-shadow(0 0 16px rgba(255, 107, 53, 0.5));
  }
}
</style>
