import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { dishes, getDishById as getRawDishById, type Dish } from '@/data/dishes';

export interface LocalizedDish extends Omit<Dish, 'name' | 'description' | 'ingredients' | 'seasonings'> {
  name: string;
  description: string;
  ingredients: string[];
  seasonings: string[];
}

export function useDishI18n() {
  const { t } = useI18n();

  function getLocalizedDish(dish: Dish): LocalizedDish {
    const prefix = `dishes.${dish.id}`;
    
    const localizedIngredients = dish.ingredients.map((ing) => 
      t(`${prefix}.ingredients.${ing}`, ing)
    );
    
    const localizedSeasonings = dish.seasonings.map((s) => 
      t(`${prefix}.seasonings.${s}`, s)
    );

    return {
      ...dish,
      name: t(`${prefix}.name`, dish.name),
      description: t(`${prefix}.description`, dish.description),
      ingredients: localizedIngredients,
      seasonings: localizedSeasonings,
    };
  }

  const localizedDishes = computed((): LocalizedDish[] => {
    return dishes.map(getLocalizedDish);
  });

  function getLocalizedDishById(id: string): LocalizedDish | undefined {
    const raw = getRawDishById(id);
    if (!raw) return undefined;
    return getLocalizedDish(raw);
  }

  return {
    localizedDishes,
    getLocalizedDish,
    getLocalizedDishById,
  };
}
