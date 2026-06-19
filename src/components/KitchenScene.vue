<script setup lang="ts">
import { computed } from 'vue';
import { useCookingStore } from '@/stores/cooking';
import { unlocks } from '@/data/unlocks';

const store = useCookingStore();

const activeDecoration = computed(() =>
  unlocks.decorations.find((d) => d.id === store.activeDecoration),
);

const counterStyle = computed(() => ({
  background: store.activeCounterData.background,
  borderColor: store.activeCounterData.borderColor,
}));

const sceneBackgroundStyle = computed(() => ({
  borderTop: `4px solid ${store.activeCounterData.accentColor}`,
  boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.08), 0 -4px 20px rgba(0,0,0,0.06)',
}));
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-3xl border-2" :style="{ borderColor: counterStyle.borderColor }">
    <div class="relative h-48 md:h-56">
      <div
        class="absolute bottom-0 left-0 right-0 h-24 md:h-28"
        :style="{
          ...sceneBackgroundStyle,
          background: counterStyle.background,
        }"
      >
        <div
          class="absolute top-0 left-0 right-0 h-3"
          :style="{ backgroundColor: store.activeCounterData.accentColor, opacity: 0.3 }"
        />
        <div
          v-if="activeDecoration"
          class="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 flex flex-col items-center animate-float"
        >
          <div class="text-5xl md:text-6xl drop-shadow-lg">
            {{ activeDecoration.emoji }}
          </div>
          <div
            class="mt-1 text-xs font-medium px-2 py-0.5 rounded-full shadow-soft"
            :style="{
              backgroundColor: store.activeBackgroundData.colors.bgSoft,
              color: store.activeBackgroundData.colors.text,
              border: `1px solid ${store.activeCounterData.borderColor}40`,
            }"
          >
            {{ activeDecoration.name }}
          </div>
        </div>
        <div
          v-else
          class="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 text-xs italic"
          :style="{ color: store.activeBackgroundData.colors.text, opacity: 0.4 }"
        >
          去成就页面选个摆件吧～
        </div>
      </div>
      <div
        class="absolute bottom-24 md:bottom-28 left-0 right-0 h-1 rounded-full"
        :style="{ backgroundColor: store.activeCounterData.accentColor, opacity: 0.6 }"
      />
    </div>
  </div>
</template>
