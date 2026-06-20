<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { X, Copy, Download, Share2, RefreshCw, Check, Loader2 } from 'lucide-vue-next';
import html2canvas from 'html2canvas-pro';
import ShareCardPreview from './ShareCardPreview.vue';
import {
  buildShareCardData,
  CARD_THEMES,
  generateShareText,
  type ShareCardData,
  type CardThemeId,
} from '@/data/share';
import { useCookingStore } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { challenges, type ChallengeBadge } from '@/data/challenges';

const props = defineProps<{
  userName?: string;
  avatarEmoji?: string;
  challengeId?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'share', data: ShareCardData): void;
}>();

const cookingStore = useCookingStore();
const challengesStore = useChallengesStore();

const selectedTheme = ref<CardThemeId>('warm');
const shareText = ref('');
const copied = ref(false);
const saving = ref(false);
const activeTab = ref<'card' | 'invite'>('card');
const cardPreviewRef = ref<InstanceType<typeof ShareCardPreview> | null>(null);
const cardElRef = ref<HTMLElement | null>(null);

const displayName = computed(() => props.userName || '小厨师');
const displayAvatar = computed(() => props.avatarEmoji || '👨‍🍳');

const unlockedBadges = computed<ChallengeBadge[]>(() => {
  return challenges
    .filter((c) => challengesStore.isBadgeUnlocked(c.badge.id))
    .map((c) => c.badge);
});

const challengeSummary = computed(() => {
  if (!props.challengeId) return undefined;
  const progress = challengesStore.getProgress(props.challengeId);
  const challenge = challenges.find((c) => c.id === props.challengeId);
  if (!challenge || !progress) return undefined;

  const progressCount = challenge.targetDishIds.length > 0
    ? new Set(progress.completedDishes.filter((d) => challenge.targetDishIds.includes(d))).size
    : progress.completedDishes.length;

  const progressPercent = Math.min((progressCount / challenge.targetCount) * 100, 100);

  const startDate = new Date(progress.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + challenge.cycleDays);
  const today = new Date();
  const remainingDays = Math.max(
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    0,
  );

  return {
    id: challenge.id,
    title: challenge.title,
    badge: challenge.badge,
    progressCount,
    targetCount: challenge.targetCount,
    progressPercent,
    remainingDays,
    isCompleted: progress.completedAt !== null,
  };
});

const shareCardData = computed<ShareCardData>(() => {
  return buildShareCardData(
    displayName.value,
    displayAvatar.value,
    cookingStore.cookingHistory,
    cookingStore.totalDays,
    cookingStore.streakDays,
    unlockedBadges.value,
    selectedTheme.value,
    challengeSummary.value,
  );
});

watch(
  () => shareCardData.value.shareText,
  (text) => {
    shareText.value = text;
  },
  { immediate: true },
);

function refreshShareText() {
  shareText.value = generateShareText(
    cookingStore.totalDays,
    cookingStore.streakDays,
    cookingStore.cookingHistory.length,
    challengeSummary.value?.title,
  );
}

async function copyShareText() {
  try {
    await navigator.clipboard.writeText(shareText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

async function copyInviteCode() {
  const code = `COZY${cookingStore.totalDays.toString().padStart(4, '0')}`;
  try {
    await navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

async function saveCardAsImage() {
  if (!cardElRef.value || saving.value) return;

  saving.value = true;
  try {
    const canvas = await html2canvas(cardElRef.value, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `我的小厨房_打卡${cookingStore.totalDays}天_${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    emit('share', shareCardData.value);
  } catch (err) {
    console.error('保存卡片失败:', err);
  } finally {
    saving.value = false;
  }
}

async function handleShare() {
  if (saving.value) return;

  if (navigator.share && navigator.canShare) {
    try {
      saving.value = true;
      if (!cardElRef.value) throw new Error('no card element');

      const canvas = await html2canvas(cardElRef.value, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!blob) throw new Error('canvas toBlob failed');

      const file = new File([blob], '我的小厨房_打卡卡片.png', { type: 'image/png' });
      const shareData = {
        title: '我的小厨房打卡分享',
        text: shareText.value,
        files: [file],
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        emit('share', shareCardData.value);
        saving.value = false;
        return;
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        saving.value = false;
        return;
      }
    } finally {
      saving.value = false;
    }
  }

  await saveCardAsImage();
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
      @click="handleClose"
    />

    <div class="relative w-full max-w-lg animate-pop-in max-h-[90vh] overflow-hidden flex flex-col">
      <div class="card-soft overflow-hidden flex flex-col max-h-full">
        <div class="flex items-center justify-between p-5 pb-3 border-b border-cream-200">
          <div>
            <h2 class="text-display text-2xl text-brown-900">
              <Share2 class="inline mr-2 text-apricot-500" :size="24" />
              分享打卡
            </h2>
            <p class="text-sm text-brown-800/60 mt-1">生成你的专属烹饪打卡卡片</p>
          </div>
          <button
            class="w-9 h-9 rounded-xl flex items-center justify-center text-brown-800/60 hover:bg-cream-200 transition-colors"
            @click="handleClose"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="flex border-b border-cream-200 px-5">
          <button
            class="px-4 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === 'card' ? 'text-apricot-600' : 'text-brown-800/60 hover:text-brown-800/80'"
            @click="activeTab = 'card'"
          >
            打卡卡片
            <div
              v-if="activeTab === 'card'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-apricot-500 rounded-full"
            />
          </button>
          <button
            class="px-4 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === 'invite' ? 'text-apricot-600' : 'text-brown-800/60 hover:text-brown-800/80'"
            @click="activeTab = 'invite'"
          >
            邀请好友
            <div
              v-if="activeTab === 'invite'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-apricot-500 rounded-full"
            />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5">
          <div v-if="activeTab === 'card'" class="space-y-5">
            <div class="flex justify-center" ref="cardElRef">
              <ShareCardPreview ref="cardPreviewRef" :data="shareCardData" size="normal" />
            </div>

            <div>
              <div class="text-sm font-medium text-brown-900 mb-2">选择主题</div>
              <div class="flex gap-2">
                <button
                  v-for="theme in CARD_THEMES"
                  :key="theme.id"
                  class="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border-2"
                  :class="{
                    'border-apricot-400 bg-apricot-50 text-apricot-700':
                      selectedTheme === theme.id,
                    'border-cream-300 bg-white text-brown-800/70 hover:border-cream-400':
                      selectedTheme !== theme.id,
                  }"
                  @click="selectedTheme = theme.id"
                >
                  <span class="flex items-center justify-center gap-2">
                    <span
                      class="w-4 h-4 rounded-full"
                      :style="{ background: theme.accent }"
                    />
                    {{ theme.name }}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-brown-900">分享文案</span>
                <button
                  class="flex items-center gap-1 text-xs text-brown-800/60 hover:text-brown-800/80 transition-colors"
                  @click="refreshShareText"
                >
                  <RefreshCw :size="14" />
                  换一句
                </button>
              </div>
              <div class="relative">
                <textarea
                  v-model="shareText"
                  class="w-full h-24 p-3 rounded-2xl border-2 border-cream-300 bg-white text-sm text-brown-800/80 resize-none focus:outline-none focus:border-apricot-400 transition-colors"
                  placeholder="输入分享文案..."
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                class="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98]"
                :class="copied
                  ? 'bg-matcha-50 border-matcha-300 text-matcha-700'
                  : 'bg-white border-cream-300 text-brown-800/80 hover:border-cream-400'"
                @click="copyShareText"
              >
                <Check v-if="copied" :size="18" />
                <Copy v-else :size="18" />
                <span class="text-sm font-medium">{{ copied ? '已复制' : '复制文案' }}</span>
              </button>
              <button
                class="flex items-center justify-center gap-2 py-3 rounded-2xl bg-cream-100 border-2 border-cream-300 text-brown-800/80 hover:bg-cream-50 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="saving"
                @click="saveCardAsImage"
              >
                <Loader2 v-if="saving" :size="18" class="animate-spin" />
                <Download v-else :size="18" />
                <span class="text-sm font-medium">{{ saving ? '生成中...' : '保存卡片' }}</span>
              </button>
            </div>
          </div>

          <div v-else class="space-y-5">
            <div class="card-soft p-5 bg-gradient-to-br from-apricot-50 to-cream-100">
              <div class="text-center mb-4">
                <div class="text-5xl mb-3">🎉</div>
                <h3 class="text-display text-xl text-brown-900 mb-1">邀请好友一起做饭</h3>
                <p class="text-sm text-brown-800/70">
                  分享给你的小伙伴，一起打卡养成做饭好习惯
                </p>
              </div>

              <div class="space-y-3">
                <div class="bg-white/70 rounded-2xl p-4 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-matcha-100 flex items-center justify-center text-2xl">
                    👭
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-brown-900">好友一起打卡</div>
                    <div class="text-xs text-brown-800/60 mt-0.5">
                      互相监督，做饭更有动力
                    </div>
                  </div>
                </div>

                <div class="bg-white/70 rounded-2xl p-4 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-apricot-100 flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-brown-900">比拼厨艺进步</div>
                    <div class="text-xs text-brown-800/60 mt-0.5">
                      看看谁解锁的徽章更多
                    </div>
                  </div>
                </div>

                <div class="bg-white/70 rounded-2xl p-4 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">
                    💌
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-brown-900">分享美味食谱</div>
                    <div class="text-xs text-brown-800/60 mt-0.5">
                      把你做的美食分享给好友
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="text-sm font-medium text-brown-900">分享方式</div>
              <div class="grid grid-cols-4 gap-3">
                <button class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-cream-300 hover:border-cream-400 transition-all duration-200 active:scale-[0.95]">
                  <div class="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white text-xl">
                    💬
                  </div>
                  <span class="text-xs text-brown-800/70">微信</span>
                </button>
                <button class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-cream-300 hover:border-cream-400 transition-all duration-200 active:scale-[0.95]">
                  <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white text-xl">
                    📕
                  </div>
                  <span class="text-xs text-brown-800/70">小红书</span>
                </button>
                <button class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-cream-300 hover:border-cream-400 transition-all duration-200 active:scale-[0.95]">
                  <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl">
                    🐧
                  </div>
                  <span class="text-xs text-brown-800/70">QQ</span>
                </button>
                <button
                  class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-cream-300 hover:border-cream-400 transition-all duration-200 active:scale-[0.95]"
                  @click="copyShareText"
                >
                  <div class="w-10 h-10 rounded-xl bg-gray-500 flex items-center justify-center text-white text-xl">
                    <Copy :size="18" />
                  </div>
                  <span class="text-xs text-brown-800/70">复制链接</span>
                </button>
              </div>
            </div>

            <div class="card-soft p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-apricot-100 flex items-center justify-center">
                  <Share2 class="text-apricot-600" :size="18" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-brown-900">专属邀请码</div>
                  <div class="text-xs text-brown-800/60 mt-0.5">
                    好友使用你的邀请码加入，双方都有惊喜奖励
                  </div>
                </div>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <div class="flex-1 h-10 px-3 rounded-xl bg-cream-100 flex items-center justify-center">
                  <span class="text-display text-lg text-apricot-600 tracking-widest">
                    COZY{{ cookingStore.totalDays.toString().padStart(4, '0') }}
                  </span>
                </div>
                <button
                  class="h-10 px-4 rounded-xl bg-apricot-500 text-white text-sm font-medium hover:bg-apricot-600 transition-colors active:scale-[0.95]"
                  @click="copyInviteCode"
                >
                  {{ copied ? '已复制' : '复制' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5 pt-3 border-t border-cream-200">
          <button
            class="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style="background: linear-gradient(135deg, #FFA66D 0%, #FF8C42 50%, #F57C2E 100%); box-shadow: 0 6px 0 rgba(245, 124, 46, 0.4);"
            :disabled="saving"
            @click="handleShare"
          >
            <Loader2 v-if="saving" :size="20" class="animate-spin" />
            <Share2 v-else :size="20" />
            <span>{{ saving ? '生成中...' : '立即分享' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
