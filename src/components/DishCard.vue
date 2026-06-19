<script setup lang="ts">
import { computed } from 'vue';
import { Clock, ChefHat, AlertTriangle, Sparkles } from 'lucide-vue-next';
import type { Dish } from '@/data/dishes';
import { ALLERGENS } from '@/stores/profile';

const props = defineProps<{
  dish: Dish;
  index?: number;
  hasAllergen?: boolean;
  matchingAllergens?: string[];
  tasteScore?: number;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();

const delayClass = computed(() => {
  const idx = props.index ?? 0;
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[idx % delays.length];
});

const difficultyStars = computed(() => '★'.repeat(props.dish.difficulty) + '☆'.repeat(3 - props.dish.difficulty));

const matchingAllergenDetails = computed(() => {
  const ids = props.matchingAllergens ?? [];
  return ALLERGENS.filter((a) => ids.includes(a.id));
});

const isGoodTasteMatch = computed(() => {
  const score = props.tasteScore ?? -999;
  return score >= -1.5;
});
</script>

<template>
  <button
    class="card-soft group relative overflow-hidden w-full text-left animate-pop-in transition-all duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98]"
    :class="[delayClass, { 'opacity-60': hasAllergen }]"
    @click="emit('select')"
  >
    <div
      class="h-40 flex items-center justify-center text-7xl relative overflow-hidden"
      :style="{ background: `linear-gradient(135deg, ${dish.color}22, ${dish.color}08)` }"
    >
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          v-for="i in 5"
          :key="i"
          class="absolute animate-steam rounded-full"
          :style="{
            left: `${30 + i * 10}%`,
            bottom: '30%',
            width: `${8 + i * 2}px`,
            height: `${8 + i * 2}px`,
            background: `${dish.color}44`,
            animationDelay: `${i * 0.3}s`,
          }"
        />
      </div>
      <span class="transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-lg">
        {{ dish.emoji }}
      </span>
      <div class="absolute top-3 left-3 flex gap-1.5">
        <Transition name="fade">
          <div
            v-if="hasAllergen"
            class="chip bg-red-500/90 text-white backdrop-blur-sm border border-red-400"
            :title="`含过敏源: ${matchingAllergenDetails.map((a) => a.name).join('、')}`"
          >
            <AlertTriangle :size="12" />
            <span class="text-[11px]">含过敏源</span>
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="isGoodTasteMatch && !hasAllergen"
            class="chip bg-matcha-500/90 text-white backdrop-blur-sm border border-matcha-400"
          >
            <Sparkles :size="12" />
            <span class="text-[11px]">合你口味</span>
          </div>
        </Transition>
      </div>
      <div
        class="absolute top-3 right-3 chip bg-white/70 backdrop-blur-sm text-brown-800/80 border border-white/60"
      >
        <ChefHat :size="12" />
        <span class="tracking-wider">{{ difficultyStars }}</span>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3
          class="text-display text-xl transition-colors"
          :class="hasAllergen ? 'text-brown-800/60' : 'text-brown-900 group-hover:text-apricot-600'"
        >
          {{ dish.name }}
        </h3>
        <div class="flex items-center gap-1 text-xs text-brown-800/60 shrink-0 mt-1">
          <Clock :size="13" />
          <span>{{ dish.time }}min</span>
        </div>
      </div>
      <p class="text-sm text-brown-800/70 leading-relaxed mb-3">
        {{ dish.description }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="ing in dish.ingredients"
          :key="ing"
          class="text-xs px-2.5 py-1 rounded-full bg-cream-200/70 text-brown-800/80 border border-white/50"
          :class="{
            'bg-red-100/70 text-red-700 border-red-200':
              matchingAllergenDetails.some((a) => ing.includes(a.name)),
          }"
        >
          {{ ing }}
        </span>
      </div>
      <div v-if="hasAllergen && matchingAllergenDetails.length > 0" class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="a in matchingAllergenDetails"
          :key="a.id"
          class="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200"
        >
          {{ a.emoji }} 含{{ a.name }}
        </span>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
    />
  </button>
</template>
