import { getDishById, type Dish } from '@/data/dishes';
import { challenges, type ChallengeBadge } from '@/data/challenges';
import type { CookingRecord, NutritionInfo } from '@/stores/cooking';
import type { ChallengeProgress } from '@/stores/challenges';

export interface CookingSummary {
  totalDishes: number;
  totalDays: number;
  streakDays: number;
  uniqueDishes: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  recentDishes: Dish[];
  topDishes: { dish: Dish; count: number }[];
}

export interface ChallengeProgressSummary {
  id: string;
  title: string;
  badge: ChallengeBadge;
  progressCount: number;
  targetCount: number;
  progressPercent: number;
  remainingDays: number;
  isCompleted: boolean;
}

export interface ShareCardData {
  userName: string;
  avatarEmoji: string;
  totalDays: number;
  streakDays: number;
  totalDishes: number;
  uniqueDishesCount: number;
  weekDishes: number;
  badges: ChallengeBadge[];
  recentDishes: Dish[];
  challengeSummary?: ChallengeProgressSummary;
  shareText: string;
  generatedAt: string;
  cardTheme: 'warm' | 'fresh' | 'sweet';
}

export const CARD_THEMES = [
  { id: 'warm', name: '暖橙', gradient: 'from-apricot-100 to-cream-100', accent: '#FF8C42' },
  { id: 'fresh', name: '清新', gradient: 'from-matcha-100 to-cream-100', accent: '#A7C957' },
  { id: 'sweet', name: '甜蜜', gradient: 'from-rose-100 to-cream-100', accent: '#FF6B9D' },
] as const;

export type CardThemeId = typeof CARD_THEMES[number]['id'];

export function calculateCookingSummary(
  cookingHistory: CookingRecord[],
  totalDays: number,
  streakDays: number,
): CookingSummary {
  const totalDishes = cookingHistory.length;

  const uniqueDishIds = new Set(cookingHistory.map((r) => r.dishId));
  const uniqueDishes = uniqueDishIds.size;

  const nutrition = cookingHistory.reduce(
    (acc, record) => {
      if (record.nutrition) {
        acc.calories += record.nutrition.calories;
        acc.protein += record.nutrition.protein;
        acc.carbs += record.nutrition.carbs;
        acc.fat += record.nutrition.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 } as NutritionInfo,
  );

  const recentRecords = cookingHistory.slice(0, 5);
  const recentDishes = recentRecords
    .map((r) => getDishById(r.dishId))
    .filter((d): d is Dish => d !== undefined);

  const dishCountMap = new Map<string, number>();
  cookingHistory.forEach((r) => {
    dishCountMap.set(r.dishId, (dishCountMap.get(r.dishId) || 0) + 1);
  });

  const topDishes = Array.from(dishCountMap.entries())
    .map(([dishId, count]) => {
      const dish = getDishById(dishId);
      return { dish, count };
    })
    .filter((item): item is { dish: Dish; count: number } => item.dish !== undefined)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalDishes,
    totalDays,
    streakDays,
    uniqueDishes,
    totalCalories: nutrition.calories,
    totalProtein: nutrition.protein,
    totalCarbs: nutrition.carbs,
    totalFat: nutrition.fat,
    recentDishes,
    topDishes,
  };
}

export function calculateWeekDishes(cookingHistory: CookingRecord[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

  return cookingHistory.filter((r) => {
    const dateStr = r.completedAt.split('T')[0];
    return dateStr >= oneWeekAgoStr;
  }).length;
}

export function getChallengeProgressSummary(
  challengeId: string,
  progress: ChallengeProgress | undefined,
): ChallengeProgressSummary | undefined {
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge || !progress) return undefined;

  const progressCount = challenge.targetDishIds.length > 0
    ? new Set(progress.completedDishes.filter((d) => challenge.targetDishIds.includes(d))).size
    : progress.completedDishes.length;

  const progressPercent = Math.min((progressCount / challenge.targetCount) * 100, 100);

  const startDate = new Date(progress.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + challenge.cycleDays);
  const today = new Date();
  const remainingDays = Math.max(
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    0,
  );

  return {
    id: challenge.id,
    title: challenge.title,
    badge: challenge.badge,
    progressCount,
    targetCount: challenge.targetCount,
    progressPercent,
    remainingDays,
    isCompleted: progress.completedAt !== null,
  };
}

export function generateShareText(
  totalDays: number,
  streakDays: number,
  totalDishes: number,
  challengeTitle?: string,
): string {
  const texts = [
    `我已经在小厨房坚持做饭 ${totalDays} 天啦！连续打卡 ${streakDays} 天，一共做了 ${totalDishes} 道菜～快来和我一起做饭吧！`,
    `${totalDays} 天的烹饪之旅，${streakDays} 天连续打卡，${totalDishes} 道美味佳肴。做饭这件小事，坚持下来真的很有成就感！`,
    `厨房打卡 ${totalDays} 天纪念 🎉 连续 ${streakDays} 天没断更，做了 ${totalDishes} 道菜。生活需要烟火气～`,
  ];

  if (challengeTitle) {
    texts.push(
      `正在挑战「${challengeTitle}」！已经坚持 ${totalDays} 天，做了 ${totalDishes} 道菜，快来一起挑战吧～`,
    );
  }

  return texts[Math.floor(Math.random() * texts.length)];
}

export function buildShareCardData(
  userName: string,
  avatarEmoji: string,
  cookingHistory: CookingRecord[],
  totalDays: number,
  streakDays: number,
  badges: ChallengeBadge[],
  cardTheme: CardThemeId = 'warm',
  challengeSummary?: ChallengeProgressSummary,
): ShareCardData {
  const summary = calculateCookingSummary(cookingHistory, totalDays, streakDays);
  const weekDishes = calculateWeekDishes(cookingHistory);

  return {
    userName,
    avatarEmoji,
    totalDays,
    streakDays,
    totalDishes: summary.totalDishes,
    uniqueDishesCount: summary.uniqueDishes,
    weekDishes,
    badges,
    recentDishes: summary.recentDishes,
    challengeSummary,
    shareText: generateShareText(totalDays, streakDays, summary.totalDishes, challengeSummary?.title),
    generatedAt: new Date().toISOString(),
    cardTheme,
  };
}
