export interface KitchenBackground {
  id: string;
  name: string;
  description: string;
  emoji: string;
  threshold: number;
  colors: {
    bg: string;
    bgSoft: string;
    primary: string;
    secondary: string;
    text: string;
  };
  gradients: {
    topLeft: string;
    bottomRight: string;
    base: string;
  };
}

export interface CounterMaterial {
  id: string;
  name: string;
  description: string;
  emoji: string;
  threshold: number;
  background: string;
  borderColor: string;
  accentColor: string;
}

export interface ThemeData {
  backgrounds: KitchenBackground[];
  counters: CounterMaterial[];
}

export const themes: ThemeData = {
  backgrounds: [
    {
      id: 'warm-cream',
      name: '暖调奶油',
      description: '治愈的奶油色调，温暖每一天',
      emoji: '🍯',
      threshold: 0,
      colors: {
        bg: '#FFE8D6',
        bgSoft: '#FFF8F0',
        primary: '#FF8C42',
        secondary: '#A7C957',
        text: '#6B4226',
      },
      gradients: {
        topLeft: '#FFF1E0',
        bottomRight: '#FFE0C4',
        base: '#FFE8D6',
      },
    },
    {
      id: 'sakura-pink',
      name: '樱花粉调',
      description: '春天的樱花，粉色浪漫',
      emoji: '🌸',
      threshold: 15,
      colors: {
        bg: '#FFE4EC',
        bgSoft: '#FFF0F5',
        primary: '#FF6B9D',
        secondary: '#FFB7C5',
        text: '#8B4557',
      },
      gradients: {
        topLeft: '#FFD6E6',
        bottomRight: '#FFC0CB',
        base: '#FFE4EC',
      },
    },
    {
      id: 'matcha-green',
      name: '抹茶清新',
      description: '日式抹茶绿，清新自然',
      emoji: '🍵',
      threshold: 25,
      colors: {
        bg: '#E8F5D4',
        bgSoft: '#F4FAE8',
        primary: '#6B8E23',
        secondary: '#A7C957',
        text: '#3D5A1E',
      },
      gradients: {
        topLeft: '#D4E8B8',
        bottomRight: '#C5E1A5',
        base: '#E8F5D4',
      },
    },
    {
      id: 'ocean-blue',
      name: '海洋蓝调',
      description: '清凉的海风，夏日清新',
      emoji: '🌊',
      threshold: 40,
      colors: {
        bg: '#E3F2FD',
        bgSoft: '#F0F8FF',
        primary: '#4A90D9',
        secondary: '#87CEEB',
        text: '#1E3A5F',
      },
      gradients: {
        topLeft: '#D0E8FA',
        bottomRight: '#B8DCF5',
        base: '#E3F2FD',
      },
    },
    {
      id: 'lavender-dream',
      name: '薰衣草梦',
      description: '紫色梦幻，优雅浪漫',
      emoji: '💜',
      threshold: 55,
      colors: {
        bg: '#F3E5F5',
        bgSoft: '#FAF0FF',
        primary: '#9C27B0',
        secondary: '#CE93D8',
        text: '#4A148C',
      },
      gradients: {
        topLeft: '#E1BEE7',
        bottomRight: '#D1C4E9',
        base: '#F3E5F5',
      },
    },
    {
      id: 'autumn-warmth',
      name: '秋日暖阳',
      description: '金黄秋叶，温暖收获',
      emoji: '🍂',
      threshold: 70,
      colors: {
        bg: '#FFF3E0',
        bgSoft: '#FFFAF0',
        primary: '#E65100',
        secondary: '#FFB74D',
        text: '#5D2E00',
      },
      gradients: {
        topLeft: '#FFE0B2',
        bottomRight: '#FFCC80',
        base: '#FFF3E0',
      },
    },
    {
      id: 'midnight-cozy',
      name: '午夜温馨',
      description: '深夜的厨房，温暖灯光',
      emoji: '🌙',
      threshold: 90,
      colors: {
        bg: '#2D2B3E',
        bgSoft: '#3D3B52',
        primary: '#FFD54F',
        secondary: '#FFAB91',
        text: '#FFF8E1',
      },
      gradients: {
        topLeft: '#3D3B52',
        bottomRight: '#252335',
        base: '#2D2B3E',
      },
    },
  ],
  counters: [
    {
      id: 'wood-light',
      name: '原木浅色',
      description: '温润的浅木色，自然质感',
      emoji: '🪵',
      threshold: 0,
      background: 'linear-gradient(180deg, #DEB887 0%, #D2B48C 50%, #C4A574 100%)',
      borderColor: '#B8956E',
      accentColor: '#8B7355',
    },
    {
      id: 'marble-white',
      name: '纯白大理石',
      description: '高级感大理石纹理',
      emoji: '⚪',
      threshold: 10,
      background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #DEE2E6 100%)',
      borderColor: '#CED4DA',
      accentColor: '#ADB5BD',
    },
    {
      id: 'concrete-gray',
      name: '工业水泥',
      description: '现代工业风水泥质感',
      emoji: '🏗️',
      threshold: 20,
      background: 'linear-gradient(180deg, #A0A0A0 0%, #8C8C8C 50%, #787878 100%)',
      borderColor: '#6E6E6E',
      accentColor: '#5A5A5A',
    },
    {
      id: 'terrazzo-colorful',
      name: '彩色水磨石',
      description: '复古彩色颗粒水磨石',
      emoji: '🎨',
      threshold: 35,
      background: 'linear-gradient(135deg, #FFE4E1 0%, #F0FFF0 25%, #E6E6FA 50%, #FFF0F5 75%, #F5F5DC 100%)',
      borderColor: '#DDA0DD',
      accentColor: '#9370DB',
    },
    {
      id: 'wood-dark',
      name: '深棕橡木',
      description: '沉稳的深色橡木',
      emoji: '🌳',
      threshold: 50,
      background: 'linear-gradient(180deg, #8B5A2B 0%, #6B4423 50%, #5C3A1D 100%)',
      borderColor: '#4A2E15',
      accentColor: '#3D2410',
    },
    {
      id: 'copper-metal',
      name: '复古铜质',
      description: '温暖的铜质金属质感',
      emoji: '🥉',
      threshold: 65,
      background: 'linear-gradient(180deg, #CD7F32 0%, #B87333 50%, #A0622D 100%)',
      borderColor: '#8B5A2B',
      accentColor: '#704214',
    },
    {
      id: 'stainless-steel',
      name: '不锈钢亮面',
      description: '专业厨房不锈钢台面',
      emoji: '✨',
      threshold: 80,
      background: 'linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 30%, #A8A8A8 50%, #C0C0C0 70%, #E8E8E8 100%)',
      borderColor: '#808080',
      accentColor: '#606060',
    },
  ],
};

export function getBackgroundById(id: string): KitchenBackground | undefined {
  return themes.backgrounds.find((b) => b.id === id);
}

export function getCounterById(id: string): CounterMaterial | undefined {
  return themes.counters.find((c) => c.id === id);
}

export function getDefaultBackground(): KitchenBackground {
  return themes.backgrounds[0];
}

export function getDefaultCounter(): CounterMaterial {
  return themes.counters[0];
}

export function checkNewThemeUnlocks(
  prevDays: number,
  newDays: number,
): {
  newBackgrounds: KitchenBackground[];
  newCounters: CounterMaterial[];
} {
  const newBackgrounds = themes.backgrounds.filter(
    (b) => b.threshold > prevDays && b.threshold <= newDays,
  );
  const newCounters = themes.counters.filter(
    (c) => c.threshold > prevDays && c.threshold <= newDays,
  );
  return { newBackgrounds, newCounters };
}

export function getAllThemeThresholds(): number[] {
  const set = new Set<number>();
  themes.backgrounds.forEach((b) => set.add(b.threshold));
  themes.counters.forEach((c) => set.add(c.threshold));
  return Array.from(set).sort((a, b) => a - b);
}
