<script setup lang="ts">
import { useRouter } from 'vue-router';
import TopStatusBar from '@/components/TopStatusBar.vue';
import DishCard from '@/components/DishCard.vue';
import { dishes, type Dish } from '@/data/dishes';
import { useCookingStore } from '@/stores/cooking';
import { useProfileStore, ALLERGENS } from '@/stores/profile';
import { unlocks } from '@/data/unlocks';
import { computed } from 'vue';
import { AlertTriangle, Sparkles } from 'lucide-vue-next';

const router = useRouter();
const store = useCookingStore();
const profileStore = useProfileStore();

const activeDecoration = computed(() =>
  unlocks.decorations.find((d) => d.id === store.activeDecoration),
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
  return dishes.map((dish) => {
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
        class="mb-6 animate-fade-slide card-soft p-4 bg-gradient-to-r from-red-50 to-apricot-50 border-red-200"
        style="animation-delay: 0.05s"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle :size="18" />
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-brown-900 mb-0.5">
              已为你过滤含过敏源的菜品
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
              。含这些食材的菜品已排到最后。
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

    <section class="mb-6 animate-fade-slide" style="animation-delay: 0.1s">
      <div class="flex items-end justify-between mb-5">
        <div>
          <h2 class="text-display text-2xl text-brown-900">今日菜单</h2>
          <p class="text-sm text-brown-800/60 mt-1">
            <template v-if="profileStore.hasAllergen">
              已为你智能排序，适合你的 {{ safeDishesCount }} 道菜优先展示
            </template>
            <template v-else>挑一个喜欢的吧～</template>
          </p>
        </div>
        <div class="text-xs text-brown-800/50">共 {{ dishes.length }} 道快手菜</div>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10">
      <DishCard
        v-for="(item, idx) in sortedDishes"
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
</template>
