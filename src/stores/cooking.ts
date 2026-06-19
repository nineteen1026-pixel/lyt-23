import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { checkNewUnlocks, type Apron, type Decoration } from '@/data/unlocks';

export interface CookingRecord {
  dishId: string;
  completedAt: string;
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
      notes,
      recentNotes,
      unlockedDecorations,
      unlockedAprons,
      activeDecoration,
      activeApron,
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
