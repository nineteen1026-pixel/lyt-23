<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

interface SeasoningConfig {
  color: string;
  particleShape: 'square' | 'circle' | 'drop' | 'dot';
  particleColor: string;
  overlayColor: string;
  emoji: string;
}

const SEASONING_MAP: Record<string, SeasoningConfig> = {
  '盐': {
    color: '#E8E8E8',
    particleShape: 'square',
    particleColor: '#FFFFFF',
    overlayColor: 'rgba(255, 255, 255, 0.35)',
    emoji: '🧂',
  },
  '糖': {
    color: '#FFF5E6',
    particleShape: 'circle',
    particleColor: '#FFFFFF',
    overlayColor: 'rgba(255, 245, 200, 0.35)',
    emoji: '🍬',
  },
  '酱油': {
    color: '#4A2C17',
    particleShape: 'drop',
    particleColor: '#5C3317',
    overlayColor: 'rgba(74, 44, 23, 0.3)',
    emoji: '🫗',
  },
  '黑胡椒': {
    color: '#2D2D2D',
    particleShape: 'dot',
    particleColor: '#1A1A1A',
    overlayColor: 'rgba(45, 45, 45, 0.25)',
    emoji: '🖤',
  },
  '生抽': {
    color: '#6B3A1F',
    particleShape: 'drop',
    particleColor: '#7A4225',
    overlayColor: 'rgba(107, 58, 31, 0.3)',
    emoji: '🫗',
  },
  '老抽': {
    color: '#3D1F0F',
    particleShape: 'drop',
    particleColor: '#4A2615',
    overlayColor: 'rgba(61, 31, 15, 0.3)',
    emoji: '🫗',
  },
  '醋': {
    color: '#8B4513',
    particleShape: 'drop',
    particleColor: '#A0522D',
    overlayColor: 'rgba(139, 69, 19, 0.25)',
    emoji: '🍶',
  },
  '料酒': {
    color: '#D4A574',
    particleShape: 'drop',
    particleColor: '#C69C6D',
    overlayColor: 'rgba(212, 165, 116, 0.25)',
    emoji: '🍶',
  },
  '蚝油': {
    color: '#5C4033',
    particleShape: 'drop',
    particleColor: '#6B4A3A',
    overlayColor: 'rgba(92, 64, 51, 0.3)',
    emoji: '🫗',
  },
  '味精': {
    color: '#F5F5F5',
    particleShape: 'circle',
    particleColor: '#FFFFFF',
    overlayColor: 'rgba(245, 245, 245, 0.3)',
    emoji: '✨',
  },
  '鸡精': {
    color: '#FFE4B5',
    particleShape: 'circle',
    particleColor: '#FFF8DC',
    overlayColor: 'rgba(255, 228, 181, 0.3)',
    emoji: '🐔',
  },
  '辣椒粉': {
    color: '#D32F2F',
    particleShape: 'square',
    particleColor: '#E53935',
    overlayColor: 'rgba(211, 47, 47, 0.3)',
    emoji: '🌶️',
  },
  '花椒粉': {
    color: '#4A5568',
    particleShape: 'dot',
    particleColor: '#2D3748',
    overlayColor: 'rgba(74, 85, 104, 0.25)',
    emoji: '🌿',
  },
  '孜然': {
    color: '#8B6914',
    particleShape: 'dot',
    particleColor: '#6B4F0F',
    overlayColor: 'rgba(139, 105, 20, 0.3)',
    emoji: '🌾',
  },
  '淀粉': {
    color: '#FAF0E6',
    particleShape: 'square',
    particleColor: '#FFFFFF',
    overlayColor: 'rgba(250, 240, 230, 0.35)',
    emoji: '⚪',
  },
};

const DEFAULT_CONFIG: SeasoningConfig = {
  color: '#C0C0C0',
  particleShape: 'dot',
  particleColor: '#A0A0A0',
  overlayColor: 'rgba(160, 160, 160, 0.3)',
  emoji: '🧴',
};

function getSeasoningConfig(name: string): SeasoningConfig {
  return SEASONING_MAP[name] || DEFAULT_CONFIG;
}

const props = defineProps<{
  seasonings: string[];
  dishEmoji: string;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const TOTAL = computed(() => props.seasonings.length);
const sprinkledCount = ref(0);
const allSprinkled = computed(() => sprinkledCount.value >= TOTAL.value);
const isMixing = ref(false);
const showComplete = ref(false);

const seasoningStates = ref<Map<string, 'idle' | 'sprinkling' | 'done'>>(new Map());
const seasoningOpacities = ref<Map<string, number>>(new Map());

props.seasonings.forEach((s) => {
  seasoningStates.value.set(s, 'idle');
  seasoningOpacities.value.set(s, 0);
});

const particleContainerRef = ref<HTMLDivElement | null>(null);
const particles: HTMLDivElement[] = [];

const progressText = computed(() => `${sprinkledCount.value}/${TOTAL.value}`);

const isButtonDisabled = computed(() => !allSprinkled.value || isMixing.value);

const buttonText = computed(() => {
  if (isMixing.value) return '拌匀中...';
  if (allSprinkled.value) return '拌匀！';
  return '请先撒完所有调料';
});

function getBottleTransform(index: number, state: string): string {
  const baseOffset = (index - 1) * 2;
  if (state === 'sprinkling') {
    return `translateX(${baseOffset}px) rotate(45deg)`;
  }
  return `translateX(${baseOffset}px) rotate(0deg)`;
}

function sprinklingSeasoning(index: number) {
  const seasoning = props.seasonings[index];
  const state = seasoningStates.value.get(seasoning);

  if (state === 'sprinkling' || state === 'done') return;

  seasoningStates.value.set(seasoning, 'sprinkling');

  const config = getSeasoningConfig(seasoning);
  createParticles(index, config);

  const fadeDuration = 1500;
  const opacityStart = seasoningOpacities.value.get(seasoning) || 0;
  const targetOpacity = 1;
  const startTime = Date.now();

  const fadeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / fadeDuration);
    const eased = 1 - Math.pow(1 - progress, 3);
    seasoningOpacities.value.set(
      seasoning,
      opacityStart + (targetOpacity - opacityStart) * eased
    );
    if (progress >= 1) {
      clearInterval(fadeInterval);
    }
  }, 16);

  setTimeout(() => {
    seasoningStates.value.set(seasoning, 'done');
    sprinkledCount.value++;
  }, 1200);
}

function createParticles(bottleIndex: number, config: SeasoningConfig) {
  if (!particleContainerRef.value) return;

  const containerRect = particleContainerRef.value.getBoundingClientRect();
  const bottleWidth = 90;
  const bottleSpacing = 110;
  const totalWidth = (TOTAL.value - 1) * bottleSpacing;
  const centerX = containerRect.width / 2;
  const firstBottleX = centerX - totalWidth / 2;
  const bottleX = firstBottleX + bottleIndex * bottleSpacing;
  const bottleBottomY = 100;

  const particleCount = 25 + Math.floor(Math.random() * 10);

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      if (!particleContainerRef.value) return;

      const particle = document.createElement('div');
      const size = 4 + Math.random() * 6;
      const startX = bottleX + (Math.random() - 0.5) * 15;
      const startY = bottleBottomY;
      const driftX = (Math.random() - 0.5) * 60;
      const fallY = 160 + Math.random() * 40;
      const duration = 0.6 + Math.random() * 0.5;
      const delay = Math.random() * 0.15;

      let borderRadius = '';
      switch (config.particleShape) {
        case 'circle':
        case 'dot':
          borderRadius = '50%';
          break;
        case 'drop':
          borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
          break;
        case 'square':
        default:
          borderRadius = '2px';
      }

      const actualSize = config.particleShape === 'dot' ? size * 0.6 : size;

      particle.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: ${actualSize}px;
        height: ${config.particleShape === 'drop' ? actualSize * 1.4 : actualSize}px;
        background: ${config.particleColor};
        border-radius: ${borderRadius};
        pointer-events: none;
        z-index: 25;
        opacity: 0.9;
        box-shadow: ${config.particleShape !== 'dot' ? `0 0 3px ${config.particleColor}40` : 'none'};
        animation: particleFall ${duration}s cubic-bezier(0.4, 0, 0.7, 1) ${delay}s forwards;
        --drift-x: ${driftX}px;
        --fall-y: ${fallY}px;
      `;

      particleContainerRef.value.appendChild(particle);
      particles.push(particle);

      particle.addEventListener('animationend', () => {
        setTimeout(() => {
          particle.remove();
          const idx = particles.indexOf(particle);
          if (idx > -1) particles.splice(idx, 1);
        }, 200);
      });
    }, i * 30);
  }
}

function handleMix() {
  if (!allSprinkled.value || isMixing.value) return;

  isMixing.value = true;

  setTimeout(() => {
    isMixing.value = false;
    showComplete.value = true;
  }, 800);

  setTimeout(() => {
    emit('complete');
  }, 2200);
}

const overlayLayers = computed(() => {
  return props.seasonings.map((s) => ({
    name: s,
    config: getSeasoningConfig(s),
    opacity: seasoningOpacities.value.get(s) || 0,
    state: seasoningStates.value.get(s) || 'idle',
  }));
});

const cleanUp = () => {
  particles.forEach((p) => p.remove());
  particles.length = 0;
};

onUnmounted(cleanUp);
</script>

<template>
  <div class="card-soft p-6 animate-fade-slide">
    <div class="text-center mb-4">
      <h2 class="text-display text-2xl text-brown-900 mb-1">调味环节</h2>
      <p class="text-sm text-brown-800/70">点击调料瓶，给食材撒上美味~</p>
    </div>

    <div class="relative mx-auto mb-6" style="width: 360px; height: 340px;">
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style="
          width: 260px;
          height: 200px;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #faf6f0, #f0e6d6);
          border-radius: 24px;
          border: 3px solid #d4c4a8;
          box-shadow:
            0 8px 24px rgba(107, 66, 38, 0.15),
            inset 0 2px 6px rgba(255, 255, 255, 0.5);
        "
      />

      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
        style="width: 260px; height: 200px;"
      >
        <div
          :class="{
            'animate-shake': isMixing,
          }"
          class="relative"
        >
          <div
            class="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
            style="
              width: 180px;
              height: 180px;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            "
          >
            <div
              v-for="layer in overlayLayers"
              :key="'layer-' + layer.name"
              class="absolute inset-0 rounded-full pointer-events-none"
              :style="{
                opacity: layer.opacity,
                background: `radial-gradient(ellipse at center, ${layer.config.overlayColor} 0%, ${layer.config.overlayColor} 40%, transparent 75%)`,
                mixBlendMode: 'multiply',
                filter: 'blur(3px)',
              }"
            />
          </div>

          <div class="relative grid grid-cols-3 gap-1" style="width: 160px; height: 120px;">
            <div
              v-for="i in 9"
              :key="'piece-' + i"
              class="flex items-center justify-center select-none drop-shadow-sm"
              :class="isMixing ? `animate-shake-piece-${((i - 1) % 3) + 1}` : ''"
              :style="{
                animationDelay: `${(i - 1) * 40}ms`,
              }"
            >
              <span
                class="text-3xl transition-transform duration-500"
                :style="{
                  transform: `rotate(${(i - 5) * 8}deg) scale(${0.75 + ((i % 3) * 0.08)})`,
                }"
              >
                {{ dishEmoji }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Transition name="fade">
        <div
          v-if="showComplete"
          class="absolute left-1/2 z-40 animate-pop-in"
          style="top: 60px; transform: translateX(-50%);"
        >
          <div class="chip bg-apricot-500 text-white shadow-card text-sm px-5 py-2.5">
            <span class="text-display">调味完成</span>
            <span>🧂✨</span>
          </div>
        </div>
      </Transition>

      <div
        ref="particleContainerRef"
        class="absolute inset-0 pointer-events-none overflow-visible"
      >
        <div
          class="absolute flex justify-center items-start gap-7 z-20"
          style="top: 0; left: 50%; transform: translateX(-50%);"
        >
          <div
            v-for="(seasoning, index) in seasonings"
            :key="'bottle-' + seasoning"
            class="flex flex-col items-center cursor-pointer select-none"
            :class="{
              'pointer-events-none': seasoningStates.get(seasoning) !== 'idle',
            }"
            @click="sprinklingSeasoning(index)"
          >
            <div
              class="relative transition-transform duration-400 ease-out"
              :style="{
                transform: getBottleTransform(index, seasoningStates.get(seasoning) || 'idle'),
                transformOrigin: 'bottom center',
              }"
            >
              <div
                class="relative flex items-center justify-center"
                :style="{
                  width: '70px',
                  height: '80px',
                  background: `linear-gradient(
                    180deg,
                    ${getSeasoningConfig(seasoning).color} 0%,
                    ${getSeasoningConfig(seasoning).color}dd 60%,
                    ${getSeasoningConfig(seasoning).color}aa 100%
                  )`,
                  borderRadius: '14px 14px 10px 10px',
                  border: '3px solid rgba(255, 255, 255, 0.6)',
                  boxShadow:
                    '0 6px 16px rgba(0, 0, 0, 0.15), inset 0 2px 6px rgba(255, 255, 255, 0.4), inset 0 -4px 8px rgba(0, 0, 0, 0.1)',
                }"
              >
                <div
                  class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3"
                  style="
                    width: 26px;
                    height: 22px;
                    background: linear-gradient(180deg, #8B7355, #6B5344);
                    border-radius: 6px 6px 4px 4px;
                    border: 2px solid #5D4637;
                    box-shadow:
                      0 3px 8px rgba(0, 0, 0, 0.3),
                      inset 0 1px 2px rgba(255, 255, 255, 0.3);
                  "
                />

                <div
                  class="absolute bottom-2.5 left-2 right-2 py-1 rounded-md bg-white/80 backdrop-blur-sm text-center"
                  style="
                    border: 1.5px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  "
                >
                  <span class="text-xs font-bold text-brown-900">
                    {{ seasoning }}
                  </span>
                </div>

                <div
                  class="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  v-if="seasoningStates.get(seasoning) === 'idle'"
                >
                  <div class="w-3 h-3 bg-matcha-400 rounded-full animate-breath-ring-sm" />
                </div>
              </div>

              <div
                class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 z-30"
                :class="{
                  'opacity-0': seasoningStates.get(seasoning) !== 'sprinkling',
                  'opacity-100': seasoningStates.get(seasoning) === 'sprinkling',
                }"
                style="transition: opacity 0.2s;"
              >
                <div
                  class="w-1.5 h-1.5 rounded-full animate-ping"
                  :style="{
                    background: getSeasoningConfig(seasoning).particleColor,
                    animationDelay: '0ms',
                  }"
                />
                <div
                  class="w-1 h-1 rounded-full animate-ping"
                  :style="{
                    background: getSeasoningConfig(seasoning).particleColor,
                    animationDelay: '150ms',
                  }"
                />
              </div>
            </div>

            <div class="mt-3 flex flex-col items-center gap-1">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300"
                :class="{
                  'bg-cream-100 border-cream-300 text-brown-800/50':
                    seasoningStates.get(seasoning) === 'idle',
                  'bg-apricot-400 border-apricot-500 text-white animate-bounce-soft scale-110':
                    seasoningStates.get(seasoning) === 'sprinkling',
                  'bg-matcha-500 border-matcha-600 text-white shadow-md shadow-matcha-500/30':
                    seasoningStates.get(seasoning) === 'done',
                }"
              >
                <template v-if="seasoningStates.get(seasoning) === 'done'">
                  ✓
                </template>
                <template v-else-if="seasoningStates.get(seasoning) === 'sprinkling'">
                  ·
                </template>
                <template v-else>
                  {{ index + 1 }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-brown-800/70">调味进度</span>
        <span class="text-sm font-medium text-brown-900">{{ progressText }}</span>
      </div>
      <div class="w-full h-3 bg-cream-200 rounded-full overflow-hidden border border-white/60">
        <div
          class="h-full bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 rounded-full transition-all duration-400 ease-out"
          :style="{ width: `${TOTAL > 0 ? (sprinkledCount / TOTAL) * 100 : 0}%` }"
        />
      </div>
      <div class="flex justify-between mt-2 gap-1.5">
        <div
          v-for="(s, i) in seasonings"
          :key="'dot-' + s"
          class="flex-1 h-1.5 rounded-full transition-all duration-300"
          :class="{
            'bg-matcha-500': seasoningStates.get(s) === 'done',
            'bg-apricot-400 animate-breath-ring-sm': seasoningStates.get(s) === 'sprinkling',
            'bg-cream-300/60': seasoningStates.get(s) === 'idle',
          }"
        />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-5">
      <div
        v-for="(s, i) in seasonings"
        :key="'tag-' + s"
        class="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-sm font-medium transition-all duration-300 border-2"
        :class="{
          'bg-white border-cream-300 text-brown-800/60':
            seasoningStates.get(s) === 'idle',
          'bg-apricot-50 border-apricot-300 text-apricot-700 scale-105 shadow-sm':
            seasoningStates.get(s) === 'sprinkling',
          'bg-matcha-50 border-matcha-300 text-matcha-700':
            seasoningStates.get(s) === 'done',
        }"
      >
        <span class="text-base">{{ getSeasoningConfig(s).emoji }}</span>
        <span class="truncate">{{ s }}</span>
        <span
          v-if="seasoningStates.get(s) === 'done'"
          class="text-matcha-600 font-bold"
        >✓</span>
      </div>
    </div>

    <button
      class="btn-primary w-full text-display text-lg transition-all duration-300"
      :class="{
        'opacity-60 cursor-not-allowed': !allSprinkled,
        'bg-gradient-to-r from-matcha-500 to-matcha-600 hover:from-matcha-600 hover:to-matcha-600 !cursor-pointer':
          allSprinkled && !isMixing,
      }"
      :disabled="isButtonDisabled"
      @click="handleMix"
    >
      <span class="flex items-center justify-center gap-2">
        <span v-if="isMixing">🥄</span>
        <span v-else-if="allSprinkled">👨‍🍳</span>
        <span v-else>⏳</span>
        {{ buttonText }}
      </span>
    </button>
  </div>
</template>

<style scoped>
@keyframes particleFall {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.95;
  }
  30% {
    opacity: 0.9;
  }
  100% {
    transform: translate(var(--drift-x), var(--fall-y)) scale(0.4);
    opacity: 0;
  }
}

@keyframes shakePiece1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(-4px, -3px) rotate(-6deg);
  }
  40% {
    transform: translate(3px, 4px) rotate(5deg);
  }
  60% {
    transform: translate(-3px, 2px) rotate(-4deg);
  }
  80% {
    transform: translate(4px, -2px) rotate(3deg);
  }
}

@keyframes shakePiece2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(3px, 2px) rotate(5deg);
  }
  40% {
    transform: translate(-4px, -3px) rotate(-6deg);
  }
  60% {
    transform: translate(2px, -4px) rotate(4deg);
  }
  80% {
    transform: translate(-3px, 3px) rotate(-3deg);
  }
}

@keyframes shakePiece3 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(-2px, 4px) rotate(-4deg);
  }
  40% {
    transform: translate(4px, -2px) rotate(6deg);
  }
  60% {
    transform: translate(-4px, -3px) rotate(-5deg);
  }
  80% {
    transform: translate(3px, 3px) rotate(4deg);
  }
}

.animate-shake-piece-1 {
  animation: shakePiece1 0.4s ease-in-out infinite;
}

.animate-shake-piece-2 {
  animation: shakePiece2 0.4s ease-in-out infinite;
}

.animate-shake-piece-3 {
  animation: shakePiece3 0.4s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-breath-ring-sm {
  animation: breathRingSm 1.6s ease-in-out infinite;
}

@keyframes breathRingSm {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}
</style>
