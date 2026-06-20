import { ref, watch, onUnmounted } from 'vue';
import { useTimerStore, type KitchenTimer } from '@/stores/timer';

export function useKitchenTimer() {
  const store = useTimerStore();
  const tickInterval = ref<number | null>(null);
  const audioContext = ref<AudioContext | null>(null);

  function startTicking(): void {
    if (tickInterval.value) return;
    store.timers
      .filter((t) => t.status === 'idle' || t.status === 'done')
      .forEach((t) => {
        if (t.status === 'done') {
          t.remainingSeconds = t.durationSeconds;
        }
      });
    tickInterval.value = window.setInterval(() => {
      store.tickAll();
    }, 1000);
  }

  function stopTicking(): void {
    if (tickInterval.value) {
      clearInterval(tickInterval.value);
      tickInterval.value = null;
    }
  }

  function ensureTicking(): void {
    if (store.hasRunningTimers && !tickInterval.value) {
      startTicking();
    }
  }

  function playDingSound(): void {
    try {
      if (!audioContext.value) {
        audioContext.value = new AudioContext();
      }
      const ctx = audioContext.value;

      const frequencies = [880, 1100, 880];
      const durations = [0.15, 0.15, 0.3];

      let startTime = ctx.currentTime;
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i]);
        osc.start(startTime);
        osc.stop(startTime + durations[i]);
        startTime += durations[i] + 0.05;
      });
    } catch {
      // silent fallback
    }
  }

  function sendBrowserNotification(timer: KitchenTimer): void {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('⏰ 计时器到时啦！', {
        body: `${timer.emoji} ${timer.label} 已完成！`,
        icon: '/favicon.svg',
        tag: timer.id,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('⏰ 计时器到时啦！', {
            body: `${timer.emoji} ${timer.label} 已完成！`,
            icon: '/favicon.svg',
            tag: timer.id,
          });
        }
      });
    }
  }

  watch(
    () => store.pendingAlerts.length,
    (newLen, oldLen) => {
      if (newLen > oldLen) {
        const newAlerts = store.pendingAlerts.slice(oldLen);
        newAlerts.forEach((alert) => {
          playDingSound();
          sendBrowserNotification(alert);
        });
      }
    },
  );

  watch(
    () => store.hasRunningTimers,
    (has) => {
      if (has) {
        ensureTicking();
      } else {
        stopTicking();
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    stopTicking();
    if (audioContext.value) {
      audioContext.value.close();
      audioContext.value = null;
    }
  });

  return {
    startTicking,
    stopTicking,
    ensureTicking,
    playDingSound,
  };
}
