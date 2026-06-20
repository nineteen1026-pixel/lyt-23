<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  dishEmoji: string;
  dishColor: string;
  dishName: string;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

type PlateStage = 'idle' | 'grabbing' | 'placing' | 'decorating' | 'done';

const stage = ref<PlateStage>('idle');
const dishInHand = ref(false);
const dishOnPlate = ref(false);
const decorationCount = ref(0);
const sparkles = ref<{ id: number; x: number; y: number; emoji: string }[]>([]);
let sparkleId = 0;

const DECORATION_ITEMS = ['🌿', '🍋', '🌸', '✨', '🧂', '🌶️'];

const buttonConfig = computed(() => {
  switch (stage.value) {
    case 'idle':
      return { text: '拿起盘子', emoji: '🍽️', disabled: false, class: '' };
    case 'grabbing':
      return { text: '准备盛盘...', emoji: '🍽️', disabled: true, class: '' };
    case 'placing':
      return { text: '放入菜肴...', emoji: props.dishEmoji, disabled: true, class: '' };
    case 'decorating':
      return { text: decorationCount.value < 3 ? '添加点缀装饰' : '完成装饰', emoji: '🌿', disabled: false, class: decorationCount.value >= 3 ? 'bg-gradient-to-r from-matcha-500 to-matcha-600 hover:from-matcha-600 hover:to-matcha-700' : '' };
    case 'done':
      return { text: '完成盛盘！', emoji: '✨', disabled: false, class: 'bg-gradient-to-r from-matcha-500 to-matcha-600 hover:from-matcha-600 hover:to-matcha-700' };
    default:
      return { text: '拿起盘子', emoji: '🍽️', disabled: false, class: '' };
  }
});

function handleMainAction() {
  switch (stage.value) {
    case 'idle':
      startGrabbing();
      break;
    case 'decorating':
      if (decorationCount.value < 3) {
        addDecoration();
      } else {
        finishDecorating();
      }
      break;
    case 'done':
      emit('complete');
      break;
  }
}

function startGrabbing() {
  stage.value = 'grabbing';
  setTimeout(() => {
    dishInHand.value = true;
    setTimeout(() => {
      startPlacing();
    }, 600);
  }, 500);
}

function startPlacing() {
  stage.value = 'placing';
  setTimeout(() => {
    dishInHand.value = false;
    dishOnPlate.value = true;
    createSparkle();
    createSparkle();
    createSparkle();
    setTimeout(() => {
      startDecorating();
    }, 800);
  }, 700);
}

function startDecorating() {
  stage.value = 'decorating';
}

function addDecoration() {
  decorationCount.value++;
  createSparkle();
}

function finishDecorating() {
  stage.value = 'done';
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createSparkle(), i * 100);
  }
}

function createSparkle() {
  const id = sparkleId++;
  const x = 20 + Math.random() * 60;
  const y = 20 + Math.random() * 60;
  const emoji = DECORATION_ITEMS[Math.floor(Math.random() * DECORATION_ITEMS.length)];
  sparkles.value.push({ id, x, y, emoji });
  setTimeout(() => {
    sparkles.value = sparkles.value.filter((s) => s.id !== id);
  }, 2000);
}

const plateDecorations = computed(() => {
  return DECORATION_ITEMS.slice(0, decorationCount.value);
});
</script>

<template>
  <div class="card-soft p-6 md:p-8 animate-fade-slide">
    <div class="text-center mb-6">
      <h2 class="text-display text-2xl md:text-3xl text-brown-900 mb-2">
        盛盘装饰
      </h2>
      <p class="text-brown-800/70">
        把美味盛到盘子里，加点装饰让它更诱人~
      </p>
    </div>

    <div class="flex justify-center mb-6">
      <div class="relative" style="perspective: 1000px; width: 360px; height: 340px;">
        <div
          class="absolute left-1/2 -translate-x-1/2"
          style="top: 140px;"
        >
          <div class="relative" style="width: 260px; height: 200px;">
            <div
              class="absolute rounded-full"
              style="
                inset: 0;
                background: linear-gradient(145deg, #f8f4ec 0%, #e8ddc8 50%, #d4c4a8 100%);
                box-shadow:
                  0 12px 32px rgba(107, 66, 38, 0.2),
                  inset 0 4px 12px rgba(255, 255, 255, 0.8),
                  inset 0 -4px 8px rgba(107, 66, 38, 0.1);
                border: 4px solid #e0d0b8;
              "
            />
            <div
              class="absolute rounded-full"
              style="
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                background: linear-gradient(180deg, #fffef8 0%, #faf5eb 100%);
                box-shadow: inset 0 2px 8px rgba(107, 66, 38, 0.08);
              "
            />
            <div
              class="absolute rounded-full flex items-center justify-center transition-all duration-500"
              style="
                top: 30px;
                left: 30px;
                right: 30px;
                bottom: 30px;
              "
              :style="{
                background: dishOnPlate
                  ? `radial-gradient(ellipse at center, ${dishColor}33 0%, ${dishColor}11 60%, transparent 100%)`
                  : 'transparent',
              }"
            >
              <Transition name="dish-place">
                <div
                  v-if="dishOnPlate"
                  class="relative"
                >
                  <div class="text-7xl md:text-8xl select-none animate-bounce-soft" style="animation-duration: 1.5s;">
                    {{ dishEmoji }}
                  </div>
                  <div
                    class="absolute inset-0 rounded-full pointer-events-none"
                    style="
                      background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 215, 0, 0.2) 40%, transparent 70%);
                      mix-blend-mode: screen;
                    "
                  />
                </div>
              </Transition>
            </div>

            <div
              v-for="(deco, i) in plateDecorations"
              :key="'deco-' + i"
              class="absolute text-2xl animate-pop-in"
              :style="{
                top: `${25 + (i === 0 ? 10 : i === 1 ? 55 : 35)}%`,
                left: `${i === 0 ? 15 : i === 1 ? 75 : 50}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.1}s`,
              }"
            >
              {{ deco }}
            </div>
          </div>
        </div>

        <Transition name="hand-fly">
          <div
            v-if="dishInHand"
            class="absolute left-1/2 z-30"
            style="top: 20px; transform: translateX(-50%);"
          >
            <div class="text-7xl animate-float">
              {{ dishEmoji }}
            </div>
            <div class="text-center mt-1 text-4xl">🤲</div>
          </div>
        </Transition>

        <Transition name="fade">
          <div
            v-if="stage === 'idle'"
            class="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div class="text-center">
              <div
                class="text-5xl animate-float opacity-70"
                style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));"
              >
                🍽️
              </div>
              <div
                class="mt-3 whitespace-nowrap
                       bg-cream-100/95 backdrop-blur-sm px-4 py-1.5 rounded-full
                       border-2 border-apricot-300 shadow-card animate-pulse"
              >
                <span class="text-sm font-medium text-brown-800">
                  👇 点击下方按钮开始
                </span>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="sparkle-fade">
          <div
            v-for="sparkle in sparkles"
            :key="'sparkle-' + sparkle.id"
            class="absolute text-2xl pointer-events-none z-40 animate-sparkle"
            :style="{
              top: `${sparkle.y}%`,
              left: `${sparkle.x}%`,
              transform: 'translate(-50%, -50%)',
            }"
          >
            {{ sparkle.emoji }}
          </div>
        </Transition>

        <Transition name="fade">
          <div
            v-if="stage === 'done'"
            class="absolute left-1/2 z-40 animate-pop-in"
            style="top: 40px; transform: translateX(-50%);"
          >
            <div class="chip bg-matcha-500 text-white shadow-card text-sm px-5 py-2.5">
              <span class="text-display">盛盘完成</span>
              <span>✨🍽️</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="max-w-sm mx-auto mb-6 space-y-4">
      <div>
        <div class="flex justify-between text-sm text-brown-800/70 mb-2">
          <span>盛盘进度</span>
          <span class="font-medium text-apricot-600">
            {{ stage === 'idle' ? '0%' : stage === 'grabbing' ? '20%' : stage === 'placing' ? '50%' : stage === 'decorating' ? `${50 + decorationCount * 15}%` : '100%' }}
          </span>
        </div>
        <div
          class="h-4 bg-cream-200 rounded-full overflow-hidden border-2 border-white shadow-inner"
        >
          <div
            class="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            :style="{
              width: stage === 'idle' ? '0%' : stage === 'grabbing' ? '20%' : stage === 'placing' ? '50%' : stage === 'decorating' ? `${50 + decorationCount * 15}%` : '100%',
              background: stage === 'done'
                ? 'linear-gradient(90deg, #6EE7B7, #34D399, #6EE7B7)'
                : 'linear-gradient(90deg, #FFD166, #FF9F43, #FF6B35)',
              backgroundSize: '200% 100%',
              animation: stage !== 'done' && stage !== 'idle' ? 'shimmer 1.5s linear infinite' : 'none',
            }"
          >
            <div
              class="absolute inset-0 opacity-40"
              style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);"
            />
          </div>
        </div>
      </div>

      <div
        v-if="stage === 'decorating'"
        class="text-center"
      >
        <div class="text-xs text-brown-800/60 mb-2">
          点缀装饰 ({{ decorationCount }}/3)
        </div>
        <div class="flex justify-center gap-2">
          <div
            v-for="i in 3"
            :key="'dot-' + i"
            class="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 border-2"
            :class="{
              'bg-matcha-100 border-matcha-300 scale-110': i <= decorationCount,
              'bg-cream-100 border-cream-300 border-dashed': i > decorationCount,
            }"
          >
            <span v-if="i <= decorationCount">
              {{ plateDecorations[i - 1] }}
            </span>
            <span v-else class="text-brown-800/30">+</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <button
        class="btn-primary text-lg md:text-xl px-10 py-4 min-w-[200px] relative overflow-hidden"
        :class="buttonConfig.class"
        :disabled="buttonConfig.disabled"
        @click="handleMainAction"
      >
        <span class="flex items-center justify-center gap-2">
          <span>{{ buttonConfig.emoji }}</span>
          <span>{{ buttonConfig.text }}</span>
          <svg
            v-if="stage === 'grabbing' || stage === 'placing'"
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
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes sparkleRise {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  30% {
    transform: translate(-50%, -80%) scale(1.3);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -120%) scale(0.6);
    opacity: 0;
  }
}

.animate-sparkle {
  animation: sparkleRise 1.8s ease-out forwards;
}

.dish-place-enter-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dish-place-leave-active {
  transition: all 0.3s ease-in;
}

.dish-place-enter-from {
  transform: translateY(-80px) scale(0.5);
  opacity: 0;
}

.dish-place-leave-to {
  transform: translateY(40px) scale(0.8);
  opacity: 0;
}

.hand-fly-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hand-fly-leave-active {
  transition: all 0.4s ease-in;
}

.hand-fly-enter-from {
  transform: translateX(-50%) translateY(-60px) scale(0.6);
  opacity: 0;
}

.hand-fly-leave-to {
  transform: translateX(-50%) translateY(40px) scale(0.9);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sparkle-fade-enter-active {
  transition: opacity 0.2s ease;
}

.sparkle-fade-leave-active {
  transition: opacity 0.6s ease;
}

.sparkle-fade-enter-from,
.sparkle-fade-leave-to {
  opacity: 0;
}
</style>
