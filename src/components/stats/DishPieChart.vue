<script setup lang="ts">
import { computed } from 'vue';

export interface DishSlice {
  id: string;
  name: string;
  emoji: string;
  count: number;
  color: string;
}

const props = defineProps<{
  data: DishSlice[];
}>();

const size = 200;
const cx = size / 2;
const cy = size / 2;
const outerR = 90;
const innerR = 55;

const total = computed(() => props.data.reduce((sum, d) => sum + d.count, 0));

const slices = computed(() => {
  if (total.value === 0) return [];
  let angle = -Math.PI / 2;
  return props.data.map((d) => {
    const fraction = d.count / total.value;
    const startAngle = angle;
    const endAngle = angle + fraction * 2 * Math.PI;
    angle = endAngle;

    const largeArc = fraction > 0.5 ? 1 : 0;
    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);

    const midAngle = (startAngle + endAngle) / 2;
    const labelR = (outerR + innerR) / 2;
    const labelX = cx + labelR * Math.cos(midAngle);
    const labelY = cy + labelR * Math.sin(midAngle);

    const path = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ');

    return {
      path,
      color: d.color,
      name: d.name,
      emoji: d.emoji,
      fraction,
      labelX,
      labelY,
      showLabel: fraction >= 0.08,
    };
  });
});

const topDishes = computed(() => {
  const sorted = [...props.data].sort((a, b) => b.count - a.count);
  return sorted.slice(0, 5);
});
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
    <div class="shrink-0">
      <svg
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
      >
        <circle
          v-if="total === 0"
          :cx="cx"
          :cy="cy"
          :r="outerR"
          fill="none"
          stroke="#FFE8D6"
          stroke-width="outerR - innerR"
        />
        <path
          v-for="(slice, i) in slices"
          :key="i"
          :d="slice.path"
          :fill="slice.color"
          class="transition-all duration-500"
          opacity="0.85"
        />
        <text
          v-for="(slice, i) in slices"
          :key="'l-' + i"
          :x="slice.labelX"
          :y="slice.labelY"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="14"
        >
          {{ slice.showLabel ? slice.emoji : '' }}
        </text>
        <text
          :x="cx"
          :y="cy - 6"
          text-anchor="middle"
          fill="#5A3620"
          font-size="22"
          font-weight="700"
        >
          {{ total }}
        </text>
        <text
          :x="cx"
          :y="cy + 14"
          text-anchor="middle"
          fill="#6B4226"
          fill-opacity="0.5"
          font-size="11"
        >
          总次数
        </text>
      </svg>
    </div>

    <div class="flex-1 min-w-0 w-full">
      <div v-if="topDishes.length === 0" class="text-sm text-brown-800/50 py-6 text-center">
        暂无烹饪记录
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(dish, i) in topDishes"
          :key="dish.id"
          class="flex items-center gap-3"
        >
          <span
            class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
            :style="{ backgroundColor: dish.color + '33', color: dish.color }"
          >
            {{ i + 1 }}
          </span>
          <span class="text-xl shrink-0">{{ dish.emoji }}</span>
          <span class="text-sm text-brown-800 truncate flex-1">{{ dish.name }}</span>
          <span class="text-sm font-medium text-brown-900 shrink-0">{{ dish.count }} 次</span>
          <div class="w-16 h-2 rounded-full bg-cream-200 overflow-hidden shrink-0">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: total > 0 ? `${(dish.count / total) * 100}%` : '0%',
                backgroundColor: dish.color,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
