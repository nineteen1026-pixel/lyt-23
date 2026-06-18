<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  dishEmoji: string;
  dishColor: string;
  time?: number;
}>(), {
  time: 15,
});

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

type BakeStage = 'idle' | 'inserting' | 'closing' | 'baking' | 'done';

const stage = ref<BakeStage>('idle');
const progress = ref(0);
const temperature = ref(25);
const doorOpen = ref(true);
const dishInside = ref(false);
const dingTrigger = ref(0);

let bakeInterval: number | null = null;
const BAKE_DURATION = 4000;
const TARGET_TEMP = 180;

const displayTime = computed(() => {
  const totalSeconds = Math.round((progress.value / 100) * props.time);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

const temperaturePercent = computed(() => {
  return Math.min(100, ((temperature.value - 25) / (TARGET_TEMP - 25)) * 100);
});

const temperatureColor = computed(() => {
  const t = temperature.value;
  if (t < 80) return '#FFD166';
  if (t < 130) return '#FF9F43';
  if (t < 160) return '#FF6B35';
  return '#E63946';
});

const buttonConfig = computed(() => {
  switch (stage.value) {
    case 'idle':
      return { text: '放入食材', emoji: '🍳', disabled: false, class: '' };
    case 'inserting':
    case 'closing':
    case 'baking':
      return { text: '烘烤中...', emoji: '🔥', disabled: true, class: '' };
    case 'done':
      return { text: '出炉！🍽️', emoji: '✨', disabled: false, class: 'bg-gradient-to-r from-matcha-500 to-matcha-600 hover:from-matcha-600 hover:to-matcha-700' };
    default:
      return { text: '放入食材', emoji: '🍳', disabled: false, class: '' };
  }
});

function handleMainAction() {
  if (stage.value === 'idle') {
    startInsert();
  } else if (stage.value === 'done') {
    emit('complete');
  }
}

function startInsert() {
  stage.value = 'inserting';
  setTimeout(() => {
    dishInside.value = true;
    setTimeout(() => {
      startCloseDoor();
    }, 500);
  }, 700);
}

function startCloseDoor() {
  stage.value = 'closing';
  setTimeout(() => {
    doorOpen.value = false;
    setTimeout(() => {
      startBaking();
    }, 800);
  }, 100);
}

function startBaking() {
  stage.value = 'baking';
  const startTime = Date.now();

  bakeInterval = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    const ratio = Math.min(1, elapsed / BAKE_DURATION);

    progress.value = Math.round(ratio * 100);
    temperature.value = Math.round(25 + ratio * (TARGET_TEMP - 25));

    if (elapsed >= BAKE_DURATION) {
      if (bakeInterval) clearInterval(bakeInterval);
      finishBaking();
    }
  }, 30);
}

function finishBaking() {
  stage.value = 'done';
  progress.value = 100;
  temperature.value = TARGET_TEMP;
  dingTrigger.value++;

  setTimeout(() => {
    doorOpen.value = true;
  }, 400);
}

const steamItems = [0, 1, 2, 3, 4];

function cleanUp() {
  if (bakeInterval) clearInterval(bakeInterval);
}

onUnmounted(cleanUp);
</script>

<template>
  <div class="card-soft p-6 md:p-8 animate-fade-slide">
    <div class="text-center mb-6">
      <h2 class="text-display text-2xl md:text-3xl text-brown-900 mb-2">
        烤箱烘烤
      </h2>
      <p class="text-brown-800/70">
        把食材放进烤箱，等待美味出炉~
      </p>
    </div>

    <div class="flex justify-center mb-6">
      <div class="relative" style="perspective: 1000px; width: 360px; height: 340px;">
        <div
          class="absolute rounded-[2rem] overflow-hidden"
          style="
            inset: 0;
            background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 50%, #1f1f1f 100%);
            border: 4px solid #505050;
            box-shadow:
              0 20px 50px rgba(0, 0, 0, 0.4),
              inset 0 2px 8px rgba(255, 255, 255, 0.08),
              inset 0 -4px 12px rgba(0, 0, 0, 0.4);
          "
        >
          <div
            class="absolute rounded-xl overflow-hidden"
            style="
              top: 60px;
              left: 24px;
              right: 24px;
              bottom: 24px;
              background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
              border: 3px solid #454545;
              box-shadow:
                inset 0 4px 16px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.03);
            "
          >
            <div
              v-if="stage === 'baking' || stage === 'done'"
              class="absolute inset-0 transition-opacity duration-500"
              :style="{
                opacity: stage === 'baking' ? 1 : 0.6,
                background: stage === 'done'
                  ? 'radial-gradient(ellipse at center, rgba(120, 255, 150, 0.35) 0%, rgba(80, 220, 120, 0.15) 50%, transparent 80%)'
                  : 'radial-gradient(ellipse at center, rgba(255, 180, 60, 0.45) 0%, rgba(255, 120, 40, 0.2) 50%, transparent 80%)',
                animation: stage === 'baking' ? 'ovenGlow 1.5s ease-in-out infinite' : 'none',
              }"
            />

            <div
              v-for="i in 2"
              :key="'heat-' + i"
              class="absolute h-3 rounded-full transition-opacity duration-500"
              :class="{
                'opacity-100': stage === 'baking' || stage === 'done',
                'opacity-0': stage !== 'baking' && stage !== 'done',
              }"
              :style="{
                left: '20px',
                right: '20px',
                top: i === 1 ? '12px' : 'auto',
                bottom: i === 2 ? '12px' : 'auto',
                background: stage === 'done'
                  ? 'linear-gradient(90deg, transparent, #6EE7B7, #34D399, #6EE7B7, transparent)'
                  : 'linear-gradient(90deg, transparent, #FF9F43, #FF6B35, #FF9F43, transparent)',
                boxShadow: stage === 'done'
                  ? '0 0 20px rgba(110, 231, 183, 0.6), 0 0 40px rgba(52, 211, 153, 0.3)'
                  : '0 0 20px rgba(255, 107, 53, 0.6), 0 0 40px rgba(255, 159, 67, 0.3)',
                animation: stage === 'baking' ? `heatPulse ${1.2 + i * 0.3}s ease-in-out infinite` : 'none',
              }"
            />

            <div
              v-for="(rack, idx) in 2"
              :key="'rack-' + idx"
              class="absolute left-4 right-4 h-1 rounded-full"
              :style="{
                top: idx === 0 ? '38%' : '62%',
                background: 'linear-gradient(90deg, #5a5a5a, #707070, #5a5a5a)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }"
            />

            <div class="absolute inset-0 flex items-center justify-center z-10">
              <Transition name="dish-fly">
                <div
                  v-if="dishInside"
                  class="relative transition-all duration-700 ease-out"
                  :style="{
                    transform: stage === 'inserting'
                      ? 'translateY(-120px) scale(0.6)'
                      : stage === 'done'
                        ? 'translateY(0) scale(1.15)'
                        : 'translateY(0) scale(1)',
                    filter: stage === 'done'
                      ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) brightness(1.1)'
                      : stage === 'baking'
                        ? `drop-shadow(0 0 12px ${dishColor}66) brightness(0.95) saturate(1.2)`
                        : 'none',
                  }"
                >
                  <div class="text-7xl md:text-8xl select-none relative">
                    {{ dishEmoji }}
                    <div
                      v-if="stage === 'done'"
                      class="absolute inset-0 rounded-full pointer-events-none"
                      style="
                        background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 215, 0, 0.3) 30%, transparent 60%);
                        mix-blend-mode: screen;
                        animation: goldShine 2s ease-in-out infinite;
                      "
                    />
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div
            class="absolute flex items-center justify-between px-5"
            style="
              top: 12px;
              left: 12px;
              right: 12px;
              height: 40px;
              background: linear-gradient(180deg, #404040 0%, #303030 100%);
              border-radius: 14px;
              border: 2px solid #555;
              box-shadow: inset 0 1px 2px rgba(255,255,255,0.1);
            "
          >
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full relative flex items-center justify-center"
                style="
                  background: radial-gradient(circle at 30% 30%, #2a2a2a, #1a1a1a);
                  border: 2px solid #444;
                  box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
                "
              >
                <svg class="w-5 h-5" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#3a3a3a"
                    stroke-width="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    :stroke="temperatureColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    :stroke-dasharray="`${temperaturePercent * 0.88} 100`"
                    style="transform: rotate(-90deg); transform-origin: 18px 18px; transition: stroke-dasharray 0.3s ease, stroke 0.3s ease;"
                  />
                </svg>
                <span
                  class="absolute text-[9px] font-bold"
                  :style="{ color: temperatureColor }"
                >
                  🌡️
                </span>
              </div>
              <span class="text-sm font-bold text-gray-300 tabular-nums">
                {{ temperature }}°C
              </span>
            </div>

            <div
              class="font-mono text-xl font-bold tracking-wider px-3 py-1 rounded-lg"
              style="
                background: #0a0a0a;
                color: #FF6B35;
                text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
                border: 1px solid #333;
                box-shadow: inset 0 2px 6px rgba(0,0,0,0.8);
              "
            >
              {{ displayTime }}
            </div>

            <div class="flex items-center gap-1">
              <div
                v-for="i in 2"
                :key="'knob-' + i"
                class="w-6 h-6 rounded-full"
                style="
                  background: radial-gradient(circle at 30% 30%, #555, #2a2a2a);
                  border: 2px solid #404040;
                  box-shadow:
                    inset 0 1px 2px rgba(255,255,255,0.15),
                    0 2px 4px rgba(0,0,0,0.4);
                "
              >
                <div
                  class="w-0.5 h-2 bg-gray-500 mx-auto mt-1 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute rounded-[2rem] transition-transform duration-700 ease-out z-20"
          :style="{
            inset: 0,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: doorOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
            animation: !doorOpen && stage === 'closing' ? 'doorBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : doorOpen && stage === 'done' ? 'doorPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            background: 'linear-gradient(145deg, #484848 0%, #383838 50%, #2d2d2d 100%)',
            border: '4px solid #5a5a5a',
            boxShadow: doorOpen
              ? '8px 0 30px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.08)',
            backfaceVisibility: 'hidden',
          }"
        >
          <div
            class="absolute rounded-xl overflow-hidden"
            style="
              top: 60px;
              left: 24px;
              right: 24px;
              bottom: 24px;
              background: linear-gradient(135deg,
                rgba(120, 160, 200, 0.15) 0%,
                rgba(80, 120, 160, 0.1) 50%,
                rgba(60, 100, 140, 0.15) 100%);
              border: 3px solid #505050;
              box-shadow:
                inset 0 0 40px rgba(0, 0, 0, 0.4),
                inset 0 0 80px rgba(80, 120, 160, 0.1),
                0 0 0 2px rgba(255, 255, 255, 0.03);
            "
          >
            <div
              v-if="stage === 'baking' || stage === 'done'"
              class="absolute inset-0 transition-opacity duration-500"
              :style="{
                opacity: 0.7,
                background: stage === 'done'
                  ? 'radial-gradient(ellipse at center, rgba(110, 231, 183, 0.25) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, rgba(255, 160, 60, 0.35) 0%, rgba(255, 100, 40, 0.15) 50%, transparent 80%)',
                animation: stage === 'baking' ? 'ovenGlow 1.5s ease-in-out infinite' : 'none',
              }"
            />

            <div
              class="absolute inset-6 rounded-lg pointer-events-none"
              style="
                border: 1px solid rgba(255, 255, 255, 0.08);
                background:
                  linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%),
                  linear-gradient(315deg, rgba(0,0,0,0.2) 0%, transparent 50%);
              "
            />

            <div
              class="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
              style="
                background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
              "
            />
          </div>

          <div
            class="absolute flex items-center justify-between px-5"
            style="
              top: 12px;
              left: 12px;
              right: 12px;
              height: 40px;
              background: linear-gradient(180deg, #484848 0%, #383838 100%);
              border-radius: 14px;
              border: 2px solid #606060;
              box-shadow:
                inset 0 1px 2px rgba(255,255,255,0.12),
                0 1px 3px rgba(0,0,0,0.3);
            "
          >
            <div class="text-xs font-bold text-gray-400 tracking-widest">
              OVEN
            </div>
            <div
              class="w-3 h-3 rounded-full transition-colors duration-300"
              :style="{
                background: stage === 'done'
                  ? '#34D399'
                  : stage === 'baking'
                    ? '#FF6B35'
                    : '#555',
                boxShadow: stage === 'baking' || stage === 'done'
                  ? `0 0 10px ${stage === 'done' ? '#34D399' : '#FF6B35'}, 0 0 20px ${stage === 'done' ? '#34D39966' : '#FF6B3566'}`
                  : 'none',
              }"
            />
          </div>

          <div
            class="absolute rounded-full"
            style="
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              width: 14px;
              height: 100px;
              background: linear-gradient(90deg, #606060, #484848, #606060);
              border: 2px solid #707070;
              box-shadow:
                2px 0 6px rgba(0,0,0,0.4),
                inset 1px 0 2px rgba(255,255,255,0.15);
            "
          />
        </div>

        <Transition name="fade">
          <div
            v-if="stage === 'idle'"
            class="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div
              class="text-6xl animate-float opacity-70"
              style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));"
            >
              {{ dishEmoji }}
            </div>
            <div
              class="absolute left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap
                     bg-cream-100/95 backdrop-blur-sm px-4 py-1.5 rounded-full
                     border-2 border-apricot-300 shadow-card animate-pulse"
            >
              <span class="text-sm font-medium text-brown-800">
                👇 点击下方按钮放入
              </span>
            </div>
          </div>
        </Transition>

        <Transition name="steam">
          <div
            v-if="stage === 'baking' || stage === 'done'"
            class="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            style="top: -8px;"
          >
            <div
              v-for="i in steamItems"
              :key="'steam-' + i + '-' + (stage === 'done' ? 'done' : 'bake')"
              class="absolute text-3xl select-none"
              :style="{
                left: `${(i - 2) * 28}px`,
                animation: `steamRise ${1.8 + i * 0.25}s ease-out infinite`,
                animationDelay: `${i * 0.35}s`,
                opacity: stage === 'done' ? 0.5 : 0.8,
              }"
            >
              ♨️
            </div>
          </div>
        </Transition>

        <Transition name="ding">
          <div
            v-if="dingTrigger > 0 && stage === 'done'"
            :key="'ding-' + dingTrigger"
            class="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <div
              class="absolute inset-0 rounded-[2rem]"
              style="
                background: radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, transparent 70%);
                animation: dingFlash 0.6s ease-out;
              "
            />
            <div
              class="text-5xl animate-bounce-soft"
              style="animation: dingPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);"
            >
              🔔
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="max-w-sm mx-auto mb-6 space-y-4">
      <div>
        <div class="flex justify-between text-sm text-brown-800/70 mb-2">
          <span>烘烤进度</span>
          <span class="font-medium text-apricot-600">{{ progress }}%</span>
        </div>
        <div
          class="h-4 bg-cream-200 rounded-full overflow-hidden border-2 border-white shadow-inner"
        >
          <div
            class="h-full rounded-full transition-all duration-150 ease-out relative overflow-hidden"
            :style="{
              width: `${progress}%`,
              background: stage === 'done'
                ? 'linear-gradient(90deg, #6EE7B7, #34D399, #6EE7B7)'
                : 'linear-gradient(90deg, #FFD166, #FF9F43, #FF6B35, #E63946)',
              backgroundSize: '200% 100%',
              animation: stage === 'baking' ? 'shimmer 1.5s linear infinite' : 'none',
            }"
          >
            <div
              class="absolute inset-0 opacity-40"
              style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);"
            />
          </div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-sm text-brown-800/70 mb-2">
          <span>炉内温度</span>
          <span class="font-medium" :style="{ color: temperatureColor }">{{ temperature }}°C</span>
        </div>
        <div
          class="h-4 bg-cream-200 rounded-full overflow-hidden border-2 border-white shadow-inner"
        >
          <div
            class="h-full rounded-full transition-all duration-150 ease-out relative"
            :style="{
              width: `${temperaturePercent}%`,
              background: `linear-gradient(90deg, #FFD166 0%, #FF9F43 40%, #FF6B35 70%, #E63946 100%)`,
            }"
          />
        </div>
        <div class="flex justify-between mt-1 text-[10px] text-brown-800/50 tabular-nums">
          <span>25°</span>
          <span>100°</span>
          <span>180°</span>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
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
            v-if="stage === 'baking'"
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
@keyframes ovenGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes heatPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scaleX(0.95);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.02);
  }
}

@keyframes goldShine {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes doorBounce {
  0% {
    transform: rotateY(-105deg);
  }
  60% {
    transform: rotateY(5deg);
  }
  75% {
    transform: rotateY(-3deg);
  }
  88% {
    transform: rotateY(1.5deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

@keyframes doorPop {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-115deg);
  }
  100% {
    transform: rotateY(-105deg);
  }
}

@keyframes steamRise {
  0% {
    transform: translateY(0) scale(0.6);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  60% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-60px) scale(1.4);
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

@keyframes dingFlash {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

@keyframes dingPop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.4);
  }
  80% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1.1);
  }
}

.dish-fly-enter-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dish-fly-leave-active {
  transition: all 0.3s ease-in;
}

.dish-fly-enter-from {
  transform: translateY(-200px) scale(0.4) !important;
  opacity: 0;
}

.dish-fly-leave-to {
  transform: translateY(80px) scale(0.8) !important;
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

.steam-enter-active {
  transition: opacity 0.5s ease 0.3s;
}

.steam-leave-active {
  transition: opacity 0.4s ease;
}

.steam-enter-from,
.steam-leave-to {
  opacity: 0;
}

.ding-enter-active {
  animation: dingEnter 0.1s ease;
}

.ding-leave-active {
  transition: opacity 0.5s ease;
}

.ding-leave-to {
  opacity: 0;
}

@keyframes dingEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
