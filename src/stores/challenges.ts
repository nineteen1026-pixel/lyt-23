import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { challenges, type Challenge, type ChallengeBadge } from '@/data/challenges';

export interface ChallengeProgress {
  challengeId: string;
  startDate: string;
  completedDishes: string[];
  completedAt: string | null;
  claimed: boolean;
}

export interface ChallengeRewardResult {
  completedChallenges: Challenge[];
  newBadges: ChallengeBadge[];
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function isDateInRange(dateStr: string, startDate: string, days: number): boolean {
  const daysPassed = daysBetween(startDate, dateStr);
  return daysPassed >= 0 && daysPassed < days;
}

export const useChallengesStore = defineStore(
  'challenges',
  () => {
    const progressMap = ref<Record<string, ChallengeProgress>>({});
    const unlockedBadges = ref<string[]>([]);

    const activeChallenges = computed(() => {
      const today = todayStr();
      return challenges.filter((c) => {
        const p = progressMap.value[c.id];
        if (!p) return true;
        if (p.completedAt) return true;
        return isDateInRange(today, p.startDate, c.cycleDays);
      });
    });

    const inProgressChallenges = computed(() => {
      const today = todayStr();
      return challenges.filter((c) => {
        const p = progressMap.value[c.id];
        if (!p) return false;
        if (p.completedAt) return false;
        return isDateInRange(today, p.startDate, c.cycleDays);
      });
    });

    const completedChallenges = computed(() => {
      return challenges.filter((c) => {
        const p = progressMap.value[c.id];
        return p?.completedAt !== null && p?.completedAt !== undefined;
      });
    });

    function getProgress(challengeId: string): ChallengeProgress | undefined {
      return progressMap.value[challengeId];
    }

    function isChallengeStarted(challengeId: string): boolean {
      return challengeId in progressMap.value;
    }

    function isChallengeCompleted(challengeId: string): boolean {
      const p = progressMap.value[challengeId];
      return p?.completedAt !== null && p?.completedAt !== undefined;
    }

    function isBadgeUnlocked(badgeId: string): boolean {
      return unlockedBadges.value.includes(badgeId);
    }

    function getProgressCount(challengeId: string): number {
      const p = progressMap.value[challengeId];
      if (!p) return 0;
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) return 0;

      if (challenge.targetDishIds.length > 0) {
        const uniqueCompleted = new Set(
          p.completedDishes.filter((d) => challenge.targetDishIds.includes(d)),
        );
        return uniqueCompleted.size;
      }
      return p.completedDishes.length;
    }

    function getProgressPercent(challengeId: string): number {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) return 0;
      const count = getProgressCount(challengeId);
      return Math.min((count / challenge.targetCount) * 100, 100);
    }

    function getRemainingDays(challengeId: string): number {
      const p = progressMap.value[challengeId];
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!p || !challenge) return 0;
      const today = todayStr();
      const endDate = addDays(p.startDate, challenge.cycleDays);
      return Math.max(daysBetween(today, endDate), 0);
    }

    function startChallenge(challengeId: string): void {
      if (isChallengeStarted(challengeId)) return;
      progressMap.value[challengeId] = {
        challengeId,
        startDate: todayStr(),
        completedDishes: [],
        completedAt: null,
        claimed: false,
      };
    }

    function recordCooking(dishId: string): ChallengeRewardResult {
      const today = todayStr();
      const completedChallenges: Challenge[] = [];
      const newBadges: ChallengeBadge[] = [];

      for (const challenge of challenges) {
        const p = progressMap.value[challenge.id];
        if (!p) continue;
        if (p.completedAt) continue;
        if (!isDateInRange(today, p.startDate, challenge.cycleDays)) continue;

        if (challenge.targetDishIds.length > 0) {
          if (!challenge.targetDishIds.includes(dishId)) continue;
          if (p.completedDishes.includes(dishId)) continue;
        }

        p.completedDishes.push(dishId);

        if (challenge.targetDishIds.length > 0) {
          const uniqueCompleted = new Set(
            p.completedDishes.filter((d) => challenge.targetDishIds.includes(d)),
          );
          if (uniqueCompleted.size >= challenge.targetCount) {
            p.completedAt = today;
            completedChallenges.push(challenge);
            if (!unlockedBadges.value.includes(challenge.badge.id)) {
              unlockedBadges.value.push(challenge.badge.id);
              newBadges.push(challenge.badge);
            }
          }
        } else {
          if (p.completedDishes.length >= challenge.targetCount) {
            p.completedAt = today;
            completedChallenges.push(challenge);
            if (!unlockedBadges.value.includes(challenge.badge.id)) {
              unlockedBadges.value.push(challenge.badge.id);
              newBadges.push(challenge.badge);
            }
          }
        }
      }

      return { completedChallenges, newBadges };
    }

    function claimReward(challengeId: string): ChallengeBadge | null {
      const p = progressMap.value[challengeId];
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!p || !challenge) return null;
      if (!p.completedAt || p.claimed) return null;

      p.claimed = true;
      if (!unlockedBadges.value.includes(challenge.badge.id)) {
        unlockedBadges.value.push(challenge.badge.id);
      }
      return challenge.badge;
    }

    function resetExpiredChallenges(): void {
      const today = todayStr();
      for (const challenge of challenges) {
        const p = progressMap.value[challenge.id];
        if (!p) continue;
        if (p.completedAt) continue;
        if (!isDateInRange(today, p.startDate, challenge.cycleDays)) {
          delete progressMap.value[challenge.id];
        }
      }
    }

    function hasUnclaimedRewards(): boolean {
      for (const challengeId of Object.keys(progressMap.value)) {
        const p = progressMap.value[challengeId];
        if (p.completedAt && !p.claimed) return true;
      }
      return false;
    }

    return {
      progressMap,
      unlockedBadges,
      activeChallenges,
      inProgressChallenges,
      completedChallenges,
      getProgress,
      isChallengeStarted,
      isChallengeCompleted,
      isBadgeUnlocked,
      getProgressCount,
      getProgressPercent,
      getRemainingDays,
      startChallenge,
      recordCooking,
      claimReward,
      resetExpiredChallenges,
      hasUnclaimedRewards,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-challenges',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
