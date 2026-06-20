<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Trash2, Timer } from 'lucide-vue-next';
import { useTimerStore } from '@/stores/timer';
import TimerCard from './TimerCard.vue';
import TimerCreateForm from './TimerCreateForm.vue';

const store = useTimerStore();

const showCreateForm = ref(false);

const activeTimers = computed(() =>
  store.timers.filter((t) => t.status === 'running' || t.status === 'paused'),
);

const idleTimers = computed(() =>
  store.timers.filter((t) => t.status === 'idle'),
);

const doneTimers = computed(() =>
  store.timers.filter((t) => t.status === 'done'),
);

function handleCreated(): void {
  showCreateForm.value = false;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-apricot-500/15 flex items-center justify-center text-apricot-500">
          <Timer :size="22" :stroke-width="2.2" />
        </div>
        <div>
          <h2 class="text-display text-2xl text-brown-900">厨房计时器</h2>
          <p class="text-xs text-brown-800/50">
            {{ store.activeTimerCount > 0 ? `${store.activeTimerCount} 个计时器运行中` : '没有运行中的计时器' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="doneTimers.length > 0"
          class="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1"
          @click="store.clearDoneTimers()"
        >
          <Trash2 :size="14" />
          <span>清除已完成</span>
        </button>
        <button
          class="btn-primary !py-2.5 !px-4 text-sm flex items-center gap-1.5"
          @click="showCreateForm = !showCreateForm"
        >
          <Plus :size="16" />
          <span>添加</span>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showCreateForm" class="mb-6 animate-fade-slide">
        <TimerCreateForm @created="handleCreated" />
      </div>
    </Transition>

    <div v-if="store.timers.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4 opacity-50">⏱️</div>
      <h3 class="text-lg font-bold text-brown-800/60 mb-2">还没有计时器</h3>
      <p class="text-sm text-brown-800/40 mb-6">点击上方「添加」开始你的第一个计时</p>
      <button
        class="btn-primary flex items-center gap-2 mx-auto"
        @click="showCreateForm = true"
      >
        <Plus :size="18" />
        <span>添加计时器</span>
      </button>
    </div>

    <div v-else class="space-y-6">
      <section v-if="activeTimers.length > 0">
        <h3 class="text-sm font-bold text-brown-800/70 mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-apricot-500 animate-pulse" />
          运行中 ({{ activeTimers.length }})
        </h3>
        <div class="grid gap-3">
          <TimerCard
            v-for="timer in activeTimers"
            :key="timer.id"
            :timer="timer"
          />
        </div>
      </section>

      <section v-if="idleTimers.length > 0">
        <h3 class="text-sm font-bold text-brown-800/70 mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cream-300" />
          准备中 ({{ idleTimers.length }})
        </h3>
        <div class="grid gap-3">
          <TimerCard
            v-for="timer in idleTimers"
            :key="timer.id"
            :timer="timer"
          />
        </div>
      </section>

      <section v-if="doneTimers.length > 0">
        <h3 class="text-sm font-bold text-brown-800/70 mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-matcha-500" />
          已完成 ({{ doneTimers.length }})
        </h3>
        <div class="grid gap-3">
          <TimerCard
            v-for="timer in doneTimers"
            :key="timer.id"
            :timer="timer"
          />
        </div>
      </section>
    </div>
  </div>
</template>
