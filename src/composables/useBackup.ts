import { ref, readonly } from 'vue';
import type { CookingRecord, Note } from '@/stores/cooking';
import type { ChallengeProgress } from '@/stores/challenges';
import type { TastePreference } from '@/stores/profile';
import type { DishFilterState } from '@/stores/favorites';
import type { HighContrastMode, SpeechRate } from '@/stores/settings';
import { useCookingStore } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { useProfileStore } from '@/stores/profile';
import { useFavoritesStore } from '@/stores/favorites';
import { useSettingsStore } from '@/stores/settings';

export interface BackupMetaData {
  version: string;
  exportedAt: string;
  appVersion: string;
  totalRecords: number;
}

export interface BackupCookingData {
  totalDays: number;
  streakDays: number;
  lastCheckInDate: string | null;
  checkInDates: string[];
  protectionCount: number;
  lastMakeupCheckInMonth: string | null;
  makeupCheckInDates: string[];
  cookingHistory: CookingRecord[];
  notes: Note[];
  unlockedDecorations: string[];
  unlockedAprons: string[];
  activeDecoration: string | null;
  activeApron: string;
  unlockedBackgrounds: string[];
  unlockedCounters: string[];
  activeBackground: string;
  activeCounter: string;
}

export interface BackupChallengeData {
  progressMap: Record<string, ChallengeProgress>;
  unlockedBadges: string[];
}

export interface BackupProfileData {
  allergens: string[];
  tastePreference: TastePreference;
}

export interface BackupFavoritesData {
  favoriteIds: string[];
  pinnedIds: string[];
  customOrder: string[];
  filterState: DishFilterState;
}

export interface BackupSettingsData {
  speechEnabled: boolean;
  speechRate: SpeechRate;
  speechPitch: number;
  speechVolume: number;
  highContrastMode: HighContrastMode;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  largeText: boolean;
}

export interface BackupData {
  meta: BackupMetaData;
  cooking: BackupCookingData;
  challenges: BackupChallengeData;
  profile: BackupProfileData;
  favorites: BackupFavoritesData;
  settings: BackupSettingsData;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  importedRecords: number;
}

export type ExportScope = 'all' | 'cooking' | 'challenges' | 'profile' | 'favorites' | 'settings';

const BACKUP_VERSION = '1.0.0';
const APP_VERSION = '0.0.0';

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const validateDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const validateISOString = (isoStr: string): boolean => {
  const date = new Date(isoStr);
  return !isNaN(date.getTime()) && isoStr.includes('T');
};

function validateMetaData(meta: unknown, errors: string[]): void {
  if (!isRecord(meta)) {
    errors.push('meta 必须是一个对象');
    return;
  }
  if (typeof meta.version !== 'string') {
    errors.push('meta.version 必须是字符串');
  }
  if (typeof meta.exportedAt !== 'string' || !validateISOString(meta.exportedAt)) {
    errors.push('meta.exportedAt 必须是有效的 ISO 日期字符串');
  }
  if (typeof meta.appVersion !== 'string') {
    errors.push('meta.appVersion 必须是字符串');
  }
  if (typeof meta.totalRecords !== 'number' || meta.totalRecords < 0) {
    errors.push('meta.totalRecords 必须是非负数字');
  }
}

function validateCookingData(cooking: unknown, errors: string[], warnings: string[]): void {
  if (!isRecord(cooking)) {
    errors.push('cooking 必须是一个对象');
    return;
  }

  if (typeof cooking.totalDays !== 'number' || cooking.totalDays < 0) {
    errors.push('cooking.totalDays 必须是非负数字');
  }
  if (typeof cooking.streakDays !== 'number' || cooking.streakDays < 0) {
    errors.push('cooking.streakDays 必须是非负数字');
  }
  if (cooking.lastCheckInDate !== null && typeof cooking.lastCheckInDate !== 'string') {
    errors.push('cooking.lastCheckInDate 必须是字符串或 null');
  }
  if (cooking.lastCheckInDate && typeof cooking.lastCheckInDate === 'string' && !validateDateString(cooking.lastCheckInDate)) {
    warnings.push('cooking.lastCheckInDate 格式可能不正确');
  }
  if (!isStringArray(cooking.checkInDates)) {
    errors.push('cooking.checkInDates 必须是字符串数组');
  }
  if (typeof cooking.protectionCount !== 'number' || cooking.protectionCount < 0) {
    errors.push('cooking.protectionCount 必须是非负数字');
  }
  if (cooking.lastMakeupCheckInMonth !== null && typeof cooking.lastMakeupCheckInMonth !== 'string') {
    errors.push('cooking.lastMakeupCheckInMonth 必须是字符串或 null');
  }
  if (!isStringArray(cooking.makeupCheckInDates)) {
    errors.push('cooking.makeupCheckInDates 必须是字符串数组');
  }
  if (!isStringArray(cooking.unlockedDecorations)) {
    errors.push('cooking.unlockedDecorations 必须是字符串数组');
  }
  if (!isStringArray(cooking.unlockedAprons) || cooking.unlockedAprons.length === 0) {
    errors.push('cooking.unlockedAprons 必须是非空字符串数组');
  }
  if (cooking.activeDecoration !== null && typeof cooking.activeDecoration !== 'string') {
    errors.push('cooking.activeDecoration 必须是字符串或 null');
  }
  if (typeof cooking.activeApron !== 'string') {
    errors.push('cooking.activeApron 必须是字符串');
  }
  if (!isStringArray(cooking.unlockedBackgrounds) || cooking.unlockedBackgrounds.length === 0) {
    errors.push('cooking.unlockedBackgrounds 必须是非空字符串数组');
  }
  if (!isStringArray(cooking.unlockedCounters) || cooking.unlockedCounters.length === 0) {
    errors.push('cooking.unlockedCounters 必须是非空字符串数组');
  }
  if (typeof cooking.activeBackground !== 'string') {
    errors.push('cooking.activeBackground 必须是字符串');
  }
  if (typeof cooking.activeCounter !== 'string') {
    errors.push('cooking.activeCounter 必须是字符串');
  }

  if (Array.isArray(cooking.cookingHistory)) {
    cooking.cookingHistory.forEach((record, index) => {
      if (!isRecord(record)) {
        errors.push(`cooking.cookingHistory[${index}] 必须是对象`);
        return;
      }
      if (typeof record.dishId !== 'string') {
        errors.push(`cooking.cookingHistory[${index}].dishId 必须是字符串`);
      }
      if (typeof record.completedAt !== 'string' || !validateISOString(record.completedAt)) {
        errors.push(`cooking.cookingHistory[${index}].completedAt 必须是有效的 ISO 日期字符串`);
      }
    });
  } else {
    errors.push('cooking.cookingHistory 必须是数组');
  }

  if (Array.isArray(cooking.notes)) {
    cooking.notes.forEach((note, index) => {
      if (!isRecord(note)) {
        errors.push(`cooking.notes[${index}] 必须是对象`);
        return;
      }
      if (typeof note.id !== 'string') {
        errors.push(`cooking.notes[${index}].id 必须是字符串`);
      }
      if (typeof note.dishId !== 'string') {
        errors.push(`cooking.notes[${index}].dishId 必须是字符串`);
      }
      if (typeof note.content !== 'string') {
        errors.push(`cooking.notes[${index}].content 必须是字符串`);
      }
      if (typeof note.rating !== 'number' || note.rating < 1 || note.rating > 5) {
        errors.push(`cooking.notes[${index}].rating 必须是 1-5 的数字`);
      }
    });
  } else {
    errors.push('cooking.notes 必须是数组');
  }
}

function validateChallengeData(challenges: unknown, errors: string[]): void {
  if (!isRecord(challenges)) {
    errors.push('challenges 必须是一个对象');
    return;
  }

  if (!isRecord(challenges.progressMap)) {
    errors.push('challenges.progressMap 必须是一个对象');
  } else {
    Object.entries(challenges.progressMap).forEach(([key, value]) => {
      if (!isRecord(value)) {
        errors.push(`challenges.progressMap['${key}'] 必须是对象`);
        return;
      }
      if (typeof value.challengeId !== 'string') {
        errors.push(`challenges.progressMap['${key}'].challengeId 必须是字符串`);
      }
      if (typeof value.startDate !== 'string' || !validateDateString(value.startDate)) {
        errors.push(`challenges.progressMap['${key}'].startDate 必须是有效的日期字符串`);
      }
      if (!isStringArray(value.completedDishes)) {
        errors.push(`challenges.progressMap['${key}'].completedDishes 必须是字符串数组`);
      }
      if (value.completedAt !== null && (typeof value.completedAt !== 'string' || !validateDateString(value.completedAt))) {
        errors.push(`challenges.progressMap['${key}'].completedAt 必须是有效的日期字符串或 null`);
      }
      if (typeof value.claimed !== 'boolean') {
        errors.push(`challenges.progressMap['${key}'].claimed 必须是布尔值`);
      }
    });
  }

  if (!isStringArray(challenges.unlockedBadges)) {
    errors.push('challenges.unlockedBadges 必须是字符串数组');
  }
}

function validateProfileData(profile: unknown, errors: string[]): void {
  if (!isRecord(profile)) {
    errors.push('profile 必须是一个对象');
    return;
  }

  if (!isStringArray(profile.allergens)) {
    errors.push('profile.allergens 必须是字符串数组');
  }

  if (!isRecord(profile.tastePreference)) {
    errors.push('profile.tastePreference 必须是一个对象');
  } else {
    const validSpicy = ['none', 'mild', 'medium', 'hot'];
    const validSalt = ['light', 'normal', 'heavy'];
    const validSweet = ['none', 'light', 'normal', 'heavy'];
    const validOil = ['light', 'normal', 'heavy'];

    if (typeof profile.tastePreference.spicy !== 'string' || !validSpicy.includes(profile.tastePreference.spicy)) {
      errors.push('profile.tastePreference.spicy 值无效');
    }
    if (typeof profile.tastePreference.salt !== 'string' || !validSalt.includes(profile.tastePreference.salt)) {
      errors.push('profile.tastePreference.salt 值无效');
    }
    if (typeof profile.tastePreference.sweet !== 'string' || !validSweet.includes(profile.tastePreference.sweet)) {
      errors.push('profile.tastePreference.sweet 值无效');
    }
    if (typeof profile.tastePreference.oil !== 'string' || !validOil.includes(profile.tastePreference.oil)) {
      errors.push('profile.tastePreference.oil 值无效');
    }
  }
}

function validateFavoritesData(favorites: unknown, errors: string[]): void {
  if (!isRecord(favorites)) {
    errors.push('favorites 必须是一个对象');
    return;
  }

  if (!isStringArray(favorites.favoriteIds)) {
    errors.push('favorites.favoriteIds 必须是字符串数组');
  }
  if (!isStringArray(favorites.pinnedIds)) {
    errors.push('favorites.pinnedIds 必须是字符串数组');
  }
  if (!isStringArray(favorites.customOrder)) {
    errors.push('favorites.customOrder 必须是字符串数组');
  }

  if (!isRecord(favorites.filterState)) {
    errors.push('favorites.filterState 必须是一个对象');
  } else {
    const validModes = ['all', 'favorites', 'non-favorites'];
    const validSortModes = ['default', 'custom', 'time-asc', 'time-desc', 'difficulty-asc', 'difficulty-desc'];

    if (typeof favorites.filterState.mode !== 'string' || !validModes.includes(favorites.filterState.mode)) {
      errors.push('favorites.filterState.mode 值无效');
    }
    if (typeof favorites.filterState.sortMode !== 'string' || !validSortModes.includes(favorites.filterState.sortMode)) {
      errors.push('favorites.filterState.sortMode 值无效');
    }
  }
}

function validateSettingsData(settings: unknown, errors: string[]): void {
  if (!isRecord(settings)) {
    errors.push('settings 必须是一个对象');
    return;
  }

  if (typeof settings.speechEnabled !== 'boolean') {
    errors.push('settings.speechEnabled 必须是布尔值');
  }

  const validSpeechRates = ['slow', 'normal', 'fast'];
  if (typeof settings.speechRate !== 'string' || !validSpeechRates.includes(settings.speechRate)) {
    errors.push('settings.speechRate 值无效');
  }

  if (typeof settings.speechPitch !== 'number' || settings.speechPitch < 0.5 || settings.speechPitch > 2) {
    errors.push('settings.speechPitch 必须在 0.5 到 2 之间');
  }
  if (typeof settings.speechVolume !== 'number' || settings.speechVolume < 0 || settings.speechVolume > 1) {
    errors.push('settings.speechVolume 必须在 0 到 1 之间');
  }

  const validContrastModes = ['off', 'light', 'dark'];
  if (typeof settings.highContrastMode !== 'string' || !validContrastModes.includes(settings.highContrastMode)) {
    errors.push('settings.highContrastMode 值无效');
  }

  if (typeof settings.reducedMotion !== 'boolean') {
    errors.push('settings.reducedMotion 必须是布尔值');
  }
  if (typeof settings.keyboardNavigation !== 'boolean') {
    errors.push('settings.keyboardNavigation 必须是布尔值');
  }
  if (typeof settings.focusVisible !== 'boolean') {
    errors.push('settings.focusVisible 必须是布尔值');
  }
  if (typeof settings.largeText !== 'boolean') {
    errors.push('settings.largeText 必须是布尔值');
  }
}

export function validateBackupData(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(data)) {
    errors.push('备份数据必须是一个 JSON 对象');
    return { valid: false, errors, warnings };
  }

  validateMetaData(data.meta, errors);
  validateCookingData(data.cooking, errors, warnings);
  validateChallengeData(data.challenges, errors);
  validateProfileData(data.profile, errors);
  validateFavoritesData(data.favorites, errors);
  validateSettingsData(data.settings, errors);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function useBackup() {
  const isExporting = ref(false);
  const isImporting = ref(false);
  const lastValidation = ref<ValidationResult | null>(null);
  const lastImportResult = ref<ImportResult | null>(null);

  const generateBackupData = (scope: ExportScope = 'all'): BackupData => {
    const cookingStore = useCookingStore();
    const challengesStore = useChallengesStore();
    const profileStore = useProfileStore();
    const favoritesStore = useFavoritesStore();
    const settingsStore = useSettingsStore();

    const totalRecords =
      cookingStore.cookingHistory.length +
      cookingStore.notes.length +
      cookingStore.checkInDates.length +
      Object.keys(challengesStore.progressMap).length;

    const backup: BackupData = {
      meta: {
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        appVersion: APP_VERSION,
        totalRecords,
      },
      cooking: {
        totalDays: cookingStore.totalDays,
        streakDays: cookingStore.streakDays,
        lastCheckInDate: cookingStore.lastCheckInDate,
        checkInDates: [...cookingStore.checkInDates],
        protectionCount: cookingStore.protectionCount,
        lastMakeupCheckInMonth: cookingStore.lastMakeupCheckInMonth,
        makeupCheckInDates: [...cookingStore.makeupCheckInDates],
        cookingHistory: JSON.parse(JSON.stringify(cookingStore.cookingHistory)),
        notes: JSON.parse(JSON.stringify(cookingStore.notes)),
        unlockedDecorations: [...cookingStore.unlockedDecorations],
        unlockedAprons: [...cookingStore.unlockedAprons],
        activeDecoration: cookingStore.activeDecoration,
        activeApron: cookingStore.activeApron,
        unlockedBackgrounds: [...cookingStore.unlockedBackgrounds],
        unlockedCounters: [...cookingStore.unlockedCounters],
        activeBackground: cookingStore.activeBackground,
        activeCounter: cookingStore.activeCounter,
      },
      challenges: {
        progressMap: JSON.parse(JSON.stringify(challengesStore.progressMap)),
        unlockedBadges: [...challengesStore.unlockedBadges],
      },
      profile: {
        allergens: [...profileStore.allergens],
        tastePreference: { ...profileStore.tastePreference },
      },
      favorites: {
        favoriteIds: [...favoritesStore.favoriteIds],
        pinnedIds: [...favoritesStore.pinnedIds],
        customOrder: [...favoritesStore.customOrder],
        filterState: { ...favoritesStore.filterState },
      },
      settings: {
        speechEnabled: settingsStore.speechEnabled,
        speechRate: settingsStore.speechRate,
        speechPitch: settingsStore.speechPitch,
        speechVolume: settingsStore.speechVolume,
        highContrastMode: settingsStore.highContrastMode,
        reducedMotion: settingsStore.reducedMotion,
        keyboardNavigation: settingsStore.keyboardNavigation,
        focusVisible: settingsStore.focusVisible,
        largeText: settingsStore.largeText,
      },
    };

    return backup;
  };

  const exportToJSON = (scope: ExportScope = 'all'): string => {
    isExporting.value = true;
    try {
      const backupData = generateBackupData(scope);
      return JSON.stringify(backupData, null, 2);
    } finally {
      isExporting.value = false;
    }
  };

  const downloadBackup = (scope: ExportScope = 'all', filename?: string): void => {
    const jsonStr = exportToJSON(scope);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = filename || `cozy-cooking-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyBackupToClipboard = async (scope: ExportScope = 'all'): Promise<boolean> => {
    const jsonStr = exportToJSON(scope);
    try {
      await navigator.clipboard.writeText(jsonStr);
      return true;
    } catch {
      return false;
    }
  };

  const parseBackupJSON = (jsonStr: string): BackupData | null => {
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed as BackupData;
    } catch {
      return null;
    }
  };

  const validateBackupJSON = (jsonStr: string): ValidationResult => {
    const parsed = parseBackupJSON(jsonStr);
    if (!parsed) {
      return {
        valid: false,
        errors: ['JSON 解析失败，请检查文件格式'],
        warnings: [],
      };
    }
    const result = validateBackupData(parsed);
    lastValidation.value = result;
    return result;
  };

  const importBackupData = (data: BackupData, merge: boolean = false): ImportResult => {
    isImporting.value = true;
    const errors: string[] = [];
    const warnings: string[] = [];
    let importedRecords = 0;

    try {
      const validation = validateBackupData(data);
      if (!validation.valid) {
        errors.push(...validation.errors);
        return { success: false, errors, warnings, importedRecords: 0 };
      }
      warnings.push(...validation.warnings);

      const cookingStore = useCookingStore();
      const challengesStore = useChallengesStore();
      const profileStore = useProfileStore();
      const favoritesStore = useFavoritesStore();
      const settingsStore = useSettingsStore();

      if (merge) {
        const existingCheckIns = new Set(cookingStore.checkInDates);
        const existingHistoryIds = new Set(cookingStore.cookingHistory.map((r: CookingRecord) => `${r.dishId}-${r.completedAt}`));
        const existingNoteIds = new Set(cookingStore.notes.map((n: Note) => n.id));
        const existingBadges = new Set(challengesStore.unlockedBadges);
        const existingDecorations = new Set(cookingStore.unlockedDecorations);
        const existingAprons = new Set(cookingStore.unlockedAprons);
        const existingBackgrounds = new Set(cookingStore.unlockedBackgrounds);
        const existingCounters = new Set(cookingStore.unlockedCounters);
        const existingFavorites = new Set(favoritesStore.favoriteIds);
        const existingAllergens = new Set(profileStore.allergens);

        data.cooking.checkInDates.forEach((date) => {
          if (!existingCheckIns.has(date)) {
            cookingStore.checkInDates.push(date);
            importedRecords++;
          }
        });

        data.cooking.cookingHistory.forEach((record) => {
          const key = `${record.dishId}-${record.completedAt}`;
          if (!existingHistoryIds.has(key)) {
            cookingStore.cookingHistory.push(record);
            importedRecords++;
          }
        });

        data.cooking.notes.forEach((note) => {
          if (!existingNoteIds.has(note.id)) {
            cookingStore.notes.push(note);
            importedRecords++;
          }
        });

        data.cooking.unlockedDecorations.forEach((id) => {
          if (!existingDecorations.has(id)) {
            cookingStore.unlockedDecorations.push(id);
            importedRecords++;
          }
        });

        data.cooking.unlockedAprons.forEach((id) => {
          if (!existingAprons.has(id)) {
            cookingStore.unlockedAprons.push(id);
            importedRecords++;
          }
        });

        data.cooking.unlockedBackgrounds.forEach((id) => {
          if (!existingBackgrounds.has(id)) {
            cookingStore.unlockedBackgrounds.push(id);
            importedRecords++;
          }
        });

        data.cooking.unlockedCounters.forEach((id) => {
          if (!existingCounters.has(id)) {
            cookingStore.unlockedCounters.push(id);
            importedRecords++;
          }
        });

        data.challenges.unlockedBadges.forEach((id) => {
          if (!existingBadges.has(id)) {
            challengesStore.unlockedBadges.push(id);
            importedRecords++;
          }
        });

        data.favorites.favoriteIds.forEach((id) => {
          if (!existingFavorites.has(id)) {
            favoritesStore.favoriteIds.push(id);
            importedRecords++;
          }
        });

        data.profile.allergens.forEach((id) => {
          if (!existingAllergens.has(id)) {
            profileStore.allergens.push(id);
            importedRecords++;
          }
        });

        Object.entries(data.challenges.progressMap).forEach(([key, value]) => {
          if (!(key in challengesStore.progressMap)) {
            challengesStore.progressMap[key] = value;
            importedRecords++;
          }
        });

        cookingStore.totalDays = Math.max(cookingStore.totalDays, data.cooking.totalDays);
        cookingStore.streakDays = Math.max(cookingStore.streakDays, data.cooking.streakDays);
        cookingStore.protectionCount = Math.max(cookingStore.protectionCount, data.cooking.protectionCount);

        cookingStore.recalculateStreak();
      } else {
        cookingStore.totalDays = data.cooking.totalDays;
        cookingStore.streakDays = data.cooking.streakDays;
        cookingStore.lastCheckInDate = data.cooking.lastCheckInDate;
        cookingStore.checkInDates = [...data.cooking.checkInDates];
        cookingStore.protectionCount = data.cooking.protectionCount;
        cookingStore.lastMakeupCheckInMonth = data.cooking.lastMakeupCheckInMonth;
        cookingStore.makeupCheckInDates = [...data.cooking.makeupCheckInDates];
        cookingStore.cookingHistory = [...data.cooking.cookingHistory];
        cookingStore.notes = [...data.cooking.notes];
        cookingStore.unlockedDecorations = [...data.cooking.unlockedDecorations];
        cookingStore.unlockedAprons = [...data.cooking.unlockedAprons];
        cookingStore.activeDecoration = data.cooking.activeDecoration;
        cookingStore.activeApron = data.cooking.activeApron;
        cookingStore.unlockedBackgrounds = [...data.cooking.unlockedBackgrounds];
        cookingStore.unlockedCounters = [...data.cooking.unlockedCounters];
        cookingStore.activeBackground = data.cooking.activeBackground;
        cookingStore.activeCounter = data.cooking.activeCounter;

        challengesStore.progressMap = { ...data.challenges.progressMap };
        challengesStore.unlockedBadges = [...data.challenges.unlockedBadges];

        profileStore.allergens = [...data.profile.allergens];
        profileStore.tastePreference = { ...data.profile.tastePreference };

        favoritesStore.favoriteIds = [...data.favorites.favoriteIds];
        favoritesStore.pinnedIds = [...data.favorites.pinnedIds];
        favoritesStore.customOrder = [...data.favorites.customOrder];
        favoritesStore.filterState = { ...data.favorites.filterState };

        settingsStore.speechEnabled = data.settings.speechEnabled;
        settingsStore.speechRate = data.settings.speechRate;
        settingsStore.speechPitch = data.settings.speechPitch;
        settingsStore.speechVolume = data.settings.speechVolume;
        settingsStore.highContrastMode = data.settings.highContrastMode;
        settingsStore.reducedMotion = data.settings.reducedMotion;
        settingsStore.keyboardNavigation = data.settings.keyboardNavigation;
        settingsStore.focusVisible = data.settings.focusVisible;
        settingsStore.largeText = data.settings.largeText;

        settingsStore.applyHighContrastToDocument();
        cookingStore.applyThemeToCSSVariables();

        importedRecords = data.meta.totalRecords;
      }

      const result: ImportResult = {
        success: errors.length === 0,
        errors,
        warnings,
        importedRecords,
      };
      lastImportResult.value = result;
      return result;
    } finally {
      isImporting.value = false;
    }
  };

  const importFromJSON = (jsonStr: string, merge: boolean = false): ImportResult => {
    const parsed = parseBackupJSON(jsonStr);
    if (!parsed) {
      return {
        success: false,
        errors: ['JSON 解析失败，请检查文件格式'],
        warnings: [],
        importedRecords: 0,
      };
    }
    return importBackupData(parsed, merge);
  };

  const importFromFile = async (file: File, merge: boolean = false): Promise<ImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(importFromJSON(content, merge));
      };
      reader.onerror = () => {
        resolve({
          success: false,
          errors: ['文件读取失败'],
          warnings: [],
          importedRecords: 0,
        });
      };
      reader.readAsText(file);
    });
  };

  return {
    isExporting: readonly(isExporting),
    isImporting: readonly(isImporting),
    lastValidation: readonly(lastValidation),
    lastImportResult: readonly(lastImportResult),
    exportToJSON,
    downloadBackup,
    copyBackupToClipboard,
    parseBackupJSON,
    validateBackupJSON,
    validateBackupData,
    importBackupData,
    importFromJSON,
    importFromFile,
  };
}
