<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Minus } from 'lucide-vue-next';
import { useTimerStore, TIMER_PRESETS, type TimerPreset } from '@/stores/timer';

const emit = defineEmits<{
  (e: 'created'): void;
}>();

const store = useTimerStore();

const mode = ref<'preset' | 'custom'>('preset');
const customLabel = ref('');
const customEmoji = ref('⏱️');
const customMinutes = ref(5);
const customSeconds = ref(0);
const customColor = ref('#FF8C42');

const emojiOptions = ['⏱️', '🍳', '🔥', '🥘', '🍲', '🧁', '☕', '🥩', '🥬', '🍚', '🧂', '🍜'];
const colorOptions = ['#FF8C42', '#FFD166', '#FF6B35', '#A7C957', '#88B04B', '#D4A373', '#FF6B6B', '#4D96FF'];

const customTotalSeconds = computed(() => customMinutes.value * 60 + customSeconds.value);

function selectPreset(preset: TimerPreset): void {
  try {
    const timer = store.addTimer({
      label: preset.label,
      emoji: preset.emoji,
      durationSeconds: preset.seconds,
      color: preset.color,
      isGlobal: true,
    });
    store.startTimer(timer.id);
    emit('created');
  } catch {
    // max timers reached
  }
}

function createCustom(): void {
  if (customTotalSeconds.value <= 0) return;
  if (!customLabel.value.trim()) return;
  try {
    const timer = store.addTimer({
      label: customLabel.value.trim(),
      emoji: customEmoji.value,
      durationSeconds: customTotalSeconds.value,
      color: customColor.value,
      isGlobal: true,
    });
    store.startTimer(timer.id);
    emit('created');
  } catch {
    // max timers reached
  }
}

function adjustMinutes(delta: number): void {
  customMinutes.value = Math.max(0, Math.min(180, customMinutes.value + delta));
}

function adjustSeconds(delta: number): void {
  customSeconds.value = customSeconds.value + delta;
  if (customSeconds.value < 0) {
    if (customMinutes.value > 0) {
      customMinutes.value--;
      customSeconds.value = 55;
    } else {
      customSeconds.value = 0;
    }
  } else if (customSeconds.value >= 60) {
    customMinutes.value++;
    customSeconds.value = 5;
  }
}
</script>

<template>
  <div class="card-soft p-5">
    <div class="flex gap-2 mb-5">
      <button
        class="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
        :class="mode === 'preset'
          ? 'bg-apricot-500 text-white shadow-btn'
          : 'bg-cream-200 text-brown-800/60 hover:bg-cream-300'"
        @click="mode = 'preset'"
      >
        快捷预设
      </button>
      <button
        class="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
        :class="mode === 'custom'
          ? 'bg-apricot-500 text-white shadow-btn'
          : 'bg-cream-200 text-brown-800/60 hover:bg-cream-300'"
        @click="mode = 'custom'"
      >
        自定义
      </button>
    </div>

    <div v-if="mode === 'preset'" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="preset in TIMER_PRESETS"
        :key="preset.label"
        class="card-soft p-3 text-left hover:shadow-soft transition-all active:scale-95 group"
        @click="selectPreset(preset)"
      >
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xl group-hover:animate-bounce-soft">{{ preset.emoji }}</span>
          <span class="text-sm font-medium text-brown-800">{{ preset.label }}</span>
        </div>
        <div class="text-xs text-brown-800/50">
          {{ Math.floor(preset.seconds / 60) }}分{{ preset.seconds % 60 > 0 ? `${preset.seconds % 60}秒` : '' }}
        </div>
      </button>
    </div>

    <div v-else class="space-y-4">
      <div>
        <label class="text-xs text-brown-800/60 mb-1.5 block">计时名称</label>
        <input
          v-model="customLabel"
          type="text"
          placeholder="例：烤箱预热"
          class="w-full px-4 py-2.5 rounded-xl bg-cream-100 border-2 border-cream-200 text-brown-800 text-sm placeholder:text-brown-800/30 focus:border-apricot-400 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label class="text-xs text-brown-800/60 mb-1.5 block">图标</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="emoji in emojiOptions"
            :key="emoji"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
            :class="customEmoji === emoji
              ? 'bg-apricot-100 ring-2 ring-apricot-400'
              : 'bg-cream-100 hover:bg-cream-200'"
            @click="customEmoji = emoji"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <div>
        <label class="text-xs text-brown-800/60 mb-1.5 block">计时时长</label>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <button
              class="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-cream-300 transition-all active:scale-90"
              @click="adjustMinutes(-1)"
            >
              <Minus :size="14" />
            </button>
            <div class="w-16 text-center">
              <input
                v-model.number="customMinutes"
                type="number"
                min="0"
                max="180"
                class="w-full text-center text-lg font-bold text-brown-800 bg-transparent focus:outline-none tabular-nums"
              />
              <div class="text-[10px] text-brown-800/40 -mt-0.5">分钟</div>
            </div>
            <button
              class="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-cream-300 transition-all active:scale-90"
              @click="adjustMinutes(1)"
            >
              <Plus :size="14" />
            </button>
          </div>

          <span class="text-brown-800/30 text-lg">:</span>

          <div class="flex items-center gap-1">
            <button
              class="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-cream-300 transition-all active:scale-90"
              @click="adjustSeconds(-5)"
            >
              <Minus :size="14" />
            </button>
            <div class="w-16 text-center">
              <input
                v-model.number="customSeconds"
                type="number"
                min="0"
                max="55"
                step="5"
                class="w-full text-center text-lg font-bold text-brown-800 bg-transparent focus:outline-none tabular-nums"
              />
              <div class="text-[10px] text-brown-800/40 -mt-0.5">秒</div>
            </div>
            <button
              class="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center text-brown-800/60 hover:bg-cream-300 transition-all active:scale-90"
              @click="adjustSeconds(5)"
            >
              <Plus :size="14" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label class="text-xs text-brown-800/60 mb-1.5 block">颜色</label>
        <div class="flex gap-2">
          <button
            v-for="color in colorOptions"
            :key="color"
            class="w-8 h-8 rounded-full transition-all active:scale-90"
            :class="customColor === color ? 'ring-2 ring-brown-800 ring-offset-2' : ''"
            :style="{ background: color }"
            @click="customColor = color"
          />
        </div>
      </div>

      <button
        class="btn-primary w-full flex items-center justify-center gap-2"
        :disabled="!customLabel.trim() || customTotalSeconds <= 0"
        @click="createCustom"
      >
        <Plus :size="18" />
        <span>创建计时器</span>
      </button>
    </div>
  </div>
</template>
