<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    title: string;
    icon?: string;
    defaultOpen?: boolean;
    accentColor?: string;
    badge?: number | string;
  }>(),
  {
    defaultOpen: false,
    accentColor: '#FF8C42',
  },
);

const isOpen = ref(props.defaultOpen);
const contentRef = ref<HTMLDivElement | null>(null);
const contentHeight = ref('0px');

function updateHeight() {
  if (!contentRef.value) return;
  if (isOpen.value) {
    contentHeight.value = `${contentRef.value.scrollHeight}px`;
  } else {
    contentHeight.value = '0px';
  }
}

function toggle() {
  isOpen.value = !isOpen.value;
}

watch(isOpen, () => {
  updateHeight();
});

onMounted(() => {
  updateHeight();
  const observer = new ResizeObserver(() => {
    if (isOpen.value && contentRef.value) {
      contentHeight.value = `${contentRef.value.scrollHeight}px`;
    }
  });
  if (contentRef.value) {
    observer.observe(contentRef.value);
  }
});
</script>

<template>
  <div class="collapse-panel w-full overflow-hidden rounded-2xl bg-cream-100 border border-white/60 shadow-card">
    <button
      type="button"
      class="collapse-header w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left select-none hover:bg-cream-50/50 transition-colors"
      :style="{ '--accent': accentColor }"
      @click="toggle"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span v-if="icon" class="text-2xl shrink-0">{{ icon }}</span>
        <span
          class="text-sm font-semibold text-brown-900 truncate"
          :class="{ '!text-[rgb(var(--accent-rgb))]': isOpen }"
        >
          {{ title }}
        </span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span
          v-if="badge !== undefined"
          class="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          :style="{ background: accentColor }"
        >
          {{ badge }}
        </span>
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          :class="isOpen ? 'rotate-180' : 'rotate-0'"
          :style="{ background: isOpen ? `${accentColor}15` : 'transparent' }"
        >
          <ChevronDown
            :size="16"
            class="transition-colors duration-300"
            :style="{ color: isOpen ? accentColor : '#6B422680' }"
          />
        </div>
      </div>
    </button>
    <div
      class="collapse-content-wrapper transition-all duration-300 ease-in-out overflow-hidden"
      :style="{ maxHeight: contentHeight }"
    >
      <div ref="contentRef" class="collapse-content px-4 pb-4 pt-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.collapse-panel {
  backdrop-filter: blur(8px);
}

:deep(.collapse-content) {
  animation: none;
}
</style>
