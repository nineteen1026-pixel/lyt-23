<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Search, Star, Pencil, Trash2, BookOpen, Plus, X } from 'lucide-vue-next';
import { useCookingStore, type Note } from '@/stores/cooking';
import { dishes } from '@/data/dishes';
import NoteEditor from '@/components/NoteEditor.vue';
import { useDishI18n } from '@/composables/useDishI18n';

const router = useRouter();
const route = useRoute();
const store = useCookingStore();
const { getLocalizedDishById, localizedDishes } = useDishI18n();

const searchKeyword = ref('');
const showEditor = ref(false);
const showDishPicker = ref(false);
const editingNote = ref<Note | null>(null);
const currentDish = ref<{ dishId: string; dishName: string; dishEmoji: string } | null>(null);

onMounted(() => {
  const searchQuery = route.query.search as string;
  if (searchQuery) {
    searchKeyword.value = searchQuery;
  }
});

const filteredNotes = computed(() => {
  return store.searchNotes(searchKeyword.value);
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

function openNewNote(dishId: string, dishName: string, dishEmoji: string) {
  editingNote.value = null;
  currentDish.value = { dishId, dishName, dishEmoji };
  showEditor.value = true;
}

function openEditNote(note: Note) {
  editingNote.value = note;
  currentDish.value = {
    dishId: note.dishId,
    dishName: note.dishName,
    dishEmoji: note.dishEmoji,
  };
  showEditor.value = true;
}

function handleSave(data: { content: string; rating: 1 | 2 | 3 | 4 | 5 }) {
  if (!currentDish.value) return;

  if (editingNote.value) {
    store.updateNote(editingNote.value.id, {
      content: data.content,
      rating: data.rating,
    });
  } else {
    store.addNote({
      dishId: currentDish.value.dishId,
      dishName: currentDish.value.dishName,
      dishEmoji: currentDish.value.dishEmoji,
      content: data.content,
      rating: data.rating,
    });
  }
  showEditor.value = false;
  editingNote.value = null;
  currentDish.value = null;
}

function handleDelete(noteId: string) {
  if (confirm('确定要删除这条笔记吗？')) {
    store.deleteNote(noteId);
  }
}

function goBack() {
  router.back();
}

function handleNewNoteClick() {
  showDishPicker.value = true;
}

function selectDishForNote(dishId: string, dishName: string, dishEmoji: string) {
  showDishPicker.value = false;
  openNewNote(dishId, dishName, dishEmoji);
}
</script>

<template>
  <div class="container max-w-3xl mx-auto px-4 pt-6 pb-10">
    <header class="flex items-center justify-between mb-6 animate-fade-slide">
      <div class="flex items-center gap-3">
        <button
          class="w-10 h-10 card-soft flex items-center justify-center hover:shadow-soft transition-all active:scale-95"
          @click="goBack"
        >
          <ArrowLeft :size="20" class="text-brown-800/70" />
        </button>
        <div>
          <h1 class="text-display text-2xl text-brown-900">烹饪笔记</h1>
          <p class="text-xs text-brown-800/60">共 {{ store.notes.length }} 条笔记</p>
        </div>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-apricot-500 to-orange-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
        @click="handleNewNoteClick"
      >
        <Plus :size="18" />
        <span>写笔记</span>
      </button>
    </header>

    <div class="mb-6 animate-fade-slide" style="animation-delay: 0.05s">
      <div class="relative">
        <Search
          :size="18"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-brown-800/40"
        />
        <input
          v-model="searchKeyword"
          type="text"
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-cream-300 bg-cream-50 text-brown-800 text-sm focus:outline-none focus:border-apricot-400 focus:bg-white transition-all placeholder:text-brown-800/30"
          placeholder="搜索菜名或笔记内容..."
        />
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div
        v-if="filteredNotes.length === 0"
        key="empty"
        class="text-center py-16 animate-fade-slide"
      >
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-display text-lg text-brown-800 mb-2">
          {{ searchKeyword ? '没有找到相关笔记' : '还没有笔记哦' }}
        </h3>
        <p class="text-sm text-brown-800/60 max-w-xs mx-auto mb-6">
          {{ searchKeyword ? '试试其他关键词吧～' : '记录每一次烹饪的心得和改良灵感' }}
        </p>
        <button
          v-if="!searchKeyword"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-apricot-500 to-orange-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
          @click="handleNewNoteClick"
        >
          <Plus :size="18" />
          <span>写第一篇笔记</span>
        </button>
      </div>

      <div
        v-else
        key="list"
        class="space-y-4"
      >
        <div
          v-for="(note, index) in filteredNotes"
          :key="note.id"
          class="card-soft p-5 animate-fade-slide hover:shadow-card transition-all duration-300"
          :style="{ animationDelay: `${index * 0.03}s` }"
        >
          <div class="flex items-start gap-4">
            <div class="text-4xl shrink-0">{{ note.dishEmoji }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-display text-brown-900 truncate">{{ getLocalizedDishById(note.dishId)?.name || note.dishName }}</h3>
                <div class="flex items-center gap-1 shrink-0">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :size="14"
                    :class="i <= note.rating ? 'text-amber-400 fill-amber-400' : 'text-brown-800/15'"
                  />
                </div>
              </div>
              <p class="text-xs text-brown-800/50 mb-3">{{ formatDate(note.createdAt) }}</p>
              <p class="text-sm text-brown-800/80 leading-relaxed whitespace-pre-wrap line-clamp-3">
                {{ note.content }}
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-cream-200">
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-brown-800/60 hover:bg-brown-800/5 transition-colors"
              @click="openEditNote(note)"
            >
              <Pencil :size="14" />
              <span>编辑</span>
            </button>
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-500/70 hover:bg-red-500/10 transition-colors"
              @click="handleDelete(note.id)"
            >
              <Trash2 :size="14" />
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <NoteEditor
        v-if="showEditor && currentDish"
        :visible="showEditor"
        :dish-id="currentDish.dishId"
        :dish-name="currentDish.dishName"
        :dish-emoji="currentDish.dishEmoji"
        :note="editingNote"
        @close="showEditor = false"
        @save="handleSave"
      />
    </Transition>

    <Transition name="fade">
      <div
        v-if="showDishPicker"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-slide"
          @click="showDishPicker = false"
        />

        <div class="relative w-full max-w-md animate-pop-in">
          <div class="card-soft overflow-hidden">
            <div class="relative p-6">
              <button
                class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-brown-800/50 hover:text-brown-800 hover:bg-brown-800/10 transition-colors"
                @click="showDishPicker = false"
              >
                <X :size="20" />
              </button>

              <h3 class="text-display text-xl text-brown-900 mb-1">选择菜品</h3>
              <p class="text-xs text-brown-800/60 mb-5">选择要写笔记的菜品</p>

              <div class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                <button
                  v-for="dish in localizedDishes"
                  :key="dish.id"
                  class="flex items-center gap-3 p-3 rounded-2xl border-2 border-cream-300 bg-cream-50 hover:border-apricot-400 hover:bg-white transition-all active:scale-[0.98]"
                  @click="selectDishForNote(dish.id, dish.name, dish.emoji)"
                >
                  <div class="text-3xl">{{ dish.emoji }}</div>
                  <div class="text-left min-w-0">
                    <div class="text-display text-brown-900 text-sm truncate">
                      {{ dish.name }}
                    </div>
                    <div class="text-[10px] text-brown-800/50">
                      {{ dish.time }}分钟 · {{ '⭐'.repeat(dish.difficulty) }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
