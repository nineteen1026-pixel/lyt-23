<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Home, Leaf, AlertCircle, Volume2, VolumeX, Timer } from 'lucide-vue-next';
import { getDishById } from '@/data/dishes';
import { useCookingStore, type UnlockResult } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { useSettingsStore } from '@/stores/settings';
import { useTimerStore } from '@/stores/timer';
import { unlocks, type Decoration, type Apron } from '@/data/unlocks';
import type { ChallengeBadge } from '@/data/challenges';
import {
  isDishAvailableThisMonth,
  getSeasonalDishInfo,
  MONTH_NAMES,
  getCurrentMonth,
} from '@/data/seasonal';
import { useSpeech } from '@/composables/useSpeech';
import { useLiveRegion } from '@/composables/useAccessibility';
import StepProgress from '@/components/cooking/StepProgress.vue';
import WashStep from '@/components/cooking/WashStep.vue';
import CutStep from '@/components/cooking/CutStep.vue';
import SeasonStep from '@/components/cooking/SeasonStep.vue';
import BakeStep from '@/components/cooking/BakeStep.vue';
import SeasonPlate from '@/components/cooking/SeasonPlate.vue';
import FinishModal from '@/components/FinishModal.vue';
import UnlockModal from '@/components/UnlockModal.vue';
import NoteEditor from '@/components/NoteEditor.vue';
import ChallengeRewardModal from '@/components/challenges/ChallengeRewardModal.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { useDishI18n } from '@/composables/useDishI18n';
import TutorialSidebar from '@/components/cooking/TutorialSidebar.vue';

interface UnlockItem {
  type: 'decoration' | 'apron' | 'background' | 'counter';
  name: string;
  emoji?: string;
  color?: string;
  stripe?: string | null;
}

const route = useRoute();
const router = useRouter();
const store = useCookingStore();
const challengesStore = useChallengesStore();
const settingsStore = useSettingsStore();
const onboardingStore = useOnboardingStore();
const timerStore = useTimerStore();
const { speak, stop, speakStep, isSpeaking, canSpeak } = useSpeech();
const { getLocalizedDishById } = useDishI18n();
const { announce } = useLiveRegion();

const dishId = computed(() => route.params.dishId as string);
const dish = computed(() => getDishById(dishId.value));
const localizedDish = computed(() => dish.value ? getLocalizedDishById(dish.value.id) : undefined);
const isSeasonalDish = computed(() => dish.value?.isSeasonal ?? false);
const isDishAvailable = computed(() => {
  if (!dish.value) return false;
  if (!dish.value.isSeasonal) return true;
  return isDishAvailableThisMonth(dish.value.id);
});
const seasonalInfo = computed(() => dish.value ? getSeasonalDishInfo(dish.value.id) : null);
const currentMonthName = computed(() => MONTH_NAMES[getCurrentMonth()]);
const dishAvailableMonths = computed(() => {
  if (!seasonalInfo.value) return [];
  return seasonalInfo.value.months.map((m) => MONTH_NAMES[m]);
});
const isLockedByThreshold = computed(() => {
  if (!seasonalInfo.value?.unlockThreshold) return false;
  return store.totalDays < seasonalInfo.value.unlockThreshold;
});

const currentStep = ref(0);
const stepCompleted = ref([false, false, false, false, false]);
const showFinishModal = ref(false);
const showUnlockModal = ref(false);
const pendingUnlockItems = ref<UnlockItem[]>([]);
const showNoteEditor = ref(false);
const showChallengeReward = ref(false);
const pendingChallengeBadges = ref<ChallengeBadge[]>([]);
const afterRewardAction = ref<(() => void) | null>(null);
const returnToFinishModal = ref(false);
const makeupSuccess = ref(false);
const cookingStartTime = ref<number | null>(null);
const finishDuration = ref(0);
const finishShareText = ref('');
const cookingFinished = ref(false);
const plateDecorations = ref<string[]>([]);

const hasLinkedBakeTimer = computed(() => {
  if (!dish.value) return false;
  return !!timerStore.findLinkedTimer(dish.value.id, 'bake');
});

function linkBakeTimerToGlobal(): void {
  if (!dish.value) return;
  timerStore.addDishBakeTimer(
    dish.value.id,
    dish.value.name,
    dish.value.emoji,
    dish.value.color,
    dish.value.time,
  );
}

const activeApronData = computed(() =>
  unlocks.aprons.find((a) => a.id === store.activeApron) ?? unlocks.aprons[0],
);

function getApronBackground(color: string, stripe: string | null): string {
  switch (stripe) {
    case 'gingham':
      return `repeating-linear-gradient(45deg, ${color}, ${color} 6px, #FFF8F0 6px, #FFF8F0 12px)`;
    case 'stripe':
      return `repeating-linear-gradient(90deg, ${color}, ${color} 8px, #FFF8F0 8px, #FFF8F0 16px)`;
    case 'denim':
      return `linear-gradient(135deg, ${color}, #5A7A96)`;
    case 'cherry':
      return `radial-gradient(circle at 20% 30%, ${color} 4px, transparent 5px), radial-gradient(circle at 70% 60%, ${color} 4px, transparent 5px), #FFF8F0`;
    case 'rainbow':
      return 'linear-gradient(135deg, #FF6B6B, #FFA07A, #FFD93D, #A7C957, #6BCB77, #4D96FF, #9B59B6)';
    default:
      return color;
  }
}

watch(
  dish,
  (val) => {
    if (!val) {
      router.replace('/');
    }
  },
  { immediate: true },
);

watch(
  currentStep,
  (step) => {
    if (dish.value && isDishAvailable.value && !isLockedByThreshold.value) {
      speakStep(step, dish.value.name);
    }
  },
  { immediate: true },
);

function toggleSpeechGuide() {
  settingsStore.toggleSpeech();
  if (!settingsStore.speechEnabled) {
    stop();
  }
}

function replayStepSpeech() {
  if (dish.value) {
    speakStep(currentStep.value, dish.value.name);
  }
}

onMounted(() => {
  cookingStartTime.value = Date.now();
  plateDecorations.value = [];
  if (!onboardingStore.isCompleted && dish.value && isDishAvailable.value && !isLockedByThreshold.value) {
    setTimeout(() => {
      onboardingStore.startFlow('cooking');
    }, 500);
  }
  window.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});

function onStepComplete(stepIndex: number, decorations?: string[]) {
  stepCompleted.value[stepIndex] = true;
  if (stepIndex === 4 && decorations) {
    plateDecorations.value = decorations;
  }
  if (stepIndex < 4) {
    setTimeout(() => {
      currentStep.value = stepIndex + 1;
    }, 800);
  } else {
    setTimeout(() => {
      finishCooking();
    }, 1000);
  }
}

function finishCooking() {
  if (cookingFinished.value || !dish.value) return;
  cookingFinished.value = true;

  const durationSec = cookingStartTime.value
    ? Math.round((Date.now() - cookingStartTime.value) / 1000)
    : 0;
  finishDuration.value = durationSec;
  const dishName = localizedDish.value?.name || dish.value.name;
  const shareText = `${dish.value.emoji} 今天做了一道「${dishName}」！用时 ${formatCookingDuration(durationSec)}，快来试试吧～`;
  finishShareText.value = shareText;
  store.addCookingRecord(dish.value.id, {
    durationSeconds: durationSec,
    shareText,
  });
  const challengeResult = challengesStore.recordCooking(dish.value.id);
  if (challengeResult.newBadges.length > 0) {
    pendingChallengeBadges.value = challengeResult.newBadges;
  }
  showFinishModal.value = true;
}

function goPrev() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
    announce(`切换到步骤 ${currentStep.value + 1}：${stepNames.value[currentStep.value]}`);
  } else {
    router.back();
  }
}

const stepNames = computed(() => [
  '清洗',
  '切菜',
  '调味',
  '烘烤',
  '摆盘',
]);

function formatCookingDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} 分 ${s} 秒` : `${m} 分钟`;
}

function goNext() {
  if (stepCompleted.value[currentStep.value] && currentStep.value < 4) {
    currentStep.value += 1;
    announce(`切换到步骤 ${currentStep.value + 1}：${stepNames.value[currentStep.value]}`);
  }
}

function handleGlobalKeyDown(event: KeyboardEvent) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? event.metaKey : event.ctrlKey;
  if (modKey) return;

  const target = event.target as HTMLElement;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      goPrev();
      break;
    case 'ArrowRight':
      event.preventDefault();
      goNext();
      break;
    case 'Home':
      event.preventDefault();
      if (currentStep.value !== 0) {
        currentStep.value = 0;
        announce(`切换到步骤 1：${stepNames.value[0]}`);
      }
      break;
    case 'End':
      event.preventDefault();
      if (currentStep.value !== 4) {
        currentStep.value = 4;
        announce(`切换到步骤 5：${stepNames.value[4]}`);
      }
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      event.preventDefault();
      const stepIndex = parseInt(event.key) - 1;
      if (stepIndex !== currentStep.value) {
        currentStep.value = stepIndex;
        announce(`切换到步骤 ${event.key}：${stepNames.value[stepIndex]}`);
      }
      break;
  }
}

function buildUnlockItems(result: UnlockResult): UnlockItem[] {
  const items: UnlockItem[] = [];
  (result.newDecorations as Decoration[]).forEach((d) => {
    items.push({ type: 'decoration', name: d.name, emoji: d.emoji });
  });
  (result.newAprons as Apron[]).forEach((a) => {
    items.push({ type: 'apron', name: a.name, color: a.color, stripe: a.stripe });
  });
  if (result.newBackgrounds) {
    result.newBackgrounds.forEach((b) => {
      items.push({ type: 'background', name: b.name, emoji: b.emoji });
    });
  }
  if (result.newCounters) {
    result.newCounters.forEach((c) => {
      items.push({ type: 'counter', name: c.name, emoji: c.emoji });
    });
  }
  return items;
}

function processCheckInResult(result: UnlockResult, hasMoreActions: boolean, wasMakeup: boolean = false) {
  const items = buildUnlockItems(result);
  const hasSomethingToShow = items.length > 0 || pendingChallengeBadges.value.length > 0;
  const shouldStayOnModal = hasMoreActions || wasMakeup;

  if (hasSomethingToShow) {
    returnToFinishModal.value = shouldStayOnModal;
    showFinishModal.value = false;
    if (items.length > 0) {
      pendingUnlockItems.value = items;
      setTimeout(() => {
        showUnlockModal.value = true;
      }, 300);
    } else {
      setTimeout(() => {
        showChallengeReward.value = true;
      }, 300);
    }
  } else if (!shouldStayOnModal) {
    showFinishModal.value = false;
  }
}

function handleCheckIn() {
  if (store.isCheckedInToday) return;
  const result: UnlockResult = store.checkIn();
  const hasMoreActions = store.canMakeupCheckInYesterday;
  processCheckInResult(result, hasMoreActions);
}

function handleMakeupCheckIn() {
  if (!store.canMakeupCheckInYesterday) return;
  const result: UnlockResult = store.makeupCheckInYesterday();
  makeupSuccess.value = true;
  const hasMoreActions = !store.isCheckedInToday;
  processCheckInResult(result, hasMoreActions, true);
}

function resetModalState() {
  showFinishModal.value = false;
  showUnlockModal.value = false;
  showChallengeReward.value = false;
  pendingChallengeBadges.value = [];
  afterRewardAction.value = null;
  returnToFinishModal.value = false;
  makeupSuccess.value = false;
}

function handleBackHome() {
  if (pendingChallengeBadges.value.length > 0 && !showChallengeReward.value) {
    afterRewardAction.value = () => router.push('/');
    showFinishModal.value = false;
    showChallengeReward.value = true;
    return;
  }
  resetModalState();
  router.push('/');
}

function handleCookMore() {
  if (pendingChallengeBadges.value.length > 0 && !showChallengeReward.value) {
    afterRewardAction.value = () => router.push('/');
    showFinishModal.value = false;
    showChallengeReward.value = true;
    return;
  }
  resetModalState();
  router.push('/');
}

function handleUnlockModalClose() {
  showUnlockModal.value = false;
  if (pendingChallengeBadges.value.length > 0 && !showChallengeReward.value) {
    showChallengeReward.value = true;
    return;
  }
  if (returnToFinishModal.value) {
    returnToFinishModal.value = false;
    showFinishModal.value = true;
    return;
  }
  router.push('/');
}

function handleCloseChallengeReward() {
  showChallengeReward.value = false;
  pendingChallengeBadges.value = [];
  if (returnToFinishModal.value) {
    returnToFinishModal.value = false;
    showFinishModal.value = true;
    return;
  }
  const action = afterRewardAction.value;
  afterRewardAction.value = null;
  if (action) {
    action();
  }
}

function handleWriteNote() {
  showFinishModal.value = false;
  showNoteEditor.value = true;
}

function handleSaveNote(data: { content: string; rating: 1 | 2 | 3 | 4 | 5 }) {
  if (!dish.value) return;
  store.addNote({
    dishId: dish.value.id,
    dishName: dish.value.name,
    dishEmoji: dish.value.emoji,
    content: data.content,
    rating: data.rating,
  });
  showNoteEditor.value = false;
}
</script>

<template>
  <div v-if="dish" class="container max-w-7xl mx-auto px-4 pt-6">
    <a href="#main-content" class="skip-link">跳转到主要内容</a>

    <template v-if="!isDishAvailable">
      <div class="flex flex-col items-center justify-center py-16 animate-fade-slide text-center">
        <div class="relative mb-6">
          <div
            class="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl grayscale opacity-60"
            :style="{ background: `linear-gradient(135deg, ${dish.color}22, ${dish.color}08)` }"
          >
            {{ dish.emoji }}
          </div>
          <div class="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-brown-900/80 flex items-center justify-center">
            <Leaf :size="22" class="text-white" />
          </div>
        </div>
        <h2 class="text-display text-3xl text-brown-900 mb-2">这道时令菜过季啦</h2>
        <p class="text-sm text-brown-800/70 max-w-sm mb-6 leading-relaxed">
          「{{ localizedDish?.name || dish.name }}」是
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
            {{ seasonalInfo?.limitedLabel ?? '季节限定' }}
          </span>
          菜品，现在是 {{ currentMonthName }}，暂时无法烹饪～
        </p>
        <div class="card-soft p-4 mb-8 w-full max-w-sm">
          <div class="flex items-center gap-2 mb-2 text-xs text-brown-800/60">
            <AlertCircle :size="14" />
            <span>这道菜的上架时间</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="month in dishAvailableMonths"
              :key="month"
              class="text-xs px-2.5 py-1 rounded-full bg-cream-100 border border-cream-200 text-brown-800/70"
            >
              {{ month }}
            </span>
          </div>
        </div>
        <button
          class="btn-primary flex items-center gap-2"
          @click="router.push('/')"
        >
          <Home :size="18" />
          <span>回首页看看当季菜品</span>
        </button>
      </div>
    </template>

    <template v-else-if="isLockedByThreshold">
      <div class="flex flex-col items-center justify-center py-16 animate-fade-slide text-center">
        <div class="relative mb-6">
          <div
            class="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl grayscale opacity-60"
            :style="{ background: `linear-gradient(135deg, ${dish.color}22, ${dish.color}08)` }"
          >
            {{ dish.emoji }}
          </div>
          <div class="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <Home :size="22" class="text-white" />
          </div>
        </div>
        <h2 class="text-display text-3xl text-brown-900 mb-2">再打卡几天就能解锁啦</h2>
        <p class="text-sm text-brown-800/70 max-w-sm mb-6 leading-relaxed">
          「{{ localizedDish?.name || dish.name }}」是限定菜品，需要累计打卡
          <span class="font-medium text-apricot-600">{{ seasonalInfo?.unlockThreshold }}</span>
          天才能烹饪，继续加油～
        </p>
        <div class="card-soft p-4 mb-8 w-full max-w-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-brown-800/60">累计打卡进度</span>
            <span class="text-xs font-medium text-brown-900">
              {{ store.totalDays }} / {{ seasonalInfo?.unlockThreshold }} 天
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-apricot-400 via-apricot-500 to-apricot-600 transition-all duration-500"
              :style="{ width: `${Math.min((store.totalDays / (seasonalInfo?.unlockThreshold ?? 1)) * 100, 100)}%` }"
            />
          </div>
          <div class="text-[11px] text-brown-800/50 mt-2">
            还需 {{ (seasonalInfo?.unlockThreshold ?? 0) - store.totalDays }} 天解锁
          </div>
        </div>
        <button
          class="btn-primary flex items-center gap-2"
          @click="router.push('/')"
        >
          <ArrowLeft :size="18" />
          <span>回首页选其他菜品</span>
        </button>
      </div>
    </template>

    <template v-else>
      <header class="flex items-center justify-between mb-6 animate-fade-slide">
        <button
          class="flex items-center gap-2 card-soft px-4 py-2.5 hover:shadow-soft transition-all active:scale-95"
          @click="goPrev"
        >
          <ArrowLeft :size="18" class="text-brown-800/70" />
          <span class="text-sm text-brown-800/80 font-medium">
            {{ currentStep === 0 ? '回首页' : '上一步' }}
          </span>
        </button>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 card-soft px-4 py-2">
            <span class="text-2xl animate-float">{{ dish.emoji }}</span>
            <div>
              <div class="flex items-center gap-1.5">
                <div class="text-display text-brown-900 leading-tight">{{ localizedDish?.name || dish.name }}</div>
                <span
                  v-if="isSeasonalDish && seasonalInfo?.limitedLabel"
                  class="chip !py-0.5 !px-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white border border-amber-300"
                >
                  <Leaf :size="10" />
                  <span class="text-[10px]">{{ seasonalInfo.limitedLabel }}</span>
                </span>
              </div>
              <div class="text-[11px] text-brown-800/60">预计 {{ dish.time }} 分钟</div>
            </div>
          </div>
          <button
            class="w-10 h-10 rounded-full card-soft flex items-center justify-center hover:shadow-soft transition-all active:scale-95"
            :class="{ 'bg-apricot-100': settingsStore.speechEnabled }"
            :title="settingsStore.speechEnabled ? '关闭语音引导' : '开启语音引导'"
            @click="toggleSpeechGuide"
          >
            <Volume2 v-if="settingsStore.speechEnabled" :size="18" class="text-apricot-600" />
            <VolumeX v-else :size="18" class="text-brown-800/40" />
          </button>
          <button
            v-if="settingsStore.speechEnabled"
            class="w-10 h-10 rounded-full card-soft flex items-center justify-center hover:shadow-soft transition-all active:scale-95"
            :class="{ 'animate-pulse': isSpeaking }"
            title="重播当前步骤"
            @click="replayStepSpeech"
          >
            <svg
              :size="18"
              class="w-[18px] h-[18px] text-brown-800/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            class="w-10 h-10 rounded-full card-soft flex items-center justify-center hover:shadow-soft transition-all active:scale-95 relative"
            :class="{ 'bg-apricot-100': timerStore.hasRunningTimers }"
            title="厨房计时器"
            @click="router.push('/timer')"
          >
            <Timer :size="18" :class="timerStore.hasRunningTimers ? 'text-apricot-600' : 'text-brown-800/40'" />
            <span
              v-if="timerStore.activeTimerCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-apricot-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ timerStore.activeTimerCount }}
            </span>
          </button>
          <div
            class="w-10 h-10 rounded-full border-2 border-cream-300 flex items-end justify-center overflow-hidden shrink-0"
            title="当前围裙"
          >
            <div
              class="w-[80%] h-[65%] rounded-t-lg"
              :style="{ background: getApronBackground(activeApronData.color, activeApronData.stripe) }"
            />
          </div>
        </div>
      </header>

      <div id="main-content" class="flex flex-col-reverse lg:flex-row lg:items-start gap-6">
        <div class="flex-1 max-w-3xl mx-auto w-full lg:mx-0">
          <div
            class="mb-8"
            :class="{ 'animate-fade-slide': !settingsStore.reducedMotion }"
            :style="{ animationDelay: '0.05s' }"
            data-onboarding="step-progress"
          >
            <StepProgress :current-step="currentStep" />
          </div>

          <div
            :class="{ 'animate-fade-slide': !settingsStore.reducedMotion }"
            :style="{ animationDelay: '0.1s' }"
          >
            <Transition name="step" mode="out-in">
              <WashStep
                v-if="currentStep === 0"
                :key="'wash'"
                :dish-emoji="dish.emoji"
                :dish-name="localizedDish?.name || dish.name"
                @complete="onStepComplete(0)"
              />
              <CutStep
                v-else-if="currentStep === 1"
                :key="'cut'"
                :dish-emoji="dish.emoji"
                @complete="onStepComplete(1)"
              />
              <SeasonStep
                v-else-if="currentStep === 2"
                :key="'season'"
                :seasonings="localizedDish?.seasonings || dish.seasonings"
                :dish-emoji="dish.emoji"
                @complete="onStepComplete(2)"
              />
              <BakeStep
                v-else-if="currentStep === 3"
                :key="'bake'"
                :dish-emoji="dish.emoji"
                :dish-color="dish.color"
                :time="dish.time"
                :has-linked-timer="hasLinkedBakeTimer"
                :linked-dish-id="dishId"
                @complete="onStepComplete(3)"
                @link-timer="linkBakeTimerToGlobal"
              />
              <SeasonPlate
                v-else
                :key="'plate'"
                :dish-emoji="dish.emoji"
                :dish-color="dish.color"
                :dish-name="localizedDish?.name || dish.name"
                @complete="(decorations: string[]) => onStepComplete(4, decorations)"
              />
            </Transition>
          </div>

          <div class="flex justify-between mt-6">
            <button
              v-if="currentStep > 0"
              class="btn-secondary flex items-center gap-2"
              :disabled="!stepCompleted[currentStep - 1]"
              @click="goPrev"
            >
              <ChevronLeft :size="18" />
              <span>上一步</span>
            </button>
            <div v-else />
            <button
              v-if="currentStep < 4"
              class="btn-primary flex items-center gap-2"
              :disabled="!stepCompleted[currentStep]"
              @click="goNext"
            >
              <span>下一步</span>
              <ChevronRight :size="18" />
            </button>
            <button
              v-else
              class="btn-primary flex items-center gap-2 !bg-matcha-500 hover:!bg-matcha-600"
              :disabled="cookingFinished || !stepCompleted[4]"
              data-onboarding="finish-btn"
              @click="finishCooking"
            >
              <Home :size="18" />
              <span>完成烹饪</span>
            </button>
          </div>
        </div>

        <TutorialSidebar
          class="animate-fade-slide"
          style="animation-delay: 0.15s"
          :dish-id="dishId"
          :current-step="currentStep"
          :dish-color="dish.color"
        />
      </div>

      <Transition name="fade">
        <FinishModal
          v-if="showFinishModal && dish"
          :dish-emoji="dish.emoji"
          :dish-name="localizedDish?.name || dish.name"
          :is-checked-in-today="store.isCheckedInToday"
          :can-makeup-check-in-yesterday="store.canMakeupCheckInYesterday"
          :protection-count="store.protectionCount"
          :makeup-check-in-success="makeupSuccess"
          :duration-seconds="finishDuration"
          :share-text="finishShareText"
          :plate-decorations="plateDecorations"
          :dish="dish"
          @check-in="handleCheckIn"
          @makeup-check-in="handleMakeupCheckIn"
          @back-home="handleBackHome"
          @cook-more="handleCookMore"
          @write-note="handleWriteNote"
        />
      </Transition>

      <Transition name="fade">
        <UnlockModal
          v-if="showUnlockModal"
          :new-items="pendingUnlockItems"
          @close="handleUnlockModalClose"
        />
      </Transition>

      <Transition name="fade">
        <NoteEditor
          v-if="showNoteEditor && dish"
          :visible="showNoteEditor"
          :dish-id="dish.id"
          :dish-name="localizedDish?.name || dish.name"
          :dish-emoji="dish.emoji"
          @close="showNoteEditor = false"
          @save="handleSaveNote"
        />
      </Transition>

      <Transition name="fade">
        <ChallengeRewardModal
          v-if="showChallengeReward && pendingChallengeBadges.length > 0"
          :badges="pendingChallengeBadges"
          @close="handleCloseChallengeReward"
        />
      </Transition>
    </template>
  </div>
</template>
