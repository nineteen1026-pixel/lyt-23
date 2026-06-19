<script setup lang="ts">
import { computed } from 'vue';

export interface MonthlyData {
  label: string;
  count: number;
}

const props = defineProps<{
  data: MonthlyData[];
}>();

const maxCount = computed(() => Math.max(...props.data.map((d) => d.count), 1));

const barWidth = 32;
const barGap = 16;
const chartHeight = 200;
const chartPaddingTop = 20;
const chartPaddingBottom = 36;
const svgWidth = computed(() => props.data.length * (barWidth + barGap) - barGap + barGap * 2);
const svgHeight = chartHeight + chartPaddingTop + chartPaddingBottom;

const bars = computed(() =>
  props.data.map((d, i) => {
    const barHeight = maxCount.value > 0 ? (d.count / maxCount.value) * chartHeight : 0;
    const x = barGap + i * (barWidth + barGap);
    const y = chartPaddingTop + chartHeight - barHeight;
    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      label: d.label,
      count: d.count,
      labelX: x + barWidth / 2,
      labelY: chartPaddingTop + chartHeight + 20,
      countY: Math.max(y - 6, chartPaddingTop),
    };
  }),
);

const gridLines = computed(() => {
  const lines: { y: number; value: number }[] = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const value = Math.round((maxCount.value / steps) * i);
    const y = chartPaddingTop + chartHeight - (i / steps) * chartHeight;
    lines.push({ y, value });
  }
  return lines;
});
</script>

<template>
  <div class="w-full overflow-x-auto scrollbar-hide">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="block"
    >
      <line
        v-for="line in gridLines"
        :key="line.value"
        :x1="0"
        :y1="line.y"
        :x2="svgWidth"
        :y2="line.y"
        stroke="#FFD4B3"
        stroke-width="1"
        stroke-dasharray="4 3"
      />
      <text
        v-for="line in gridLines"
        :key="'v-' + line.value"
        :x="0"
        :y="line.y - 4"
        fill="#6B4226"
        fill-opacity="0.35"
        font-size="10"
      >
        {{ line.value }}
      </text>
      <rect
        v-for="bar in bars"
        :key="bar.label"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="bar.height"
        rx="6"
        fill="url(#barGradient)"
        class="transition-all duration-500"
      />
      <text
        v-for="bar in bars"
        :key="'count-' + bar.label"
        :x="bar.labelX"
        :y="bar.countY"
        text-anchor="middle"
        fill="#FF8C42"
        font-size="12"
        font-weight="600"
      >
        {{ bar.count || '' }}
      </text>
      <text
        v-for="bar in bars"
        :key="'label-' + bar.label"
        :x="bar.labelX"
        :y="bar.labelY"
        text-anchor="middle"
        fill="#6B4226"
        fill-opacity="0.6"
        font-size="11"
      >
        {{ bar.label }}
      </text>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFA66D" />
          <stop offset="100%" stop-color="#FF8C42" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
