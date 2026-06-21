<script setup lang="ts">
import { computed } from 'vue';
import { useCookingStore } from '@/stores/cooking';
import { unlocks, getAllThresholds, getNextThresholdReward, type Decoration, type Apron } from '@/data/unlocks';
import { themes, type KitchenBackground, type CounterMaterial } from '@/data/themes';

interface ThresholdItem {
  threshold: number;
  decorations: Decoration[];
  aprons: Apron[];
  backgrounds: KitchenBackground[];
  counters: CounterMaterial[];
}

const store = useCookingStore();

const thresholds = getAllThresholds();
const maxThreshold = Math.max(...thresholds, 1);

const unlockedDecorationCount = computed(() => store.unlockedDecorations.length);
const totalDecorationCount = computed(() => unlocks.decorations.length);
const unlockedApronCount = computed(() => store.unlockedAprons.length);
const totalApronCount = computed(() => unlocks.aprons.length);
const unlockedBackgroundCount = computed(() => store.unlockedBackgrounds.length);
const totalBackgroundCount = computed(() => themes.backgrounds.length);
const unlockedCounterCount = computed(() => store.unlockedCounters.length);
const totalCounterCount = computed(() => themes.counters.length);

const progressPercent = computed(() => {
  const pct = Math.min((store.totalDays / maxThreshold) * 100, 100);
  return pct;
});

function getThresholdIcon(threshold: number): string {
  const deco = unlocks.decorations.find((d) => d.threshold === threshold);
  if (deco) return deco.emoji;

  const apron = unlocks.aprons.find((a) => a.threshold === threshold);
  if (apron) return '👗';

  const bg = themes.backgrounds.find((b) => b.threshold === threshold);
  if (bg) return bg.emoji;

  const counter = themes.counters.find((c) => c.threshold === threshold);
  if (counter) return counter.emoji;

  return '🎁';
}

function isThresholdReached(threshold: number) {
  return store.totalDays >= threshold;
}

function getThresholdPercent(threshold: number) {
  return (threshold / maxThreshold) * 100;
}

const thresholdItems = computed<ThresholdItem[]>(() => {
  const map = new Map<number, ThresholdItem>();

  unlocks.decorations.forEach((d) => {
    if (!map.has(d.threshold)) {
      map.set(d.threshold, { threshold: d.threshold, decorations: [], aprons: [], backgrounds: [], counters: [] });
    }
    map.get(d.threshold)!.decorations.push(d);
  });

  unlocks.aprons.forEach((a) => {
    if (!map.has(a.threshold)) {
      map.set(a.threshold, { threshold: a.threshold, decorations: [], aprons: [], backgrounds: [], counters: [] });
    }
    map.get(a.threshold)!.aprons.push(a);
  });

  themes.backgrounds.forEach((b) => {
    if (!map.has(b.threshold)) {
      map.set(b.threshold, { threshold: b.threshold, decorations: [], aprons: [], backgrounds: [], counters: [] });
    }
    map.get(b.threshold)!.backgrounds.push(b);
  });

  themes.counters.forEach((c) => {
    if (!map.has(c.threshold)) {
      map.set(c.threshold, { threshold: c.threshold, decorations: [], aprons: [], backgrounds: [], counters: [] });
    }
    map.get(c.threshold)!.counters.push(c);
  });

  return Array.from(map.values()).sort((a, b) => a.threshold - b.threshold);
});

const nextReward = computed(() => getNextThresholdReward(store.totalDays));

function daysRemaining(threshold: number) {
  return Math.max(threshold - store.totalDays, 0);
}

function isDecorationUnlocked(id: string) {
  return store.unlockedDecorations.includes(id);
}

function isApronUnlocked(id: string) {
  return store.unlockedAprons.includes(id);
}

function isBackgroundUnlocked(id: string) {
  return store.unlockedBackgrounds.includes(id);
}

function isCounterUnlocked(id: string) {
  return store.unlockedCounters.includes(id);
}

function getApronStyle(item: Apron) {
  const color = item.color;
  const stripe = item.stripe;

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
          radial-gradient(circle at 30% 30%, #E63946 1.5px, transparent 2.5px),
          radial-gradient(circle at 70% 70%, #E63946 1.5px, transparent 2.5px),
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
  <div class="space-y-5">
    <div class="grid grid-cols-2 gap-3">
      <div class="card-soft p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🏠</span>
          <span class="text-display text-lg text-brown-900">摆件</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-apricot-500">{{ unlockedDecorationCount }}</span>
          <span class="text-brown-800/50">/</span>
          <span class="text-xl text-brown-800/70">{{ totalDecorationCount }}</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-cream-200 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: totalDecorationCount > 0 ? `${(unlockedDecorationCount / totalDecorationCount) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #FFA66D, #FF8C42)',
            }"
          />
        </div>
      </div>

      <div class="card-soft p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">👗</span>
          <span class="text-display text-lg text-brown-900">围裙</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-matcha-500">{{ unlockedApronCount }}</span>
          <span class="text-brown-800/50">/</span>
          <span class="text-xl text-brown-800/70">{{ totalApronCount }}</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-cream-200 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: totalApronCount > 0 ? `${(unlockedApronCount / totalApronCount) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #BFD87A, #A7C957)',
            }"
          />
        </div>
      </div>

      <div class="card-soft p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🎨</span>
          <span class="text-display text-lg text-brown-900">背景</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-blue-500">{{ unlockedBackgroundCount }}</span>
          <span class="text-brown-800/50">/</span>
          <span class="text-xl text-brown-800/70">{{ totalBackgroundCount }}</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-cream-200 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: totalBackgroundCount > 0 ? `${(unlockedBackgroundCount / totalBackgroundCount) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #60A5FA, #3B82F6)',
            }"
          />
        </div>
      </div>

      <div class="card-soft p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🪑</span>
          <span class="text-display text-lg text-brown-900">台面</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-purple-500">{{ unlockedCounterCount }}</span>
          <span class="text-brown-800/50">/</span>
          <span class="text-xl text-brown-800/70">{{ totalCounterCount }}</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-cream-200 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: totalCounterCount > 0 ? `${(unlockedCounterCount / totalCounterCount) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #C084FC, #A855F7)',
            }"
          />
        </div>
      </div>
    </div>

    <div class="card-soft p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-display text-xl text-brown-900">解锁进度</h3>
        <span class="text-sm text-brown-800/70">第 {{ store.totalDays }} / {{ maxThreshold }} 天</span>
      </div>

      <div class="relative pt-8 pb-4 px-2">
        <div
          class="absolute left-2 right-2 top-10 h-4 rounded-full a11y-progress-track"
          style="background: #FFE8D6;"
        />
        <div
          class="absolute left-2 top-10 h-4 rounded-full transition-all duration-700 ease-out"
          :style="{
            width: `calc(${progressPercent}% - ${progressPercent > 0 ? '0.5rem' : '0'})`,
            background: 'linear-gradient(90deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%)',
          }"
        />

        <div
          v-for="threshold in thresholds"
          :key="threshold"
          class="absolute top-6 -translate-x-1/2 flex flex-col items-center"
          :style="{ left: `calc(${getThresholdPercent(threshold)}% )` }"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 z-10 border-2"
            :class="[
              isThresholdReached(threshold)
                ? 'bg-apricot-500 border-apricot-400 shadow-md'
                : nextReward && nextReward.threshold === threshold
                  ? 'bg-cream-100 border-matcha-400 progress-dot-pulse'
                  : 'bg-white border-cream-300',
            ]"
          >
            <span v-if="isThresholdReached(threshold)">{{ getThresholdIcon(threshold) }}</span>
            <span v-else-if="nextReward && nextReward.threshold === threshold" class="text-sm">{{ getThresholdIcon(threshold) }}</span>
            <span v-else class="text-brown-800/40">🔒</span>
          </div>
          <span
            class="mt-1 text-xs font-medium whitespace-nowrap"
            :class="isThresholdReached(threshold) ? 'text-apricot-600' : nextReward && nextReward.threshold === threshold ? 'text-matcha-600 font-bold' : 'text-brown-800/40'"
          >
            {{ threshold }}天
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="group in thresholdItems"
        :key="group.threshold"
        class="space-y-3"
      >
        <div class="flex items-center gap-3 px-1">
          <span
            class="chip"
            :class="store.totalDays >= group.threshold
              ? 'bg-matcha-400/30 text-matcha-600'
              : 'bg-cream-200 text-brown-800/60'"
          >
            第 {{ group.threshold }} 天
          </span>
          <div class="flex-1 h-px bg-cream-300" />
          <span
            v-if="store.totalDays < group.threshold"
            class="text-xs text-brown-800/50"
          >
            还差 {{ daysRemaining(group.threshold) }} 天
          </span>
          <span
            v-else
            class="text-xs text-matcha-600 font-medium"
          >
            已解锁 ✓
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="deco in group.decorations"
            :key="deco.id"
            class="card-soft p-4 transition-all duration-300"
            :class="isDecorationUnlocked(deco.id)
              ? 'ring-2 ring-matcha-400/60 bg-matcha-400/10'
              : 'opacity-70'"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
              >
                {{ deco.emoji }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-display text-base text-brown-900 truncate">{{ deco.name }}</h4>
                  <span
                    v-if="isDecorationUnlocked(deco.id)"
                    class="chip bg-matcha-400/40 text-matcha-600 text-xs shrink-0"
                  >
                    已解锁 ✓
                  </span>
                </div>
                <p class="text-xs text-brown-800/60 mb-2 line-clamp-1">{{ deco.description }}</p>
                <p
                  v-if="!isDecorationUnlocked(deco.id)"
                  class="text-xs text-brown-800/50"
                >
                  还差 {{ daysRemaining(group.threshold) }} 天解锁
                </p>
              </div>
            </div>
          </div>

          <div
            v-for="apron in group.aprons"
            :key="apron.id"
            class="card-soft p-4 transition-all duration-300"
            :class="isApronUnlocked(apron.id)
              ? 'ring-2 ring-matcha-400/60 bg-matcha-400/10'
              : 'opacity-70'"
          >
            <div class="flex items-center gap-4">
              <div
                class="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border-2 border-white/80"
              >
                <div
                  class="absolute inset-0"
                  :style="getApronStyle(apron)"
                />
                <svg
                  class="relative w-9 h-9"
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
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-display text-base text-brown-900 truncate">{{ apron.name }}</h4>
                  <span
                    v-if="isApronUnlocked(apron.id)"
                    class="chip bg-matcha-400/40 text-matcha-600 text-xs shrink-0"
                  >
                    已解锁 ✓
                  </span>
                </div>
                <p class="text-xs text-brown-800/60 mb-2">第 {{ apron.threshold }} 天解锁</p>
                <p
                  v-if="!isApronUnlocked(apron.id)"
                  class="text-xs text-brown-800/50"
                >
                  还差 {{ daysRemaining(group.threshold) }} 天解锁
                </p>
              </div>
            </div>
          </div>

          <div
            v-for="bg in group.backgrounds"
            :key="bg.id"
            class="card-soft p-4 transition-all duration-300"
            :class="isBackgroundUnlocked(bg.id)
              ? 'ring-2 ring-blue-400/60 bg-blue-400/10'
              : 'opacity-70'"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ring-2 ring-white/80"
                :style="{ background: `linear-gradient(135deg, ${bg.colors.bgSoft}, ${bg.colors.bg})` }"
              >
                {{ bg.emoji }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-display text-base text-brown-900 truncate">{{ bg.name }}</h4>
                  <span
                    v-if="isBackgroundUnlocked(bg.id)"
                    class="chip bg-blue-400/40 text-blue-600 text-xs shrink-0"
                  >
                    已解锁 ✓
                  </span>
                </div>
                <p class="text-xs text-brown-800/60 mb-2 line-clamp-1">{{ bg.description }}</p>
                <p
                  v-if="!isBackgroundUnlocked(bg.id)"
                  class="text-xs text-brown-800/50"
                >
                  还差 {{ daysRemaining(group.threshold) }} 天解锁
                </p>
              </div>
            </div>
          </div>

          <div
            v-for="counter in group.counters"
            :key="counter.id"
            class="card-soft p-4 transition-all duration-300"
            :class="isCounterUnlocked(counter.id)
              ? 'ring-2 ring-purple-400/60 bg-purple-400/10'
              : 'opacity-70'"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ring-2 ring-white/80"
                :style="{ background: counter.background }"
              >
                {{ counter.emoji }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-display text-base text-brown-900 truncate">{{ counter.name }}</h4>
                  <span
                    v-if="isCounterUnlocked(counter.id)"
                    class="chip bg-purple-400/40 text-purple-600 text-xs shrink-0"
                  >
                    已解锁 ✓
                  </span>
                </div>
                <p class="text-xs text-brown-800/60 mb-2 line-clamp-1">{{ counter.description }}</p>
                <p
                  v-if="!isCounterUnlocked(counter.id)"
                  class="text-xs text-brown-800/50"
                >
                  还差 {{ daysRemaining(group.threshold) }} 天解锁
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
