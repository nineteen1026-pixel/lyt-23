<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeft, User, AlertTriangle, Sparkles, RotateCcw, Volume2, Globe, MessageSquareHeart } from 'lucide-vue-next';
import {
  useProfileStore,
  ALLERGENS,
  SPICY_LEVELS,
  SALT_LEVELS,
  SWEET_LEVELS,
  OIL_LEVELS,
  type SpicyLevel,
  type SaltLevel,
  type SweetLevel,
  type OilLevel,
} from '@/stores/profile';
import {
  useSettingsStore,
  SPEECH_RATE_OPTIONS,
  HIGH_CONTRAST_OPTIONS,
  type SpeechRate,
  type HighContrastMode,
} from '@/stores/settings';
import { useSpeech } from '@/composables/useSpeech';
import LanguageSelector from '@/components/settings/LanguageSelector.vue';
import FeedbackForm from '@/components/feedback/FeedbackForm.vue';
import FeedbackQueue from '@/components/feedback/FeedbackQueue.vue';

const { t } = useI18n();
const router = useRouter();
const profileStore = useProfileStore();
const settingsStore = useSettingsStore();
const { speak, isSupported } = useSpeech();

function testSpeech() {
  speak('你好，欢迎使用语音引导功能！');
}

function handleSpeechRateChange(rate: SpeechRate) {
  settingsStore.setSpeechRate(rate);
  if (settingsStore.speechEnabled) {
    const option = SPEECH_RATE_OPTIONS.find((o) => o.value === rate);
    if (option) {
      speak(`语速已调整为${option.label}`);
    }
  }
}

function handleReset() {
  profileStore.resetProfile();
  settingsStore.resetSettings();
}
</script>

<template>
  <div class="container max-w-4xl mx-auto px-4 pt-8">
    <header class="mb-8 animate-fade-slide">
      <button
        class="flex items-center gap-2 card-soft px-4 py-2.5 mb-6 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/')"
      >
        <ArrowLeft :size="18" class="text-brown-800/70" />
        <span class="text-sm text-brown-800/80 font-medium">回到厨房</span>
      </button>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-display text-4xl text-brown-900 flex items-center gap-2">
            <User class="text-apricot-500" :size="36" />
            我的饮食档案
          </h1>
          <p class="text-sm text-brown-800/70 mt-2">
            设置你的过敏源和口味偏好，让小厨房更懂你 ✿
          </p>
        </div>
        <button
          class="flex items-center gap-2 card-soft px-4 py-2.5 hover:shadow-soft transition-all active:scale-95 text-brown-800/70"
          @click="handleReset"
        >
          <RotateCcw :size="16" />
          <span class="text-sm">重置</span>
        </button>
      </div>
    </header>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.05s">
      <div class="flex items-center gap-2 mb-4">
        <AlertTriangle class="text-red-400" :size="22" />
        <h2 class="text-display text-xl text-brown-900">过敏源</h2>
        <span class="text-xs text-brown-800/60 ml-1">（勾选后会在首页自动过滤含过敏源的菜品）</span>
      </div>
      <div class="card-soft p-5">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <button
            v-for="allergen in ALLERGENS"
            :key="allergen.id"
            class="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-300 text-left active:scale-95"
            :class="{
              'bg-red-50 border-red-300 text-red-700 shadow-sm':
                profileStore.allergens.includes(allergen.id),
              'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                !profileStore.allergens.includes(allergen.id),
            }"
            @click="profileStore.toggleAllergen(allergen.id)"
          >
            <span class="text-2xl">{{ allergen.emoji }}</span>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ allergen.name }}</div>
              <div
                v-if="profileStore.allergens.includes(allergen.id)"
                class="text-[11px] text-red-500 mt-0.5"
              >
                已标记
              </div>
            </div>
            <div
              v-if="profileStore.allergens.includes(allergen.id)"
              class="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center text-white text-xs font-bold"
            >
              ✓
            </div>
          </button>
        </div>
        <div
          v-if="profileStore.allergens.length === 0"
          class="text-center text-sm text-brown-800/50 py-4"
        >
          还没有标记任何过敏源～
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.1s">
      <div class="flex items-center gap-2 mb-4">
        <Sparkles class="text-apricot-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">口味偏好</h2>
        <span class="text-xs text-brown-800/60 ml-1">（会影响调味步骤的建议用量）</span>
      </div>

      <div class="card-soft p-5 space-y-6">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-brown-900">🌶️ 辣度偏好</span>
            <span class="text-xs text-brown-800/60">
              {{ SPICY_LEVELS.find((l) => l.value === profileStore.tastePreference.spicy)?.label }}
            </span>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="level in SPICY_LEVELS"
              :key="level.value"
              class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
              :class="{
                'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                  profileStore.tastePreference.spicy === level.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                  profileStore.tastePreference.spicy !== level.value,
              }"
              @click="profileStore.setTaste('spicy', level.value as SpicyLevel)"
            >
              <div class="text-lg mb-0.5">{{ level.emoji }}</div>
              <div class="text-xs">{{ level.label }}</div>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-brown-900">🧂 咸淡偏好</span>
            <span class="text-xs text-brown-800/60">
              {{ SALT_LEVELS.find((l) => l.value === profileStore.tastePreference.salt)?.label }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="level in SALT_LEVELS"
              :key="level.value"
              class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
              :class="{
                'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                  profileStore.tastePreference.salt === level.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                  profileStore.tastePreference.salt !== level.value,
              }"
              @click="profileStore.setTaste('salt', level.value as SaltLevel)"
            >
              <div class="text-lg mb-0.5">{{ level.emoji }}</div>
              <div class="text-xs">{{ level.label }}</div>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-brown-900">🍬 甜度偏好</span>
            <span class="text-xs text-brown-800/60">
              {{ SWEET_LEVELS.find((l) => l.value === profileStore.tastePreference.sweet)?.label }}
            </span>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="level in SWEET_LEVELS"
              :key="level.value"
              class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
              :class="{
                'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                  profileStore.tastePreference.sweet === level.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                  profileStore.tastePreference.sweet !== level.value,
              }"
              @click="profileStore.setTaste('sweet', level.value as SweetLevel)"
            >
              <div class="text-lg mb-0.5">{{ level.emoji }}</div>
              <div class="text-xs">{{ level.label }}</div>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-brown-900">🫒 油度偏好</span>
            <span class="text-xs text-brown-800/60">
              {{ OIL_LEVELS.find((l) => l.value === profileStore.tastePreference.oil)?.label }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="level in OIL_LEVELS"
              :key="level.value"
              class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
              :class="{
                'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                  profileStore.tastePreference.oil === level.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                  profileStore.tastePreference.oil !== level.value,
              }"
              @click="profileStore.setTaste('oil', level.value as OilLevel)"
            >
              <div class="text-lg mb-0.5">{{ level.emoji }}</div>
              <div class="text-xs">{{ level.label }}</div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.15s">
      <div class="flex items-center gap-2 mb-4">
        <Volume2 class="text-blue-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">语音引导</h2>
        <span class="text-xs text-brown-800/60 ml-1">（烹饪时语音播报步骤提示）</span>
      </div>

      <div v-if="!isSupported" class="card-soft p-5 bg-amber-50 border-amber-200">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="text-sm font-medium text-brown-900">当前浏览器不支持语音功能</p>
            <p class="text-xs text-brown-800/60 mt-1">
              语音引导功能需要浏览器支持 Web Speech API，建议使用最新版 Chrome、Edge 或 Safari 浏览器。
            </p>
          </div>
        </div>
      </div>

      <div v-else class="card-soft p-5 space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center"
              :class="settingsStore.speechEnabled ? 'bg-blue-100' : 'bg-cream-200'"
            >
              <Volume2
                :size="22"
                :class="settingsStore.speechEnabled ? 'text-blue-600' : 'text-brown-800/40'"
              />
            </div>
            <div>
              <div class="text-sm font-medium text-brown-900">语音引导开关</div>
              <div class="text-xs text-brown-800/60 mt-0.5">
                开启后烹饪时会自动播报步骤提示
              </div>
            </div>
          </div>
          <button
            class="relative w-14 h-7 rounded-full transition-all duration-300"
            :class="settingsStore.speechEnabled ? 'bg-blue-500' : 'bg-cream-300'"
            @click="settingsStore.toggleSpeech()"
          >
            <div
              class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              :class="settingsStore.speechEnabled ? 'left-7' : 'left-0.5'"
            />
          </button>
        </div>

        <div
          v-if="settingsStore.speechEnabled"
          class="pt-4 border-t border-cream-200 space-y-5"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-brown-900">🎙️ 语速调节</span>
              <span class="text-xs text-brown-800/60">
                {{ SPEECH_RATE_OPTIONS.find((o) => o.value === settingsStore.speechRate)?.label }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in SPEECH_RATE_OPTIONS"
                :key="option.value"
                class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
                :class="{
                  'bg-blue-100 border-blue-400 text-blue-700 shadow-sm':
                    settingsStore.speechRate === option.value,
                  'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                    settingsStore.speechRate !== option.value,
                }"
                @click="handleSpeechRateChange(option.value as SpeechRate)"
              >
                <div class="text-lg mb-0.5">
                  {{ option.value === 'slow' ? '🐢' : option.value === 'normal' ? '🚶' : '🐇' }}
                </div>
                <div class="text-xs">{{ option.label }}</div>
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button
              class="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.98]"
              @click="testSpeech"
            >
              🔊 试听一下
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.175s">
      <div class="flex items-center gap-2 mb-4">
        <Globe class="text-matcha-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">语言设置</h2>
        <span class="text-xs text-brown-800/60 ml-1">（切换界面显示语言）</span>
      </div>
      <LanguageSelector />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.185s">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">♿</span>
        <h2 class="text-display text-xl text-brown-900">无障碍设置</h2>
        <span class="text-xs text-brown-800/60 ml-1">（让小厨房更易用）</span>
      </div>

      <div class="card-soft p-5 space-y-6">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-brown-900">🎨 高对比度主题</span>
            <span class="text-xs text-brown-800/60">
              {{ HIGH_CONTRAST_OPTIONS.find((o) => o.value === settingsStore.highContrastMode)?.label }}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="option in HIGH_CONTRAST_OPTIONS"
              :key="option.value"
              class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2"
              :class="{
                'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                  settingsStore.highContrastMode === option.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                  settingsStore.highContrastMode !== option.value,
              }"
              :aria-pressed="settingsStore.highContrastMode === option.value"
              @click="settingsStore.setHighContrastMode(option.value as HighContrastMode)"
            >
              <div class="text-lg mb-0.5">
                {{ option.value === 'off' ? '☀️' : option.value === 'light' ? '⚪' : '⚫' }}
              </div>
              <div class="text-xs">{{ option.label }}</div>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-cream-200">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center"
              :class="settingsStore.reducedMotion ? 'bg-purple-100' : 'bg-cream-200'"
            >
              <span class="text-xl">{{ settingsStore.reducedMotion ? '🐢' : '🐇' }}</span>
            </div>
            <div>
              <div class="text-sm font-medium text-brown-900">减少动画</div>
              <div class="text-xs text-brown-800/60 mt-0.5">
                关闭不必要的动画效果
              </div>
            </div>
          </div>
          <button
            role="switch"
            :aria-checked="settingsStore.reducedMotion"
            :aria-label="'减少动画'"
            class="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2"
            :class="settingsStore.reducedMotion ? 'bg-purple-500' : 'bg-cream-300'"
            @click="settingsStore.toggleReducedMotion()"
            @keydown.enter.prevent="settingsStore.toggleReducedMotion()"
            @keydown.space.prevent="settingsStore.toggleReducedMotion()"
          >
            <div
              class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              :class="settingsStore.reducedMotion ? 'left-7' : 'left-0.5'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-cream-200">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center"
              :class="settingsStore.largeText ? 'bg-teal-100' : 'bg-cream-200'"
            >
              <span class="text-xl">{{ settingsStore.largeText ? '🔍' : '🔤' }}</span>
            </div>
            <div>
              <div class="text-sm font-medium text-brown-900">大字体</div>
              <div class="text-xs text-brown-800/60 mt-0.5">
                增大界面字体大小
              </div>
            </div>
          </div>
          <button
            role="switch"
            :aria-checked="settingsStore.largeText"
            :aria-label="'大字体'"
            class="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2"
            :class="settingsStore.largeText ? 'bg-teal-500' : 'bg-cream-300'"
            @click="settingsStore.toggleLargeText()"
            @keydown.enter.prevent="settingsStore.toggleLargeText()"
            @keydown.space.prevent="settingsStore.toggleLargeText()"
          >
            <div
              class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              :class="settingsStore.largeText ? 'left-7' : 'left-0.5'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-cream-200">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center"
              :class="settingsStore.focusVisible ? 'bg-indigo-100' : 'bg-cream-200'"
            >
              <span class="text-xl">{{ settingsStore.focusVisible ? '🎯' : '👆' }}</span>
            </div>
            <div>
              <div class="text-sm font-medium text-brown-900">可见焦点</div>
              <div class="text-xs text-brown-800/60 mt-0.5">
                键盘导航时显示焦点指示
              </div>
            </div>
          </div>
          <button
            role="switch"
            :aria-checked="settingsStore.focusVisible"
            :aria-label="'可见焦点'"
            class="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-apricot-500 focus-visible:ring-offset-2"
            :class="settingsStore.focusVisible ? 'bg-indigo-500' : 'bg-cream-300'"
            @click="settingsStore.toggleFocusVisible()"
            @keydown.enter.prevent="settingsStore.toggleFocusVisible()"
            @keydown.space.prevent="settingsStore.toggleFocusVisible()"
          >
            <div
              class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              :class="settingsStore.focusVisible ? 'left-7' : 'left-0.5'"
            />
          </button>
        </div>
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.2s">
      <div class="flex items-center gap-2 mb-4">
        <MessageSquareHeart class="text-apricot-500" :size="22" />
        <h2 class="text-display text-xl text-brown-900">{{ t('feedback.title') }}</h2>
        <span class="text-xs text-brown-800/60 ml-1">（{{ t('feedback.subtitle') }}）</span>
      </div>
      <div class="grid md:grid-cols-2 gap-5">
        <FeedbackForm />
        <FeedbackQueue />
      </div>
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.225s">
      <div class="card-soft p-5 bg-gradient-to-br from-apricot-50 to-cream-100 border-apricot-200">
        <div class="flex items-start gap-3">
          <div class="text-3xl">💡</div>
          <div>
            <h3 class="text-display text-lg text-brown-900 mb-1">小档案的作用</h3>
            <ul class="text-sm text-brown-800/70 space-y-1.5 leading-relaxed">
              <li>• 首页会自动把含有你过敏源的菜品排到最后或隐藏</li>
              <li>• 口味匹配度高的菜品会优先展示给你</li>
              <li>• 调味步骤会根据你的口味偏好显示建议用量（如"少放盐"、"多加糖"）</li>
              <li>• 所有设置保存在本地，换浏览器或清缓存需要重新设置哦～</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-4">
      好好吃饭，慢慢生活 · 你的小厨房更懂你啦 🧡
    </footer>
  </div>
</template>
