<script setup lang="ts">
import { useRouter } from 'vue-router';
import TopStatusBar from '@/components/TopStatusBar.vue';
import DishCard from '@/components/DishCard.vue';
import { dishes } from '@/data/dishes';
import { useCookingStore } from '@/stores/cooking';
import { unlocks } from '@/data/unlocks';
import { computed } from 'vue';

const router = useRouter();
const store = useCookingStore();

const activeDecoration = computed(() =>
  unlocks.decorations.find((d) => d.id === store.activeDecoration),
);

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

    <section class="mb-6 animate-fade-slide" style="animation-delay: 0.1s">
      <div class="flex items-end justify-between mb-5">
        <div>
          <h2 class="text-display text-2xl text-brown-900">今日菜单</h2>
          <p class="text-sm text-brown-800/60 mt-1">挑一个喜欢的吧～</p>
        </div>
        <div class="text-xs text-brown-800/50">共 {{ dishes.length }} 道快手菜</div>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10">
      <DishCard
        v-for="(dish, idx) in dishes"
        :key="dish.id"
        :dish="dish"
        :index="idx"
        @select="selectDish(dish.id)"
      />
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-6">
      Made with 🧡 · 好好吃饭，慢慢生活
    </footer>
  </div>
</template>
