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
  return Array.from(set).sort((a, b) => a - b);
}

export function checkNewUnlocks(prevDays: number, newDays: number): {
  newDecorations: Decoration[];
  newAprons: Apron[];
} {
  const newDecorations = unlocks.decorations.filter(
    (d) => d.threshold > prevDays && d.threshold <= newDays,
  );
  const newAprons = unlocks.aprons.filter(
    (a) => a.threshold > prevDays && a.threshold <= newDays,
  );
  return { newDecorations, newAprons };
}
