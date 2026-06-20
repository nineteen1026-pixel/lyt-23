import { computed } from 'vue';
import type { Dish } from '@/data/dishes';
import { getIngredientNutrition, type DishNutrition } from '@/data/nutrition';

export function useNutrition() {
  function calculateDishNutrition(dish: Dish): DishNutrition {
    const allIngredients = [...dish.ingredients, ...dish.seasonings];
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const ingredients = allIngredients.map((name) => {
      const nutrition = getIngredientNutrition(name);
      if (!nutrition) {
        return {
          name,
          amount: 0,
          unit: 'g',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      const factor = nutrition.servingSize / 100;
      const calories = Math.round(nutrition.calories * factor * 10) / 10;
      const protein = Math.round(nutrition.protein * factor * 10) / 10;
      const carbs = Math.round(nutrition.carbs * factor * 10) / 10;
      const fat = Math.round(nutrition.fat * factor * 10) / 10;

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;

      return {
        name,
        amount: nutrition.servingSize,
        unit: nutrition.unit,
        calories,
        protein,
        carbs,
        fat,
      };
    });

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      ingredients,
    };
  }

  function getCalorieLevel(calories: number): { level: 'low' | 'medium' | 'high'; label: string; color: string } {
    if (calories < 300) return { level: 'low', label: '轻食', color: 'text-matcha-600' };
    if (calories < 600) return { level: 'medium', label: '适中', color: 'text-amber-600' };
    return { level: 'high', label: '丰盛', color: 'text-apricot-600' };
  }

  function getProteinLevel(protein: number): { level: 'low' | 'medium' | 'high'; label: string } {
    if (protein < 15) return { level: 'low', label: '补充蛋白' };
    if (protein < 30) return { level: 'medium', label: '蛋白适中' };
    return { level: 'high', label: '高蛋白' };
  }

  function getNutritionAdvice(nutrition: DishNutrition): string[] {
    const advice: string[] = [];
    const { totalCalories, totalProtein, totalCarbs, totalFat } = nutrition;

    if (totalCalories < 300) {
      advice.push('这道菜品热量较低，适合作为轻食餐');
    } else if (totalCalories > 600) {
      advice.push('这道菜品热量较高，建议控制食用量');
    }

    if (totalProtein < 15) {
      advice.push('可以搭配鸡蛋、豆制品增加蛋白质');
    } else if (totalProtein > 30) {
      advice.push('蛋白质含量丰富，是增肌好选择');
    }

    if (totalCarbs > 50) {
      advice.push('碳水化合物较高，注意搭配蔬菜');
    }

    if (totalFat > 30) {
      advice.push('脂肪含量较高，建议减少食用油用量');
    }

    if (advice.length === 0) {
      advice.push('营养搭配均衡，继续保持！');
    }

    return advice;
  }

  function formatNutrientValue(value: number): string {
    if (value >= 100) return Math.round(value).toString();
    return value.toFixed(1);
  }

  function calculateMacroPercentages(nutrition: DishNutrition) {
    const proteinCal = nutrition.totalProtein * 4;
    const carbsCal = nutrition.totalCarbs * 4;
    const fatCal = nutrition.totalFat * 9;
    const total = proteinCal + carbsCal + fatCal;

    if (total === 0) {
      return { protein: 33.3, carbs: 33.3, fat: 33.3 };
    }

    return {
      protein: Math.round((proteinCal / total) * 100),
      carbs: Math.round((carbsCal / total) * 100),
      fat: Math.round((fatCal / total) * 100),
    };
  }

  return {
    calculateDishNutrition,
    getCalorieLevel,
    getProteinLevel,
    getNutritionAdvice,
    formatNutrientValue,
    calculateMacroPercentages,
  };
}
