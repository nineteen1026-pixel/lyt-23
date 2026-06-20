<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, ChefHat, Sparkles, Target, Award, Flame, Beef, Wheat, Droplet, TrendingUp, Calendar, CalendarRange, BarChart3, Share2 } from 'lucide-vue-next';
import CheckInCalendar from '@/components/achievements/CheckInCalendar.vue';
import UnlockProgress from '@/components/achievements/UnlockProgress.vue';
import DecorationGrid from '@/components/achievements/DecorationGrid.vue';
import ApronSelector from '@/components/achievements/ApronSelector.vue';
import ThemeSelector from '@/components/achievements/ThemeSelector.vue';
import ChallengeList from '@/components/challenges/ChallengeList.vue';
import ShareInviteModal from '@/components/share/ShareInviteModal.vue';
import { useCookingStore } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { challenges } from '@/data/challenges';
import type { ShareCardData } from '@/data/share';
import { computed, onMounted, ref } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { useNutrition } from '@/composables/useNutrition';

const router = useRouter();
const store = useCookingStore();
const challengesStore = useChallengesStore();
const onboardingStore = useOnboardingStore();
const showShareModal = ref(false);
const { formatNutrientValue } = useNutrition();

type NutritionPeriod = 'today' | 'week' | 'month' | 'total';
const activeNutritionPeriod = ref<NutritionPeriod>('week');

const currentNutrition = computed(() => {
  switch (activeNutritionPeriod.value) {
    case 'today':
      return store.todayNutrition;
    case 'week':
      return store.weekNutrition;
    case 'month':
      return store.monthNutrition;
    case 'total':
      return store.totalNutrition;
    default:
      return store.weekNutrition;
  }
});

const nutritionPeriods: { key: NutritionPeriod; label: string; icon: any }[] = [
  { key: 'today', label: '今日', icon: Calendar },
  { key: 'week', label: '本周', icon: CalendarRange },
  { key: 'month', label: '本月', icon: BarChart3 },
  { key: 'total', label: '累计', icon: TrendingUp },
];

onMounted(() => {
  if (!onboardingStore.isCompleted) {
    setTimeout(() => {
      onboardingStore.startFlow('achievements');
    }, 500);
  }
});

const unlockedBadgeDetails = computed(() => {
  return challenges
    .filter((c) => challengesStore.isBadgeUnlocked(c.badge.id))
    .map((c) => c.badge);
});

const totalBadgeCount = computed(() => challenges.length);

function handleStartChallenge(challengeId: string) {
  challengesStore.startChallenge(challengeId);
}
</script>

<template>
  <div class="container max-w-4xl mx-auto px-4 pt-8">
    <header class="mb-8 animate-fade-slide">
      <button
        class="flex items-center gap-2 card-soft px-4 py-2.5 mb-6 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/')"
      >
        <ArrowLeft :size="18" class="text-brown-800/70" />
        <span class="text-sm text-brown-800/80 font-medium">回到厨房</span>
      </button>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-display text-4xl text-brown-900 flex items-center gap-2">
            <ChefHat class="text-apricot-500" :size="36" />
            我的成就
          </h1>
          <p class="text-sm text-brown-800/70 mt-2">
            每一次打卡都是对生活的认真 ✿ 继续解锁更可爱的厨房吧！
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div
            v-if="store.totalDays > 0"
            class="card-soft px-5 py-3 flex items-center gap-3 animate-float"
          >
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-apricot-400 to-apricot-600 flex items-center justify-center shadow-soft">
              <Sparkles :size="22" class="text-white" />
            </div>
            <div>
              <div class="text-[11px] text-brown-800/60 leading-none">厨房等级</div>
              <div class="text-display text-2xl text-apricot-600 leading-tight">
                Lv.{{ Math.floor(store.totalDays / 10) + 1 }}
              </div>
            </div>
          </div>
          <button
            class="card-soft px-4 py-3 hover:shadow-soft transition-all active:scale-95 flex items-center gap-2"
            @click="showShareModal = true"
          >
            <div class="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500">
              <Share2 :size="18" :stroke-width="2.2" />
            </div>
            <span class="text-sm font-medium text-brown-800">分享成就</span>
          </button>
        </div>
      </div>
    </header>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.05s" data-onboarding="calendar">
      <h2 class="text-display text-xl text-brown-900 mb-4">📅 打卡日历</h2>
      <CheckInCalendar />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.07s">
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-display text-xl text-brown-900 flex items-center gap-2">
            <Flame :size="20" class="text-apricot-500" />
            营养统计
          </h2>
          <p class="text-xs text-brown-800/60 mt-1">追踪你的饮食营养摄入情况</p>
        </div>
      </div>

      <div class="card-soft p-5">
        <div class="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
          <button
            v-for="period in nutritionPeriods"
            :key="period.key"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
            :class="activeNutritionPeriod === period.key
              ? 'bg-gradient-to-r from-apricot-500 to-apricot-600 text-white shadow-soft'
              : 'bg-cream-50 text-brown-700 hover:bg-cream-100'"
            @click="activeNutritionPeriod = period.key"
          >
            <component :is="period.icon" :size="16" />
            <span>{{ period.label }}</span>
          </button>
        </div>

        <div class="bg-gradient-to-br from-apricot-50 to-amber-50 rounded-2xl p-5 mb-5 border border-apricot-100">
          <div class="flex items-center justify-center gap-3">
            <Flame :size="28" class="text-apricot-500" />
            <span class="text-display text-5xl text-apricot-600 font-bold">
              {{ currentNutrition.calories }}
            </span>
            <span class="text-lg text-brown-800/60">千卡</span>
          </div>
          <p class="text-center text-sm text-brown-800/60 mt-2">
            {{ activeNutritionPeriod === 'today' ? '今日' : activeNutritionPeriod === 'week' ? '本周' : activeNutritionPeriod === 'month' ? '本月' : '累计' }}总热量摄入
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-5">
          <div class="text-center p-4 rounded-2xl bg-rose-50 border border-rose-100">
            <Beef :size="22" class="mx-auto text-rose-500 mb-2" />
            <div class="text-display text-3xl text-rose-600 font-bold">
              {{ formatNutrientValue(currentNutrition.protein) }}
            </div>
            <div class="text-xs text-brown-800/60 mt-1">蛋白质 (g)</div>
          </div>
          <div class="text-center p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <Wheat :size="22" class="mx-auto text-amber-500 mb-2" />
            <div class="text-display text-3xl text-amber-600 font-bold">
              {{ formatNutrientValue(currentNutrition.carbs) }}
            </div>
            <div class="text-xs text-brown-800/60 mt-1">碳水 (g)</div>
          </div>
          <div class="text-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <Droplet :size="22" class="mx-auto text-blue-500 mb-2" />
            <div class="text-display text-3xl text-blue-600 font-bold">
              {{ formatNutrientValue(currentNutrition.fat) }}
            </div>
            <div class="text-xs text-brown-800/60 mt-1">脂肪 (g)</div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-brown-800 mb-3">宏量营养素占比</h4>
          <div class="h-4 rounded-full bg-cream-200 overflow-hidden flex">
            <div
              class="h-full bg-rose-400 transition-all duration-500"
              :style="{ width: `${currentNutrition.calories > 0 ? Math.round((currentNutrition.protein * 4 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0}%` }"
            />
            <div
              class="h-full bg-amber-400 transition-all duration-500"
              :style="{ width: `${currentNutrition.calories > 0 ? Math.round((currentNutrition.carbs * 4 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0}%` }"
            />
            <div
              class="h-full bg-blue-400 transition-all duration-500"
              :style="{ width: `${currentNutrition.calories > 0 ? Math.round((currentNutrition.fat * 9 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0}%` }"
            />
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <span class="text-rose-500">
              蛋白质 {{ currentNutrition.calories > 0 ? Math.round((currentNutrition.protein * 4 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0 }}%
            </span>
            <span class="text-amber-500">
              碳水 {{ currentNutrition.calories > 0 ? Math.round((currentNutrition.carbs * 4 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0 }}%
            </span>
            <span class="text-blue-500">
              脂肪 {{ currentNutrition.calories > 0 ? Math.round((currentNutrition.fat * 9 / (currentNutrition.protein * 4 + currentNutrition.carbs * 4 + currentNutrition.fat * 9)) * 100) : 0 }}%
            </span>
          </div>
        </div>

        <div v-if="currentNutrition.calories === 0" class="text-center py-6 text-brown-800/50">
          <div class="text-4xl mb-2">🍽️</div>
          <p class="text-sm">还没有营养数据，快去做道菜吧～</p>
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.08s" data-onboarding="badges">
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-display text-xl text-brown-900 flex items-center gap-2">
            <Award :size="20" class="text-apricot-500" />
            我的徽章
          </h2>
          <p class="text-xs text-brown-800/60 mt-1">完成挑战任务解锁专属徽章</p>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-apricot-500">{{ unlockedBadgeDetails.length }}</span>
          <span class="text-brown-800/50">/</span>
          <span class="text-lg text-brown-800/70">{{ totalBadgeCount }}</span>
        </div>
      </div>

      <div v-if="unlockedBadgeDetails.length === 0" class="card-soft p-6 text-center">
        <div class="text-5xl mb-3">🏅</div>
        <h4 class="text-display text-brown-900 mb-1">暂无徽章</h4>
        <p class="text-sm text-brown-800/60">去下方挑战任务中赢取你的第一枚徽章吧～</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div
          v-for="badge in unlockedBadgeDetails"
          :key="badge.id"
          class="card-soft p-4 flex flex-col items-center gap-2 ring-2 ring-matcha-400/40 bg-matcha-400/10 hover:-translate-y-1 hover:shadow-card transition-all duration-300"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
            style="background: linear-gradient(135deg, #E8F5D4, #FFF8F0);"
          >
            {{ badge.emoji }}
          </div>
          <h4 class="text-display text-sm text-brown-900 text-center">{{ badge.name }}</h4>
          <p class="text-xs text-brown-800/50 text-center leading-tight">{{ badge.description }}</p>
        </div>
        <div
          v-for="i in Math.max(0, 4 - (unlockedBadgeDetails.length % 4 === 0 ? 4 : unlockedBadgeDetails.length % 4))"
          :key="`lock-${i}`"
          class="card-soft p-4 flex flex-col items-center gap-2 opacity-50"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
          >
            🔒
          </div>
          <h4 class="text-display text-sm text-brown-800/50 text-center">未解锁</h4>
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.1s">
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-display text-xl text-brown-900 flex items-center gap-2">
            <Target :size="20" class="text-apricot-500" />
            挑战任务
          </h2>
          <p class="text-xs text-brown-800/60 mt-1">在规定周期内完成指定菜品，解锁徽章奖励</p>
        </div>
      </div>
      <ChallengeList @start="handleStartChallenge" />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.2s">
      <h2 class="text-display text-xl text-brown-900 mb-4">🎯 解锁进度</h2>
      <UnlockProgress />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.25s" data-onboarding="decorations">
      <h2 class="text-display text-xl text-brown-900 mb-4">🏠 厨房摆件</h2>
      <DecorationGrid />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.28s">
      <h2 class="text-display text-xl text-brown-900 mb-4">🎨 主题装修</h2>
      <ThemeSelector />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.3s">
      <h2 class="text-display text-xl text-brown-900 mb-4">👩‍🍳 围裙皮肤</h2>
      <ApronSelector />
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-4">
      好好吃饭，慢慢生活 · 累计 {{ store.totalDays }} 天的烟火气 🧡
    </footer>
  </div>

  <Transition name="fade">
    <ShareInviteModal
      v-if="showShareModal"
      @close="showShareModal = false"
      @share="(_data: ShareCardData) => showShareModal = false"
    />
  </Transition>
</template>
