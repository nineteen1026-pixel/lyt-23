<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLiveRegion, useReducedMotion, useHighContrast } from '@/composables/useAccessibility';

const { t } = useI18n();
const { announce, liveRegionRef } = useLiveRegion();
const { motionReduce } = useReducedMotion();
const { isHighContrast } = useHighContrast();

const props = defineProps<{
  dishEmoji: string;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const TOTAL_CUTS = 4;
const cuts = ref(0);
const isCutting = ref(false);
const showKnifeFlash = ref(false);
const cutCompleted = ref(false);

const buttonText = computed(() => {
  if (cutCompleted.value) return t('steps.cut.nextButton');
  if (cuts.value === 0) return t('steps.cut.startButton');
  return t('steps.cut.cutButton', { cutNumber: cuts.value + 1 });
});

const progressText = computed(() => `${Math.min(cuts.value, TOTAL_CUTS)}/${TOTAL_CUTS}`);

const cuttingBoardAriaLabel = computed(() => {
  if (cutCompleted.value) return t('steps.cut.completeMessage');
  if (isCutting.value) return t('steps.cut.cutButton', { cutNumber: cuts.value + 1 });
  return `${t('steps.cut.subtitle')}，${progressText.value}`;
});

const boardShakeKey = ref(0);
const knifeSwingKey = ref(0);

const pieceScale = computed(() => {
  if (cuts.value === 0) return 1;
  return 1 - cuts.value * 0.08;
});

const piecePositions = computed(() => {
  const positions: { x: number; y: number; rot: number; scale: number; key: number }[] = [];
  const count = cuts.value;
  for (let i = 0; i < count; i++) {
    const angle = (i / TOTAL_CUTS) * Math.PI * 2 + Math.PI / 4;
    positions.push({
      x: Math.cos(angle) * 48,
      y: Math.sin(angle) * 42,
      rot: (i * 25) - 30,
      scale: 0.42 + (i * 0.03),
      key: i,
    });
  }
  return positions;
});

const finalPieceGrid = computed(() => {
  const grid: { x: number; y: number; scale: number; key: number }[] = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      grid.push({
        x: (col - 0.5) * 56,
        y: (row - 0.5) * 52,
        scale: 0.52,
        key: row * 2 + col,
      });
    }
  }
  return grid;
});

function handleCut() {
  if (cutCompleted.value) {
    emit('complete');
    return;
  }
  if (isCutting.value) return;

  isCutting.value = true;
  boardShakeKey.value++;
  knifeSwingKey.value++;
  showKnifeFlash.value = true;

  announce(t('steps.cut.cutButton', { cutNumber: cuts.value + 1 }), 'polite');

  setTimeout(() => {
    showKnifeFlash.value = false;
  }, 220);

  setTimeout(() => {
    cuts.value++;
    isCutting.value = false;
    if (cuts.value >= TOTAL_CUTS) {
      cutCompleted.value = true;
      announce(t('steps.cut.completeMessage'), 'assertive');
    }
  }, 300);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleCut();
  }
}
</script>

<template>
  <div
    class="card-soft p-6"
    :class="{ 'animate-fade-slide': !motionReduce }"
    role="region"
    :aria-label="t('steps.cut.title')"
  >
    <div ref="liveRegionRef" class="sr-only" aria-live="polite"></div>

    <div class="text-center mb-4">
      <h2 class="text-display text-2xl text-brown-900 mb-1">{{ t('steps.cut.title') }}</h2>
      <p class="text-sm text-brown-800/70">{{ t('steps.cut.subtitle') }}</p>
    </div>

    <div
      class="relative mx-auto mb-6 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2 rounded-3xl"
      style="width: 340px; height: 260px;"
      role="button"
      tabindex="0"
      :aria-label="cuttingBoardAriaLabel"
      :aria-disabled="isCutting && !cutCompleted"
      @click="handleCut"
      @keydown="handleKeyDown"
    >
      <div
        :key="'board-' + boardShakeKey"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        :class="boardShakeKey > 0 && !motionReduce ? 'animate-shake' : ''"
      >
        <div
          class="relative rounded-3xl shadow-card"
          style="
            width: 300px;
            height: 200px;
            background:
              repeating-linear-gradient(
                90deg,
                #c69c6d 0px,
                #d4a574 3px,
                #b88e5e 6px,
                #c69c6d 10px,
                #d4a574 14px,
                #c69c6d 18px
              ),
              linear-gradient(135deg, #c69c6d, #a87a4a);
            border: 3px solid #8b5e34;
            box-shadow:
              0 10px 30px rgba(107, 66, 38, 0.35),
              inset 0 2px 8px rgba(255, 255, 255, 0.15),
              inset 0 -4px 12px rgba(0, 0, 0, 0.15);
          "
        >
          <div
            class="absolute inset-0 rounded-3xl pointer-events-none"
            style="
              background:
                radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.08) 0%, transparent 50%);
            "
          />
        </div>
      </div>

      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style="width: 300px; height: 200px;"
      >
        <Transition name="fade">
          <div
            v-if="showKnifeFlash"
            class="absolute pointer-events-none z-20"
            style="
              left: 40px;
              top: 30px;
              width: 160px;
              height: 4px;
              background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.95) 70%, transparent 100%);
              border-radius: 999px;
              transform: rotate(25deg);
              box-shadow: 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5);
              animation: knifeFlash 0.22s ease-out forwards;
            "
          />
        </Transition>

        <div class="absolute inset-0 flex items-center justify-center">
          <TransitionGroup name="piece" tag="div" class="relative" style="width: 200px; height: 160px;">
            <template v-if="!cutCompleted">
              <div
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                :style="{ transform: `translate(-50%, -50%) scale(${pieceScale})` }"
              >
                <span class="text-6xl drop-shadow-md select-none">{{ dishEmoji }}</span>
              </div>

              <div
                v-for="pos in piecePositions"
                :key="'piece-' + pos.key"
                class="absolute left-1/2 top-1/2 animate-pop-in drop-shadow-md select-none"
                :style="{
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.rot}deg) scale(${pos.scale})`,
                  animationDelay: '60ms',
                }"
              >
                <span class="text-4xl">{{ dishEmoji }}</span>
              </div>
            </template>

            <template v-else>
              <div
                v-for="p in finalPieceGrid"
                :key="'final-' + p.key"
                class="absolute left-1/2 top-1/2 animate-pop-in drop-shadow-md select-none"
                :style="{
                  transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) scale(${p.scale})`,
                  animationDelay: `${p.key * 80}ms`,
                }"
              >
                <span class="text-4xl">{{ dishEmoji }}</span>
              </div>
            </template>
          </TransitionGroup>
        </div>
      </div>

      <div
        class="absolute z-10 pointer-events-none"
        :key="'knife-' + knifeSwingKey"
        style="right: 18px; top: 8px; transform-origin: 80% 85%;"
      >
        <div
          :class="knifeSwingKey > 0 ? 'knife-swing' : ''"
          class="text-6xl select-none drop-shadow-lg"
          style="display: inline-block;"
        >
          🔪
        </div>
      </div>

      <Transition name="fade">
        <div
          v-if="cutCompleted"
          class="absolute -top-2 left-1/2 -translate-x-1/2 z-30 animate-pop-in"
        >
          <div class="chip bg-apricot-500 text-white shadow-card text-sm px-4 py-2">
            <span class="text-display">{{ t('steps.cut.completeMessage') }}</span>
          </div>
        </div>
      </Transition>
    </div>

    <div class="mb-5">
      <div class="flex items-center justify-between mb-2">
        <span id="cut-progress-label" class="text-sm text-brown-800/70">{{ t('steps.cut.progressLabel') }}</span>
        <span class="text-sm font-medium text-brown-900">{{ progressText }}</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin="0"
        :aria-valuemax="TOTAL_CUTS"
        :aria-valuenow="Math.min(cuts, TOTAL_CUTS)"
        aria-labelledby="cut-progress-label"
        class="w-full h-3 bg-cream-200 rounded-full overflow-hidden border border-white/60"
      >
        <div
          class="h-full bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 rounded-full transition-all duration-400 ease-out"
          :style="{ width: `${(Math.min(cuts, TOTAL_CUTS) / TOTAL_CUTS) * 100}%` }"
        />
      </div>
      <div class="flex justify-between mt-2 gap-1.5" role="list" :aria-label="t('steps.cut.progressLabel')">
        <div
          v-for="i in TOTAL_CUTS"
          :key="i"
          role="listitem"
          :aria-label="`第 ${i} 刀${i <= cuts ? '已完成' : '未完成'}`"
          class="flex-1 h-1.5 rounded-full transition-all duration-300"
          :class="i <= cuts ? 'bg-apricot-500' : 'bg-cream-300/60'"
        />
      </div>
    </div>

    <button
      class="btn-primary w-full text-display text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2"
      :class="cutCompleted ? 'bg-gradient-to-r from-matcha-500 to-matcha-600 hover:from-matcha-600 hover:to-matcha-600' : ''"
      :disabled="isCutting"
      :aria-label="buttonText"
      @click="handleCut"
      @keydown.enter.prevent="handleCut"
      @keydown.space.prevent="handleCut"
    >
      <span class="flex items-center justify-center gap-2">
        <span v-if="!cutCompleted && !isCutting">👨‍🍳</span>
        <span v-if="isCutting">💥</span>
        <span v-if="cutCompleted">✅</span>
        {{ buttonText }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.knife-swing {
  animation: knifeSwing 0.3s ease-in-out;
}

@keyframes knifeSwing {
  0% {
    transform: rotate(-30deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-30deg);
  }
}

@keyframes knifeFlash {
  0% {
    opacity: 0;
    transform: rotate(25deg) scaleX(0.3);
  }
  30% {
    opacity: 1;
    transform: rotate(25deg) scaleX(1);
  }
  100% {
    opacity: 0;
    transform: rotate(25deg) scaleX(1.1);
  }
}

.piece-enter-active {
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.piece-leave-active {
  animation: fadeOut 0.25s ease forwards;
}

.piece-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
