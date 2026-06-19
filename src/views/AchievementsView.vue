<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, ChefHat, Sparkles, Target, Award } from 'lucide-vue-next';
import CheckInCalendar from '@/components/achievements/CheckInCalendar.vue';
import UnlockProgress from '@/components/achievements/UnlockProgress.vue';
import DecorationGrid from '@/components/achievements/DecorationGrid.vue';
import ApronSelector from '@/components/achievements/ApronSelector.vue';
import ThemeSelector from '@/components/achievements/ThemeSelector.vue';
import ChallengeList from '@/components/challenges/ChallengeList.vue';
import { useCookingStore } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { challenges } from '@/data/challenges';
import { computed, onMounted } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';

const router = useRouter();
const store = useCookingStore();
const challengesStore = useChallengesStore();
const onboardingStore = useOnboardingStore();

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
      </div>
    </header>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.05s" data-onboarding="calendar">
      <h2 class="text-display text-xl text-brown-900 mb-4">📅 打卡日历</h2>
      <CheckInCalendar />
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
</template>
