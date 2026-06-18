import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { checkNewUnlocks, type Apron, type Decoration } from '@/data/unlocks';

export interface CookingRecord {
  dishId: string;
  completedAt: string;
}

export interface UnlockResult {
  newDecorations: Decoration[];
  newAprons: Apron[];
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isYesterday(dateStr: string): boolean {
  const today = new Date();
  const target = new Date(dateStr);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return (
    target.getFullYear() === yesterday.getFullYear() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getDate() === yesterday.getDate()
  );
}

export const useCookingStore = defineStore(
  'cooking',
  () => {
    const totalDays = ref(0);
    const streakDays = ref(0);
    const lastCheckInDate = ref<string | null>(null);
    const checkInDates = ref<string[]>([]);
    const cookingHistory = ref<CookingRecord[]>([]);
    const unlockedDecorations = ref<string[]>([]);
    const unlockedAprons = ref<string[]>(['default']);
    const activeDecoration = ref<string | null>(null);
    const activeApron = ref<string>('default');

    const isCheckedInToday = computed(() => lastCheckInDate.value === todayStr());

    function addCookingRecord(dishId: string): void {
      cookingHistory.value.unshift({
        dishId,
        completedAt: new Date().toISOString(),
      });
      if (cookingHistory.value.length > 500) {
        cookingHistory.value = cookingHistory.value.slice(0, 500);
      }
    }

    function checkIn(): UnlockResult {
      const today = todayStr();
      const prevTotal = totalDays.value;
      if (lastCheckInDate.value === today) {
        return { newDecorations: [], newAprons: [] };
      }

      if (lastCheckInDate.value && isYesterday(lastCheckInDate.value)) {
        streakDays.value += 1;
      } else {
        streakDays.value = 1;
      }

      totalDays.value += 1;
      lastCheckInDate.value = today;
      checkInDates.value.push(today);
      if (checkInDates.value.length > 365) {
        checkInDates.value = checkInDates.value.slice(-365);
      }

      const { newDecorations, newAprons } = checkNewUnlocks(prevTotal, totalDays.value);
      if (newDecorations.length > 0) {
        unlockedDecorations.value = Array.from(
          new Set([...unlockedDecorations.value, ...newDecorations.map((d) => d.id)]),
        );
      }
      if (newAprons.length > 0) {
        unlockedAprons.value = Array.from(
          new Set([...unlockedAprons.value, ...newAprons.map((a) => a.id)]),
        );
      }

      return { newDecorations, newAprons };
    }

    function toggleDecoration(id: string): void {
      if (!unlockedDecorations.value.includes(id)) return;
      activeDecoration.value = activeDecoration.value === id ? null : id;
    }

    function setActiveApron(id: string): void {
      if (unlockedAprons.value.includes(id)) {
        activeApron.value = id;
      }
    }

    function hasCheckedInOn(dateStr: string): boolean {
      return checkInDates.value.includes(dateStr);
    }

    return {
      totalDays,
      streakDays,
      lastCheckInDate,
      checkInDates,
      cookingHistory,
      unlockedDecorations,
      unlockedAprons,
      activeDecoration,
      activeApron,
      isCheckedInToday,
      addCookingRecord,
      checkIn,
      toggleDecoration,
      setActiveApron,
      hasCheckedInOn,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-data',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
