<script setup lang="ts">
import { computed } from 'vue';
import { CARD_THEMES, type ShareCardData, type CardThemeId } from '@/data/share';

const props = defineProps<{
  data: ShareCardData;
  size?: 'normal' | 'small';
}>();

const sizeClass = computed(() => props.size === 'small' ? 'w-64' : 'w-80');

const themeConfig = computed(() => {
  return CARD_THEMES.find((t) => t.id === props.data.cardTheme) ?? CARD_THEMES[0];
});

const gradientClass = computed(() => {
  const theme = props.data.cardTheme;
  switch (theme) {
    case 'warm':
      return 'from-apricot-100 to-cream-100';
    case 'fresh':
      return 'from-matcha-100 to-cream-100';
    case 'sweet':
      return 'from-rose-100 to-cream-100';
    default:
      return 'from-apricot-100 to-cream-100';
  }
});

const accentColor = computed(() => themeConfig.value.accent);

const formattedDate = computed(() => {
  const date = new Date(props.data.generatedAt);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
});
</script>

<template>
  <div
    class="relative rounded-3xl overflow-hidden shadow-card border border-white/60"
    :class="[sizeClass, `bg-gradient-to-br ${gradientClass}`]"
  >
    <div class="absolute top-0 right-0 w-32 h-32 opacity-20">
      <div class="absolute top-4 right-4 text-6xl">🍳</div>
    </div>

    <div class="relative p-5 space-y-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white/80"
          :style="{ background: accentColor + '20' }"
        >
          {{ data.avatarEmoji }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-display text-lg text-brown-900 truncate">{{ data.userName }}</div>
          <div class="text-xs text-brown-800/60">{{ formattedDate }} · 打卡记录</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/70 rounded-2xl p-3 text-center backdrop-blur-sm">
          <div class="text-2xl font-bold text-brown-900">{{ data.totalDays }}</div>
          <div class="text-xs text-brown-800/60 mt-0.5">累计天数</div>
        </div>
        <div class="bg-white/70 rounded-2xl p-3 text-center backdrop-blur-sm">
          <div class="text-2xl font-bold" :style="{ color: accentColor }">{{ data.streakDays }}</div>
          <div class="text-xs text-brown-800/60 mt-0.5">连续打卡</div>
        </div>
        <div class="bg-white/70 rounded-2xl p-3 text-center backdrop-blur-sm">
          <div class="text-2xl font-bold text-matcha-600">{{ data.totalDishes }}</div>
          <div class="text-xs text-brown-800/60 mt-0.5">完成菜品</div>
        </div>
      </div>

      <div class="bg-white/50 rounded-2xl p-3 backdrop-blur-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-brown-900">本周数据</span>
          <span class="text-xs text-brown-800/60">{{ data.weekDishes }} 道菜</span>
        </div>
        <div class="flex items-center gap-3 text-xs text-brown-800/70">
          <span class="flex items-center gap-1">
            <span>🍽️</span>
            <span>{{ data.uniqueDishesCount }} 种不同菜品</span>
          </span>
        </div>
      </div>

      <div v-if="data.challengeSummary" class="bg-white/70 rounded-2xl p-3 backdrop-blur-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">{{ data.challengeSummary.badge.emoji }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-brown-900 truncate">{{ data.challengeSummary.title }}</div>
            <div class="text-xs text-brown-800/60">{{ data.challengeSummary.badge.name }}</div>
          </div>
          <div
            v-if="data.challengeSummary.isCompleted"
            class="chip bg-matcha-400/30 text-matcha-600 text-xs"
          >
            ✓ 已完成
          </div>
          <div
            v-else
            class="text-xs text-brown-800/60"
          >
            剩 {{ data.challengeSummary.remainingDays }} 天
          </div>
        </div>
        <div class="h-2 rounded-full bg-cream-200 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: `${data.challengeSummary.progressPercent}%`,
              background: data.challengeSummary.isCompleted
                ? 'linear-gradient(90deg, #BFD87A, #A7C957)'
                : `linear-gradient(90deg, ${accentColor}aa, ${accentColor})`,
            }"
          />
        </div>
        <div class="flex justify-between mt-1.5 text-xs text-brown-800/60">
          <span>{{ data.challengeSummary.progressCount }} / {{ data.challengeSummary.targetCount }}</span>
          <span>{{ Math.round(data.challengeSummary.progressPercent) }}%</span>
        </div>
      </div>

      <div v-if="data.badges.length > 0">
        <div class="text-xs text-brown-800/70 mb-2">获得徽章</div>
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="badge in data.badges.slice(0, 6)"
            :key="badge.id"
            class="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/70 backdrop-blur-sm"
          >
            <span>{{ badge.emoji }}</span>
            <span class="text-brown-800/80">{{ badge.name }}</span>
          </div>
          <div
            v-if="data.badges.length > 6"
            class="flex items-center px-2 py-1 rounded-full text-xs bg-white/50 text-brown-800/60"
          >
            +{{ data.badges.length - 6 }}
          </div>
        </div>
      </div>

      <div v-if="data.recentDishes.length > 0">
        <div class="text-xs text-brown-800/70 mb-2">最近作品</div>
        <div class="flex gap-2">
          <div
            v-for="dish in data.recentDishes.slice(0, 5)"
            :key="dish.id"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/70 backdrop-blur-sm shadow-sm"
            :title="dish.name"
          >
            {{ dish.emoji }}
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-brown-800/10">
        <p class="text-xs text-brown-800/70 leading-relaxed">
          {{ data.shareText }}
        </p>
      </div>

      <div class="flex items-center justify-center gap-2 pt-1">
        <span class="text-lg">🍳</span>
        <span class="text-display text-sm text-brown-900/80">我的小厨房</span>
      </div>
    </div>
  </div>
</template>
