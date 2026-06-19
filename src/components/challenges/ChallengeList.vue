<script setup lang="ts">
import { computed } from 'vue';
import { useChallengesStore } from '@/stores/challenges';
import { challenges, type Challenge } from '@/data/challenges';
import ChallengeProgress from '@/components/challenges/ChallengeProgress.vue';
import { Play, Trophy, Clock } from 'lucide-vue-next';

const store = useChallengesStore();

const emit = defineEmits<{
  (e: 'start', challengeId: string): void;
}>();

interface ChallengeWithState {
  challenge: Challenge;
  state: 'not-started' | 'in-progress' | 'completed';
}

const challengesWithState = computed<ChallengeWithState[]>(() => {
  return challenges.map((c) => {
    let state: 'not-started' | 'in-progress' | 'completed' = 'not-started';
    if (store.isChallengeCompleted(c.id)) {
      state = 'completed';
    } else if (store.isChallengeStarted(c.id)) {
      state = 'in-progress';
    }
    return { challenge: c, state };
  });
});

const notStarted = computed(() => challengesWithState.value.filter((c) => c.state === 'not-started'));
const inProgress = computed(() => challengesWithState.value.filter((c) => c.state === 'in-progress'));
const completed = computed(() => challengesWithState.value.filter((c) => c.state === 'completed'));

function getStateLabel(state: string): string {
  switch (state) {
    case 'not-started':
      return '待挑战';
    case 'in-progress':
      return '进行中';
    case 'completed':
      return '已完成';
    default:
      return '';
  }
}

function getStateClass(state: string): string {
  switch (state) {
    case 'not-started':
      return 'bg-cream-200 text-brown-800/60';
    case 'in-progress':
      return 'bg-apricot-400/30 text-apricot-600';
    case 'completed':
      return 'bg-matcha-400/30 text-matcha-600';
    default:
      return '';
  }
}
</script>

<template>
  <div class="space-y-6">
    <section v-if="inProgress.length > 0">
      <div class="flex items-center gap-2 mb-4">
        <Clock :size="18" class="text-apricot-500" />
        <h3 class="text-display text-lg text-brown-900">进行中的挑战</h3>
        <span class="chip bg-apricot-400/30 text-apricot-600 text-xs">
          {{ inProgress.length }}
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="{ challenge, state } in inProgress"
          :key="challenge.id"
          class="card-soft p-4 ring-2 ring-apricot-400/30 bg-apricot-400/5"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
            >
              {{ challenge.badge.emoji }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-display text-base text-brown-900 truncate">{{ challenge.title }}</h4>
                <span class="chip text-xs" :class="getStateClass(state)">
                  {{ getStateLabel(state) }}
                </span>
              </div>
              <p class="text-xs text-brown-800/60 mb-3">{{ challenge.description }}</p>
              <ChallengeProgress :challenge="challenge" :show-target-dishes="true" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="notStarted.length > 0">
      <div class="flex items-center gap-2 mb-4">
        <Play :size="18" class="text-brown-800/60" />
        <h3 class="text-display text-lg text-brown-900">可挑战任务</h3>
        <span class="chip bg-cream-200 text-brown-800/60 text-xs">
          {{ notStarted.length }}
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="{ challenge, state } in notStarted"
          :key="challenge.id"
          class="card-soft p-4 hover:shadow-card transition-all duration-300 cursor-pointer group"
          @click="emit('start', challenge.id)"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              style="background: linear-gradient(135deg, #FFE8D6, #FFF8F0);"
            >
              🔒
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-display text-base text-brown-900 truncate">{{ challenge.title }}</h4>
                <span class="chip text-xs" :class="getStateClass(state)">
                  {{ getStateLabel(state) }}
                </span>
              </div>
              <p class="text-xs text-brown-800/60 mb-3">{{ challenge.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-xs text-brown-800/50 flex items-center gap-1">
                  <span>🎯</span>
                  <span>{{ challenge.targetCount }} 道菜品</span>
                  <span class="mx-1">·</span>
                  <span>⏰</span>
                  <span>{{ challenge.cycleDays }} 天期限</span>
                </div>
                <button class="chip bg-apricot-500/20 text-apricot-600 hover:bg-apricot-500/30 transition-all active:scale-95">
                  开始挑战
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="completed.length > 0">
      <div class="flex items-center gap-2 mb-4">
        <Trophy :size="18" class="text-matcha-500" />
        <h3 class="text-display text-lg text-brown-900">已完成挑战</h3>
        <span class="chip bg-matcha-400/30 text-matcha-600 text-xs">
          {{ completed.length }}
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="{ challenge, state } in completed"
          :key="challenge.id"
          class="card-soft p-4 ring-2 ring-matcha-400/30 bg-matcha-400/5"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner"
              style="background: linear-gradient(135deg, #E8F5D4, #FFF8F0);"
            >
              {{ challenge.badge.emoji }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-display text-base text-brown-900 truncate">{{ challenge.title }}</h4>
                <span class="chip text-xs" :class="getStateClass(state)">
                  {{ getStateLabel(state) }}
                </span>
              </div>
              <p class="text-xs text-brown-800/60 mb-1">{{ challenge.description }}</p>
              <p class="text-xs text-matcha-600 flex items-center gap-1">
                <span>🏅</span>
                <span>获得徽章：{{ challenge.badge.name }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
