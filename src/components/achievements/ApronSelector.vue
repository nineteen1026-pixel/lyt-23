<script setup lang="ts">
import { computed } from 'vue';
import { useCookingStore } from '@/stores/cooking';
import { unlocks, type Apron } from '@/data/unlocks';

const store = useCookingStore();

const totalCount = computed(() => unlocks.aprons.length);
const unlockedCount = computed(() => store.unlockedAprons.length);

function isUnlocked(id: string): boolean {
  return store.unlockedAprons.includes(id);
}

function isActive(id: string): boolean {
  return store.activeApron === id;
}

function handleClick(id: string): void {
  if (isUnlocked(id)) {
    store.setActiveApron(id);
  }
}

function getDelayClass(index: number): string {
  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];
  return delays[index % delays.length];
}

function getApronStyle(apron: Apron) {
  const color = apron.color;
  const stripe = apron.stripe;

  if (!stripe) {
    return { background: color };
  }

  switch (stripe) {
    case 'gingham':
      return {
        background: `
          linear-gradient(45deg, ${color} 25%, transparent 25%),
          linear-gradient(-45deg, ${color} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${color} 75%),
          linear-gradient(-45deg, transparent 75%, ${color} 75%),
          #FFF8F0
        `,
        backgroundSize: '10px 10px',
        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
      };
    case 'stripe':
      return {
        background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 8px, #FFF8F0 8px, #FFF8F0 16px)`,
      };
    case 'denim':
      return {
        background: `
          linear-gradient(135deg, #6B8EAE 25%, #5A7D9C 25%, #5A7D9C 50%, #6B8EAE 50%, #6B8EAE 75%, #5A7D9C 75%)
        `,
        backgroundSize: '6px 6px',
      };
    case 'cherry':
      return {
        background: `
          radial-gradient(circle at 30% 30%, #E63946 2px, transparent 3px),
          radial-gradient(circle at 70% 70%, #E63946 2px, transparent 3px),
          #FFF8F0
        `,
        backgroundSize: '16px 16px',
      };
    case 'rainbow':
      return {
        background: `linear-gradient(135deg, #FF6B6B 0%, #FFE66D 20%, #A7C957 40%, #4ECDC4 60%, #6B8EAE 80%, #DDA0DD 100%)`,
      };
    default:
      return { background: color };
  }
}
</script>

<template>
  <div class="card-soft p-6">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-display text-2xl text-brown-900">
        👩‍🍳 围裙皮肤
      </h2>
      <div class="chip bg-apricot-400/30 text-apricot-600 border border-apricot-400/40">
        <span class="font-bold">{{ unlockedCount }}</span>
        <span>/</span>
        <span>{{ totalCount }}</span>
        <span class="ml-1">已解锁</span>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <button
        v-for="(apron, index) in unlocks.aprons"
        :key="apron.id"
        class="card-soft relative overflow-hidden animate-pop-in transition-all duration-300 p-3 flex flex-col items-center gap-2"
        :class="[
          getDelayClass(index),
          isUnlocked(apron.id)
            ? 'hover:-translate-y-1 hover:shadow-card active:scale-[0.98] cursor-pointer'
            : 'cursor-not-allowed',
          isActive(apron.id)
            ? 'ring-4 ring-apricot-500 ring-offset-2 ring-offset-cream-100 shadow-xl scale-[1.03]'
            : '',
        ]"
        :disabled="!isUnlocked(apron.id)"
        @click="handleClick(apron.id)"
      >
        <div
          class="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-inner border-2 border-white/80"
          :class="!isUnlocked(apron.id) ? 'grayscale opacity-50' : ''"
        >
          <div
            class="absolute inset-0"
            :style="getApronStyle(apron)"
          />
          <svg
            class="relative w-10 h-10"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12 L28 8 L36 8 L44 12 L42 24 L46 32 L46 56 L18 56 L18 32 L22 24 Z"
              fill="white"
              fill-opacity="0.35"
              stroke="white"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M28 8 Q28 4 32 4 Q36 4 36 8"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M20 12 L10 10 M44 12 L54 10"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>

          <div
            v-if="!isUnlocked(apron.id)"
            class="absolute inset-0 flex items-center justify-center bg-brown-900/20 backdrop-blur-[1px]"
          >
            <span class="text-2xl drop-shadow-md">🔒</span>
          </div>

          <div
            v-if="isActive(apron.id)"
            class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-apricot-500 text-white flex items-center justify-center text-xs font-bold shadow-md animate-bounce-soft border-2 border-white"
          >
            ✓
          </div>
        </div>

        <div class="text-center w-full">
          <h4
            class="text-sm font-medium leading-tight"
            :class="isUnlocked(apron.id) ? 'text-brown-900' : 'text-brown-800/50'"
          >
            {{ apron.name }}
          </h4>

          <div
            v-if="isActive(apron.id)"
            class="mt-1"
          >
            <span class="chip bg-apricot-500 text-white text-[10px]">
              ✨ 穿戴中
            </span>
          </div>

          <p
            v-else-if="!isUnlocked(apron.id)"
            class="text-xs mt-1 text-apricot-600/80 font-medium"
          >
            第{{ apron.threshold }}天解锁
          </p>
        </div>
      </button>
    </div>
  </div>
</template>
