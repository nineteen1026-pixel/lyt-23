<script setup lang="ts">
import { computed } from 'vue';
import { Clock, ChefHat, AlertTriangle, Sparkles, Leaf, Lock, Heart, Pin } from 'lucide-vue-next';
import type { Dish } from '@/data/dishes';
import { ALLERGENS } from '@/stores/profile';
import { getSeasonalDishInfo } from '@/data/seasonal';
import { useCookingStore } from '@/stores/cooking';
import { useFavoritesStore } from '@/stores/favorites';
import { useDishI18n } from '@/composables/useDishI18n';

const props = defineProps<{
  dish: Dish;
  index?: number;
  hasAllergen?: boolean;
  matchingAllergens?: string[];
  tasteScore?: number;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();

const cookingStore = useCookingStore();
const favoritesStore = useFavoritesStore();
const { getLocalizedDish } = useDishI18n();

const localizedDish = computed(() => getLocalizedDish(props.dish));

const isFav = computed(() => favoritesStore.isFavorite(props.dish.id));
const isPinned = computed(() => favoritesStore.isPinned(props.dish.id));

function handleToggleFavorite(e: Event) {
  e.stopPropagation();
  favoritesStore.toggleFavorite(props.dish.id);
}

function handleTogglePin(e: Event) {
  e.stopPropagation();
  favoritesStore.togglePin(props.dish.id);
}

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

const seasonalInfo = computed(() => {
  if (!props.dish.isSeasonal) return null;
  return getSeasonalDishInfo(props.dish.id);
});

const isSeasonalLocked = computed(() => {
  if (!seasonalInfo.value?.unlockThreshold) return false;
  return cookingStore.totalDays < seasonalInfo.value.unlockThreshold;
});

const seasonalUnlockProgress = computed(() => {
  if (!seasonalInfo.value?.unlockThreshold) return 100;
  const threshold = seasonalInfo.value.unlockThreshold;
  return Math.min((cookingStore.totalDays / threshold) * 100, 100);
});
</script>

<template>
  <button
    class="card-soft group relative overflow-hidden w-full text-left animate-pop-in transition-all duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98]"
    :class="[delayClass, { 'opacity-60': hasAllergen || isSeasonalLocked }]"
    @click="!isSeasonalLocked && emit('select')"
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
      <span
        class="transform transition-transform duration-500 drop-shadow-lg"
        :class="isSeasonalLocked ? 'grayscale opacity-50' : 'group-hover:scale-110 group-hover:-rotate-3'"
      >
        {{ dish.emoji }}
      </span>
      <div v-if="isSeasonalLocked" class="absolute inset-0 bg-brown-900/30 backdrop-blur-[2px] flex items-center justify-center">
        <div class="text-center">
          <Lock :size="28" class="text-white mx-auto mb-1" />
          <div class="text-[11px] text-white font-medium">
            还需 {{ (seasonalInfo?.unlockThreshold ?? 0) - cookingStore.totalDays }} 天
          </div>
        </div>
      </div>
      <div class="absolute top-3 left-3 flex flex-col gap-1.5">
        <div class="flex gap-1.5">
          <Transition name="fade">
            <div
              v-if="isPinned"
              class="chip bg-gradient-to-r from-rose-400 to-pink-500 text-white backdrop-blur-sm border border-rose-300 shadow-sm"
              title="已置顶"
            >
              <Pin :size="12" class="fill-white" />
              <span class="text-[11px] font-medium">置顶</span>
            </div>
          </Transition>
          <Transition name="fade">
            <div
              v-if="seasonalInfo?.limitedLabel"
              class="chip bg-gradient-to-r from-amber-400 to-orange-400 text-white backdrop-blur-sm border border-amber-300 shadow-sm"
            >
              <Leaf :size="12" />
              <span class="text-[11px] font-medium">{{ seasonalInfo.limitedLabel }}</span>
            </div>
          </Transition>
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
              v-if="isGoodTasteMatch && !hasAllergen && !isSeasonalLocked"
              class="chip bg-matcha-500/90 text-white backdrop-blur-sm border border-matcha-400"
            >
              <Sparkles :size="12" />
              <span class="text-[11px]">合你口味</span>
            </div>
          </Transition>
        </div>
      </div>
      <div class="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          v-if="showActions !== false"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm border"
          :class="isFav
            ? 'bg-rose-500/90 text-white border-rose-400 hover:bg-rose-600/90'
            : 'bg-white/70 text-brown-800/60 border-white/60 hover:bg-white/90 hover:text-rose-500'"
          :title="isFav ? '取消收藏' : '加入收藏'"
          @click="handleToggleFavorite"
        >
          <Heart :size="15" :class="isFav ? 'fill-white' : ''" />
        </button>
        <button
          v-if="showActions !== false && isFav"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm border"
          :class="isPinned
            ? 'bg-amber-500/90 text-white border-amber-400 hover:bg-amber-600/90'
            : 'bg-white/70 text-brown-800/60 border-white/60 hover:bg-white/90 hover:text-amber-600'"
          :title="isPinned ? '取消置顶' : '置顶此菜'"
          @click="handleTogglePin"
        >
          <Pin :size="15" :class="isPinned ? 'fill-white' : ''" />
        </button>
        <div
          v-if="!isFav || showActions === false"
          class="chip bg-white/70 backdrop-blur-sm text-brown-800/80 border border-white/60"
        >
          <ChefHat :size="12" />
          <span class="tracking-wider">{{ difficultyStars }}</span>
        </div>
      </div>
      <div
        v-if="isSeasonalLocked"
        class="absolute bottom-0 left-0 right-0 h-1 bg-brown-800/30"
      >
        <div
          class="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
          :style="{ width: `${seasonalUnlockProgress}%` }"
        />
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3
          class="text-display text-xl transition-colors"
          :class="(hasAllergen || isSeasonalLocked) ? 'text-brown-800/60' : 'text-brown-900 group-hover:text-apricot-600'"
        >
          {{ localizedDish.name }}
        </h3>
        <div class="flex items-center gap-1 text-xs text-brown-800/60 shrink-0 mt-1">
          <Clock :size="13" />
          <span>{{ dish.time }}min</span>
        </div>
      </div>
      <p class="text-sm text-brown-800/70 leading-relaxed mb-3">
        {{ localizedDish.description }}
      </p>
      <div v-if="isSeasonalLocked" class="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <Lock :size="10" />
            解锁进度：累计打卡 {{ seasonalInfo?.unlockThreshold }} 天
          </span>
          <span class="text-[11px] text-amber-600 font-medium">
            {{ cookingStore.totalDays }} / {{ seasonalInfo?.unlockThreshold }}
          </span>
        </div>
        <div class="h-1.5 w-full rounded-full bg-amber-200/60 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
            :style="{ width: `${seasonalUnlockProgress}%` }"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="ing in localizedDish.ingredients"
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
      v-if="!isSeasonalLocked"
      class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
    />
  </button>
</template>
