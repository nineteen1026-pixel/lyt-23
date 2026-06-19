<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const store = useOnboardingStore();
const router = useRouter();

const highlightRect = ref({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});

const tooltipPosition = ref({
  top: 0,
  left: 0,
  placement: 'bottom' as 'top' | 'bottom' | 'left' | 'right',
});

const showTooltip = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function updateHighlight() {
  const step = store.currentStep;
  if (!step || !step.targetSelector) {
    highlightRect.value = { top: 0, left: 0, width: 0, height: 0 };
    showTooltip.value = false;
    return;
  }

  const target = document.querySelector(step.targetSelector);
  if (!target) {
    highlightRect.value = { top: 0, left: 0, width: 0, height: 0 };
    showTooltip.value = false;
    return;
  }

  const rect = target.getBoundingClientRect();
  const padding = 8;

  highlightRect.value = {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };

  const placement = step.placement || 'bottom';
  const tooltipWidth = 320;
  const tooltipHeight = 200;
  const gap = 16;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = highlightRect.value.top - tooltipHeight - gap;
      left = highlightRect.value.left + highlightRect.value.width / 2 - tooltipWidth / 2;
      break;
    case 'bottom':
      top = highlightRect.value.top + highlightRect.value.height + gap;
      left = highlightRect.value.left + highlightRect.value.width / 2 - tooltipWidth / 2;
      break;
    case 'left':
      top = highlightRect.value.top + highlightRect.value.height / 2 - tooltipHeight / 2;
      left = highlightRect.value.left - tooltipWidth - gap;
      break;
    case 'right':
      top = highlightRect.value.top + highlightRect.value.height / 2 - tooltipHeight / 2;
      left = highlightRect.value.left + highlightRect.value.width + gap;
      break;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < 16) left = 16;
  if (left + tooltipWidth > viewportWidth - 16) {
    left = viewportWidth - tooltipWidth - 16;
  }

  if (top < 16) {
    top = highlightRect.value.top + highlightRect.value.height + gap;
    placement === 'top' ? (tooltipPosition.value.placement = 'bottom') : null;
  }
  if (top + tooltipHeight > viewportHeight - 16) {
    top = highlightRect.value.top - tooltipHeight - gap;
    placement === 'bottom' ? (tooltipPosition.value.placement = 'top') : null;
  }

  tooltipPosition.value.top = top;
  tooltipPosition.value.left = left;
  tooltipPosition.value.placement = placement;

  nextTick(() => {
    showTooltip.value = true;
  });
}

function waitForElementAndHighlight(selector: string) {
  stopPolling();
  showTooltip.value = false;

  const check = () => {
    const target = document.querySelector(selector);
    if (target) {
      stopPolling();
      updateHighlight();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  check();
  if (!document.querySelector(selector)) {
    pollTimer = setInterval(check, 100);
    setTimeout(() => stopPolling(), 3000);
  }
}

function handleNext() {
  if (store.isLastStep) {
    handleComplete();
  } else {
    store.nextStep();
  }
}

function handlePrev() {
  store.prevStep();
}

function handleSkip() {
  store.skipFlow();
}

function handleComplete() {
  if (store.currentFlow === 'home') {
    store.completeFlow();
    const firstDish = document.querySelector<HTMLElement>('[data-onboarding="first-dish"]');
    if (firstDish) {
      firstDish.click();
    }
  } else if (store.currentFlow === 'cooking') {
    store.completeFlow();
    router.push('/achievements');
    setTimeout(() => {
      store.startFlow('achievements');
    }, 300);
  } else {
    store.completeFlow();
  }
}

function handleScroll() {
  updateHighlight();
}

function handleResize() {
  updateHighlight();
}

watch(
  () => [store.currentStep?.id, store.isVisible],
  () => {
    if (store.isVisible && store.currentStep) {
      showTooltip.value = false;
      stopPolling();
      setTimeout(() => {
        const selector = store.currentStep?.targetSelector;
        if (selector) {
          waitForElementAndHighlight(selector);
        } else {
          updateHighlight();
        }
      }, 100);
    } else {
      stopPolling();
    }
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  stopPolling();
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleResize);
});

const hasTarget = computed(() => {
  return !!(store.currentStep?.targetSelector && highlightRect.value.width > 0);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="store.isVisible && store.currentStep"
        class="fixed inset-0 z-[100] pointer-events-none"
      >
        <svg
          class="fixed inset-0 w-full h-full pointer-events-none"
          style="pointer-events: none;"
        >
          <defs>
            <mask id="onboarding-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                v-if="hasTarget"
                :x="highlightRect.left"
                :y="highlightRect.top"
                :width="highlightRect.width"
                :height="highlightRect.height"
                rx="12"
                ry="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(60, 40, 30, 0.6)"
            mask="url(#onboarding-mask)"
            class="backdrop-blur-sm"
          />
        </svg>

        <div
          v-if="hasTarget"
          class="fixed rounded-xl ring-2 ring-apricot-400 ring-opacity-80 animate-pulse pointer-events-none"
          :style="{
            top: `${highlightRect.top}px`,
            left: `${highlightRect.left}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
            boxShadow: '0 0 0 4px rgba(251, 146, 60, 0.2)',
          }"
        />

        <Transition name="pop">
          <div
            v-if="showTooltip || !hasTarget"
            class="fixed pointer-events-auto"
            :style="{
              top: hasTarget ? `${tooltipPosition.top}px` : '50%',
              left: hasTarget ? `${tooltipPosition.left}px` : '50%',
              transform: hasTarget ? 'none' : 'translate(-50%, -50%)',
              width: hasTarget ? '320px' : '360px',
            }"
          >
            <div class="card-soft p-5 shadow-xl bg-gradient-to-br from-cream-50 to-cream-100 border-2 border-apricot-300/50">
              <div class="flex items-start gap-3 mb-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-3xl shrink-0 animate-float"
                  style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
                >
                  {{ store.currentStep.emoji }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-display text-lg text-brown-900 mb-1">
                    {{ store.currentStep.title }}
                  </h3>
                  <p class="text-sm text-brown-800/70 leading-relaxed">
                    {{ store.currentStep.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 mb-4">
                <div class="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-apricot-400 to-apricot-500 transition-all duration-300"
                    :style="{ width: `${store.progress}%` }"
                  />
                </div>
                <span class="text-xs text-brown-800/60 shrink-0">
                  {{ store.currentStepIndex + 1 }}/{{ store.currentFlowSteps.length }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <button
                  v-if="!store.isFirstStep"
                  class="btn-secondary flex items-center gap-1 !py-2 !px-3 text-sm"
                  @click="handlePrev"
                >
                  <ChevronLeft :size="16" />
                  <span>上一步</span>
                </button>
                <div v-else>
                  <button
                    class="text-xs text-brown-800/50 hover:text-brown-800/70 transition-colors"
                    @click="handleSkip"
                  >
                    跳过引导
                  </button>
                </div>

                <button
                  class="btn-primary flex items-center gap-1 !py-2 !px-4 text-sm"
                  @click="handleNext"
                >
                  <span>{{ store.isLastStep ? '开始使用' : '下一步' }}</span>
                  <template v-if="!store.isLastStep">
                    <ChevronRight :size="16" />
                  </template>
                  <template v-else>
                    <Sparkles :size="16" />
                  </template>
                </button>
              </div>
            </div>

            <div
              v-if="hasTarget"
              class="absolute w-3 h-3 bg-cream-100 border-2 border-apricot-300/50 rotate-45"
              :class="{
                'left-1/2 -translate-x-1/2 -bottom-1.5': tooltipPosition.placement === 'top',
                'left-1/2 -translate-x-1/2 -top-1.5': tooltipPosition.placement === 'bottom',
                'top-1/2 -translate-y-1/2 -right-1.5': tooltipPosition.placement === 'left',
                'top-1/2 -translate-y-1/2 -left-1.5': tooltipPosition.placement === 'right',
              }"
            />
          </div>
        </Transition>

        <button
          v-if="!hasTarget"
          class="fixed top-4 right-4 w-9 h-9 rounded-full bg-cream-100/80 hover:bg-cream-200 flex items-center justify-center text-brown-800/70 transition-all pointer-events-auto"
          @click="handleSkip"
        >
          <X :size="18" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
