<script setup lang="ts">
import { computed } from 'vue';
import { useCookingStore } from '@/stores/cooking';
import { unlocks } from '@/data/unlocks';

const store = useCookingStore();

const totalCount = computed(() => unlocks.decorations.length);
const unlockedCount = computed(() => store.unlockedDecorations.length);

function isUnlocked(id: string): boolean {
  return store.unlockedDecorations.includes(id);
}

function isActive(id: string): boolean {
  return store.activeDecoration === id;
}

function handleClick(id: string): void {
  if (isUnlocked(id)) {
    store.toggleDecoration(id);
  }
}

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}
</script>

<template>
  <div class="card-soft p-6">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-display text-2xl text-brown-900">
        🏠 厨房摆件
      </h2>
      <div class="chip bg-matcha-400/30 text-matcha-600 border border-matcha-400/40">
        <span class="font-bold">{{ unlockedCount }}</span>
        <span>/</span>
        <span>{{ totalCount }}</span>
        <span class="ml-1">已解锁</span>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      <button
        v-for="(decoration, index) in unlocks.decorations"
        :key="decoration.id"
        class="card-soft relative overflow-hidden animate-pop-in transition-all duration-300 text-left"
        :class="[
          getDelayClass(index),
          isUnlocked(decoration.id)
            ? 'hover:-translate-y-1 hover:shadow-card active:scale-[0.98] cursor-pointer'
            : 'cursor-not-allowed',
          isActive(decoration.id)
            ? 'ring-4 ring-apricot-500 ring-offset-2 ring-offset-cream-100 shadow-xl scale-[1.03]'
            : '',
        ]"
        :disabled="!isUnlocked(decoration.id)"
        @click="handleClick(decoration.id)"
      >
        <div
          class="h-24 flex items-center justify-center text-5xl relative"
          :class="[
            isUnlocked(decoration.id)
              ? 'bg-gradient-to-br from-cream-50 to-cream-100'
              : 'grayscale opacity-50',
          ]"
        >
          <span
            class="transform transition-transform duration-500"
            :class="isUnlocked(decoration.id) ? 'hover:scale-110' : ''"
          >
            {{ decoration.emoji }}
          </span>

          <div
            v-if="!isUnlocked(decoration.id)"
            class="absolute inset-0 flex items-center justify-center bg-brown-900/10 backdrop-blur-[1px]"
          >
            <span class="text-3xl drop-shadow-md">🔒</span>
          </div>

          <div
            v-if="isActive(decoration.id)"
            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-apricot-500 text-white flex items-center justify-center text-xs font-bold shadow-md animate-bounce-soft"
          >
            ✓
          </div>
        </div>

        <div class="p-3 pt-2">
          <h4
            class="text-sm font-medium text-center leading-tight"
            :class="isUnlocked(decoration.id) ? 'text-brown-900' : 'text-brown-800/50'"
          >
            {{ decoration.name }}
          </h4>
          <p
            v-if="!isUnlocked(decoration.id)"
            class="text-xs text-center mt-1 text-apricot-600/80 font-medium"
          >
            第{{ decoration.threshold }}天解锁
          </p>
        </div>
      </button>
    </div>

    <p class="text-center text-sm text-brown-800/60 leading-relaxed">
      💡 选择一个摆件，它会出现在首页陪伴你做饭～
    </p>
  </div>
</template>
