<script setup lang="ts">
import { useRouter } from 'vue-router';
import TopStatusBar from '@/components/TopStatusBar.vue';
import DishCard from '@/components/DishCard.vue';
import { dishes, type Dish } from '@/data/dishes';
import { useCookingStore } from '@/stores/cooking';
import { useProfileStore, ALLERGENS } from '@/stores/profile';
import { unlocks } from '@/data/unlocks';
import { computed, ref, onMounted } from 'vue';
import { AlertTriangle, Sparkles, BookOpen, ChevronRight, Star, Target, Trophy, Leaf, Calendar } from 'lucide-vue-next';
import { useChallengesStore } from '@/stores/challenges';
import ChallengeProgress from '@/components/challenges/ChallengeProgress.vue';
import ChallengeList from '@/components/challenges/ChallengeList.vue';
import {
  getCurrentMonth,
  getCurrentSeason,
  getCurrentSeasonalDishes,
  MONTH_NAMES,
  SEASON_NAMES,
  SEASON_EMOJI,
  SEASON_COLORS,
  isDishAvailableThisMonth,
  getSeasonalDishInfo,
  getCurrentSeasonalDecorations,
  getCurrentSeasonalAprons,
} from '@/data/seasonal';

const router = useRouter();
const store = useCookingStore();
const profileStore = useProfileStore();
const challengesStore = useChallengesStore();

const showChallengeList = ref(false);

onMounted(() => {
  challengesStore.resetExpiredChallenges();
});

function handleStartChallenge(challengeId: string) {
  challengesStore.startChallenge(challengeId);
}

const activeDecoration = computed(() =>
  unlocks.decorations.find((d) => d.id === store.activeDecoration),
);

const currentMonth = computed(() => getCurrentMonth());
const currentSeason = computed(() => getCurrentSeason());
const currentMonthName = computed(() => MONTH_NAMES[currentMonth.value]);
const currentSeasonName = computed(() => SEASON_NAMES[currentSeason.value]);
const currentSeasonEmoji = computed(() => SEASON_EMOJI[currentSeason.value]);
const currentSeasonColor = computed(() => SEASON_COLORS[currentSeason.value]);

const currentSeasonalDishIds = computed(() =>
  getCurrentSeasonalDishes().map((sd) => sd.dishId),
);

const availableDishes = computed<Dish[]>(() =>
  dishes.filter((d) => isDishAvailableThisMonth(d.id)),
);

const seasonalDishesOnly = computed<DishWithMeta[]>(() => {
  return sortedDishes.value.filter((item) =>
    currentSeasonalDishIds.value.includes(item.dish.id),
  );
});

const regularDishes = computed<DishWithMeta[]>(() => {
  return sortedDishes.value.filter((item) =>
    !currentSeasonalDishIds.value.includes(item.dish.id),
  );
});

const currentSeasonalDecos = computed(() => {
  const decoIds = getCurrentSeasonalDecorations().map((d) => d.decorationId);
  return unlocks.decorations.filter((d) => decoIds.includes(d.id));
});

const currentSeasonalApronList = computed(() => {
  const apronIds = getCurrentSeasonalAprons().map((a) => a.apronId);
  return unlocks.aprons.filter((a) => apronIds.includes(a.id));
});

const unlockedSeasonalDecosCount = computed(() =>
  currentSeasonalDecos.value.filter((d) => store.unlockedDecorations.includes(d.id)).length,
);

const unlockedSeasonalApronsCount = computed(() =>
  currentSeasonalApronList.value.filter((a) => store.unlockedAprons.includes(a.id)).length,
);

function spicyLevelToNum(level: string): number {
  switch (level) {
    case 'mild':
      return 1;
    case 'medium':
      return 2;
    case 'hot':
      return 3;
    default:
      return 0;
  }
}

function saltLevelToNum(level: string): number {
  switch (level) {
    case 'light':
      return 0.5;
    case 'heavy':
      return 2.5;
    default:
      return 1.5;
  }
}

function sweetLevelToNum(level: string): number {
  switch (level) {
    case 'light':
      return 0.5;
    case 'none':
      return 0;
    case 'heavy':
      return 2.5;
    default:
      return 1.5;
  }
}

function oilLevelToNum(level: string): number {
  switch (level) {
    case 'light':
      return 0.5;
    case 'heavy':
      return 2.5;
    default:
      return 1.5;
  }
}

function computeTasteScore(dish: Dish): number {
  const pref = profileStore.tastePreference;
  let diff = 0;
  diff += Math.abs(dish.taste.spicy - spicyLevelToNum(pref.spicy));
  diff += Math.abs(dish.taste.salty - saltLevelToNum(pref.salt));
  diff += Math.abs(dish.taste.sweet - sweetLevelToNum(pref.sweet));
  diff += Math.abs(dish.taste.oily - oilLevelToNum(pref.oil));
  return -diff;
}

function hasMatchingAllergen(dish: Dish): boolean {
  return dish.allergens.some((a) => profileStore.allergens.includes(a));
}

interface DishWithMeta {
  dish: Dish;
  hasAllergen: boolean;
  matchingAllergens: string[];
  tasteScore: number;
}

const dishesWithMeta = computed<DishWithMeta[]>(() => {
  return availableDishes.value.map((dish) => {
    const matching = dish.allergens.filter((a) => profileStore.allergens.includes(a));
    return {
      dish,
      hasAllergen: matching.length > 0,
      matchingAllergens: matching,
      tasteScore: computeTasteScore(dish),
    };
  });
});

const sortedDishes = computed<DishWithMeta[]>(() => {
  const list = [...dishesWithMeta.value];
  list.sort((a, b) => {
    const aSeasonal = currentSeasonalDishIds.value.includes(a.dish.id) ? 0 : 1;
    const bSeasonal = currentSeasonalDishIds.value.includes(b.dish.id) ? 0 : 1;
    if (aSeasonal !== bSeasonal) return aSeasonal - bSeasonal;
    if (a.hasAllergen !== b.hasAllergen) {
      return a.hasAllergen ? 1 : -1;
    }
    return b.tasteScore - a.tasteScore;
  });
  return list;
});

const safeDishesCount = computed(() =>
  dishesWithMeta.value.filter((d) => !d.hasAllergen).length,
);

const allergenWarningNames = computed(() => {
  const ids = new Set<string>();
  dishesWithMeta.value.forEach((d) => d.matchingAllergens.forEach((a) => ids.add(a)));
  return ALLERGENS.filter((a) => ids.has(a.id));
});

function getSeasonalLabel(dishId: string): string | undefined {
  const info = getSeasonalDishInfo(dishId);
  return info?.limitedLabel;
}

function selectDish(id: string) {
  router.push(`/cooking/${id}`);
}
</script>

<template>
  <div class="container max-w-4xl mx-auto px-4 pt-8">
    <TopStatusBar />

    <section class="relative mb-10 text-center animate-fade-slide">
      <div class="relative inline-block">
        <h1 class="text-display text-5xl md:text-6xl text-brown-900 text-shadow-soft leading-tight">
          一人食
          <span class="text-apricot-500 mx-2">·</span>
          治愈小厨房
        </h1>
        <div class="flex justify-center gap-2 mt-2 pointer-events-none select-none">
          <span
            v-for="i in 4"
            :key="i"
            class="text-2xl opacity-40 animate-steam"
            :style="{ animationDelay: `${i * 0.4}s`, animationDuration: `${1.5 + i * 0.3}s` }"
          >
            ♨️
          </span>
        </div>
      </div>
      <p class="mt-5 text-brown-800/70 text-sm md:text-base max-w-md mx-auto leading-relaxed">
        今天也好好吃饭 ✿ 选一道快手菜，慢慢感受烟火气，完成后记得打卡喔～
      </p>
      <div
        v-if="activeDecoration"
        class="mt-4 inline-flex items-center gap-2 chip bg-cream-100 border-2 border-cream-300 text-brown-800/80 animate-float"
      >
        <span class="text-xl">{{ activeDecoration.emoji }}</span>
        <span class="text-xs">{{ activeDecoration.name }} 正在陪着你 🌿</span>
      </div>
    </section>

    <Transition name="fade">
      <div
        v-if="profileStore.hasAllergen && dishesWithMeta.some((d) => d.hasAllergen)"
        class="mb-6 animate-fade-slide card-soft p-4 bg-gradient-to-r from-apricot-50 to-cream-50 border-apricot-200"
        style="animation-delay: 0.05s"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-apricot-100 flex items-center justify-center text-apricot-500 shrink-0">
            <AlertTriangle :size="18" />
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-brown-900 mb-0.5">
              已为你调整菜品排序
            </div>
            <div class="text-xs text-brown-800/70 leading-relaxed">
              已标记过敏源：
              <span
                v-for="(a, i) in profileStore.allergenDetails"
                :key="a.id"
                class="inline-flex items-center gap-0.5"
              >
                {{ a.emoji }}{{ a.name }}<span v-if="i < profileStore.allergenDetails.length - 1">、</span>
              </span>
              。含这些食材的菜品已排在最后，你可以根据需要选择。
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="!profileStore.hasAllergen"
        class="mb-4 animate-fade-slide"
        style="animation-delay: 0.05s"
      >
        <button
          class="chip bg-matcha-50 border-matcha-300 text-matcha-700 hover:shadow-soft transition-all active:scale-95"
          @click="router.push('/profile')"
        >
          <Sparkles :size="14" />
          <span class="text-xs">还没设置饮食档案？点击这里告诉小厨房你的喜好～</span>
        </button>
      </div>
    </Transition>

    <section
      class="mb-8 animate-fade-slide"
      style="animation-delay: 0.08s"
    >
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-display text-xl text-brown-900 flex items-center gap-2">
            <Target :size="20" class="text-apricot-500" />
            挑战任务
          </h2>
          <p class="text-xs text-brown-800/60 mt-1">完成挑战解锁专属徽章～</p>
        </div>
        <button
          class="flex items-center gap-1 text-sm text-apricot-600 hover:text-apricot-700 transition-colors"
          @click="showChallengeList = true"
        >
          <span>查看全部</span>
          <ChevronRight :size="16" />
        </button>
      </div>

      <div v-if="challengesStore.inProgressChallenges.length === 0">
        <div
          class="card-soft p-6 text-center cursor-pointer hover:shadow-card transition-all duration-300"
          @click="showChallengeList = true"
        >
          <div class="text-5xl mb-3">🎯</div>
          <h4 class="text-display text-brown-900 mb-1">暂无进行中的挑战</h4>
          <p class="text-sm text-brown-800/60 mb-3">点击开始挑战，赢取专属徽章</p>
          <span class="inline-flex items-center gap-1 text-sm text-apricot-600">
            去看看 <ChevronRight :size="16" />
          </span>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="challenge in challengesStore.inProgressChallenges.slice(0, 2)"
          :key="challenge.id"
          class="card-soft p-4 ring-2 ring-apricot-400/30 bg-apricot-400/5 hover:shadow-card transition-all duration-300 cursor-pointer"
          @click="showChallengeList = true"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
            >
              {{ challenge.badge.emoji }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-display text-base text-brown-900 truncate">{{ challenge.title }}</h4>
                <span class="chip bg-apricot-400/30 text-apricot-600 text-xs shrink-0">
                  进行中
                </span>
              </div>
              <ChallengeProgress :challenge="challenge" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="mb-8 animate-fade-slide"
      style="animation-delay: 0.1s"
    >
      <div class="flex items-end justify-between mb-4">
        <div>
          <h2 class="text-display text-xl text-brown-900 flex items-center gap-2">
            <BookOpen :size="20" class="text-apricot-500" />
            最近笔记
          </h2>
          <p class="text-xs text-brown-800/60 mt-1">记录你的烹饪心得～</p>
        </div>
        <button
          class="flex items-center gap-1 text-sm text-apricot-600 hover:text-apricot-700 transition-colors"
          @click="router.push('/notes')"
        >
          <span>查看全部</span>
          <ChevronRight :size="16" />
        </button>
      </div>

      <div v-if="store.recentNotes.length === 0">
        <div
          class="card-soft p-6 text-center cursor-pointer hover:shadow-card transition-all duration-300"
          @click="router.push('/notes')"
        >
          <div class="text-5xl mb-3">📝</div>
          <h4 class="text-display text-brown-900 mb-1">还没有笔记</h4>
          <p class="text-sm text-brown-800/60 mb-3">记录每一次烹饪的心得和改良灵感</p>
          <span class="inline-flex items-center gap-1 text-sm text-apricot-600">
            去看看 <ChevronRight :size="16" />
          </span>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="note in store.recentNotes"
          :key="note.id"
          class="card-soft p-4 hover:shadow-card transition-all duration-300 cursor-pointer"
          @click="router.push({ path: '/notes', query: { search: note.dishName } })"
        >
          <div class="flex items-start gap-3">
            <div class="text-3xl shrink-0">{{ note.dishEmoji }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h4 class="text-display text-brown-900 text-base truncate">
                  {{ note.dishName }}
                </h4>
                <div class="flex items-center gap-0.5 shrink-0">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :size="12"
                    :class="i <= note.rating ? 'text-amber-400 fill-amber-400' : 'text-brown-800/10'"
                  />
                </div>
              </div>
              <p class="text-xs text-brown-800/50 mb-2">
                {{ new Date(note.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) }}
              </p>
              <p class="text-sm text-brown-800/70 line-clamp-2 leading-relaxed">
                {{ note.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="seasonalDishesOnly.length > 0"
      class="mb-8 animate-fade-slide"
      style="animation-delay: 0.1s"
    >
      <div class="flex items-end justify-between mb-5">
        <div>
          <h2 class="text-display text-2xl text-brown-900 flex items-center gap-2">
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              :style="{ background: `${currentSeasonColor}33` }"
            >
              {{ currentSeasonEmoji }}
            </span>
            {{ currentMonthName }}时令菜单
          </h2>
          <p class="text-sm text-brown-800/60 mt-1 flex items-center gap-1.5">
            <Calendar :size="12" />
            {{ currentSeasonName }}季限定 · 限时上架中
            <span v-if="currentSeasonalDecos.length > 0 || currentSeasonalApronList.length > 0" class="ml-1">
              · 本季可解锁 <span class="text-apricot-600 font-medium">{{ currentSeasonalDecos.length + currentSeasonalApronList.length }}</span> 件限定装饰
            </span>
          </p>
        </div>
        <div class="text-right">
          <div class="text-xs text-brown-800/50 flex items-center gap-1">
            <Leaf :size="12" />
            {{ seasonalDishesOnly.length }} 道限定菜
          </div>
          <div v-if="currentSeasonalDecos.length > 0" class="text-[11px] text-brown-800/40 mt-0.5">
            装饰 {{ unlockedSeasonalDecosCount }}/{{ currentSeasonalDecos.length }} · 围裙 {{ unlockedSeasonalApronsCount }}/{{ currentSeasonalApronList.length }}
          </div>
        </div>
      </div>

      <div
        class="relative p-5 rounded-2xl mb-5 overflow-hidden"
        :style="{ background: `linear-gradient(135deg, ${currentSeasonColor}22, ${currentSeasonColor}08)` }"
      >
        <div class="absolute -top-4 -right-4 text-8xl opacity-10 select-none pointer-events-none">
          {{ currentSeasonEmoji }}
        </div>
        <div class="relative flex items-start justify-between gap-4 flex-wrap">
          <div class="flex-1 min-w-[200px]">
            <h3 class="text-display text-lg text-brown-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles :size="16" class="text-amber-500" />
              本月限定美味
            </h3>
            <p class="text-sm text-brown-800/70 leading-relaxed">
              珍惜当季食材，品尝时节的馈赠～完成打卡即可解锁限定装饰和围裙！
            </p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="deco in currentSeasonalDecos"
              :key="deco.id"
              class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all"
              :class="store.unlockedDecorations.includes(deco.id)
                ? 'bg-matcha-50 border-matcha-200 text-matcha-700'
                : 'bg-cream-100 border-cream-200 text-brown-800/50'"
              :title="`${deco.name} - 打卡${deco.threshold}天解锁`"
            >
              <span>{{ deco.emoji }}</span>
              <span>{{ store.unlockedDecorations.includes(deco.id) ? '已解锁' : `${deco.threshold}天` }}</span>
            </span>
            <span
              v-for="apron in currentSeasonalApronList"
              :key="apron.id"
              class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all"
              :class="store.unlockedAprons.includes(apron.id)
                ? 'bg-matcha-50 border-matcha-200 text-matcha-700'
                : 'bg-cream-100 border-cream-200 text-brown-800/50'"
              :title="`${apron.name} - 打卡${apron.threshold}天解锁`"
            >
              <span>👩‍🍳</span>
              <span>{{ store.unlockedAprons.includes(apron.id) ? '已解锁' : `${apron.threshold}天` }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <DishCard
          v-for="(item, idx) in seasonalDishesOnly"
          :key="item.dish.id"
          :dish="item.dish"
          :index="idx"
          :has-allergen="item.hasAllergen"
          :matching-allergens="item.matchingAllergens"
          :taste-score="item.tasteScore"
          @select="selectDish(item.dish.id)"
        />
      </div>
    </section>

    <section
      class="mb-6 animate-fade-slide"
      style="animation-delay: 0.12s"
    >
      <div class="flex items-end justify-between mb-5">
        <div>
          <h2 class="text-display text-2xl text-brown-900">今日菜单</h2>
          <p class="text-sm text-brown-800/60 mt-1">
            <template v-if="profileStore.hasAllergen">
              已为你智能排序，过敏源菜品排在最后
            </template>
            <template v-else>挑一个喜欢的吧～</template>
          </p>
        </div>
        <div class="text-xs text-brown-800/50">共 {{ availableDishes.length }} 道快手菜</div>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10">
      <DishCard
        v-for="(item, idx) in regularDishes"
        :key="item.dish.id"
        :dish="item.dish"
        :index="idx"
        :has-allergen="item.hasAllergen"
        :matching-allergens="item.matchingAllergens"
        :taste-score="item.tasteScore"
        @select="selectDish(item.dish.id)"
      />
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-6">
      Made with 🧡 · 好好吃饭，慢慢生活
    </footer>
  </div>

  <Transition name="fade">
    <div
      v-if="showChallengeList"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
        @click="showChallengeList = false"
      />
      <div class="relative w-full max-w-2xl max-h-[85vh] overflow-hidden animate-pop-in">
        <div class="card-soft overflow-hidden flex flex-col max-h-[85vh]">
          <div class="p-5 pb-3 border-b border-cream-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              <Trophy :size="24" class="text-apricot-500" />
              <h2 class="text-display text-2xl text-brown-900">挑战任务</h2>
            </div>
            <button
              class="w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-800/70 transition-all active:scale-95"
              @click="showChallengeList = false"
            >
              ✕
            </button>
          </div>
          <div class="p-5 overflow-y-auto">
            <ChallengeList @start="handleStartChallenge" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
