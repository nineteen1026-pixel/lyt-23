export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const MONTH_NAMES: Record<MonthNumber, string> = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月',
};

export const SEASON_NAMES: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const MONTH_SEASON: Record<MonthNumber, string> = {
  1: 'winter',
  2: 'winter',
  3: 'spring',
  4: 'spring',
  5: 'spring',
  6: 'summer',
  7: 'summer',
  8: 'summer',
  9: 'autumn',
  10: 'autumn',
  11: 'autumn',
  12: 'winter',
};

export const SEASON_EMOJI: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍁',
  winter: '❄️',
};

export const SEASON_COLORS: Record<string, string> = {
  spring: '#FFB6C1',
  summer: '#87CEEB',
  autumn: '#DEB887',
  winter: '#B0E0E6',
};

export interface SeasonalDish {
  dishId: string;
  months: MonthNumber[];
  isLimited: boolean;
  limitedLabel?: string;
  unlockThreshold?: number;
  description?: string;
}

export interface SeasonalDecoration {
  decorationId: string;
  months: MonthNumber[];
  unlockThreshold: number;
}

export interface SeasonalApron {
  apronId: string;
  months: MonthNumber[];
  unlockThreshold: number;
}

export const seasonalDishes: SeasonalDish[] = [
  {
    dishId: 'spring-roll',
    months: [3, 4, 5],
    isLimited: true,
    limitedLabel: '春日限定',
    description: '春光明媚，咬一口酥脆春卷',
  },
  {
    dishId: 'strawberry-dessert',
    months: [3, 4, 5],
    isLimited: true,
    limitedLabel: '春日限定',
    unlockThreshold: 5,
    description: '草莓季的甜蜜小确幸',
  },
  {
    dishId: 'mung-bean-soup',
    months: [6, 7, 8],
    isLimited: true,
    limitedLabel: '消暑限定',
    description: '夏日清凉，一碗绿豆汤解暑',
  },
  {
    dishId: 'cold-noodles',
    months: [6, 7, 8],
    isLimited: true,
    limitedLabel: '消暑限定',
    unlockThreshold: 10,
    description: '酸辣开胃的夏日凉面',
  },
  {
    dishId: 'mooncake',
    months: [8, 9, 10],
    isLimited: true,
    limitedLabel: '中秋限定',
    description: '月圆人团圆，月饼少不了',
  },
  {
    dishId: 'osmanthus-cake',
    months: [9, 10, 11],
    isLimited: true,
    limitedLabel: '金秋限定',
    unlockThreshold: 8,
    description: '桂花香里的秋天味道',
  },
  {
    dishId: 'hot-pot',
    months: [11, 12, 1, 2],
    isLimited: true,
    limitedLabel: '暖冬限定',
    description: '寒风凛冽，围炉吃火锅',
  },
  {
    dishId: 'tangyuan',
    months: [12, 1, 2],
    isLimited: true,
    limitedLabel: '冬至限定',
    unlockThreshold: 12,
    description: '团团圆圆的甜汤圆',
  },
  {
    dishId: 'laba-porridge',
    months: [12, 1],
    isLimited: true,
    limitedLabel: '腊八限定',
    description: '腊八节的温暖粥品',
  },
  {
    dishId: 'rice-cake',
    months: [1, 2],
    isLimited: true,
    limitedLabel: '新年限定',
    unlockThreshold: 15,
    description: '步步高升的年糕',
  },
];

export const seasonalDecorations: SeasonalDecoration[] = [
  {
    decorationId: 'cherry-blossom',
    months: [3, 4, 5],
    unlockThreshold: 25,
  },
  {
    decorationId: 'paper-fan',
    months: [6, 7, 8],
    unlockThreshold: 35,
  },
  {
    decorationId: 'maple-leaf',
    months: [9, 10, 11],
    unlockThreshold: 40,
  },
  {
    decorationId: 'snowflake',
    months: [11, 12, 1, 2],
    unlockThreshold: 30,
  },
];

export const seasonalAprons: SeasonalApron[] = [
  {
    apronId: 'sakura',
    months: [3, 4, 5],
    unlockThreshold: 18,
  },
  {
    apronId: 'watermelon',
    months: [6, 7, 8],
    unlockThreshold: 22,
  },
  {
    apronId: 'pumpkin',
    months: [9, 10, 11],
    unlockThreshold: 28,
  },
  {
    apronId: 'christmas',
    months: [11, 12],
    unlockThreshold: 42,
  },
];

export function getCurrentMonth(): MonthNumber {
  return (new Date().getMonth() + 1) as MonthNumber;
}

export function getCurrentSeason(): string {
  return MONTH_SEASON[getCurrentMonth()];
}

export function getCurrentSeasonalDishes(): SeasonalDish[] {
  const currentMonth = getCurrentMonth();
  return seasonalDishes.filter((sd) => sd.months.includes(currentMonth));
}

export function isDishAvailableThisMonth(dishId: string): boolean {
  const currentMonth = getCurrentMonth();
  const seasonal = seasonalDishes.find((sd) => sd.dishId === dishId);
  if (!seasonal) return true;
  return seasonal.months.includes(currentMonth);
}

export function getSeasonalDishInfo(dishId: string): SeasonalDish | undefined {
  return seasonalDishes.find((sd) => sd.dishId === dishId);
}

export function getCurrentSeasonalDecorations(): SeasonalDecoration[] {
  const currentMonth = getCurrentMonth();
  return seasonalDecorations.filter((sd) => sd.months.includes(currentMonth));
}

export function getCurrentSeasonalAprons(): SeasonalApron[] {
  const currentMonth = getCurrentMonth();
  return seasonalAprons.filter((sa) => sa.months.includes(currentMonth));
}

export function getAllSeasonalThresholds(): number[] {
  const set = new Set<number>();
  seasonalDishes.forEach((sd) => {
    if (sd.unlockThreshold) set.add(sd.unlockThreshold);
  });
  seasonalDecorations.forEach((sd) => set.add(sd.unlockThreshold));
  seasonalAprons.forEach((sa) => set.add(sa.unlockThreshold));
  return Array.from(set).sort((a, b) => a - b);
}
