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

export interface CookingRecord {
  dishId: string;
  completedAt: string;
  durationSeconds?: number;
  shareText?: string;
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

    const activeBackgroundData = computed(() =>
      getBackgroundById(activeBackground.value) ?? getDefaultBackground(),
    );

    const activeCounterData = computed(() =>
      getCounterById(activeCounter.value) ?? getDefaultCounter(),
    );

    function addCookingRecord(dishId: string, extra?: { durationSeconds?: number; shareText?: string }): void {
      cookingHistory.value.unshift({
        dishId,
        completedAt: new Date().toISOString(),
        ...extra,
      });
      if (cookingHistory.value.length > 500) {
        cookingHistory.value = cookingHistory.value.slice(0, 500);
      }
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
      addCookingRecord,
      addNote,
      updateNote,
      deleteNote,
      searchNotes,
      getNotesByDish,
      checkIn,
      toggleDecoration,
      setActiveApron,
      setActiveBackground,
      setActiveCounter,
      applyThemeToCSSVariables,
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
