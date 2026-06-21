import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { checkNewUnlocks, type Apron, type Decoration } from '@/data/unlocks';
import {
  checkNewThemeUnlocks,
  getBackgroundById,
  getCounterById,
  getDefaultBackground,
  getDefaultCounter,
  type KitchenBackground,
  type CounterMaterial,
} from '@/data/themes';
import { getDishById } from '@/data/dishes';
import { useNutrition } from '@/composables/useNutrition';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CookingRecord {
  dishId: string;
  completedAt: string;
  durationSeconds?: number;
  shareText?: string;
  nutrition?: NutritionInfo;
}

export interface Note {
  id: string;
  dishId: string;
  dishName: string;
  dishEmoji: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
}

export interface UnlockResult {
  newDecorations: Decoration[];
  newAprons: Apron[];
  newBackgrounds: KitchenBackground[];
  newCounters: CounterMaterial[];
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toLocalDateStr(isoString: string): string {
  const d = new Date(isoString);
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

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function isSameMonth(dateStr: string, monthKey: string): boolean {
  const [y, m] = dateStr.split('-');
  return `${y}-${m}` === monthKey;
}

export const useCookingStore = defineStore(
  'cooking',
  () => {
    const totalDays = ref(0);
    const streakDays = ref(0);
    const lastCheckInDate = ref<string | null>(null);
    const checkInDates = ref<string[]>([]);
    const protectionCount = ref(3);
    const lastMakeupCheckInMonth = ref<string | null>(null);
    const makeupCheckInDates = ref<string[]>([]);
    const cookingHistory = ref<CookingRecord[]>([]);
    const notes = ref<Note[]>([]);
    const unlockedDecorations = ref<string[]>([]);
    const unlockedAprons = ref<string[]>(['default']);
    const activeDecoration = ref<string | null>(null);
    const activeApron = ref<string>('default');
    const unlockedBackgrounds = ref<string[]>(['warm-cream']);
    const unlockedCounters = ref<string[]>(['wood-light']);
    const activeBackground = ref<string>('warm-cream');
    const activeCounter = ref<string>('wood-light');

    const isCheckedInToday = computed(() => lastCheckInDate.value === todayStr());

    const todayCookingCount = computed(() => {
      const today = todayStr();
      return cookingHistory.value.filter((r) => toLocalDateStr(r.completedAt) === today).length;
    });

    const lastCookingRecord = computed(() => {
      return cookingHistory.value.length > 0 ? cookingHistory.value[0] : null;
    });

    const isCheckedInYesterday = computed(() => {
      const yesterday = yesterdayStr();
      return checkInDates.value.includes(yesterday);
    });

    const canMakeupCheckInYesterday = computed(() => {
      if (isCheckedInYesterday.value) return false;
      if (protectionCount.value <= 0) return false;
      const monthKey = currentMonthKey();
      if (lastMakeupCheckInMonth.value && isSameMonth(lastMakeupCheckInMonth.value, monthKey)) return false;
      return true;
    });

    const activeBackgroundData = computed(() =>
      getBackgroundById(activeBackground.value) ?? getDefaultBackground(),
    );

    const activeCounterData = computed(() =>
      getCounterById(activeCounter.value) ?? getDefaultCounter(),
    );

    const nutrition = useNutrition();

    function addCookingRecord(dishId: string, extra?: { durationSeconds?: number; shareText?: string; nutrition?: NutritionInfo }): void {
      const dish = getDishById(dishId);
      let nutritionInfo: NutritionInfo | undefined = extra?.nutrition;
      
      if (!nutritionInfo && dish) {
        const dishNutrition = nutrition.calculateDishNutrition(dish);
        nutritionInfo = {
          calories: dishNutrition.totalCalories,
          protein: dishNutrition.totalProtein,
          carbs: dishNutrition.totalCarbs,
          fat: dishNutrition.totalFat,
        };
      }

      cookingHistory.value.unshift({
        dishId,
        completedAt: new Date().toISOString(),
        nutrition: nutritionInfo,
        ...extra,
      });
      if (cookingHistory.value.length > 500) {
        cookingHistory.value = cookingHistory.value.slice(0, 500);
      }
    }

    const totalNutrition = computed((): NutritionInfo => {
      return cookingHistory.value.reduce(
        (acc, record) => {
          if (record.nutrition) {
            acc.calories += record.nutrition.calories;
            acc.protein += record.nutrition.protein;
            acc.carbs += record.nutrition.carbs;
            acc.fat += record.nutrition.fat;
          }
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
    });

    const todayNutrition = computed((): NutritionInfo => {
      const today = todayStr();
      return cookingHistory.value
        .filter((r) => toLocalDateStr(r.completedAt) === today)
        .reduce(
          (acc, record) => {
            if (record.nutrition) {
              acc.calories += record.nutrition.calories;
              acc.protein += record.nutrition.protein;
              acc.carbs += record.nutrition.carbs;
              acc.fat += record.nutrition.fat;
            }
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    });

    const weekNutrition = computed((): NutritionInfo => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
      
      return cookingHistory.value
        .filter((r) => r.completedAt.split('T')[0] >= oneWeekAgoStr)
        .reduce(
          (acc, record) => {
            if (record.nutrition) {
              acc.calories += record.nutrition.calories;
              acc.protein += record.nutrition.protein;
              acc.carbs += record.nutrition.carbs;
              acc.fat += record.nutrition.fat;
            }
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    });

    const monthNutrition = computed((): NutritionInfo => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
      
      return cookingHistory.value
        .filter((r) => r.completedAt.split('T')[0] >= oneMonthAgoStr)
        .reduce(
          (acc, record) => {
            if (record.nutrition) {
              acc.calories += record.nutrition.calories;
              acc.protein += record.nutrition.protein;
              acc.carbs += record.nutrition.carbs;
              acc.fat += record.nutrition.fat;
            }
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    });

    function getNutritionByDateRange(startDate: string, endDate: string): NutritionInfo {
      return cookingHistory.value
        .filter((r) => {
          const dateStr = r.completedAt.split('T')[0];
          return dateStr >= startDate && dateStr <= endDate;
        })
        .reduce(
          (acc, record) => {
            if (record.nutrition) {
              acc.calories += record.nutrition.calories;
              acc.protein += record.nutrition.protein;
              acc.carbs += record.nutrition.carbs;
              acc.fat += record.nutrition.fat;
            }
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    }

    function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...note,
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      notes.value.unshift(newNote);
      if (notes.value.length > 200) {
        notes.value = notes.value.slice(0, 200);
      }
      return newNote;
    }

    function updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'dishId'>>): Note | undefined {
      const idx = notes.value.findIndex((n) => n.id === id);
      if (idx > -1) {
        notes.value[idx] = {
          ...notes.value[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return notes.value[idx];
      }
      return undefined;
    }

    function deleteNote(id: string): void {
      const idx = notes.value.findIndex((n) => n.id === id);
      if (idx > -1) {
        notes.value.splice(idx, 1);
      }
    }

    function searchNotes(keyword: string): Note[] {
      if (!keyword.trim()) {
        return notes.value;
      }
      const lowerKeyword = keyword.toLowerCase();
      return notes.value.filter(
        (n) =>
          n.dishName.toLowerCase().includes(lowerKeyword) ||
          n.content.toLowerCase().includes(lowerKeyword),
      );
    }

    function getNotesByDish(dishId: string): Note[] {
      return notes.value.filter((n) => n.dishId === dishId);
    }

    const recentNotes = computed(() => notes.value.slice(0, 5));

    function checkIn(): UnlockResult {
      const today = todayStr();
      const prevTotal = totalDays.value;
      if (lastCheckInDate.value === today) {
        return { newDecorations: [], newAprons: [], newBackgrounds: [], newCounters: [] };
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

      const { newBackgrounds, newCounters } = checkNewThemeUnlocks(prevTotal, totalDays.value);
      if (newBackgrounds.length > 0) {
        unlockedBackgrounds.value = Array.from(
          new Set([...unlockedBackgrounds.value, ...newBackgrounds.map((b) => b.id)]),
        );
      }
      if (newCounters.length > 0) {
        unlockedCounters.value = Array.from(
          new Set([...unlockedCounters.value, ...newCounters.map((c) => c.id)]),
        );
      }

      return { newDecorations, newAprons, newBackgrounds, newCounters };
    }

    function recalculateStreak(): void {
      const dateSet = new Set(checkInDates.value);
      if (dateSet.size === 0) {
        streakDays.value = 0;
        return;
      }

      let streak = 0;
      const d = new Date();
      let checkDate = todayStr();

      if (!dateSet.has(checkDate)) {
        d.setDate(d.getDate() - 1);
        checkDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      while (dateSet.has(checkDate)) {
        streak++;
        d.setDate(d.getDate() - 1);
        checkDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      streakDays.value = streak;
    }

    function makeupCheckInYesterday(): UnlockResult {
      const emptyResult: UnlockResult = { newDecorations: [], newAprons: [], newBackgrounds: [], newCounters: [] };
      if (!canMakeupCheckInYesterday.value) return emptyResult;

      const yesterday = yesterdayStr();
      const prevTotal = totalDays.value;

      totalDays.value += 1;
      if (lastCheckInDate.value !== todayStr()) {
        lastCheckInDate.value = yesterday;
      }
      checkInDates.value.push(yesterday);
      if (checkInDates.value.length > 365) {
        checkInDates.value = checkInDates.value.slice(-365);
      }
      recalculateStreak();

      protectionCount.value -= 1;
      lastMakeupCheckInMonth.value = currentMonthKey();
      makeupCheckInDates.value.push(yesterday);

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

      const { newBackgrounds, newCounters } = checkNewThemeUnlocks(prevTotal, totalDays.value);
      if (newBackgrounds.length > 0) {
        unlockedBackgrounds.value = Array.from(
          new Set([...unlockedBackgrounds.value, ...newBackgrounds.map((b) => b.id)]),
        );
      }
      if (newCounters.length > 0) {
        unlockedCounters.value = Array.from(
          new Set([...unlockedCounters.value, ...newCounters.map((c) => c.id)]),
        );
      }

      return { newDecorations, newAprons, newBackgrounds, newCounters };
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

    function setActiveBackground(id: string): void {
      if (unlockedBackgrounds.value.includes(id)) {
        activeBackground.value = id;
      }
    }

    function setActiveCounter(id: string): void {
      if (unlockedCounters.value.includes(id)) {
        activeCounter.value = id;
      }
    }

    function applyThemeToCSSVariables(): void {
      if (typeof document === 'undefined') return;
      const bg = activeBackgroundData.value;
      const counter = activeCounterData.value;
      const root = document.documentElement;

      root.style.setProperty('--color-bg', bg.colors.bg);
      root.style.setProperty('--color-bg-soft', bg.colors.bgSoft);
      root.style.setProperty('--color-primary', bg.colors.primary);
      root.style.setProperty('--color-secondary', bg.colors.secondary);
      root.style.setProperty('--color-text', bg.colors.text);
      root.style.setProperty('--gradient-top-left', bg.gradients.topLeft);
      root.style.setProperty('--gradient-bottom-right', bg.gradients.bottomRight);
      root.style.setProperty('--gradient-base', bg.gradients.base);
      root.style.setProperty('--counter-bg', counter.background);
      root.style.setProperty('--counter-border', counter.borderColor);
      root.style.setProperty('--counter-accent', counter.accentColor);
    }

    watch(
      [activeBackground, activeCounter],
      () => {
        applyThemeToCSSVariables();
      },
      { immediate: true },
    );

    function hasCheckedInOn(dateStr: string): boolean {
      return checkInDates.value.includes(dateStr);
    }

    return {
      totalDays,
      streakDays,
      lastCheckInDate,
      checkInDates,
      protectionCount,
      lastMakeupCheckInMonth,
      makeupCheckInDates,
      cookingHistory,
      notes,
      recentNotes,
      unlockedDecorations,
      unlockedAprons,
      activeDecoration,
      activeApron,
      unlockedBackgrounds,
      unlockedCounters,
      activeBackground,
      activeCounter,
      activeBackgroundData,
      activeCounterData,
      isCheckedInToday,
      isCheckedInYesterday,
      canMakeupCheckInYesterday,
      todayCookingCount,
      lastCookingRecord,
      totalNutrition,
      todayNutrition,
      weekNutrition,
      monthNutrition,
      addCookingRecord,
      addNote,
      updateNote,
      deleteNote,
      searchNotes,
      getNotesByDish,
      checkIn,
      makeupCheckInYesterday,
      toggleDecoration,
      setActiveApron,
      setActiveBackground,
      setActiveCounter,
      applyThemeToCSSVariables,
      hasCheckedInOn,
      getNutritionByDateRange,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-data',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
