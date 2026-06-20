<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AlertTriangle, Lightbulb, BookOpen, CheckCircle2, Info } from 'lucide-vue-next';
import CollapsePanel from '@/components/CollapsePanel.vue';
import { getTutorialByDishId, type StepTip, type CommonMistake, type TipIllustration, type PrepGuide } from '@/data/tutorials';

const { t } = useI18n();

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

const stepKeys = ['wash', 'cut', 'season', 'bake', 'plate'] as const;
const currentStepName = computed(() => {
  try {
    return t(`tutorial.stepNames.${stepKeys[props.currentStep]}`);
  } catch {
    return stepNamesFallback[props.currentStep] || '';
  }
});

function getTipTitle(tip: StepTip): string {
  if (tip.titleI18nKey) return t(tip.titleI18nKey);
  return tip.title || '';
}

function getTipContent(tip: StepTip): string {
  if (tip.contentI18nKey) return t(tip.contentI18nKey);
  return tip.content || '';
}

function getMistakeTitle(mistake: CommonMistake): string {
  if (mistake.titleI18nKey) return t(mistake.titleI18nKey);
  return mistake.title || '';
}

function getMistakeField(mistake: CommonMistake, field: 'mistake' | 'consequence' | 'solution'): string {
  const i18nKey = mistake[`${field}I18nKey` as keyof CommonMistake] as string | undefined;
  if (i18nKey) return t(i18nKey);
  return mistake[field] || '';
}

function getPrepTitle(prep: PrepGuide): string {
  if (prep.titleI18nKey) return t(prep.titleI18nKey);
  return prep.title || '';
}

function getPrepItems(prep: PrepGuide): string[] {
  if (prep.itemI18nKeys) return prep.itemI18nKeys.map((key) => t(key));
  return prep.items || [];
}

const stepNamesFallback = ['洗菜备料', '切配处理', '调味准备', '烹饪加热', '摆盘装饰'];

function getImportanceLabel(importance: StepTip['importance']): string {
  return t(`tutorial.importance.${importance}`);
}

function getImportanceStyle(importance: StepTip['importance']) {
  switch (importance) {
    case 'critical':
      return {
        border: 'border-l-[#E63946]',
        bg: 'bg-[#E6394608]',
        icon: 'bg-[#E63946]',
        labelBg: 'bg-[#E63946]',
      };
    case 'important':
      return {
        border: 'border-l-[#FF8C42]',
        bg: 'bg-[#FF8C4208]',
        icon: 'bg-[#FF8C42]',
        labelBg: 'bg-[#FF8C42]',
      };
    default:
      return {
        border: 'border-l-[#6BCB77]',
        bg: 'bg-[#6BCB7708]',
        icon: 'bg-[#6BCB77]',
        labelBg: 'bg-[#6BCB77]',
      };
  }
}

function getIllustrationStyle(illustration: TipIllustration) {
  return {
    background: `linear-gradient(135deg, ${illustration.gradientFrom}, ${illustration.gradientTo})`,
  };
}

function getPatternStyle(pattern?: TipIllustration['pattern']) {
  if (pattern === 'dots') {
    return {
      backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
      backgroundSize: '12px 12px',
    };
  }
  if (pattern === 'stripes') {
    return {
      backgroundImage: 'repeating-linear-gradient(45deg, white, white 4px, transparent 4px, transparent 8px)',
    };
  }
  return {};
}
</script>

<template>
  <aside v-if="hasAnyContent" class="tutorial-sidebar w-full lg:w-80 flex-shrink-0 space-y-3">
    <div class="card-soft p-4 border-l-4" :style="{ borderLeftColor: dishColor }">
      <div class="flex items-center gap-2 mb-1">
        <BookOpen :size="18" class="text-brown-800/70" />
        <span class="text-display text-sm text-brown-900">{{ t('tutorial.sidebarTitle') }}</span>
      </div>
      <p class="text-[11px] text-brown-800/50 leading-relaxed">
        {{ t('tutorial.sidebarSubtitle') }}
      </p>
    </div>

    <CollapsePanel
      v-if="tutorial.prepGuide"
      :title="getPrepTitle(tutorial.prepGuide)"
      icon="📋"
      :badge="getPrepItems(tutorial.prepGuide).length"
      :accent-color="dishColor"
      :default-open="true"
    >
      <ul class="space-y-2">
        <li
          v-for="(item, idx) in getPrepItems(tutorial.prepGuide)"
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
          {{ t('tutorial.currentStepTips', { step: currentStep + 1, stepName: currentStepName }) }}
        </span>
        <span
          class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          :style="{ background: dishColor }"
        >
          {{ t('tutorial.currentStepBadge') }}
        </span>
      </div>
      <div class="space-y-3">
        <div
          v-for="tip in currentStepTips"
          :key="tip.id"
          class="tip-card rounded-xl overflow-hidden border-l-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
          :class="[getImportanceStyle(tip.importance).bg, getImportanceStyle(tip.importance).border]"
        >
          <img
            v-if="tip.image"
            :src="tip.image"
            :alt="getTipTitle(tip)"
            class="w-full h-28 object-cover"
            loading="lazy"
          />
          <div
            v-else-if="tip.illustration"
            class="tip-illustration h-20 flex items-center justify-center relative overflow-hidden"
            :style="getIllustrationStyle(tip.illustration)"
          >
            <div
              v-if="tip.illustration.pattern && tip.illustration.pattern !== 'none'"
              class="absolute inset-0"
              :class="tip.illustration.pattern === 'dots' ? 'opacity-20' : 'opacity-15'"
              :style="getPatternStyle(tip.illustration.pattern)"
            />
            <span class="text-4xl relative z-10 drop-shadow-lg">{{ tip.illustration.emoji }}</span>
          </div>
          <div class="p-3">
            <div class="flex items-start gap-2.5">
              <div v-if="!tip.image && !tip.illustration" class="shrink-0">
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
                  <h4 class="text-sm font-bold text-brown-900">{{ getTipTitle(tip) }}</h4>
                  <span
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                    :class="getImportanceStyle(tip.importance).labelBg"
                  >
                    {{ getImportanceLabel(tip.importance) }}
                  </span>
                </div>
                <p class="text-[12px] text-brown-800/75 leading-relaxed">
                  {{ getTipContent(tip) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CollapsePanel
      v-if="tutorial.commonMistakes.length > 0"
      :title="t('tutorial.commonMistakes')"
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
          <img
            v-if="mistake.image"
            :src="mistake.image"
            :alt="getMistakeTitle(mistake)"
            class="w-full h-24 object-cover rounded-lg mb-3"
            loading="lazy"
          />
          <div
            v-else-if="mistake.illustration"
            class="h-16 flex items-center justify-center relative overflow-hidden rounded-lg mb-3"
            :style="getIllustrationStyle(mistake.illustration)"
          >
            <div
              v-if="mistake.illustration.pattern && mistake.illustration.pattern !== 'none'"
              class="absolute inset-0"
              :class="mistake.illustration.pattern === 'dots' ? 'opacity-20' : 'opacity-15'"
              :style="getPatternStyle(mistake.illustration.pattern)"
            />
            <span class="text-3xl relative z-10 drop-shadow-md">{{ mistake.illustration.emoji }}</span>
          </div>
          <div class="flex items-start gap-2.5 mb-2">
            <span v-if="!mistake.image && !mistake.illustration" class="text-xl shrink-0">{{ mistake.emoji || '❌' }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-[#C1121F]">{{ getMistakeTitle(mistake) }}</h4>
                <span class="text-[10px] text-brown-800/50 font-medium">#{{ idx + 1 }}</span>
              </div>
            </div>
          </div>
          <div :class="(mistake.image || mistake.illustration) ? 'space-y-2 text-[12px]' : 'ml-[42px] space-y-2 text-[12px]'">
            <div class="flex items-start gap-1.5">
              <span class="text-red-500 shrink-0 mt-0.5">●</span>
              <div>
                <span class="font-semibold text-brown-800/80">{{ t('tutorial.mistakeLabel') }}：</span>
                <span class="text-brown-800/70 leading-relaxed">{{ getMistakeField(mistake, 'mistake') }}</span>
              </div>
            </div>
            <div class="flex items-start gap-1.5">
              <span class="text-orange-500 shrink-0 mt-0.5">●</span>
              <div>
                <span class="font-semibold text-brown-800/80">{{ t('tutorial.consequenceLabel') }}：</span>
                <span class="text-brown-800/70 leading-relaxed">{{ getMistakeField(mistake, 'consequence') }}</span>
              </div>
            </div>
            <div
              class="flex items-start gap-1.5 p-2.5 rounded-lg bg-[#6BCB7715] border border-[#6BCB7730]"
            >
              <CheckCircle2 :size="14" class="text-[#4CAF50] shrink-0 mt-0.5" />
              <div>
                <span class="font-semibold text-[#2E7D32]">{{ t('tutorial.solutionLabel') }}：</span>
                <span class="text-brown-800/80 leading-relaxed">{{ getMistakeField(mistake, 'solution') }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </CollapsePanel>

    <CollapsePanel
      v-if="tutorial.proTips && tutorial.proTips.length > 0"
      :title="t('tutorial.proTips')"
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
          <img
            v-if="tip.image"
            :src="tip.image"
            :alt="getTipTitle(tip)"
            class="w-full h-24 object-cover"
            loading="lazy"
          />
          <div
            v-else-if="tip.illustration"
            class="h-16 flex items-center justify-center relative overflow-hidden"
            :style="getIllustrationStyle(tip.illustration)"
          >
            <div
              v-if="tip.illustration.pattern && tip.illustration.pattern !== 'none'"
              class="absolute inset-0"
              :class="tip.illustration.pattern === 'dots' ? 'opacity-20' : 'opacity-15'"
              :style="getPatternStyle(tip.illustration.pattern)"
            />
            <span class="text-3xl relative z-10 drop-shadow-md">{{ tip.illustration.emoji }}</span>
          </div>
          <div class="p-3">
            <div class="flex items-start gap-2.5">
              <span v-if="!tip.image && !tip.illustration" class="text-xl shrink-0">{{ tip.emoji || '💫' }}</span>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-[#6B21A8] mb-1">{{ getTipTitle(tip) }}</h4>
                <p class="text-[12px] text-brown-800/75 leading-relaxed">
                  {{ getTipContent(tip) }}
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
