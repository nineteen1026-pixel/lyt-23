<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import KitchenTimerPanel from '@/components/timer/KitchenTimerPanel.vue';

const router = useRouter();
</script>

<template>
  <div class="container max-w-3xl mx-auto px-4 pt-6">
    <header class="flex items-center gap-3 mb-6 animate-fade-slide">
      <button
        class="flex items-center gap-2 card-soft px-4 py-2.5 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/')"
      >
        <ArrowLeft :size="18" class="text-brown-800/70" />
        <span class="text-sm text-brown-800/80 font-medium">返回</span>
      </button>
    </header>

    <div class="animate-fade-slide" style="animation-delay: 0.05s">
      <KitchenTimerPanel />
    </div>
  </div>
</template>
