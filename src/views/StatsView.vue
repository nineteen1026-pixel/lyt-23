<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, BarChart3, TrendingUp, ChefHat, UtensilsCrossed, Flame, CalendarDays } from 'lucide-vue-next';
import { useCookingStore } from '@/stores/cooking';
import { getDishById } from '@/data/dishes';
import MonthlyBarChart from '@/components/stats/MonthlyBarChart.vue';
import DishPieChart from '@/components/stats/DishPieChart.vue';
import type { MonthlyData } from '@/components/stats/MonthlyBarChart.vue';
import type { DishSlice } from '@/components/stats/DishPieChart.vue';

const router = useRouter();
const store = useCookingStore();

const MONTH_SHORT = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const monthlyData = computed<MonthlyData[]>(() => {
  const now = new Date();
  const counts: Map<string, number> = new Map();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    counts.set(key, 0);
  }

  store.cookingHistory.forEach((record) => {
    const date = new Date(record.completedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });

  return Array.from(counts.entries()).map(([key, count]) => {
    const monthIdx = parseInt(key.split('-')[1], 10) - 1;
    return { label: MONTH_SHORT[monthIdx], count };
  });
});

const dishDistribution = computed<DishSlice[]>(() => {
  const counts: Map<string, number> = new Map();
  store.cookingHistory.forEach((record) => {
    counts.set(record.dishId, (counts.get(record.dishId) ?? 0) + 1);
  });

  const sorted = Array.from(counts.entries())
    .map(([id, count]) => {
      const dish = getDishById(id);
      return {
        id,
        name: dish?.name ?? id,
        emoji: dish?.emoji ?? '🍽️',
        count,
        color: dish?.color ?? '#FF8C42',
      };
    })
    .sort((a, b) => b.count - a.count);

  return sorted;
});

const totalCount = computed(() => store.cookingHistory.length);

const favoriteDish = computed(() => {
  if (dishDistribution.value.length === 0) return null;
  return dishDistribution.value[0];
});

const currentMonthCount = computed(() => {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const counts: Map<string, number> = new Map();
  store.cookingHistory.forEach((record) => {
    const date = new Date(record.completedAt);
    const recordKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    counts.set(recordKey, (counts.get(recordKey) ?? 0) + 1);
  });
  return counts.get(key) ?? 0;
});

const avgPerMonth = computed(() => {
  if (monthlyData.value.length === 0) return 0;
  return Math.round((totalCount.value / 12) * 10) / 10;
});

const uniqueDishes = computed(() => dishDistribution.value.length);
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

      <div>
        <h1 class="text-display text-4xl text-brown-900 flex items-center gap-2">
          <BarChart3 class="text-apricot-500" :size="36" />
          烹饪统计
        </h1>
        <p class="text-sm text-brown-800/70 mt-2">
          用数据回顾你的美食旅程 📊 看看哪些菜是你的最爱～
        </p>
      </div>
    </header>

    <section class="mb-8 animate-fade-slide" style="animation-delay: 0.05s">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card-soft p-4 text-center">
          <div class="w-10 h-10 rounded-full bg-apricot-500/15 flex items-center justify-center text-apricot-500 mx-auto mb-2">
            <UtensilsCrossed :size="20" />
          </div>
          <div class="text-display text-2xl text-brown-900">{{ totalCount }}</div>
          <div class="text-xs text-brown-800/50 mt-1">累计烹饪</div>
        </div>
        <div class="card-soft p-4 text-center">
          <div class="w-10 h-10 rounded-full bg-matcha-500/15 flex items-center justify-center text-matcha-600 mx-auto mb-2">
            <CalendarDays :size="20" />
          </div>
          <div class="text-display text-2xl text-brown-900">{{ currentMonthCount }}</div>
          <div class="text-xs text-brown-800/50 mt-1">本月烹饪</div>
        </div>
        <div class="card-soft p-4 text-center">
          <div class="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 mx-auto mb-2">
            <TrendingUp :size="20" />
          </div>
          <div class="text-display text-2xl text-brown-900">{{ avgPerMonth }}</div>
          <div class="text-xs text-brown-800/50 mt-1">月均烹饪</div>
        </div>
        <div class="card-soft p-4 text-center">
          <div class="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500 mx-auto mb-2">
            <ChefHat :size="20" />
          </div>
          <div class="text-display text-2xl text-brown-900">{{ uniqueDishes }}</div>
          <div class="text-xs text-brown-800/50 mt-1">尝试菜品</div>
        </div>
      </div>
    </section>

    <section class="mb-8 animate-fade-slide" style="animation-delay: 0.1s">
      <div class="flex items-center gap-2 mb-4">
        <Flame class="text-apricot-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">月度烹饪频次</h2>
      </div>
      <div class="card-soft p-5">
        <div v-if="totalCount === 0" class="py-10 text-center">
          <div class="text-4xl mb-3">📊</div>
          <p class="text-sm text-brown-800/50">还没有烹饪记录，快去做一道菜吧～</p>
        </div>
        <MonthlyBarChart v-else :data="monthlyData" />
      </div>
    </section>

    <section class="mb-8 animate-fade-slide" style="animation-delay: 0.15s">
      <div class="flex items-center gap-2 mb-4">
        <ChefHat class="text-apricot-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">最爱菜品分布</h2>
      </div>
      <div class="card-soft p-5">
        <div v-if="totalCount === 0" class="py-10 text-center">
          <div class="text-4xl mb-3">🍽️</div>
          <p class="text-sm text-brown-800/50">完成菜品后就能看到你的口味偏好了～</p>
        </div>
        <template v-else>
          <DishPieChart :data="dishDistribution" />
          <div
            v-if="favoriteDish"
            class="mt-5 p-4 rounded-2xl bg-gradient-to-r from-apricot-50 to-cream-50 border border-apricot-200"
          >
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ favoriteDish.emoji }}</span>
              <div>
                <div class="text-xs text-brown-800/50 mb-0.5">你的最爱菜品</div>
                <div class="text-display text-lg text-brown-900">
                  {{ favoriteDish.name }}
                  <span class="text-sm font-normal text-apricot-600 ml-1">{{ favoriteDish.count }} 次</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <section class="mb-8 animate-fade-slide" style="animation-delay: 0.2s">
      <div class="card-soft p-5 bg-gradient-to-br from-matcha-50 to-cream-100 border-matcha-200">
        <div class="flex items-start gap-3">
          <div class="text-3xl">💡</div>
          <div>
            <h3 class="text-display text-lg text-brown-900 mb-1">统计小贴士</h3>
            <ul class="text-sm text-brown-800/70 space-y-1.5 leading-relaxed">
              <li>• 每月烹饪频次展示近 12 个月的烹饪次数趋势</li>
              <li>• 最爱菜品分布基于你所有已完成的烹饪记录</li>
              <li>• 只有完成做菜才计入统计，打卡不影响数据</li>
              <li>• 所有数据保存在本地，清缓存后需重新积累</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-4">
      用数据记录每一餐的温暖 🧡
    </footer>
  </div>
</template>
