import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type OnboardingFlow = 'home' | 'cooking' | 'achievements';

export interface OnboardingStep {
  id: string;
  flow: OnboardingFlow;
  targetSelector?: string;
  title: string;
  description: string;
  emoji: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  nextAction?: () => void;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'home-welcome',
    flow: 'home',
    title: '欢迎来到治愈小厨房',
    description: '这里是专属于你的一人食小天地，慢慢做饭，好好生活～让我带你逛逛吧！',
    emoji: '👋',
    placement: 'bottom',
  },
  {
    id: 'home-dishes',
    flow: 'home',
    targetSelector: '[data-onboarding="dish-card"]',
    title: '选择今日菜品',
    description: '点击菜品卡片就能开始烹饪啦，每道菜都有详细的步骤指引哦～',
    emoji: '🍳',
    placement: 'top',
  },
  {
    id: 'home-challenges',
    flow: 'home',
    targetSelector: '[data-onboarding="challenge-section"]',
    title: '挑战任务',
    description: '完成挑战可以解锁专属徽章，让做饭更有动力！',
    emoji: '🎯',
    placement: 'top',
  },
  {
    id: 'home-to-cooking',
    flow: 'home',
    targetSelector: '[data-onboarding="first-dish"]',
    title: '开始第一道菜',
    description: '选一道喜欢的菜，跟着步骤一起做吧！做完记得打卡哦～',
    emoji: '✨',
    placement: 'top',
  },
  {
    id: 'cooking-steps',
    flow: 'cooking',
    targetSelector: '[data-onboarding="step-progress"]',
    title: '烹饪四步走',
    description: '洗菜 → 切菜 → 调味 → 烹制，跟着步骤一步步来，新手也能轻松搞定！',
    emoji: '📝',
    placement: 'bottom',
  },
  {
    id: 'cooking-seasoning',
    flow: 'cooking',
    targetSelector: '[data-onboarding="seasoning-tip"]',
    title: '智能调味建议',
    description: '小厨房会根据你的口味偏好推荐调味用量，做出最适合你的味道～',
    emoji: '🧂',
    placement: 'top',
  },
  {
    id: 'cooking-finish',
    flow: 'cooking',
    targetSelector: '[data-onboarding="finish-btn"]',
    title: '完成烹饪打卡',
    description: '做完菜记得点「完成烹饪」打卡，累计天数可以解锁更多可爱装饰！',
    emoji: '🎉',
    placement: 'top',
  },
  {
    id: 'achievements-calendar',
    flow: 'achievements',
    targetSelector: '[data-onboarding="calendar"]',
    title: '打卡日历',
    description: '看看你坚持做饭多少天啦，每一格都是对生活的认真～',
    emoji: '📅',
    placement: 'bottom',
  },
  {
    id: 'achievements-badges',
    flow: 'achievements',
    targetSelector: '[data-onboarding="badges"]',
    title: '收集徽章',
    description: '完成挑战任务就能获得专属徽章，看看你能收集多少枚？',
    emoji: '🏅',
    placement: 'bottom',
  },
  {
    id: 'achievements-decorations',
    flow: 'achievements',
    targetSelector: '[data-onboarding="decorations"]',
    title: '装扮你的小厨房',
    description: '累计打卡可以解锁可爱的厨房摆件和围裙皮肤，把厨房布置成你喜欢的样子～',
    emoji: '🏠',
    placement: 'top',
  },
  {
    id: 'achievements-complete',
    flow: 'achievements',
    title: '引导完成！',
    description: '恭喜你了解了小厨房的所有功能，现在开始你的治愈烹饪之旅吧～',
    emoji: '🎊',
    placement: 'bottom',
  },
];

export const useOnboardingStore = defineStore(
  'onboarding',
  () => {
    const isCompleted = ref(false);
    const currentFlow = ref<OnboardingFlow | null>(null);
    const currentStepIndex = ref(0);
    const isVisible = ref(false);

    const currentFlowSteps = computed(() => {
      if (!currentFlow.value) return [];
      return onboardingSteps.filter((s) => s.flow === currentFlow.value);
    });

    const currentStep = computed(() => {
      const steps = currentFlowSteps.value;
      if (steps.length === 0 || currentStepIndex.value >= steps.length) return null;
      return steps[currentStepIndex.value];
    });

    const isFirstStep = computed(() => currentStepIndex.value === 0);
    const isLastStep = computed(() => {
      const steps = currentFlowSteps.value;
      return currentStepIndex.value === steps.length - 1;
    });

    const progress = computed(() => {
      const steps = currentFlowSteps.value;
      if (steps.length === 0) return 0;
      return ((currentStepIndex.value + 1) / steps.length) * 100;
    });

    function startFlow(flow: OnboardingFlow): void {
      if (isCompleted.value) return;
      currentFlow.value = flow;
      currentStepIndex.value = 0;
      isVisible.value = true;
    }

    function nextStep(): void {
      const steps = currentFlowSteps.value;
      if (currentStepIndex.value < steps.length - 1) {
        currentStepIndex.value += 1;
      }
    }

    function prevStep(): void {
      if (currentStepIndex.value > 0) {
        currentStepIndex.value -= 1;
      }
    }

    function goToStep(stepId: string): void {
      const steps = currentFlowSteps.value;
      const idx = steps.findIndex((s) => s.id === stepId);
      if (idx > -1) {
        currentStepIndex.value = idx;
      }
    }

    function completeFlow(): void {
      isVisible.value = false;
      if (
        currentFlow.value === 'achievements' &&
        currentStepIndex.value === currentFlowSteps.value.length - 1
      ) {
        isCompleted.value = true;
      }
      currentFlow.value = null;
      currentStepIndex.value = 0;
    }

    function skipFlow(): void {
      isVisible.value = false;
      currentFlow.value = null;
      currentStepIndex.value = 0;
    }

    function completeAll(): void {
      isCompleted.value = true;
      isVisible.value = false;
      currentFlow.value = null;
      currentStepIndex.value = 0;
    }

    function reset(): void {
      isCompleted.value = false;
      currentFlow.value = null;
      currentStepIndex.value = 0;
      isVisible.value = false;
    }

    return {
      isCompleted,
      currentFlow,
      currentStepIndex,
      isVisible,
      currentFlowSteps,
      currentStep,
      isFirstStep,
      isLastStep,
      progress,
      startFlow,
      nextStep,
      prevStep,
      goToStep,
      completeFlow,
      skipFlow,
      completeAll,
      reset,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-onboarding',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
