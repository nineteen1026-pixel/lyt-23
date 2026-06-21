<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Inbox, Trash2, Star, FileJson, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { useFeedbackStore, FEEDBACK_CATEGORIES } from '@/stores/feedback';
import { useToastStore } from '@/stores/toast';
import { useLocaleStore } from '@/stores/locale';

const { t } = useI18n();
const feedbackStore = useFeedbackStore();
const toastStore = useToastStore();
const localeStore = useLocaleStore();

const expanded = ref(true);
const confirmClear = ref(false);

const averageRatingDisplay = computed(() => {
  const avg = feedbackStore.averageRating;
  if (avg === 0) return '—';
  return avg.toFixed(1);
});

function getCategoryLabel(value?: string) {
  const cat = FEEDBACK_CATEGORIES.find((c) => c.value === value);
  if (cat) {
    return `${cat.emoji} ${t(`feedback.form.categories.${cat.value}` as Parameters<typeof t>[0])}`;
  }
  return t('feedback.queue.uncategorized');
}

function formatDate(timestamp: number) {
  const now = new Date();
  const diff = now.getTime() - timestamp;

  if (diff < 60 * 1000) return t('feedback.queue.timeJustNow');
  if (diff < 60 * 60 * 1000)
    return t('feedback.queue.timeMinutesAgo', { n: Math.floor(diff / (60 * 1000)) });
  if (diff < 24 * 60 * 60 * 1000)
    return t('feedback.queue.timeHoursAgo', { n: Math.floor(diff / (60 * 60 * 1000)) });
  if (diff < 7 * 24 * 60 * 60 * 1000)
    return t('feedback.queue.timeDaysAgo', { n: Math.floor(diff / (24 * 60 * 60 * 1000)) });

  return new Date(timestamp).toLocaleDateString(localeStore.isZh ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function handleRemove(id: string) {
  feedbackStore.removeFeedback(id);
  toastStore.info(t('feedback.queue.deleted'), '🗑️');
}

function handleClearAll() {
  feedbackStore.clearAll();
  confirmClear.value = false;
  toastStore.success(t('feedback.queue.clearSuccess'), '✨');
}

function handleExportJson() {
  feedbackStore.downloadJson();
  toastStore.success(t('feedback.queue.exportSuccessJson'), '📄');
}

function handleExportCsv() {
  feedbackStore.downloadCsv();
  toastStore.success(t('feedback.queue.exportSuccessCsv'), '📊');
}
</script>

<template>
  <div class="card-soft p-5">
    <div class="flex items-center justify-between mb-5">
      <button
        class="flex items-center gap-2 transition-all"
        @click="expanded = !expanded"
      >
        <Inbox class="text-apricot-500" :size="22" />
        <h3 class="text-display text-lg text-brown-900">{{ t('feedback.queue.title') }}</h3>
        <span
          v-if="feedbackStore.count > 0"
          class="px-2 py-0.5 text-xs rounded-full bg-apricot-100 text-apricot-700 font-medium"
        >
          {{ feedbackStore.count }}
        </span>
        <component
          :is="expanded ? ChevronUp : ChevronDown"
          :size="18"
          class="text-brown-800/50 ml-1"
        />
      </button>

      <div v-if="feedbackStore.count > 0" class="flex items-center gap-2">
        <div class="text-sm text-brown-800/60 flex items-center gap-1">
          <Star :size="14" class="text-yellow-400 fill-yellow-400" />
          {{ t('feedback.queue.average') }} {{ averageRatingDisplay }}
        </div>
      </div>
    </div>

    <div v-if="expanded">
      <div
        v-if="feedbackStore.count === 0"
        class="py-10 text-center"
      >
        <div class="text-5xl mb-3">📭</div>
        <div class="text-sm text-brown-800/60">
          {{ t('feedback.queue.empty') }}
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 active:scale-95 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            @click="handleExportJson"
          >
            <FileJson :size="16" />
            {{ t('feedback.queue.exportJson') }}
          </button>
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 active:scale-95 bg-matcha-50 border-matcha-200 text-matcha-700 hover:bg-matcha-100"
            @click="handleExportCsv"
          >
            <FileSpreadsheet :size="16" />
            {{ t('feedback.queue.exportCsv') }}
          </button>

          <div class="flex-1" />

          <div v-if="!confirmClear">
            <button
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 active:scale-95 bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              @click="confirmClear = true"
            >
              <Trash2 :size="16" />
              {{ t('feedback.queue.clearAll') }}
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-brown-800/60">{{ t('feedback.queue.clearConfirm') }}</span>
            <button
              class="px-3 py-2 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all"
              @click="handleClearAll"
            >
              {{ t('feedback.queue.confirm') }}
            </button>
            <button
              class="px-3 py-2 rounded-xl text-xs font-medium bg-cream-200 text-brown-800/70 hover:bg-cream-300 active:scale-95 transition-all"
              @click="confirmClear = false"
            >
              {{ t('feedback.queue.cancel') }}
            </button>
          </div>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
          <div
            v-for="item in feedbackStore.sortedQueue"
            :key="item.id"
            class="p-4 rounded-2xl bg-cream-50 border border-cream-200 hover:bg-cream-100 transition-all group"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <div class="flex items-center gap-0.5">
                    <Star
                      v-for="s in 5"
                      :key="s"
                      :size="14"
                      :class="{
                        'text-yellow-400 fill-yellow-400': s <= item.rating,
                        'text-cream-300': s > item.rating,
                      }"
                    />
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-white border border-cream-200 text-brown-800/60">
                    {{ getCategoryLabel(item.category) }}
                  </span>
                  <span class="text-xs text-brown-800/40">
                    {{ formatDate(item.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-brown-800 leading-relaxed whitespace-pre-wrap break-words">
                  {{ item.content }}
                </p>
              </div>
              <button
                class="w-8 h-8 rounded-full flex items-center justify-center text-brown-800/30 hover:bg-rose-100 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                @click="handleRemove(item.id)"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
