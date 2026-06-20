<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Check } from 'lucide-vue-next';

interface Step {
  id: string;
  name: string;
  icon: string;
}

const DEFAULT_STEPS: Omit<Step, 'name'>[] = [
  { id: 'wash', icon: '🧼' },
  { id: 'cut', icon: '🔪' },
  { id: 'season', icon: '🧂' },
  { id: 'bake', icon: '🔥' },
  { id: 'plate', icon: '🍽️' },
];

const { t } = useI18n();

const props = defineProps<{
  currentStep: number;
  steps?: Step[];
}>();

const localizedSteps = computed<Step[]>(() => {
  if (props.steps && props.steps.length > 0) {
    return props.steps;
  }
  return DEFAULT_STEPS.map((step) => ({
    ...step,
    name: t(`steps.progress.${step.id}`),
  }));
});

const progressWidth = computed(() => {
  const max = localizedSteps.value.length - 1;
  if (max <= 0) return '0%';
  const pct = Math.min(100, (props.currentStep / max) * 100);
  return `${pct}%`;
});

function getStepState(index: number): 'completed' | 'current' | 'pending' {
  if (index < props.currentStep) return 'completed';
  if (index === props.currentStep) return 'current';
  return 'pending';
}
</script>

<template>
  <div class="w-full px-3 sm:px-6 py-4 sm:py-6">
    <div class="relative max-w-2xl mx-auto">
      <div class="absolute top-6 sm:top-7 left-6 sm:left-8 right-6 sm:right-8 h-1 sm:h-1.5 bg-cream-300 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-matcha-400 to-matcha-500 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressWidth }"
        />
      </div>

      <div class="relative flex justify-between items-start">
        <div
          v-for="(step, index) in localizedSteps"
          :key="step.id"
          class="flex flex-col items-center flex-1"
        >
          <div class="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <div
              v-if="getStepState(index) === 'current'"
              class="absolute inset-0 rounded-full bg-apricot-400/40 animate-breath-ring"
            />
            <div
              class="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-300"
              :class="{
                'bg-matcha-500 shadow-lg shadow-matcha-500/30 animate-bounce-soft': getStepState(index) === 'completed',
                'bg-apricot-500 shadow-lg shadow-apricot-500/40 scale-110 z-10': getStepState(index) === 'current',
                'bg-cream-100 border-2 border-dashed border-cream-300': getStepState(index) === 'pending',
              }"
            >
              <Check
                v-if="getStepState(index) === 'completed'"
                :size="22"
                class="text-white stroke-[3]"
              />
              <span v-else>{{ step.icon }}</span>
            </div>
          </div>

          <div class="mt-2 sm:mt-3 text-center px-1">
            <div
              class="text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap"
              :class="{
                'text-matcha-600': getStepState(index) === 'completed',
                'text-apricot-600 font-bold text-base sm:text-lg': getStepState(index) === 'current',
                'text-brown-800/40': getStepState(index) === 'pending',
              }"
            >
              {{ step.name }}
            </div>
            <div
              v-if="getStepState(index) === 'current'"
              class="mt-1 mx-auto w-1 h-1 rounded-full bg-apricot-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
