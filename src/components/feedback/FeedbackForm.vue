<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star, Send, MessageSquareHeart } from 'lucide-vue-next';
import {
  useFeedbackStore,
  FEEDBACK_CATEGORIES,
  type FeedbackRating,
} from '@/stores/feedback';
import { useToastStore } from '@/stores/toast';

const emit = defineEmits<{
  submitted: [];
}>();

const feedbackStore = useFeedbackStore();
const toastStore = useToastStore();

const rating = ref<FeedbackRating | null>(null);
const hoverRating = ref<FeedbackRating | null>(null);
const category = ref<string>('experience');
const content = ref('');

const MAX_CONTENT_LENGTH = 500;
const contentLength = computed(() => content.value.length);
const canSubmit = computed(() => rating.value !== null && content.value.trim().length > 0);

const displayRating = computed(() => hoverRating.value ?? rating.value);

const ratingLabels: Record<FeedbackRating, string> = {
  1: '很不满意 😞',
  2: '不太满意 😕',
  3: '一般般 🙂',
  4: '比较满意 😊',
  5: '非常满意 🥰',
};

function setRating(value: FeedbackRating) {
  rating.value = value;
}

function setHover(value: FeedbackRating | null) {
  hoverRating.value = value;
}

function handleSubmit() {
  if (!canSubmit.value || rating.value === null) return;

  feedbackStore.addFeedback({
    rating: rating.value,
    content: content.value,
    category: category.value,
  });

  toastStore.success('感谢您的反馈！已保存到本地队列', '💌');

  rating.value = null;
  content.value = '';
  category.value = 'experience';

  emit('submitted');
}
</script>

<template>
  <div class="card-soft p-5">
    <div class="flex items-center gap-2 mb-5">
      <MessageSquareHeart class="text-apricot-500" :size="22" />
      <h3 class="text-display text-lg text-brown-900">提交反馈</h3>
    </div>

    <div class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-brown-900 mb-3">
          体验评分
          <span class="text-rose-500">*</span>
        </label>
        <div class="flex flex-col items-center gap-2 py-3 bg-cream-50 rounded-2xl">
          <div class="flex items-center gap-2">
            <button
              v-for="star in 5"
              :key="star"
              class="p-1 transition-all duration-200 active:scale-90"
              :class="{
                'scale-110': displayRating === star,
              }"
              @click="setRating(star as FeedbackRating)"
              @mouseenter="setHover(star as FeedbackRating)"
              @mouseleave="setHover(null)"
            >
              <Star
                :size="36"
                :class="{
                  'text-yellow-400 fill-yellow-400': displayRating !== null && star <= displayRating,
                  'text-cream-300': displayRating === null || star > displayRating,
                }"
              />
            </button>
          </div>
          <div
            v-if="displayRating"
            class="text-sm text-brown-800/70 h-5"
          >
            {{ ratingLabels[displayRating] }}
          </div>
          <div v-else class="text-xs text-brown-800/50 h-5">
            点击星星为体验打分
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-brown-900 mb-3">
          反馈分类
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            v-for="cat in FEEDBACK_CATEGORIES"
            :key="cat.value"
            class="py-2.5 px-2 rounded-xl text-sm transition-all duration-300 border-2 active:scale-95"
            :class="{
              'bg-apricot-100 border-apricot-400 text-apricot-700 shadow-sm':
                category === cat.value,
              'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400':
                category !== cat.value,
            }"
            @click="category = cat.value"
          >
            <div class="text-lg mb-0.5">{{ cat.emoji }}</div>
            <div class="text-xs">{{ cat.label }}</div>
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-brown-900">
            详细建议
            <span class="text-rose-500">*</span>
          </label>
          <span
            class="text-xs"
            :class="contentLength > MAX_CONTENT_LENGTH ? 'text-rose-500' : 'text-brown-800/50'"
          >
            {{ contentLength }}/{{ MAX_CONTENT_LENGTH }}
          </span>
        </div>
        <textarea
          v-model="content"
          :maxlength="MAX_CONTENT_LENGTH"
          rows="4"
          placeholder="说说您的想法和建议，帮助我们做得更好～"
          class="w-full px-4 py-3 rounded-2xl border-2 border-cream-300 bg-white text-sm text-brown-900 placeholder:text-brown-800/40 focus:border-apricot-400 focus:outline-none focus:ring-2 focus:ring-apricot-200 resize-none transition-all"
        />
      </div>

      <button
        :disabled="!canSubmit"
        class="w-full py-3 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
        :class="{
          'bg-gradient-to-r from-apricot-500 to-apricot-400 text-white shadow-md hover:shadow-lg hover:from-apricot-600 hover:to-apricot-500':
            canSubmit,
          'bg-cream-200 text-brown-800/40 cursor-not-allowed': !canSubmit,
        }"
        @click="handleSubmit"
      >
        <Send :size="16" />
        提交反馈
      </button>
    </div>
  </div>
</template>
