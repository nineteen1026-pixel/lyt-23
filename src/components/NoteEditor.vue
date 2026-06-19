<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { X, Star } from 'lucide-vue-next';
import type { Note } from '@/stores/cooking';

const props = defineProps<{
  visible: boolean;
  dishId: string;
  dishName: string;
  dishEmoji: string;
  note?: Note | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: { content: string; rating: 1 | 2 | 3 | 4 | 5 }): void;
}>();

const content = ref('');
const rating = ref<1 | 2 | 3 | 4 | 5>(5);
const isEditing = computed(() => !!props.note);

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.note) {
        content.value = props.note.content;
        rating.value = props.note.rating;
      } else {
        content.value = '';
        rating.value = 5;
      }
    }
  },
  { immediate: true },
);

function setRating(value: 1 | 2 | 3 | 4 | 5) {
  rating.value = value;
}

function handleSave() {
  if (!content.value.trim()) return;
  emit('save', { content: content.value.trim(), rating: rating.value });
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
        @click="handleClose"
      />

      <div class="relative w-full max-w-md animate-pop-in">
        <div class="card-soft overflow-hidden">
          <div class="relative p-6">
            <button
              class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-brown-800/50 hover:text-brown-800 hover:bg-brown-800/10 transition-colors"
              @click="handleClose"
            >
              <X :size="20" />
            </button>

            <div class="flex items-center gap-3 mb-5">
              <div class="text-4xl">{{ dishEmoji }}</div>
              <div>
                <h3 class="text-display text-xl text-brown-900">{{ dishName }}</h3>
                <p class="text-xs text-brown-800/60">
                  {{ isEditing ? '编辑改良心得' : '写点改良心得吧～' }}
                </p>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-brown-800 mb-2">评分</label>
              <div class="flex gap-1">
                <button
                  v-for="i in 5"
                  :key="i"
                  class="p-1 transition-transform active:scale-90"
                  @click="setRating(i as 1 | 2 | 3 | 4 | 5)"
                >
                  <Star
                    :size="28"
                    :class="i <= rating ? 'text-amber-400 fill-amber-400' : 'text-brown-800/20'"
                  />
                </button>
              </div>
            </div>

            <div class="mb-5">
              <label class="block text-sm font-medium text-brown-800 mb-2">改良心得</label>
              <textarea
                v-model="content"
                class="w-full h-40 p-4 rounded-2xl border-2 border-cream-300 bg-cream-50 text-brown-800 text-sm leading-relaxed resize-none focus:outline-none focus:border-apricot-400 focus:bg-white transition-all placeholder:text-brown-800/30"
                placeholder="记录一下这次的心得吧～比如：下次少放点盐、加一点蒜末会更香..."
              />
              <div class="mt-1 text-right text-xs text-brown-800/40">
                {{ content.length }} 字
              </div>
            </div>

            <div class="flex gap-3">
              <button
                class="flex-1 btn-secondary"
                @click="handleClose"
              >
                取消
              </button>
              <button
                class="flex-1 btn-primary"
                :disabled="!content.trim()"
                @click="handleSave"
              >
                {{ isEditing ? '保存修改' : '保存笔记' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
