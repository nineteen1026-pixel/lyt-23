<script setup lang="ts">
import { computed } from 'vue';
import { useChallengesStore } from '@/stores/challenges';
import type { Challenge } from '@/data/challenges';
import { getDishById } from '@/data/dishes';

const props = defineProps<{
  challenge: Challenge;
  showTargetDishes?: boolean;
}>();

const store = useChallengesStore();

const progressCount = computed(() => store.getProgressCount(props.challenge.id));
const progressPercent = computed(() => store.getProgressPercent(props.challenge.id));
const remainingDays = computed(() => store.getRemainingDays(props.challenge.id));
const isStarted = computed(() => store.isChallengeStarted(props.challenge.id));
const isCompleted = computed(() => store.isChallengeCompleted(props.challenge.id));

const targetDishes = computed(() => {
  if (props.challenge.targetDishIds.length === 0) return [];
  return props.challenge.targetDishIds
    .map((id) => getDishById(id))
    .filter(Boolean);
});

const completedDishIds = computed(() => {
  const p = store.getProgress(props.challenge.id);
  if (!p) return new Set<string>();
  if (props.challenge.targetDishIds.length > 0) {
    return new Set(
      p.completedDishes.filter((d) => props.challenge.targetDishIds.includes(d)),
    );
  }
  return new Set<string>();
});
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-baseline gap-1">
        <span class="text-2xl font-bold text-apricot-500">{{ progressCount }}</span>
        <span class="text-brown-800/50">/</span>
        <span class="text-lg text-brown-800/70">{{ challenge.targetCount }}</span>
      </div>
      <div v-if="isStarted && !isCompleted" class="flex items-center gap-1">
        <span class="text-sm">⏰</span>
        <span class="text-sm" :class="remainingDays <= 1 ? 'text-apricot-600 font-medium' : 'text-brown-800/60'">
          剩余 {{ remainingDays }} 天
        </span>
      </div>
      <div v-else-if="isCompleted" class="chip bg-matcha-400/30 text-matcha-600 text-xs">
        ✓ 已完成
      </div>
    </div>

    <div class="h-3 rounded-full bg-cream-200 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :style="{
          width: `${progressPercent}%`,
          background: isCompleted
            ? 'linear-gradient(90deg, #BFD87A, #A7C957)'
            : 'linear-gradient(90deg, #FFA66D, #FF8C42)',
        }"
      />
    </div>

    <div
      v-if="showTargetDishes && targetDishes.length > 0"
      class="flex flex-wrap gap-2 pt-1"
    >
      <div
        v-for="dish in targetDishes"
        :key="dish!.id"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-300"
        :class="completedDishIds.has(dish!.id)
          ? 'bg-matcha-400/30 text-matcha-700'
          : 'bg-cream-200 text-brown-800/60'"
      >
        <span>{{ dish!.emoji }}</span>
        <span>{{ dish!.name }}</span>
        <span v-if="completedDishIds.has(dish!.id)">✓</span>
      </div>
    </div>

    <div
      v-else-if="showTargetDishes && challenge.targetDishIds.length === 0"
      class="text-xs text-brown-800/50"
    >
      任意菜品均可累计进度
    </div>
  </div>
</template>
