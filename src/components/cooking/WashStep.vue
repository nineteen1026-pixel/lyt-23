<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useKeyboardNavigation, useLiveRegion, useReducedMotion, useHighContrast, useKeyboardEnabled } from '@/composables/useAccessibility';

const { t } = useI18n();
const { announce, liveRegionRef } = useLiveRegion();
const { motionReduce } = useReducedMotion();
const { isHighContrast } = useHighContrast();
const { keyboardEnabled } = useKeyboardEnabled();

const props = defineProps<{
  dishEmoji: string;
  dishName: string;
}>();

const subtitle = computed(() => t('steps.wash.subtitle', { dishName: props.dishName }));

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const isWashing = ref(false);
const isComplete = ref(false);
const progress = ref(0);
const dirtOpacity = ref(1);
const sinkFocused = ref(false);

const sinkRef = ref<HTMLDivElement | null>(null);
const droplets: HTMLDivElement[] = [];
let animationFrameId: number | null = null;
let progressInterval: number | null = null;
let dropletInterval: number | null = null;

const MAX_DROPLETS = 30;
const WASH_DURATION = 3000;

const { handleKeyDown: sinkKeyDown } = useKeyboardNavigation(
  () => startWash(),
);

const sinkAriaLabel = computed(() => {
  if (isComplete.value) return t('steps.wash.completeMessage');
  if (isWashing.value) return `${t('steps.wash.washingButton')}，进度 ${progress.value}%`;
  return t('steps.wash.clickHint');
});

const startWash = () => {
  if (isWashing.value || isComplete.value) return;
  isWashing.value = true;
  announce(t('steps.wash.washingButton'), 'assertive');

  const startTime = Date.now();

  progressInterval = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    progress.value = Math.min(100, Math.round((elapsed / WASH_DURATION) * 100));
    dirtOpacity.value = Math.max(0, 1 - elapsed / WASH_DURATION);

    if (elapsed >= WASH_DURATION) {
      if (progressInterval) clearInterval(progressInterval);
      if (dropletInterval) clearInterval(dropletInterval);
      finishWash();
    }
  }, 30);

  if (!motionReduce.value) {
    createDroplets();
    dropletInterval = window.setInterval(createDroplets, 120);
  }
};

const createDroplets = () => {
  if (!sinkRef.value || droplets.length >= MAX_DROPLETS) return;

  const sinkRect = sinkRef.value.getBoundingClientRect();
  const droplet = document.createElement('div');
  const size = 8 + Math.random() * 10;
  const left = 10 + Math.random() * 80;
  const delay = Math.random() * 0.3;
  const duration = 0.6 + Math.random() * 0.4;
  const hue = 190 + Math.random() * 30;
  const lightness = 55 + Math.random() * 15;

  droplet.className = 'droplet';
  droplet.style.cssText = `
    position: absolute;
    left: ${left}%;
    top: -20px;
    width: ${size}px;
    height: ${size * 1.4}px;
    background: radial-gradient(ellipse at 30% 30%, hsl(${hue}, 90%, ${lightness + 15}%), hsl(${hue}, 85%, ${lightness}%));
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    opacity: 0.85;
    pointer-events: none;
    box-shadow: 0 0 4px hsla(${hue}, 80%, 60%, 0.5);
    animation: dropletFall ${duration}s ease-in ${delay}s forwards;
    z-index: 10;
  `;

  sinkRef.value.appendChild(droplet);
  droplets.push(droplet);

  droplet.addEventListener('animationend', () => {
    const splash = document.createElement('div');
    const splashSize = size * 2;
    splash.style.cssText = `
      position: absolute;
      left: calc(${left}% - ${splashSize / 2}px);
      top: calc(75% - ${splashSize / 2}px);
      width: ${splashSize}px;
      height: ${splashSize / 2}px;
      border: 2px solid hsla(${hue}, 80%, 70%, 0.8);
      border-top: none;
      border-radius: 0 0 50% 50%;
      opacity: 0.7;
      pointer-events: none;
      animation: splash 0.4s ease-out forwards;
    `;
    sinkRef.value?.appendChild(splash);

    setTimeout(() => {
      splash.remove();
    }, 400);

    droplet.remove();
    const idx = droplets.indexOf(droplet);
    if (idx > -1) droplets.splice(idx, 1);
  });
};

const finishWash = () => {
  isWashing.value = false;
  isComplete.value = true;
  progress.value = 100;
  dirtOpacity.value = 0;
  announce(t('steps.wash.completeMessage'), 'assertive');

  setTimeout(() => {
    emit('complete');
  }, 2000);
};

const cleanUp = () => {
  if (progressInterval) clearInterval(progressInterval);
  if (dropletInterval) clearInterval(dropletInterval);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  droplets.forEach(d => d.remove());
  droplets.length = 0;
};

onUnmounted(cleanUp);
</script>

<template>
  <div
    class="card-soft p-6 md:p-8"
    :class="{ 'animate-pop-in': !motionReduce }"
    role="region"
    :aria-label="t('steps.wash.title')"
  >
    <div ref="liveRegionRef" class="sr-only" aria-live="polite"></div>

    <div class="text-center mb-6">
      <h2 class="text-display text-2xl md:text-3xl text-brown-900 mb-2">
        {{ t('steps.wash.title') }}
      </h2>
      <p class="text-brown-800/70">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex justify-center mb-6">
      <div
        ref="sinkRef"
        role="button"
        :tabindex="keyboardEnabled ? 0 : -1"
        :aria-label="sinkAriaLabel"
        :aria-disabled="isWashing || isComplete"
        class="a11y-sink relative w-full max-w-sm h-72 md:h-80 rounded-[2.5rem] overflow-hidden cursor-pointer select-none shadow-inner border-4 border-blue-200/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        :class="{
          'opacity-60 cursor-not-allowed': isWashing || isComplete,
        }"
        :style="{
          background: 'linear-gradient(180deg, #E0F4FF 0%, #B3E0FF 40%, #7CC8F2 70%, #4FB3E8 100%)',
        }"
        @click="startWash"
        @keydown="sinkKeyDown"
      >
        <div
          class="absolute inset-x-0 bottom-0 h-1/2"
          style="background: linear-gradient(180deg, transparent 0%, rgba(79, 179, 232, 0.3) 100%);"
        />

        <div
          class="absolute inset-x-0 top-0 h-4 opacity-40"
          style="background: linear-gradient(180deg, rgba(255,255,255,0.8), transparent);"
        />

        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="relative"
            :class="{
              'animate-[wiggle_0.4s_ease-in-out_infinite]': isWashing,
              'animate-[float_3s_ease-in-out_infinite]': !isWashing && !isComplete,
              'animate-bounce-soft': isComplete,
            }"
          >
            <div
              class="text-8xl md:text-9xl transition-all duration-500"
              :class="{
                'drop-shadow-[0_0_20px_rgba(255,255,200,0.8)] scale-110': isComplete,
              }"
            >
              {{ dishEmoji }}
            </div>

            <div
              class="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
              :style="{
                opacity: dirtOpacity,
                background: 'radial-gradient(ellipse at center, rgba(120, 110, 90, 0.55) 0%, rgba(100, 90, 70, 0.4) 40%, rgba(80, 70, 50, 0.25) 70%, transparent 100%)',
                filter: 'blur(2px)',
                mixBlendMode: 'multiply',
              }"
            />

            <div
              v-if="isComplete"
              class="absolute -top-2 -right-2 w-12 h-12 md:w-14 md:h-14 bg-matcha-500 rounded-full flex items-center justify-center shadow-lg animate-pop-in border-4 border-white"
            >
              <svg
                class="w-7 h-7 md:w-8 md:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="3.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <Transition name="fade">
          <div
            v-if="isComplete"
            class="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg animate-bounce-soft border-2 border-matcha-300"
          >
            <span class="text-display text-lg md:text-xl text-matcha-600">
              {{ t('steps.wash.completeMessage') }}
            </span>
          </div>
        </Transition>

        <Transition name="fade">
          <div
            v-if="!isWashing && !isComplete"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-600/70 text-sm font-medium animate-pulse"
          >
            {{ t('steps.wash.clickHint') }}
          </div>
        </Transition>
      </div>
    </div>

    <div class="max-w-sm mx-auto mb-6">
      <div class="flex justify-between text-sm text-brown-800/70 mb-2">
        <span id="wash-progress-label">{{ t('steps.wash.progressLabel') }}</span>
        <span class="font-medium text-blue-600">{{ progress }}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progress"
        :aria-labelledby="'wash-progress-label'"
        class="a11y-progress-track h-4 bg-cream-200 rounded-full overflow-hidden border-2 border-white shadow-inner"
      >
        <div
          class="a11y-progress-fill h-full rounded-full transition-all duration-100 ease-out relative overflow-hidden"
          :style="{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4FB3E8, #7CC8F2, #4FB3E8)',
            backgroundSize: '200% 100%',
            animation: isWashing && !motionReduce ? 'shimmer 1s linear infinite' : 'none',
          }"
        >
          <div
            class="absolute inset-0 opacity-50"
            style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        class="btn-primary text-lg md:text-xl px-10 py-4 min-w-[180px] relative overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        :disabled="isWashing || isComplete"
        :aria-label="isComplete ? t('steps.wash.completeButton') : isWashing ? t('steps.wash.washingButton') : t('steps.wash.startButton')"
        @click="startWash"
        @keydown.enter.prevent="startWash"
        @keydown.space.prevent="startWash"
      >
        <span v-if="!isWashing && !isComplete">
          {{ t('steps.wash.startButton') }}
        </span>
        <span v-else-if="isWashing" class="inline-flex items-center gap-2">
          <svg
            class="animate-spin w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {{ t('steps.wash.washingButton') }}
        </span>
        <span v-else>
          {{ t('steps.wash.completeButton') }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes dropletFall {
  0% {
    transform: translateY(0) scaleY(1) scaleX(1);
    opacity: 0.9;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(calc(288px * 0.75)) scaleY(0.7) scaleX(1.3);
    opacity: 0;
  }
}

@keyframes splash {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes wiggle {
  0%, 100% {
    transform: translateY(0) rotate(-3deg);
  }
  25% {
    transform: translateY(-6px) rotate(2deg);
  }
  50% {
    transform: translateY(0) rotate(-2deg);
  }
  75% {
    transform: translateY(-4px) rotate(3deg);
  }
}
</style>
