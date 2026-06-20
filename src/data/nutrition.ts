export interface IngredientNutrition {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  unit: 'g' | 'ml' | 'piece';
}

export interface DishNutrition {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export const ingredientNutritionDB: Record<string, IngredientNutrition> = {
  '番茄': { name: '番茄', calories: 20, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: 150, unit: 'g' },
  '鸡蛋': { name: '鸡蛋', calories: 155, protein: 13.3, carbs: 2.8, fat: 10.3, servingSize: 50, unit: 'g' },
  '三文鱼': { name: '三文鱼', calories: 208, protein: 20.4, carbs: 0, fat: 13.4, servingSize: 150, unit: 'g' },
  '味噌': { name: '味噌', calories: 199, protein: 12.8, carbs: 20.1, fat: 6.1, servingSize: 30, unit: 'g' },
  '意面': { name: '意面', calories: 371, protein: 13.1, carbs: 75.1, fat: 1.5, servingSize: 100, unit: 'g' },
  '西兰花': { name: '西兰花', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, servingSize: 100, unit: 'g' },
  '小番茄': { name: '小番茄', calories: 20, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: 50, unit: 'g' },
  '鸡腿': { name: '鸡腿', calories: 231, protein: 19.7, carbs: 0, fat: 16.5, servingSize: 200, unit: 'g' },
  '酱油': { name: '酱油', calories: 53, protein: 5.6, carbs: 5.4, fat: 0.3, servingSize: 15, unit: 'ml' },
  '蘑菇': { name: '蘑菇', calories: 34, protein: 3.1, carbs: 3.5, fat: 0.3, servingSize: 100, unit: 'g' },
  '奶油': { name: '奶油', calories: 340, protein: 2.1, carbs: 3.2, fat: 35.9, servingSize: 60, unit: 'ml' },
  '吐司': { name: '吐司', calories: 265, protein: 9, carbs: 49, fat: 3.2, servingSize: 60, unit: 'g' },
  '牛油果': { name: '牛油果', calories: 160, protein: 2, carbs: 7.5, fat: 15.3, servingSize: 100, unit: 'g' },
  '春卷皮': { name: '春卷皮', calories: 292, protein: 7.5, carbs: 56.8, fat: 3.6, servingSize: 80, unit: 'g' },
  '豆芽': { name: '豆芽', calories: 30, protein: 4, carbs: 5.8, fat: 0.2, servingSize: 50, unit: 'g' },
  '胡萝卜': { name: '胡萝卜', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, servingSize: 50, unit: 'g' },
  '香菇': { name: '香菇', calories: 26, protein: 2.2, carbs: 5.2, fat: 0.3, servingSize: 30, unit: 'g' },
  '草莓': { name: '草莓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, servingSize: 150, unit: 'g' },
  '牛奶': { name: '牛奶', calories: 54, protein: 3, carbs: 3.4, fat: 3.2, servingSize: 100, unit: 'ml' },
  '淡奶油': { name: '淡奶油', calories: 340, protein: 2.1, carbs: 3.2, fat: 35.9, servingSize: 80, unit: 'ml' },
  '绿豆': { name: '绿豆', calories: 339, protein: 21.6, carbs: 55.6, fat: 0.8, servingSize: 100, unit: 'g' },
  '冰糖': { name: '冰糖', calories: 387, protein: 0, carbs: 99.9, fat: 0, servingSize: 30, unit: 'g' },
  '面条': { name: '面条', calories: 284, protein: 8.3, carbs: 56.8, fat: 2.3, servingSize: 150, unit: 'g' },
  '黄瓜': { name: '黄瓜', calories: 15, protein: 0.8, carbs: 2.9, fat: 0.2, servingSize: 50, unit: 'g' },
  '花生碎': { name: '花生碎', calories: 574, protein: 24.8, carbs: 16.1, fat: 44.3, servingSize: 20, unit: 'g' },
  '月饼皮': { name: '月饼皮', calories: 446, protein: 5.9, carbs: 76.6, fat: 12.9, servingSize: 80, unit: 'g' },
  '莲蓉': { name: '莲蓉', calories: 443, protein: 6.8, carbs: 66.3, fat: 18.5, servingSize: 60, unit: 'g' },
  '咸蛋黄': { name: '咸蛋黄', calories: 312, protein: 14.5, carbs: 4.5, fat: 26.8, servingSize: 30, unit: 'g' },
  '糯米粉': { name: '糯米粉', calories: 360, protein: 5.9, carbs: 78.3, fat: 0.7, servingSize: 100, unit: 'g' },
  '桂花': { name: '桂花', calories: 254, protein: 7.1, carbs: 56.9, fat: 1.5, servingSize: 5, unit: 'g' },
  '蜂蜜': { name: '蜂蜜', calories: 321, protein: 0.3, carbs: 82.4, fat: 0, servingSize: 30, unit: 'g' },
  '肥牛卷': { name: '肥牛卷', calories: 250, protein: 17, carbs: 0, fat: 20, servingSize: 200, unit: 'g' },
  '白菜': { name: '白菜', calories: 12, protein: 1, carbs: 2.2, fat: 0.1, servingSize: 100, unit: 'g' },
  '豆腐': { name: '豆腐', calories: 76, protein: 8.1, carbs: 3.8, fat: 3.7, servingSize: 100, unit: 'g' },
  '大米': { name: '大米', calories: 347, protein: 7.4, carbs: 77.9, fat: 0.8, servingSize: 50, unit: 'g' },
  '红豆': { name: '红豆', calories: 338, protein: 20.2, carbs: 55.7, fat: 0.6, servingSize: 30, unit: 'g' },
  '花生': { name: '花生', calories: 574, protein: 24.8, carbs: 16.1, fat: 44.3, servingSize: 20, unit: 'g' },
  '红枣': { name: '红枣', calories: 264, protein: 3.2, carbs: 67.8, fat: 0.5, servingSize: 30, unit: 'g' },
  '莲子': { name: '莲子', calories: 344, protein: 17.2, carbs: 64.2, fat: 2, servingSize: 20, unit: 'g' },
  '黑芝麻': { name: '黑芝麻', calories: 559, protein: 19.1, carbs: 24, fat: 46.1, servingSize: 30, unit: 'g' },
  '猪油': { name: '猪油', calories: 827, protein: 0, carbs: 0, fat: 92.5, servingSize: 20, unit: 'g' },
  '红糖': { name: '红糖', calories: 380, protein: 0.7, carbs: 96.6, fat: 0, servingSize: 30, unit: 'g' },
  '生姜片': { name: '生姜片', calories: 41, protein: 1.3, carbs: 10.3, fat: 0.6, servingSize: 10, unit: 'g' },
  '盐': { name: '盐', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: 5, unit: 'g' },
  '糖': { name: '糖', calories: 387, protein: 0, carbs: 99.9, fat: 0, servingSize: 10, unit: 'g' },
  '清酒': { name: '清酒', calories: 134, protein: 0.5, carbs: 5, fat: 0, servingSize: 15, unit: 'ml' },
  '橄榄油': { name: '橄榄油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 10, unit: 'ml' },
  '黑胡椒': { name: '黑胡椒', calories: 251, protein: 10.4, carbs: 64, fat: 3.3, servingSize: 3, unit: 'g' },
  '百里香': { name: '百里香', calories: 101, protein: 5.6, carbs: 24.4, fat: 1.7, servingSize: 2, unit: 'g' },
  '吉利丁片': { name: '吉利丁片', calories: 335, protein: 84, carbs: 0, fat: 0.1, servingSize: 5, unit: 'g' },
  '生抽': { name: '生抽', calories: 53, protein: 5.6, carbs: 5.4, fat: 0.3, servingSize: 15, unit: 'ml' },
  '香油': { name: '香油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 5, unit: 'ml' },
  '醋': { name: '醋', calories: 31, protein: 0.1, carbs: 5.3, fat: 0.3, servingSize: 10, unit: 'ml' },
  '辣椒油': { name: '辣椒油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 10, unit: 'ml' },
  '糖浆': { name: '糖浆', calories: 315, protein: 0, carbs: 79.4, fat: 0, servingSize: 20, unit: 'g' },
  '花生油': { name: '花生油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 10, unit: 'ml' },
  '火锅底料': { name: '火锅底料', calories: 450, protein: 8, carbs: 25, fat: 35, servingSize: 50, unit: 'g' },
  '芝麻酱': { name: '芝麻酱', calories: 618, protein: 19.2, carbs: 22.7, fat: 52.7, servingSize: 20, unit: 'g' },
  '食用油': { name: '食用油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 10, unit: 'ml' },
  '味醂': { name: '味醂', calories: 137, protein: 0.3, carbs: 33.5, fat: 0, servingSize: 10, unit: 'ml' },
};

export function getIngredientNutrition(name: string): IngredientNutrition | undefined {
  return ingredientNutritionDB[name];
}
