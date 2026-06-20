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

    function syncPinnedIdsFromOrder(): void {
      pinnedIds.value = customOrder.value.slice(0, pinnedCount.value);
    }

    function toggleFavorite(dishId: string): void {
      const idx = favoriteIds.value.indexOf(dishId);
      if (idx > -1) {
        favoriteIds.value.splice(idx, 1);
        const orderIdx = customOrder.value.indexOf(dishId);
        if (orderIdx > -1) {
          const wasPinned = orderIdx < pinnedCount.value;
          customOrder.value.splice(orderIdx, 1);
          if (wasPinned) {
            pinnedIds.value = customOrder.value.slice(0, pinnedCount.value - 1);
          }
        }
      } else {
        favoriteIds.value.push(dishId);
        customOrder.value.push(dishId);
      }
    }

    function togglePin(dishId: string): void {
      if (!isFavorite(dishId)) return;
      const orderIdx = customOrder.value.indexOf(dishId);
      if (orderIdx === -1) return;

      const isCurrentlyPinned = orderIdx < pinnedCount.value;
      if (isCurrentlyPinned) {
        customOrder.value.splice(orderIdx, 1);
        const newPinnedCount = pinnedCount.value - 1;
        customOrder.value.splice(newPinnedCount, 0, dishId);
        pinnedIds.value = customOrder.value.slice(0, newPinnedCount);
      } else {
        customOrder.value.splice(orderIdx, 1);
        const newPinnedCount = pinnedCount.value + 1;
        customOrder.value.splice(newPinnedCount - 1, 0, dishId);
        pinnedIds.value = customOrder.value.slice(0, newPinnedCount);
      }
    }

    function getPinnedOrderIndex(dishId: string): number {
      return pinnedIds.value.indexOf(dishId);
    }

    function getNonPinnedOrderIndex(dishId: string): number {
      const orderIdx = customOrder.value.indexOf(dishId);
      if (orderIdx === -1 || orderIdx < pinnedCount.value) return -1;
      return orderIdx - pinnedCount.value;
    }

    function isFirstInPinned(dishId: string): boolean {
      return getPinnedOrderIndex(dishId) === 0;
    }

    function isLastInPinned(dishId: string): boolean {
      const idx = getPinnedOrderIndex(dishId);
      return idx !== -1 && idx === pinnedCount.value - 1;
    }

    function isFirstInNonPinned(dishId: string): boolean {
      return getNonPinnedOrderIndex(dishId) === 0;
    }

    function isLastInNonPinned(dishId: string): boolean {
      const idx = getNonPinnedOrderIndex(dishId);
      const nonPinnedCount = customOrder.value.length - pinnedCount.value;
      return idx !== -1 && idx === nonPinnedCount - 1;
    }

    function moveUp(dishId: string): void {
      const orderIdx = customOrder.value.indexOf(dishId);
      if (orderIdx === -1) return;

      const isDishPinned = orderIdx < pinnedCount.value;
      const lowerBound = isDishPinned ? 0 : pinnedCount.value;
      if (orderIdx > lowerBound) {
        [customOrder.value[orderIdx - 1], customOrder.value[orderIdx]] = [
          customOrder.value[orderIdx],
          customOrder.value[orderIdx - 1],
        ];
        if (isDishPinned) {
          syncPinnedIdsFromOrder();
        }
      }
    }

    function moveDown(dishId: string): void {
      const orderIdx = customOrder.value.indexOf(dishId);
      if (orderIdx === -1) return;

      const isDishPinned = orderIdx < pinnedCount.value;
      const upperBound = isDishPinned ? pinnedCount.value - 1 : customOrder.value.length - 1;
      if (orderIdx < upperBound) {
        [customOrder.value[orderIdx + 1], customOrder.value[orderIdx]] = [
          customOrder.value[orderIdx],
          customOrder.value[orderIdx + 1],
        ];
        if (isDishPinned) {
          syncPinnedIdsFromOrder();
        }
      }
    }

    function moveTo(dishId: string, targetIndex: number): void {
      const orderIdx = customOrder.value.indexOf(dishId);
      if (orderIdx === -1) return;

      const isDishPinned = orderIdx < pinnedCount.value;
      const lowerBound = isDishPinned ? 0 : pinnedCount.value;
      const upperBound = isDishPinned ? pinnedCount.value - 1 : customOrder.value.length - 1;
      const clampedTarget = Math.max(lowerBound, Math.min(targetIndex, upperBound));
      if (orderIdx === clampedTarget) return;

      customOrder.value.splice(orderIdx, 1);
      customOrder.value.splice(clampedTarget, 0, dishId);
      if (isDishPinned) {
        syncPinnedIdsFromOrder();
      }
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
      getPinnedOrderIndex,
      getNonPinnedOrderIndex,
      isFirstInPinned,
      isLastInPinned,
      isFirstInNonPinned,
      isLastInNonPinned,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-favorites',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
