import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface KitchenTimer {
  id: string;
  label: string;
  emoji: string;
  durationSeconds: number;
  remainingSeconds: number;
  status: 'idle' | 'running' | 'paused' | 'done';
  linkedDishId?: string;
  linkedDishName?: string;
  linkedStep?: string;
  isGlobal: boolean;
  createdAt: number;
  alertTriggered: boolean;
  color: string;
}

export interface TimerPreset {
  label: string;
  emoji: string;
  seconds: number;
  color: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { label: '煮蛋计时', emoji: '🥚', seconds: 420, color: '#FFD166' },
  { label: '意面计时', emoji: '🍝', seconds: 600, color: '#A7C957' },
  { label: '烤箱预热', emoji: '🔥', seconds: 300, color: '#FF6B35' },
  { label: '焖饭计时', emoji: '🍚', seconds: 1200, color: '#FF8C42' },
  { label: '煲汤计时', emoji: '🍲', seconds: 1800, color: '#D4A373' },
  { label: '泡茶计时', emoji: '🍵', seconds: 180, color: '#88B04B' },
];

const MAX_TIMERS = 8;

function generateId(): string {
  return `timer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useTimerStore = defineStore(
  'timer',
  () => {
    const timers = ref<KitchenTimer[]>([]);
    const pendingAlerts = ref<KitchenTimer[]>([]);

    const runningTimers = computed(() =>
      timers.value.filter((t) => t.status === 'running'),
    );

    const activeTimerCount = computed(() =>
      timers.value.filter((t) => t.status === 'running' || t.status === 'paused').length,
    );

    const hasRunningTimers = computed(() => runningTimers.value.length > 0);

    const globalTimers = computed(() => timers.value.filter((t) => t.isGlobal));

    const dishTimers = computed(() => timers.value.filter((t) => !t.isGlobal));

    function addTimer(options: {
      label: string;
      emoji: string;
      durationSeconds: number;
      color?: string;
      linkedDishId?: string;
      linkedDishName?: string;
      linkedStep?: string;
      isGlobal?: boolean;
    }): KitchenTimer {
      if (timers.value.length >= MAX_TIMERS) {
        const doneTimer = timers.value.find((t) => t.status === 'done');
        if (doneTimer) {
          removeTimer(doneTimer.id);
        } else {
          throw new Error(`最多同时运行 ${MAX_TIMERS} 个计时器`);
        }
      }

      const timer: KitchenTimer = {
        id: generateId(),
        label: options.label,
        emoji: options.emoji,
        durationSeconds: options.durationSeconds,
        remainingSeconds: options.durationSeconds,
        status: 'idle',
        linkedDishId: options.linkedDishId,
        linkedDishName: options.linkedDishName,
        linkedStep: options.linkedStep,
        isGlobal: options.isGlobal ?? true,
        createdAt: Date.now(),
        alertTriggered: false,
        color: options.color ?? '#FF8C42',
      };

      timers.value.unshift(timer);
      return timer;
    }

    function removeTimer(id: string): void {
      const idx = timers.value.findIndex((t) => t.id === id);
      if (idx > -1) {
        timers.value.splice(idx, 1);
      }
      const alertIdx = pendingAlerts.value.findIndex((t) => t.id === id);
      if (alertIdx > -1) {
        pendingAlerts.value.splice(alertIdx, 1);
      }
    }

    function startTimer(id: string): void {
      const timer = timers.value.find((t) => t.id === id);
      if (!timer) return;
      if (timer.status === 'idle' || timer.status === 'done') {
        timer.remainingSeconds = timer.durationSeconds;
      }
      timer.status = 'running';
      timer.alertTriggered = false;
    }

    function pauseTimer(id: string): void {
      const timer = timers.value.find((t) => t.id === id);
      if (timer && timer.status === 'running') {
        timer.status = 'paused';
      }
    }

    function resumeTimer(id: string): void {
      const timer = timers.value.find((t) => t.id === id);
      if (timer && timer.status === 'paused') {
        timer.status = 'running';
      }
    }

    function resetTimer(id: string): void {
      const timer = timers.value.find((t) => t.id === id);
      if (timer) {
        timer.remainingSeconds = timer.durationSeconds;
        timer.status = 'idle';
        timer.alertTriggered = false;
      }
      const alertIdx = pendingAlerts.value.findIndex((t) => t.id === id);
      if (alertIdx > -1) {
        pendingAlerts.value.splice(alertIdx, 1);
      }
    }

    function tickAll(): void {
      for (const timer of timers.value) {
        if (timer.status !== 'running') continue;
        timer.remainingSeconds = Math.max(0, timer.remainingSeconds - 1);
        if (timer.remainingSeconds <= 0) {
          timer.status = 'done';
          timer.alertTriggered = true;
          if (!pendingAlerts.value.find((t) => t.id === timer.id)) {
            pendingAlerts.value.push({ ...timer });
          }
        }
      }
    }

    function dismissAlert(id: string): void {
      const idx = pendingAlerts.value.findIndex((t) => t.id === id);
      if (idx > -1) {
        pendingAlerts.value.splice(idx, 1);
      }
    }

    function dismissAllAlerts(): void {
      pendingAlerts.value = [];
    }

    function clearDoneTimers(): void {
      timers.value = timers.value.filter((t) => t.status !== 'done');
      pendingAlerts.value = [];
    }

    function findLinkedTimer(dishId: string, step?: string): KitchenTimer | undefined {
      return timers.value.find(
        (t) => t.linkedDishId === dishId && (!step || t.linkedStep === step),
      );
    }

    function addDishBakeTimer(dishId: string, dishName: string, dishEmoji: string, dishColor: string, durationMinutes: number): KitchenTimer {
      const existing = findLinkedTimer(dishId, 'bake');
      if (existing) return existing;

      return addTimer({
        label: `${dishName} · 烘烤`,
        emoji: dishEmoji,
        durationSeconds: durationMinutes * 60,
        color: dishColor,
        linkedDishId: dishId,
        linkedDishName: dishName,
        linkedStep: 'bake',
        isGlobal: true,
      });
    }

    return {
      timers,
      pendingAlerts,
      runningTimers,
      activeTimerCount,
      hasRunningTimers,
      globalTimers,
      dishTimers,
      addTimer,
      removeTimer,
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      tickAll,
      dismissAlert,
      dismissAllAlerts,
      clearDoneTimers,
      findLinkedTimer,
      addDishBakeTimer,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-timers',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
