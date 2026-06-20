<script setup lang="ts">
import { computed } from 'vue';
import { X, Flame, Beef, Wheat, Droplet, ChevronDown, ChevronUp, Lightbulb } from 'lucide-vue-next';
import { useNutrition } from '@/composables/useNutrition';
import type { DishNutrition } from '@/data/nutrition';
import { ref } from 'vue';

const props = defineProps<{
  dishName: string;
  dishEmoji: string;
  nutrition: DishNutrition;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { getCalorieLevel, getProteinLevel, getNutritionAdvice, formatNutrientValue, calculateMacroPercentages } = useNutrition();

const showIngredients = ref(false);

const calorieLevel = computed(() => getCalorieLevel(props.nutrition.totalCalories));
const proteinLevel = computed(() => getProteinLevel(props.nutrition.totalProtein));
const advice = computed(() => getNutritionAdvice(props.nutrition));
const macroPercentages = computed(() => calculateMacroPercentages(props.nutrition));
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
      @click="emit('close')"
    />

    <div class="relative w-full max-w-md animate-pop-in max-h-[90vh] overflow-y-auto">
      <div class="card-soft overflow-hidden">
        <div class="relative p-6 pb-4">
          <button
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cream-100 hover:bg-cream-200 transition-colors z-20"
            @click="emit('close')"
          >
            <X :size="16" class="text-brown-600" />
          </button>

          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner"
              style="background: linear-gradient(135deg, #E8F5D4, #FFF8F0);"
            >
              {{ dishEmoji }}
            </div>
            <div>
              <h3 class="text-display text-xl text-brown-900">{{ dishName }}</h3>
              <p class="text-sm text-brown-800/60">营养估算</p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-apricot-50 to-amber-50 rounded-2xl p-5 mb-5 border border-apricot-100">
            <div class="flex items-center justify-center gap-3 mb-3">
              <Flame :size="24" class="text-apricot-500" />
              <span class="text-display text-4xl text-apricot-600 font-bold">
                {{ nutrition.totalCalories }}
              </span>
              <span class="text-lg text-brown-800/60">千卡</span>
            </div>
            <div class="flex justify-center">
              <span
                class="px-4 py-1 rounded-full text-sm font-medium"
                :class="calorieLevel.color"
                :style="{ backgroundColor: calorieLevel.level === 'low' ? '#E8F5D4' : calorieLevel.level === 'medium' ? '#FEF3C7' : '#FFE8D6' }"
              >
                {{ calorieLevel.label }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-5">
            <div class="text-center p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <Beef :size="20" class="mx-auto text-rose-500 mb-2" />
              <div class="text-display text-2xl text-rose-600 font-bold">
                {{ formatNutrientValue(nutrition.totalProtein) }}
              </div>
              <div class="text-xs text-brown-800/60">蛋白质 (g)</div>
            </div>
            <div class="text-center p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <Wheat :size="20" class="mx-auto text-amber-500 mb-2" />
              <div class="text-display text-2xl text-amber-600 font-bold">
                {{ formatNutrientValue(nutrition.totalCarbs) }}
              </div>
              <div class="text-xs text-brown-800/60">碳水 (g)</div>
            </div>
            <div class="text-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <Droplet :size="20" class="mx-auto text-blue-500 mb-2" />
              <div class="text-display text-2xl text-blue-600 font-bold">
                {{ formatNutrientValue(nutrition.totalFat) }}
              </div>
              <div class="text-xs text-brown-800/60">脂肪 (g)</div>
            </div>
          </div>

          <div class="mb-5">
            <h4 class="text-sm font-medium text-brown-800 mb-3">宏量营养素占比</h4>
            <div class="h-3 rounded-full bg-cream-200 overflow-hidden flex">
              <div
                class="h-full bg-rose-400 transition-all duration-500"
                :style="{ width: `${macroPercentages.protein}%` }"
              />
              <div
                class="h-full bg-amber-400 transition-all duration-500"
                :style="{ width: `${macroPercentages.carbs}%` }"
              />
              <div
                class="h-full bg-blue-400 transition-all duration-500"
                :style="{ width: `${macroPercentages.fat}%` }"
              />
            </div>
            <div class="flex justify-between mt-2 text-xs">
              <span class="text-rose-500">蛋白质 {{ macroPercentages.protein }}%</span>
              <span class="text-amber-500">碳水 {{ macroPercentages.carbs }}%</span>
              <span class="text-blue-500">脂肪 {{ macroPercentages.fat }}%</span>
            </div>
          </div>

          <button
            class="w-full flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-200 mb-4 hover:bg-cream-100 transition-colors"
            @click="showIngredients = !showIngredients"
          >
            <span class="text-sm font-medium text-brown-800">食材明细</span>
            <component :is="showIngredients ? ChevronUp : ChevronDown" :size="18" class="text-brown-500" />
          </button>

          <div v-if="showIngredients" class="mb-4 animate-fade-slide">
            <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
              <div
                v-for="(ing, idx) in nutrition.ingredients"
                :key="idx"
                class="flex items-center justify-between p-3 rounded-xl bg-white border border-cream-100"
              >
                <div>
                  <span class="text-sm font-medium text-brown-800">{{ ing.name }}</span>
                  <span class="text-xs text-brown-800/50 ml-2">{{ ing.amount }}{{ ing.unit }}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-medium text-apricot-600">{{ Math.round(ing.calories) }} 卡</span>
                  <div class="text-xs text-brown-800/50">
                    蛋白{{ ing.protein.toFixed(1) }}g · 碳水{{ ing.carbs.toFixed(1) }}g · 脂肪{{ ing.fat.toFixed(1) }}g
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-matcha-50 rounded-2xl p-4 border border-matcha-100">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-matcha-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb :size="16" class="text-matcha-600" />
              </div>
              <div>
                <h4 class="text-sm font-medium text-matcha-700 mb-2">营养小贴士</h4>
                <ul class="space-y-1">
                  <li
                    v-for="(tip, idx) in advice"
                    :key="idx"
                    class="text-xs text-brown-800/70 leading-relaxed"
                  >
                    • {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6">
          <button
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-apricot-500 to-apricot-600 text-white font-medium hover:shadow-lg transition-all active:scale-[0.98]"
            @click="emit('close')"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
