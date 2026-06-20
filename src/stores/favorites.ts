import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type DishFilterMode = 'all' | 'favorites' | 'non-favorites';
export type DishSortMode = 'default' | 'custom' | 'time-asc' | 'time-desc' | 'difficulty-asc' | 'difficulty-desc';

export interface DishFilterState {
  mode: DishFilterMode;
  sortMode: DishSortMode;
}

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favoriteIds = ref<string[]>([]);
    const pinnedIds = ref<string[]>([]);
    const customOrder = ref<string[]>([]);
    const filterState = ref<DishFilterState>({
      mode: 'all',
      sortMode: 'default',
    });

    const favoriteCount = computed(() => favoriteIds.value.length);
    const pinnedCount = computed(() => pinnedIds.value.length);

    function isFavorite(dishId: string): boolean {
      return favoriteIds.value.includes(dishId);
    }

    function isPinned(dishId: string): boolean {
      return pinnedIds.value.includes(dishId);
    }

    function toggleFavorite(dishId: string): void {
      const idx = favoriteIds.value.indexOf(dishId);
      if (idx > -1) {
        favoriteIds.value.splice(idx, 1);
        const pinIdx = pinnedIds.value.indexOf(dishId);
        if (pinIdx > -1) {
          pinnedIds.value.splice(pinIdx, 1);
        }
        const orderIdx = customOrder.value.indexOf(dishId);
        if (orderIdx > -1) {
          customOrder.value.splice(orderIdx, 1);
        }
      } else {
        favoriteIds.value.push(dishId);
        customOrder.value.push(dishId);
      }
    }

    function togglePin(dishId: string): void {
      if (!isFavorite(dishId)) return;
      const idx = pinnedIds.value.indexOf(dishId);
      if (idx > -1) {
        pinnedIds.value.splice(idx, 1);
      } else {
        pinnedIds.value.unshift(dishId);
        moveToTopInCustomOrder(dishId);
      }
    }

    function moveToTopInCustomOrder(dishId: string): void {
      const idx = customOrder.value.indexOf(dishId);
      if (idx > -1) {
        customOrder.value.splice(idx, 1);
        customOrder.value.unshift(dishId);
      }
    }

    function moveUp(dishId: string): void {
      const idx = customOrder.value.indexOf(dishId);
      if (idx > 0) {
        [customOrder.value[idx - 1], customOrder.value[idx]] = [
          customOrder.value[idx],
          customOrder.value[idx - 1],
        ];
      }
    }

    function moveDown(dishId: string): void {
      const idx = customOrder.value.indexOf(dishId);
      if (idx > -1 && idx < customOrder.value.length - 1) {
        [customOrder.value[idx + 1], customOrder.value[idx]] = [
          customOrder.value[idx],
          customOrder.value[idx + 1],
        ];
      }
    }

    function moveTo(dishId: string, targetIndex: number): void {
      const currentIdx = customOrder.value.indexOf(dishId);
      if (currentIdx === -1) return;
      const clampedTarget = Math.max(0, Math.min(targetIndex, customOrder.value.length - 1));
      if (currentIdx === clampedTarget) return;
      customOrder.value.splice(currentIdx, 1);
      customOrder.value.splice(clampedTarget, 0, dishId);
    }

    function setFilterMode(mode: DishFilterMode): void {
      filterState.value.mode = mode;
    }

    function setSortMode(sortMode: DishSortMode): void {
      filterState.value.sortMode = sortMode;
    }

    function resetFilter(): void {
      filterState.value = {
        mode: 'all',
        sortMode: 'default',
      };
    }

    function getCustomOrderIndex(dishId: string): number {
      return customOrder.value.indexOf(dishId);
    }

    return {
      favoriteIds,
      pinnedIds,
      customOrder,
      filterState,
      favoriteCount,
      pinnedCount,
      isFavorite,
      isPinned,
      toggleFavorite,
      togglePin,
      moveUp,
      moveDown,
      moveTo,
      setFilterMode,
      setSortMode,
      resetFilter,
      getCustomOrderIndex,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-favorites',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
