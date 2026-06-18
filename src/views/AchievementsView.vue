<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft, ChefHat, Sparkles } from 'lucide-vue-next';
import CheckInCalendar from '@/components/achievements/CheckInCalendar.vue';
import UnlockProgress from '@/components/achievements/UnlockProgress.vue';
import DecorationGrid from '@/components/achievements/DecorationGrid.vue';
import ApronSelector from '@/components/achievements/ApronSelector.vue';
import { useCookingStore } from '@/stores/cooking';

const router = useRouter();
const store = useCookingStore();
</script>

<template>
  <div class="container max-w-4xl mx-auto px-4 pt-8">
    <header class="mb-8 animate-fade-slide">
      <button
        class="flex items-center gap-2 card-soft px-4 py-2.5 mb-6 hover:shadow-soft transition-all active:scale-95"
        @click="router.push('/')"
      >
        <ArrowLeft :size="18" class="text-brown-800/70" />
        <span class="text-sm text-brown-800/80 font-medium">回到厨房</span>
      </button>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-display text-4xl text-brown-900 flex items-center gap-2">
            <ChefHat class="text-apricot-500" :size="36" />
            我的成就
          </h1>
          <p class="text-sm text-brown-800/70 mt-2">
            每一次打卡都是对生活的认真 ✿ 继续解锁更可爱的厨房吧！
          </p>
        </div>
        <div
          v-if="store.totalDays > 0"
          class="card-soft px-5 py-3 flex items-center gap-3 animate-float"
        >
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-apricot-400 to-apricot-600 flex items-center justify-center shadow-soft">
            <Sparkles :size="22" class="text-white" />
          </div>
          <div>
            <div class="text-[11px] text-brown-800/60 leading-none">厨房等级</div>
            <div class="text-display text-2xl text-apricot-600 leading-tight">
              Lv.{{ Math.floor(store.totalDays / 10) + 1 }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.05s">
      <h2 class="text-display text-xl text-brown-900 mb-4">📅 打卡日历</h2>
      <CheckInCalendar />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.1s">
      <h2 class="text-display text-xl text-brown-900 mb-4">🎯 解锁进度</h2>
      <UnlockProgress />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.15s">
      <h2 class="text-display text-xl text-brown-900 mb-4">🏠 厨房摆件</h2>
      <DecorationGrid />
    </section>

    <section class="mb-10 animate-fade-slide" style="animation-delay: 0.2s">
      <h2 class="text-display text-xl text-brown-900 mb-4">👩‍🍳 围裙皮肤</h2>
      <ApronSelector />
    </section>

    <footer class="text-center text-xs text-brown-800/50 py-4">
      好好吃饭，慢慢生活 · 累计 {{ store.totalDays }} 天的烟火气 🧡
    </footer>
  </div>
</template>
