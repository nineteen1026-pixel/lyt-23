<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from 'lucide-vue-next';
import { getDishById } from '@/data/dishes';
import { useCookingStore, type UnlockResult } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { unlocks, type Decoration, type Apron } from '@/data/unlocks';
import type { ChallengeBadge } from '@/data/challenges';
import StepProgress from '@/components/cooking/StepProgress.vue';
import WashStep from '@/components/cooking/WashStep.vue';
import CutStep from '@/components/cooking/CutStep.vue';
import SeasonStep from '@/components/cooking/SeasonStep.vue';
import BakeStep from '@/components/cooking/BakeStep.vue';
import FinishModal from '@/components/FinishModal.vue';
import UnlockModal from '@/components/UnlockModal.vue';
import NoteEditor from '@/components/NoteEditor.vue';
import ChallengeRewardModal from '@/components/challenges/ChallengeRewardModal.vue';

interface UnlockItem {
  type: 'decoration' | 'apron';
  name: string;
  emoji?: string;
  color?: string;
  stripe?: string | null;
}

const route = useRoute();
const router = useRouter();
const store = useCookingStore();
const challengesStore = useChallengesStore();

const dishId = computed(() => route.params.dishId as string);
const dish = computed(() => getDishById(dishId.value));

const currentStep = ref(0);
const stepCompleted = ref([false, false, false, false]);
const showFinishModal = ref(false);
const showUnlockModal = ref(false);
const pendingUnlockItems = ref<UnlockItem[]>([]);
const showNoteEditor = ref(false);
const showChallengeReward = ref(false);
const pendingChallengeBadges = ref<ChallengeBadge[]>([]);
const afterRewardAction = ref<(() => void) | null>(null);

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

function onStepComplete(stepIndex: number) {
  stepCompleted.value[stepIndex] = true;
  if (stepIndex < 3) {
    setTimeout(() => {
      currentStep.value = stepIndex + 1;
    }, 800);
  } else {
    setTimeout(() => {
      if (dish.value) {
        store.addCookingRecord(dish.value.id);
        const challengeResult = challengesStore.recordCooking(dish.value.id);
        if (challengeResult.newBadges.length > 0) {
          pendingChallengeBadges.value = challengeResult.newBadges;
        }
      }
      showFinishModal.value = true;
    }, 1000);
  }
}

function goPrev() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  } else {
    router.back();
  }
}

function goNext() {
  if (stepCompleted.value[currentStep.value] && currentStep.value < 3) {
    currentStep.value += 1;
  }
}

function handleCheckIn() {
  if (store.isCheckedInToday) return;
  const result: UnlockResult = store.checkIn();
  const items: UnlockItem[] = [];
  (result.newDecorations as Decoration[]).forEach((d) => {
    items.push({ type: 'decoration', name: d.name, emoji: d.emoji });
  });
  (result.newAprons as Apron[]).forEach((a) => {
    items.push({ type: 'apron', name: a.name, color: a.color, stripe: a.stripe });
  });

  showFinishModal.value = false;
  if (items.length > 0) {
    pendingUnlockItems.value = items;
    setTimeout(() => {
      showUnlockModal.value = true;
    }, 300);
  } else if (pendingChallengeBadges.value.length > 0) {
    setTimeout(() => {
      showChallengeReward.value = true;
    }, 300);
  }
}

function handleBackHome() {
  showFinishModal.value = false;
  showUnlockModal.value = false;
  if (pendingChallengeBadges.value.length > 0 && !showChallengeReward.value) {
    afterRewardAction.value = () => router.push('/');
    showChallengeReward.value = true;
    return;
  }
  showChallengeReward.value = false;
  pendingChallengeBadges.value = [];
  afterRewardAction.value = null;
  router.push('/');
}

function handleCookMore() {
  showFinishModal.value = false;
  showUnlockModal.value = false;
  if (pendingChallengeBadges.value.length > 0 && !showChallengeReward.value) {
    afterRewardAction.value = () => router.push('/');
    showChallengeReward.value = true;
    return;
  }
  showChallengeReward.value = false;
  pendingChallengeBadges.value = [];
  afterRewardAction.value = null;
  router.push('/');
}

function handleCloseChallengeReward() {
  showChallengeReward.value = false;
  const action = afterRewardAction.value;
  pendingChallengeBadges.value = [];
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
  <div v-if="dish" class="container max-w-3xl mx-auto px-4 pt-6">
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
            <div class="text-display text-brown-900 leading-tight">{{ dish.name }}</div>
            <div class="text-[11px] text-brown-800/60">预计 {{ dish.time }} 分钟</div>
          </div>
        </div>
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

    <div class="mb-8 animate-fade-slide" style="animation-delay: 0.05s">
      <StepProgress :current-step="currentStep" />
    </div>

    <div class="animate-fade-slide" style="animation-delay: 0.1s">
      <Transition name="step" mode="out-in">
        <WashStep
          v-if="currentStep === 0"
          :key="'wash'"
          :dish-emoji="dish.emoji"
          :dish-name="dish.name"
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
          :seasonings="dish.seasonings"
          :dish-emoji="dish.emoji"
          @complete="onStepComplete(2)"
        />
        <BakeStep
          v-else
          :key="'bake'"
          :dish-emoji="dish.emoji"
          :dish-color="dish.color"
          :time="dish.time"
          @complete="onStepComplete(3)"
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
        v-if="currentStep < 3"
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
        :disabled="!stepCompleted[3] && !showFinishModal"
        @click="showFinishModal = true"
      >
        <Home :size="18" />
        <span>完成烹饪</span>
      </button>
    </div>

    <Transition name="fade">
      <FinishModal
        v-if="showFinishModal"
        :dish-emoji="dish.emoji"
        :dish-name="dish.name"
        :is-checked-in-today="store.isCheckedInToday"
        @check-in="handleCheckIn"
        @back-home="handleBackHome"
        @cook-more="handleCookMore"
        @write-note="handleWriteNote"
      />
    </Transition>

    <Transition name="fade">
      <UnlockModal
        v-if="showUnlockModal"
        :new-items="pendingUnlockItems"
        @close="handleBackHome"
      />
    </Transition>

    <Transition name="fade">
      <NoteEditor
        v-if="showNoteEditor && dish"
        :visible="showNoteEditor"
        :dish-id="dish.id"
        :dish-name="dish.name"
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
  </div>
</template>
