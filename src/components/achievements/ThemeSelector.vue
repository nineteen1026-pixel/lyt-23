<script setup lang="ts">
import { computed } from 'vue';
import { useCookingStore } from '@/stores/cooking';
import { themes } from '@/data/themes';
import { Palette, Layers } from 'lucide-vue-next';

const store = useCookingStore();

const totalBackgrounds = computed(() => themes.backgrounds.length);
const unlockedBackgrounds = computed(() => store.unlockedBackgrounds.length);

const totalCounters = computed(() => themes.counters.length);
const unlockedCounters = computed(() => store.unlockedCounters.length);

function isBackgroundUnlocked(id: string): boolean {
  return store.unlockedBackgrounds.includes(id);
}

function isBackgroundActive(id: string): boolean {
  return store.activeBackground === id;
}

function isCounterUnlocked(id: string): boolean {
  return store.unlockedCounters.includes(id);
}

function isCounterActive(id: string): boolean {
  return store.activeCounter === id;
}

function handleBackgroundClick(id: string): void {
  if (isBackgroundUnlocked(id)) {
    store.setActiveBackground(id);
  }
}

function handleCounterClick(id: string): void {
  if (isCounterUnlocked(id)) {
    store.setActiveCounter(id);
  }
}

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}
</script>

<template>
  <div class="space-y-8">
    <section class="card-soft p-6">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <Palette :size="24" class="text-apricot-500" />
          <h2 class="text-display text-2xl text-brown-900">
            厨房背景
          </h2>
        </div>
        <div class="chip bg-blue-400/30 text-blue-600 border border-blue-400/40">
          <span class="font-bold">{{ unlockedBackgrounds }}</span>
          <span>/</span>
          <span>{{ totalBackgrounds }}</span>
          <span class="ml-1">已解锁</span>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        <button
          v-for="(bg, index) in themes.backgrounds"
          :key="bg.id"
          class="card-soft relative overflow-hidden animate-pop-in transition-all duration-300 text-left"
          :class="[
            getDelayClass(index),
            isBackgroundUnlocked(bg.id)
              ? 'hover:-translate-y-1 hover:shadow-card active:scale-[0.98] cursor-pointer'
              : 'cursor-not-allowed',
            isBackgroundActive(bg.id)
              ? 'ring-4 ring-apricot-500 ring-offset-2 ring-offset-cream-100 shadow-xl scale-[1.03]'
              : '',
          ]"
          :disabled="!isBackgroundUnlocked(bg.id)"
          @click="handleBackgroundClick(bg.id)"
        >
          <div
            class="h-28 flex flex-col items-center justify-center relative"
            :class="isBackgroundUnlocked(bg.id) ? '' : 'grayscale opacity-50'"
            :style="{
              background: `radial-gradient(ellipse at top left, ${bg.gradients.topLeft} 0%, transparent 50%), radial-gradient(ellipse at bottom right, ${bg.gradients.bottomRight} 0%, transparent 50%), ${bg.gradients.base}`,
            }"
          >
            <span class="text-4xl mb-1 transform transition-transform duration-500" :class="isBackgroundUnlocked(bg.id) ? 'hover:scale-110' : ''">
              {{ bg.emoji }}
            </span>
            <div class="flex gap-1">
              <span
                class="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                :style="{ backgroundColor: bg.colors.primary }"
              />
              <span
                class="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                :style="{ backgroundColor: bg.colors.secondary }"
              />
              <span
                class="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                :style="{ backgroundColor: bg.colors.text }"
              />
            </div>

            <div
              v-if="!isBackgroundUnlocked(bg.id)"
              class="absolute inset-0 flex items-center justify-center bg-brown-900/10 backdrop-blur-[1px]"
            >
              <span class="text-3xl drop-shadow-md">🔒</span>
            </div>

            <div
              v-if="isBackgroundActive(bg.id)"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-apricot-500 text-white flex items-center justify-center text-xs font-bold shadow-md animate-bounce-soft"
            >
              ✓
            </div>
          </div>

          <div class="p-3 pt-2">
            <h4
              class="text-sm font-medium text-center leading-tight"
              :class="isBackgroundUnlocked(bg.id) ? 'text-brown-900' : 'text-brown-800/50'"
            >
              {{ bg.name }}
            </h4>
            <p
              v-if="!isBackgroundUnlocked(bg.id)"
              class="text-xs text-center mt-1 text-apricot-600/80 font-medium"
            >
              第{{ bg.threshold }}天解锁
            </p>
            <p
              v-else
              class="text-xs text-center mt-1 text-brown-800/50 line-clamp-1"
            >
              {{ bg.description }}
            </p>
          </div>
        </button>
      </div>

      <p class="text-center text-sm text-brown-800/60 leading-relaxed">
        💡 选择一个背景主题，整个厨房的色调会跟着变化哦～
      </p>
    </section>

    <section class="card-soft p-6">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <Layers :size="24" class="text-apricot-500" />
          <h2 class="text-display text-2xl text-brown-900">
            台面材质
          </h2>
        </div>
        <div class="chip bg-purple-400/30 text-purple-600 border border-purple-400/40">
          <span class="font-bold">{{ unlockedCounters }}</span>
          <span>/</span>
          <span>{{ totalCounters }}</span>
          <span class="ml-1">已解锁</span>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        <button
          v-for="(counter, index) in themes.counters"
          :key="counter.id"
          class="card-soft relative overflow-hidden animate-pop-in transition-all duration-300 text-left"
          :class="[
            getDelayClass(index),
            isCounterUnlocked(counter.id)
              ? 'hover:-translate-y-1 hover:shadow-card active:scale-[0.98] cursor-pointer'
              : 'cursor-not-allowed',
            isCounterActive(counter.id)
              ? 'ring-4 ring-apricot-500 ring-offset-2 ring-offset-cream-100 shadow-xl scale-[1.03]'
              : '',
          ]"
          :disabled="!isCounterUnlocked(counter.id)"
          @click="handleCounterClick(counter.id)"
        >
          <div
            class="h-28 flex items-center justify-center relative"
            :class="isCounterUnlocked(counter.id) ? '' : 'grayscale opacity-50'"
            :style="{ background: counter.background }"
          >
            <span class="text-4xl transform transition-transform duration-500" :class="isCounterUnlocked(counter.id) ? 'hover:scale-110' : ''">
              {{ counter.emoji }}
            </span>

            <div
              v-if="!isCounterUnlocked(counter.id)"
              class="absolute inset-0 flex items-center justify-center bg-brown-900/10 backdrop-blur-[1px]"
            >
              <span class="text-3xl drop-shadow-md">🔒</span>
            </div>

            <div
              v-if="isCounterActive(counter.id)"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-apricot-500 text-white flex items-center justify-center text-xs font-bold shadow-md animate-bounce-soft"
            >
              ✓
            </div>
          </div>

          <div class="p-3 pt-2">
            <h4
              class="text-sm font-medium text-center leading-tight"
              :class="isCounterUnlocked(counter.id) ? 'text-brown-900' : 'text-brown-800/50'"
            >
              {{ counter.name }}
            </h4>
            <p
              v-if="!isCounterUnlocked(counter.id)"
              class="text-xs text-center mt-1 text-apricot-600/80 font-medium"
            >
              第{{ counter.threshold }}天解锁
            </p>
            <p
              v-else
              class="text-xs text-center mt-1 text-brown-800/50 line-clamp-1"
            >
              {{ counter.description }}
            </p>
          </div>
        </button>
      </div>

      <p class="text-center text-sm text-brown-800/60 leading-relaxed">
        💡 选择台面材质，搭配你的摆件，打造专属厨房风格～
      </p>
    </section>
  </div>
</template>
