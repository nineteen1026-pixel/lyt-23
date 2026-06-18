<script setup lang="ts">
import { computed } from 'vue';
import { Clock, ChefHat } from 'lucide-vue-next';
import type { Dish } from '@/data/dishes';

const props = defineProps<{
  dish: Dish;
  index?: number;
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
</script>

<template>
  <button
    class="card-soft group relative overflow-hidden w-full text-left animate-pop-in transition-all duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98]"
    :class="delayClass"
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
      <div
        class="absolute top-3 right-3 chip bg-white/70 backdrop-blur-sm text-brown-800/80 border border-white/60"
      >
        <ChefHat :size="12" />
        <span class="tracking-wider">{{ difficultyStars }}</span>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3 class="text-display text-xl text-brown-900 group-hover:text-apricot-600 transition-colors">
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
        >
          {{ ing }}
        </span>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
    />
  </button>
</template>
