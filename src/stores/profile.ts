import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type SpicyLevel = 'none' | 'mild' | 'medium' | 'hot';
export type SaltLevel = 'light' | 'normal' | 'heavy';
export type SweetLevel = 'none' | 'light' | 'normal' | 'heavy';
export type OilLevel = 'light' | 'normal' | 'heavy';

export interface Allergen {
  id: string;
  name: string;
  emoji: string;
}

export interface TastePreference {
  spicy: SpicyLevel;
  salt: SaltLevel;
  sweet: SweetLevel;
  oil: OilLevel;
}

export const ALLERGENS: Allergen[] = [
  { id: 'peanut', name: '花生', emoji: '🥜' },
  { id: 'seafood', name: '海鲜', emoji: '🦐' },
  { id: 'fish', name: '鱼类', emoji: '🐟' },
  { id: 'egg', name: '鸡蛋', emoji: '🥚' },
  { id: 'milk', name: '牛奶', emoji: '🥛' },
  { id: 'soy', name: '大豆', emoji: '🫘' },
  { id: 'wheat', name: '小麦', emoji: '🌾' },
  { id: 'nut', name: '坚果', emoji: '🌰' },
  { id: 'shellfish', name: '贝类', emoji: '🦪' },
  { id: 'mushroom', name: '蘑菇', emoji: '🍄' },
  { id: 'cilantro', name: '香菜', emoji: '🌿' },
  { id: 'garlic', name: '大蒜', emoji: '🧄' },
];

export const SPICY_LEVELS: { value: SpicyLevel; label: string; emoji: string }[] = [
  { value: 'none', label: '完全不辣', emoji: '🟢' },
  { value: 'mild', label: '微辣', emoji: '🌶️' },
  { value: 'medium', label: '中辣', emoji: '🌶️🌶️' },
  { value: 'hot', label: '重辣', emoji: '🌶️🔥' },
];

export const SALT_LEVELS: { value: SaltLevel; label: string; emoji: string }[] = [
  { value: 'light', label: '清淡', emoji: '🧂' },
  { value: 'normal', label: '正常', emoji: '🧂🧂' },
  { value: 'heavy', label: '偏咸', emoji: '🧂🧂🧂' },
];

export const SWEET_LEVELS: { value: SweetLevel; label: string; emoji: string }[] = [
  { value: 'none', label: '完全不甜', emoji: '🍬' },
  { value: 'light', label: '微甜', emoji: '🍬🍬' },
  { value: 'normal', label: '正常甜', emoji: '🍬🍬🍬' },
  { value: 'heavy', label: '更甜', emoji: '🍬🍭' },
];

export const OIL_LEVELS: { value: OilLevel; label: string; emoji: string }[] = [
  { value: 'light', label: '少油', emoji: '🫒' },
  { value: 'normal', label: '正常油', emoji: '🫒🫒' },
  { value: 'heavy', label: '多油', emoji: '🫒🫒🫒' },
];

export const useProfileStore = defineStore(
  'profile',
  () => {
    const allergens = ref<string[]>([]);
    const tastePreference = ref<TastePreference>({
      spicy: 'none',
      salt: 'normal',
      sweet: 'normal',
      oil: 'normal',
    });

    const hasAllergen = computed(() => allergens.value.length > 0);
    const allergenDetails = computed(() =>
      ALLERGENS.filter((a) => allergens.value.includes(a.id)),
    );

    function toggleAllergen(id: string): void {
      const idx = allergens.value.indexOf(id);
      if (idx > -1) {
        allergens.value.splice(idx, 1);
      } else {
        allergens.value.push(id);
      }
    }

    function setTaste<K extends keyof TastePreference>(
      key: K,
      value: TastePreference[K],
    ): void {
      tastePreference.value[key] = value;
    }

    function resetProfile(): void {
      allergens.value = [];
      tastePreference.value = {
        spicy: 'none',
        salt: 'normal',
        sweet: 'normal',
        oil: 'normal',
      };
    }

    function getSeasoningMultiplier(seasoning: string): number {
      switch (seasoning) {
        case '盐':
        case '酱油':
        case '生抽':
        case '老抽':
        case '蚝油':
        case '味噌':
          if (tastePreference.value.salt === 'light') return 0.6;
          if (tastePreference.value.salt === 'heavy') return 1.4;
          return 1;
        case '糖':
        case '蜂蜜':
          if (tastePreference.value.sweet === 'none') return 0;
          if (tastePreference.value.sweet === 'light') return 0.6;
          if (tastePreference.value.sweet === 'heavy') return 1.4;
          return 1;
        case '辣椒粉':
        case '孜然':
          if (tastePreference.value.spicy === 'none') return 0;
          if (tastePreference.value.spicy === 'mild') return 0.6;
          if (tastePreference.value.spicy === 'hot') return 1.4;
          return 1;
        case '橄榄油':
        case '黑胡椒':
        case '花椒粉':
          if (tastePreference.value.oil === 'light') return 0.7;
          if (tastePreference.value.oil === 'heavy') return 1.3;
          return 1;
        default:
          return 1;
      }
    }

    function getRecommendedDosage(seasoning: string): string {
      const multiplier = getSeasoningMultiplier(seasoning);
      if (multiplier === 0) return '不添加';
      if (multiplier <= 0.6) return '少量';
      if (multiplier <= 0.8) return '稍少';
      if (multiplier >= 1.3) return '稍多';
      if (multiplier >= 1.4) return '多加';
      return '正常';
    }

    return {
      allergens,
      tastePreference,
      hasAllergen,
      allergenDetails,
      toggleAllergen,
      setTaste,
      resetProfile,
      getSeasoningMultiplier,
      getRecommendedDosage,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-profile',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
