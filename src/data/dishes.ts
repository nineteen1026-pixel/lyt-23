export interface DishTasteProfile {
  spicy: 0 | 1 | 2 | 3;
  salty: 0 | 1 | 2 | 3;
  sweet: 0 | 1 | 2 | 3;
  oily: 0 | 1 | 2 | 3;
}

export interface Dish {
  id: string;
  name: string;
  emoji: string;
  time: number;
  difficulty: 1 | 2 | 3;
  ingredients: string[];
  color: string;
  seasonings: string[];
  description: string;
  allergens: string[];
  taste: DishTasteProfile;
}

export const dishes: Dish[] = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    emoji: '🍅',
    time: 10,
    difficulty: 1,
    ingredients: ['番茄', '鸡蛋'],
    seasonings: ['盐', '糖'],
    color: '#FF6B6B',
    description: '国民家常菜，酸甜开胃超下饭',
    allergens: ['egg'],
    taste: { spicy: 0, salty: 1, sweet: 2, oily: 1 },
  },
  {
    id: 'miso-salmon',
    name: '味噌烤三文鱼',
    emoji: '🐟',
    time: 15,
    difficulty: 2,
    ingredients: ['三文鱼', '味噌'],
    seasonings: ['味噌', '清酒', '蜂蜜'],
    color: '#FFA07A',
    description: '日式风味，外焦里嫩 omega-3 满满',
    allergens: ['fish', 'soy'],
    taste: { spicy: 0, salty: 2, sweet: 1, oily: 1 },
  },
  {
    id: 'veggie-pasta',
    name: '时蔬意面',
    emoji: '🍝',
    time: 15,
    difficulty: 2,
    ingredients: ['意面', '西兰花', '小番茄'],
    seasonings: ['橄榄油', '黑胡椒', '盐'],
    color: '#A7C957',
    description: '清新健康，颜色缤纷的治愈系一餐',
    allergens: ['wheat'],
    taste: { spicy: 0, salty: 1, sweet: 0, oily: 2 },
  },
  {
    id: 'teriyaki-chicken',
    name: '照烧鸡腿',
    emoji: '🍗',
    time: 20,
    difficulty: 2,
    ingredients: ['鸡腿', '酱油'],
    seasonings: ['酱油', '味醂', '清酒'],
    color: '#C97B3C',
    description: '浓郁照烧汁裹着嫩滑鸡腿，肉香四溢',
    allergens: ['soy', 'wheat'],
    taste: { spicy: 0, salty: 2, sweet: 2, oily: 2 },
  },
  {
    id: 'mushroom-soup',
    name: '奶油蘑菇汤',
    emoji: '🍄',
    time: 12,
    difficulty: 1,
    ingredients: ['蘑菇', '奶油'],
    seasonings: ['黑胡椒', '盐', '百里香'],
    color: '#D4A373',
    description: '浓香丝滑，抚慰疲惫的温暖汤品',
    allergens: ['milk', 'mushroom'],
    taste: { spicy: 0, salty: 1, sweet: 0, oily: 2 },
  },
  {
    id: 'avocado-toast',
    name: '牛油果吐司',
    emoji: '🥑',
    time: 8,
    difficulty: 1,
    ingredients: ['吐司', '牛油果', '鸡蛋'],
    seasonings: ['黑胡椒', '盐', '橄榄油'],
    color: '#88B04B',
    description: '快手早午餐，健康又高颜值',
    allergens: ['wheat', 'egg'],
    taste: { spicy: 0, salty: 1, sweet: 0, oily: 2 },
  },
];

export function getDishById(id: string): Dish | undefined {
  return dishes.find((d) => d.id === id);
}
