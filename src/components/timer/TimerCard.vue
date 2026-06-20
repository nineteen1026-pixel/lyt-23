<script setup lang="ts">
import { computed } from 'vue';
import { Play, Pause, RotateCcw, X } from 'lucide-vue-next';
import { useTimerStore, type KitchenTimer } from '@/stores/timer';

const props = defineProps<{
  timer: KitchenTimer;
}>();

const store = useTimerStore();

const progress = computed(() => {
  if (props.timer.durationSeconds <= 0) return 0;
  return ((props.timer.durationSeconds - props.timer.remainingSeconds) / props.timer.durationSeconds) * 100;
});

const circumference = 2 * Math.PI * 42;
const strokeDashoffset = computed(() => {
  const offset = circumference - (progress.value / 100) * circumference;
  return offset;
});

const displayTime = computed(() => {
  const totalSec = props.timer.remainingSeconds;
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

const progressColor = computed(() => {
  if (props.timer.status === 'done') return '#A7C957';
  const ratio = props.timer.remainingSeconds / props.timer.durationSeconds;
  if (ratio > 0.5) return '#FFD166';
  if (ratio > 0.2) return '#FF9F43';
  return '#FF6B35';
});

const statusLabel = computed(() => {
  switch (props.timer.status) {
    case 'idle': return '准备中';
    case 'running': return '计时中';
    case 'paused': return '已暂停';
    case 'done': return '已完成';
  }
});

function handlePlayPause() {
  if (props.timer.status === 'running') {
    store.pauseTimer(props.timer.id);
  } else {
    store.startTimer(props.timer.id);
  }
}
</script>

<template>
  <div
    class="card-soft p-4 relative overflow-hidden transition-all duration-300"
    :class="{
      'ring-2 ring-apricot-400/60 shadow-lg': timer.status === 'running',
      'ring-2 ring-matcha-400/60 shadow-lg': timer.status === 'done',
      'opacity-70': timer.status === 'idle',
    }"
  >
    <div
      v-if="timer.status === 'done'"
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(circle at 50% 50%, rgba(167, 201, 87, 0.08) 0%, transparent 70%);"
    />

    <div class="flex items-center gap-4">
      <div class="relative w-24 h-24 shrink-0">
        <svg class="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="#FFE8D6"
            stroke-width="5"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            :stroke="progressColor"
            stroke-width="5"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl">{{ timer.emoji }}</span>
          <span
            class="text-xs font-bold tabular-nums mt-0.5"
            :style="{ color: progressColor }"
          >
            {{ displayTime }}
          </span>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-sm font-bold text-brown-800 truncate">{{ timer.label }}</h3>
          <span
            v-if="timer.isGlobal && timer.linkedStep === 'bake'"
            class="chip !py-0 !px-1.5 text-[10px] bg-apricot-100 text-apricot-600 border border-apricot-200"
          >
            🔗 全局厨房
          </span>
        </div>
        <div class="text-[11px] text-brown-800/50 mb-3">
          {{ statusLabel }}
          <template v-if="timer.status === 'running' || timer.status === 'paused'">
            · 剩余 {{ displayTime }}
          </template>
          <template v-else-if="timer.status === 'done'">
            · 到时啦！
          </template>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="timer.status !== 'done'"
            class="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            :class="timer.status === 'running'
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
              : 'bg-matcha-100 text-matcha-600 hover:bg-matcha-200'"
            @click="handlePlayPause"
          >
            <Pause v-if="timer.status === 'running'" :size="16" />
            <Play v-else :size="16" />
          </button>

          <button
            class="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-cream-300 transition-all active:scale-90"
            @click="store.resetTimer(timer.id)"
          >
            <RotateCcw :size="14" />
          </button>

          <button
            class="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-red-100 hover:text-red-500 transition-all active:scale-90"
            @click="store.removeTimer(timer.id)"
          >
            <X :size="14" />
          </button>

          <button
            v-if="timer.status === 'done'"
            class="ml-auto btn-primary !py-1.5 !px-4 text-sm"
            @click="store.dismissAlert(timer.id); store.resetTimer(timer.id)"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
