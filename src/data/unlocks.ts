import { isDecorationAvailableThisMonth, isApronAvailableThisMonth } from '@/data/seasonal';
import { themes, type KitchenBackground, type CounterMaterial } from '@/data/themes';

export interface Decoration {
  id: string;
  name: string;
  emoji: string;
  threshold: number;
  description: string;
}

export interface Apron {
  id: string;
  name: string;
  color: string;
  stripe: string | null;
  threshold: number;
}

export interface UnlockData {
  decorations: Decoration[];
  aprons: Apron[];
}

export type UnlockItemType = 'decoration' | 'apron' | 'background' | 'counter';

export interface PreviewUnlockItem {
  type: UnlockItemType;
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  stripe?: string | null;
  description?: string;
  threshold: number;
}

export interface NextThresholdReward {
  threshold: number;
  items: PreviewUnlockItem[];
  daysRemaining: number;
  progressPercent: number;
}

export const unlocks: UnlockData = {
  decorations: [
    { id: 'cactus', name: '治愈小仙人掌', emoji: '🌵', threshold: 3, description: '不需要浇水也能茁壮成长' },
    { id: 'cat-figure', name: '厨房猫咪摆件', emoji: '🐱', threshold: 7, description: '蹲在角落安静陪你做饭' },
    { id: 'herb-pot', name: '罗勒香草盆', emoji: '🌿', threshold: 14, description: '随手揪一片点缀意面' },
    { id: 'vintage-lamp', name: '复古小台灯', emoji: '🌷', threshold: 21, description: '深夜做饭的温暖陪伴' },
    { id: 'fridge-magnet', name: '冰箱贴套装', emoji: '🧲', threshold: 30, description: '把每日菜单贴在冰箱上' },
    { id: 'coffee-mug', name: '暖心马克杯', emoji: '☕', threshold: 45, description: '饭后一杯咖啡刚刚好' },
    { id: 'wreath', name: '干花小花环', emoji: '🌸', threshold: 60, description: '挂在厨房门口迎接好心情' },
    { id: 'cherry-blossom', name: '樱花风铃', emoji: '🌸', threshold: 25, description: '春风拂过，花瓣随风摇曳' },
    { id: 'paper-fan', name: '古风纸扇', emoji: '🏮', threshold: 35, description: '夏日午后摇一摇，凉风习习' },
    { id: 'maple-leaf', name: '枫叶标本框', emoji: '🍁', threshold: 40, description: '留住秋日限定的秋色' },
    { id: 'snowflake', name: '雪花水晶球', emoji: '❄️', threshold: 30, description: '摇一摇就是下雪天' },
  ],
  aprons: [
    { id: 'default', name: '基础米白围裙', color: '#FFF8F0', stripe: null, threshold: 0 },
    { id: 'gingham', name: '橙白格纹围裙', color: '#FF8C42', stripe: 'gingham', threshold: 5 },
    { id: 'stripe', name: '抹茶条纹围裙', color: '#A7C957', stripe: 'stripe', threshold: 10 },
    { id: 'denim', name: '做旧牛仔围裙', color: '#6B8EAE', stripe: 'denim', threshold: 20 },
    { id: 'cherry', name: '樱桃印花围裙', color: '#E63946', stripe: 'cherry', threshold: 35 },
    { id: 'rainbow', name: '彩虹治愈围裙', color: '#F4A261', stripe: 'rainbow', threshold: 50 },
    { id: 'sakura', name: '樱花粉围裙', color: '#FFB7C5', stripe: 'floral', threshold: 18 },
    { id: 'watermelon', name: '清凉西瓜围裙', color: '#FF6B6B', stripe: 'watermelon', threshold: 22 },
    { id: 'pumpkin', name: '南瓜橙南瓜围裙', color: '#FFA500', stripe: 'pumpkin', threshold: 28 },
    { id: 'christmas', name: '圣诞红绿围裙', color: '#165B33', stripe: 'christmas', threshold: 42 },
  ],
};

export function getAllThresholds(): number[] {
  const set = new Set<number>();
  unlocks.decorations.forEach((d) => set.add(d.threshold));
  unlocks.aprons.forEach((a) => set.add(a.threshold));
  themes.backgrounds.forEach((b) => set.add(b.threshold));
  themes.counters.forEach((c) => set.add(c.threshold));
  return Array.from(set).sort((a, b) => a - b);
}

export function checkNewUnlocks(prevDays: number, newDays: number): {
  newDecorations: Decoration[];
  newAprons: Apron[];
} {
  const newDecorations = unlocks.decorations.filter(
    (d) =>
      d.threshold > prevDays &&
      d.threshold <= newDays &&
      isDecorationAvailableThisMonth(d.id),
  );
  const newAprons = unlocks.aprons.filter(
    (a) =>
      a.threshold > prevDays &&
      a.threshold <= newDays &&
      isApronAvailableThisMonth(a.id),
  );
  return { newDecorations, newAprons };
}

export function getMaxThreshold(): number {
  const allThresholds = getAllThresholds();
  return Math.max(...allThresholds, 1);
}

export function getNextThresholdReward(currentDays: number): NextThresholdReward | null {
  const allThresholds = getAllThresholds();
  const nextThreshold = allThresholds.find((t) => t > currentDays);

  if (!nextThreshold) {
    return null;
  }

  const items: PreviewUnlockItem[] = [];

  unlocks.decorations
    .filter((d) => d.threshold === nextThreshold && isDecorationAvailableThisMonth(d.id))
    .forEach((d) => {
      items.push({
        type: 'decoration',
        id: d.id,
        name: d.name,
        emoji: d.emoji,
        description: d.description,
        threshold: d.threshold,
      });
    });

  unlocks.aprons
    .filter((a) => a.threshold === nextThreshold && isApronAvailableThisMonth(a.id))
    .forEach((a) => {
      items.push({
        type: 'apron',
        id: a.id,
        name: a.name,
        color: a.color,
        stripe: a.stripe,
        threshold: a.threshold,
      });
    });

  themes.backgrounds
    .filter((b) => b.threshold === nextThreshold)
    .forEach((b) => {
      items.push({
        type: 'background',
        id: b.id,
        name: b.name,
        emoji: b.emoji,
        description: b.description,
        threshold: b.threshold,
      });
    });

  themes.counters
    .filter((c) => c.threshold === nextThreshold)
    .forEach((c) => {
      items.push({
        type: 'counter',
        id: c.id,
        name: c.name,
        emoji: c.emoji,
        description: c.description,
        threshold: c.threshold,
      });
    });

  const maxThreshold = getMaxThreshold();
  const prevThreshold = allThresholds.filter((t) => t <= currentDays).pop() || 0;

  return {
    threshold: nextThreshold,
    items,
    daysRemaining: nextThreshold - currentDays,
    progressPercent: currentDays >= nextThreshold
      ? 100
      : Math.min(
          ((currentDays - prevThreshold) / (nextThreshold - prevThreshold)) * 100,
          100,
        ),
  };
}

export function getProgressInfo(currentDays: number): {
  currentThreshold: number;
  nextThreshold: number | null;
  maxThreshold: number;
  overallPercent: number;
  thresholds: number[];
} {
  const thresholds = getAllThresholds();
  const maxThreshold = getMaxThreshold();
  const currentThreshold = thresholds.filter((t) => t <= currentDays).pop() || 0;
  const nextThreshold = thresholds.find((t) => t > currentDays) || null;
  const overallPercent = Math.min((currentDays / maxThreshold) * 100, 100);

  return {
    currentThreshold,
    nextThreshold,
    maxThreshold,
    overallPercent,
    thresholds,
  };
}
