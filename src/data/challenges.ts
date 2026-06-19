export interface ChallengeBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDishIds: string[];
  targetCount: number;
  cycleDays: number;
  badge: ChallengeBadge;
  startDate?: string;
}

export const challenges: Challenge[] = [
  {
    id: 'beginner-chef',
    title: '新手厨师入门',
    description: '一周内完成 3 道任意菜品，获得「新手厨师」徽章',
    targetDishIds: [],
    targetCount: 3,
    cycleDays: 7,
    badge: {
      id: 'badge-beginner',
      name: '新手厨师',
      emoji: '👨‍🍳',
      description: '迈出烹饪第一步的勇敢小厨师',
    },
  },
  {
    id: 'veggie-lover',
    title: '素食爱好者',
    description: '5 天内完成番茄炒蛋与时蔬意面，获得「素食爱好者」徽章',
    targetDishIds: ['tomato-egg', 'veggie-pasta'],
    targetCount: 2,
    cycleDays: 5,
    badge: {
      id: 'badge-veggie',
      name: '素食爱好者',
      emoji: '🥗',
      description: '热爱蔬菜，健康生活的代表',
    },
  },
  {
    id: 'japanese-cuisine',
    title: '日式料理达人',
    description: '7 天内完成味噌烤三文鱼与照烧鸡腿，获得「日式料理达人」徽章',
    targetDishIds: ['miso-salmon', 'teriyaki-chicken'],
    targetCount: 2,
    cycleDays: 7,
    badge: {
      id: 'badge-japanese',
      name: '日式料理达人',
      emoji: '🍱',
      description: '精通日式家常料理的烹饪高手',
    },
  },
  {
    id: 'soup-master',
    title: '温暖汤品大师',
    description: '3 天内完成奶油蘑菇汤，获得「温暖汤品大师」徽章',
    targetDishIds: ['mushroom-soup'],
    targetCount: 1,
    cycleDays: 3,
    badge: {
      id: 'badge-soup',
      name: '温暖汤品大师',
      emoji: '🍲',
      description: '熬制温暖人心汤品的治愈大师',
    },
  },
  {
    id: 'breakfast-champion',
    title: '早餐冠军',
    description: '4 天内完成牛油果吐司，获得「早餐冠军」徽章',
    targetDishIds: ['avocado-toast'],
    targetCount: 1,
    cycleDays: 4,
    badge: {
      id: 'badge-breakfast',
      name: '早餐冠军',
      emoji: '🌅',
      description: '用美味早餐开启活力满满的一天',
    },
  },
  {
    id: 'week-warrior',
    title: '一周战士',
    description: '7 天内完成 5 道任意菜品，获得「一周战士」徽章',
    targetDishIds: [],
    targetCount: 5,
    cycleDays: 7,
    badge: {
      id: 'badge-warrior',
      name: '一周战士',
      emoji: '⚔️',
      description: '连续一周坚持做饭的坚韧战士',
    },
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}
