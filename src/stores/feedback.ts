import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

function generateId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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
      const data = {
        exportedAt: new Date().toISOString(),
        totalCount: queue.value.length,
        averageRating: averageRating.value,
        feedbacks: sortedQueue.value.map((item) => ({
          ...item,
          createdAtFormatted: new Date(item.createdAt).toLocaleString('zh-CN'),
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
      const headers = ['ID', '评分', '分类', '内容', '提交时间'];
      const rows = sortedQueue.value.map((item) => [
        item.id,
        String(item.rating),
        item.category ?? '',
        `"${(item.content ?? '').replace(/"/g, '""')}"`,
        new Date(item.createdAt).toLocaleString('zh-CN'),
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
