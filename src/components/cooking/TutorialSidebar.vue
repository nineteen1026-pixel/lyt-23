<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, Lightbulb, BookOpen, CheckCircle2, Info } from 'lucide-vue-next';
import CollapsePanel from '@/components/CollapsePanel.vue';
import { getTutorialByDishId, type StepTip, type CommonMistake } from '@/data/tutorials';

const props = defineProps<{
  dishId: string;
  currentStep: number;
  dishColor: string;
}>();

const tutorial = computed(() => getTutorialByDishId(props.dishId));
const currentStepTips = computed(() => tutorial.value.stepTips[props.currentStep] ?? []);
const hasAnyContent = computed(() => {
  return (
    tutorial.value.prepGuide ||
    currentStepTips.value.length > 0 ||
    tutorial.value.commonMistakes.length > 0 ||
    (tutorial.value.proTips && tutorial.value.proTips.length > 0)
  );
});

const stepNames = ['洗菜备料', '切配处理', '调味准备', '烹饪加热', '摆盘装饰'];

function getImportanceStyle(importance: StepTip['importance']) {
  switch (importance) {
    case 'critical':
      return {
        border: 'border-l-[#E63946]',
        bg: 'bg-[#E6394608]',
        icon: 'bg-[#E63946]',
        label: '必看',
        labelBg: 'bg-[#E63946]',
      };
    case 'important':
      return {
        border: 'border-l-[#FF8C42]',
        bg: 'bg-[#FF8C4208]',
        icon: 'bg-[#FF8C42]',
        label: '重要',
        labelBg: 'bg-[#FF8C42]',
      };
    default:
      return {
        border: 'border-l-[#6BCB77]',
        bg: 'bg-[#6BCB7708]',
        icon: 'bg-[#6BCB77]',
        label: '贴士',
        labelBg: 'bg-[#6BCB77]',
      };
  }
}
</script>

<template>
  <aside v-if="hasAnyContent" class="tutorial-sidebar w-full lg:w-80 flex-shrink-0 space-y-3">
    <div class="card-soft p-4 border-l-4" :style="{ borderLeftColor: dishColor }">
      <div class="flex items-center gap-2 mb-1">
        <BookOpen :size="18" class="text-brown-800/70" />
        <span class="text-display text-sm text-brown-900">烹饪教程</span>
      </div>
      <p class="text-[11px] text-brown-800/50 leading-relaxed">
        跟随贴士避开常见雷区，做出完美料理
      </p>
    </div>

    <CollapsePanel
      v-if="tutorial.prepGuide"
      title="备料清单"
      icon="📋"
      :badge="tutorial.prepGuide.items.length"
      :accent-color="dishColor"
      :default-open="true"
    >
      <ul class="space-y-2">
        <li
          v-for="(item, idx) in tutorial.prepGuide.items"
          :key="idx"
          class="flex items-start gap-2 text-xs text-brown-800/80 leading-relaxed"
        >
          <span
            class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
            :style="{ background: dishColor }"
          >
            {{ idx + 1 }}
          </span>
          <span class="pt-0.5">{{ item }}</span>
        </li>
      </ul>
    </CollapsePanel>

    <div v-if="currentStepTips.length > 0" class="space-y-2">
      <div class="flex items-center gap-2 px-1">
        <Lightbulb
          :size="16"
          class="text-[#FFD93D] drop-shadow-sm"
        />
        <span class="text-xs font-bold text-brown-900">
          第 {{ currentStep + 1 }} 步 · {{ stepNames[currentStep] }} 贴士
        </span>
        <span
          class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          :style="{ background: dishColor }"
        >
          当前步骤
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="tip in currentStepTips"
          :key="tip.id"
          class="tip-card rounded-xl overflow-hidden border-l-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
          :class="[getImportanceStyle(tip.importance).bg, getImportanceStyle(tip.importance).border]"
        >
          <div
            v-if="tip.illustration"
            class="tip-illustration h-20 flex items-center justify-center relative overflow-hidden"
            :style="{
              background: `linear-gradient(135deg, ${tip.illustration.gradientFrom}, ${tip.illustration.gradientTo})`,
            }"
          >
            <div
              v-if="tip.illustration.pattern === 'dots'"
              class="absolute inset-0 opacity-20"
              :style="{
                backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
                backgroundSize: '12px 12px',
              }"
            />
            <div
              v-else-if="tip.illustration.pattern === 'stripes'"
              class="absolute inset-0 opacity-15"
              :style="{
                backgroundImage: 'repeating-linear-gradient(45deg, white, white 4px, transparent 4px, transparent 8px)',
              }"
            />
            <span class="text-4xl relative z-10 drop-shadow-lg">{{ tip.illustration.emoji }}</span>
          </div>
          <div class="p-3">
            <div class="flex items-start gap-2.5">
              <div v-if="!tip.illustration" class="shrink-0">
                <span v-if="tip.emoji" class="text-xl">{{ tip.emoji }}</span>
                <div
                  v-else
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getImportanceStyle(tip.importance).icon"
                >
                  <Info :size="14" class="text-white" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <h4 class="text-sm font-bold text-brown-900">{{ tip.title }}</h4>
                  <span
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                    :class="getImportanceStyle(tip.importance).labelBg"
                  >
                    {{ getImportanceStyle(tip.importance).label }}
                  </span>
                </div>
                <p class="text-[12px] text-brown-800/75 leading-relaxed">
                  {{ tip.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CollapsePanel
      v-if="tutorial.commonMistakes.length > 0"
      title="常见失误"
      icon="⚠️"
      :badge="tutorial.commonMistakes.length"
      accent-color="#E63946"
    >
      <ul class="space-y-4">
        <li
          v-for="(mistake, idx) in tutorial.commonMistakes"
          :key="mistake.id"
          class="mistake-item"
        >
          <div class="flex items-start gap-2.5 mb-2">
            <span class="text-xl shrink-0">{{ mistake.emoji || '❌' }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-[#C1121F]">{{ mistake.title }}</h4>
                <span class="text-[10px] text-brown-800/50 font-medium">#{{ idx + 1 }}</span>
              </div>
            </div>
          </div>
          <div class="ml-[42px] space-y-2 text-[12px]">
            <div class="flex items-start gap-1.5">
              <span class="text-red-500 shrink-0 mt-0.5">●</span>
              <div>
                <span class="font-semibold text-brown-800/80">误区：</span>
                <span class="text-brown-800/70 leading-relaxed">{{ mistake.mistake }}</span>
              </div>
            </div>
            <div class="flex items-start gap-1.5">
              <span class="text-orange-500 shrink-0 mt-0.5">●</span>
              <div>
                <span class="font-semibold text-brown-800/80">后果：</span>
                <span class="text-brown-800/70 leading-relaxed">{{ mistake.consequence }}</span>
              </div>
            </div>
            <div
              class="flex items-start gap-1.5 p-2.5 rounded-lg bg-[#6BCB7715] border border-[#6BCB7730]"
            >
              <CheckCircle2 :size="14" class="text-[#4CAF50] shrink-0 mt-0.5" />
              <div>
                <span class="font-semibold text-[#2E7D32]">正确做法：</span>
                <span class="text-brown-800/80 leading-relaxed">{{ mistake.solution }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </CollapsePanel>

    <CollapsePanel
      v-if="tutorial.proTips && tutorial.proTips.length > 0"
      title="进阶技巧"
      icon="⭐"
      :badge="tutorial.proTips.length"
      accent-color="#9B59B6"
    >
      <div class="space-y-3">
        <div
          v-for="tip in tutorial.proTips"
          :key="tip.id"
          class="pro-tip-card rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div
            v-if="tip.illustration"
            class="h-16 flex items-center justify-center relative overflow-hidden"
            :style="{
              background: `linear-gradient(135deg, ${tip.illustration.gradientFrom}, ${tip.illustration.gradientTo})`,
            }"
          >
            <div
              v-if="tip.illustration.pattern === 'dots'"
              class="absolute inset-0 opacity-20"
              :style="{
                backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
                backgroundSize: '12px 12px',
              }"
            />
            <div
              v-else-if="tip.illustration.pattern === 'stripes'"
              class="absolute inset-0 opacity-15"
              :style="{
                backgroundImage: 'repeating-linear-gradient(45deg, white, white 4px, transparent 4px, transparent 8px)',
              }"
            />
            <span class="text-3xl relative z-10 drop-shadow-md">{{ tip.illustration.emoji }}</span>
          </div>
          <div class="p-3">
            <div class="flex items-start gap-2.5">
              <span v-if="!tip.illustration" class="text-xl shrink-0">{{ tip.emoji || '💫' }}</span>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-[#6B21A8] mb-1">{{ tip.title }}</h4>
                <p class="text-[12px] text-brown-800/75 leading-relaxed">
                  {{ tip.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollapsePanel>
  </aside>
</template>

<style scoped>
.tutorial-sidebar {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 4px;
}

.tutorial-sidebar::-webkit-scrollbar {
  width: 4px;
}

.tutorial-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.tutorial-sidebar::-webkit-scrollbar-thumb {
  background: rgba(107, 66, 38, 0.15);
  border-radius: 2px;
}

.tutorial-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 66, 38, 0.25);
}

.mistake-item + .mistake-item {
  border-top: 1px dashed rgba(230, 57, 70, 0.15);
  padding-top: 1rem;
}
</style>
