import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { i18n } from '@/i18n';
import type { Locale } from '@/i18n/types';

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export interface FeedbackItem {
  id: string;
  rating: FeedbackRating;
  content: string;
  category?: string;
  createdAt: number;
}

export const FEEDBACK_CATEGORIES: { value: string; label: string; emoji: string }[] = [
  { value: 'experience', label: '整体体验', emoji: '✨' },
  { value: 'dish', label: '菜品建议', emoji: '🍳' },
  { value: 'feature', label: '功能建议', emoji: '💡' },
  { value: 'bug', label: '问题反馈', emoji: '🐛' },
  { value: 'other', label: '其他', emoji: '💬' },
];

const CATEGORY_LABELS_ZH: Record<string, string> = {
  experience: '整体体验',
  dish: '菜品建议',
  feature: '功能建议',
  bug: '问题反馈',
  other: '其他',
};

const CATEGORY_LABELS_EN: Record<string, string> = {
  experience: 'Overall Experience',
  dish: 'Dish Suggestion',
  feature: 'Feature Request',
  bug: 'Bug Report',
  other: 'Other',
};

const RATING_LABELS_ZH: Record<number, string> = {
  1: '很不满意 😞',
  2: '不太满意 😕',
  3: '一般般 🙂',
  4: '比较满意 😊',
  5: '非常满意 🥰',
};

const RATING_LABELS_EN: Record<number, string> = {
  1: 'Very Unsatisfied 😞',
  2: 'Not Great 😕',
  3: 'Just Okay 🙂',
  4: 'Pretty Good 😊',
  5: 'Excellent 🥰',
};

function generateId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getCurrentLocale(): Locale {
  try {
    return (i18n.global.locale as { value: Locale }).value ?? 'zh-CN';
  } catch {
    return 'zh-CN';
  }
}

function getCategoryLabelLocalized(value?: string, locale?: Locale): string {
  const loc = locale ?? getCurrentLocale();
  if (!value) {
    return loc === 'zh-CN' ? '未分类' : 'Uncategorized';
  }
  const map = loc === 'zh-CN' ? CATEGORY_LABELS_ZH : CATEGORY_LABELS_EN;
  return map[value] ?? value;
}

function getRatingLabelLocalized(rating: FeedbackRating, locale?: Locale): string {
  const loc = locale ?? getCurrentLocale();
  const map = loc === 'zh-CN' ? RATING_LABELS_ZH : RATING_LABELS_EN;
  return map[rating] ?? String(rating);
}

function getRatingWithLabel(rating: FeedbackRating, locale?: Locale): string {
  return `${rating} - ${getRatingLabelLocalized(rating, locale)}`;
}

function formatDateLocalized(timestamp: number, locale?: Locale): string {
  const loc = locale ?? getCurrentLocale();
  const localeTag = loc === 'zh-CN' ? 'zh-CN' : 'en-US';
  return new Date(timestamp).toLocaleString(localeTag, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export const useFeedbackStore = defineStore(
  'feedback',
  () => {
    const queue = ref<FeedbackItem[]>([]);

    const count = computed(() => queue.value.length);

    const sortedQueue = computed(() =>
      [...queue.value].sort((a, b) => b.createdAt - a.createdAt),
    );

    const averageRating = computed(() => {
      if (queue.value.length === 0) return 0;
      const sum = queue.value.reduce((acc, item) => acc + item.rating, 0);
      return sum / queue.value.length;
    });

    function addFeedback(data: {
      rating: FeedbackRating;
      content: string;
      category?: string;
    }): FeedbackItem {
      const item: FeedbackItem = {
        id: generateId(),
        rating: data.rating,
        content: data.content.trim(),
        category: data.category,
        createdAt: Date.now(),
      };
      queue.value.push(item);
      return item;
    }

    function removeFeedback(id: string): void {
      const idx = queue.value.findIndex((f) => f.id === id);
      if (idx > -1) {
        queue.value.splice(idx, 1);
      }
    }

    function clearAll(): void {
      queue.value = [];
    }

    function exportToJson(): string {
      const locale = getCurrentLocale();
      const locStr = locale === 'zh-CN' ? 'zh-CN' : 'en-US';

      const data = {
        exportedAt: new Date().toISOString(),
        exportedAtFormatted: formatDateLocalized(Date.now(), locale),
        exportLanguage: locStr,
        totalCount: queue.value.length,
        averageRating: averageRating.value,
        averageRatingDisplay:
          averageRating.value > 0 ? averageRating.value.toFixed(2) : '—',
        feedbacks: sortedQueue.value.map((item) => ({
          id: item.id,
          rating: item.rating,
          ratingLabel: getRatingLabelLocalized(item.rating, locale),
          ratingDisplay: getRatingWithLabel(item.rating, locale),
          categoryKey: item.category ?? null,
          category: getCategoryLabelLocalized(item.category, locale),
          content: item.content,
          createdAt: item.createdAt,
          createdAtFormatted: formatDateLocalized(item.createdAt, locale),
        })),
      };
      return JSON.stringify(data, null, 2);
    }

    function downloadJson(): void {
      if (queue.value.length === 0) return;
      const json = exportToJson();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.href = url;
      a.download = `feedback-export-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function exportToCsv(): string {
      const locale = getCurrentLocale();
      const isZh = locale === 'zh-CN';

      const headers = [
        isZh ? 'ID' : 'ID',
        isZh ? '评分' : 'Rating',
        isZh ? '评分描述' : 'Rating Label',
        isZh ? '分类代码' : 'Category Key',
        isZh ? '分类' : 'Category',
        isZh ? '建议内容' : 'Content',
        isZh ? '提交时间戳' : 'Timestamp',
        isZh ? '提交时间' : 'Submitted At',
      ];

      const rows = sortedQueue.value.map((item) => [
        item.id,
        String(item.rating),
        `"${getRatingLabelLocalized(item.rating, locale).replace(/"/g, '""')}"`,
        item.category ?? '',
        `"${getCategoryLabelLocalized(item.category, locale).replace(/"/g, '""')}"`,
        `"${(item.content ?? '').replace(/"/g, '""')}"`,
        String(item.createdAt),
        `"${formatDateLocalized(item.createdAt, locale).replace(/"/g, '""')}"`,
      ]);

      return [headers, ...rows].map((row) => row.join(',')).join('\n');
    }

    function downloadCsv(): void {
      if (queue.value.length === 0) return;
      const csv = exportToCsv();
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.href = url;
      a.download = `feedback-export-${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return {
      queue,
      count,
      sortedQueue,
      averageRating,
      addFeedback,
      removeFeedback,
      clearAll,
      exportToJson,
      downloadJson,
      exportToCsv,
      downloadCsv,
    };
  },
  {
    persist: {
      key: 'cozy-cooking-feedback',
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  },
);
