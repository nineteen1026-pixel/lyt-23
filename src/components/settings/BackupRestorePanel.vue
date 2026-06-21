<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Download, Upload, Copy, Check, AlertTriangle, Info, HardDrive, RefreshCw, Trash2 } from 'lucide-vue-next';
import { useBackup, type ValidationResult, type ImportResult, type ExportScope } from '@/composables/useBackup';
import { useCookingStore } from '@/stores/cooking';
import { useChallengesStore } from '@/stores/challenges';
import { useFavoritesStore } from '@/stores/favorites';

const { t } = useI18n();
const backup = useBackup();
const cookingStore = useCookingStore();
const challengesStore = useChallengesStore();
const favoritesStore = useFavoritesStore();

const showConfirmDialog = ref(false);
const importMode = ref<'overwrite' | 'merge'>('overwrite');
const selectedFile = ref<File | null>(null);
const validationResult = ref<ValidationResult | null>(null);
const importResult = ref<ImportResult | null>(null);
const copiedToClipboard = ref(false);
const showExportOptions = ref(false);
const exportScope = ref<ExportScope>('all');

const fileInputRef = ref<HTMLInputElement | null>(null);

const dataStats = computed(() => ({
  checkInDays: cookingStore.checkInDates.length,
  cookingRecords: cookingStore.cookingHistory.length,
  notes: cookingStore.notes.length,
  badges: challengesStore.unlockedBadges.length,
  decorations: cookingStore.unlockedDecorations.length,
  aprons: cookingStore.unlockedAprons.length,
  backgrounds: cookingStore.unlockedBackgrounds.length,
  counters: cookingStore.unlockedCounters.length,
  favorites: favoritesStore.favoriteIds.length,
}));

const totalRecords = computed(() =>
  dataStats.value.checkInDays +
  dataStats.value.cookingRecords +
  dataStats.value.notes +
  Object.keys(challengesStore.progressMap).length
);

function handleExport() {
  showExportOptions.value = !showExportOptions.value;
}

function doDownload() {
  backup.downloadBackup(exportScope.value);
  showExportOptions.value = false;
}

async function doCopyToClipboard() {
  const success = await backup.copyBackupToClipboard(exportScope.value);
  if (success) {
    copiedToClipboard.value = true;
    setTimeout(() => {
      copiedToClipboard.value = false;
    }, 2000);
  }
  showExportOptions.value = false;
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    selectedFile.value = file;
    validationResult.value = null;
    importResult.value = null;
  }
}

async function validateFile() {
  if (!selectedFile.value) return;
  
  const content = await selectedFile.value.text();
  validationResult.value = backup.validateBackupJSON(content);
}

async function doImport() {
  if (!selectedFile.value) return;
  
  showConfirmDialog.value = true;
}

async function confirmImport() {
  if (!selectedFile.value) return;
  
  const merge = importMode.value === 'merge';
  importResult.value = await backup.importFromFile(selectedFile.value, merge);
  showConfirmDialog.value = false;
  
  if (importResult.value.success) {
    selectedFile.value = null;
    validationResult.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
}

function cancelImport() {
  showConfirmDialog.value = false;
}

function clearFile() {
  selectedFile.value = null;
  validationResult.value = null;
  importResult.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

const exportScopeOptions = [
  { value: 'all', labelKey: 'backup.export.scope.all', emoji: '📦' },
  { value: 'cooking', labelKey: 'backup.export.scope.cooking', emoji: '🍳' },
  { value: 'challenges', labelKey: 'backup.export.scope.challenges', emoji: '🏆' },
  { value: 'profile', labelKey: 'backup.export.scope.profile', emoji: '👤' },
  { value: 'favorites', labelKey: 'backup.export.scope.favorites', emoji: '⭐' },
  { value: 'settings', labelKey: 'backup.export.scope.settings', emoji: '⚙️' },
];
</script>

<template>
  <div class="space-y-6">
    <div class="card-soft p-5">
      <div class="flex items-center gap-2 mb-4">
        <HardDrive class="text-emerald-500" :size="22" />
        <h3 class="text-display text-lg text-brown-900">{{ t('backup.overview.title') }}</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div class="bg-cream-50 rounded-xl p-3 text-center">
          <div class="text-2xl mb-1">📅</div>
          <div class="text-xl font-bold text-brown-900">{{ dataStats.checkInDays }}</div>
          <div class="text-xs text-brown-800/60">{{ t('backup.overview.checkInDays') }}</div>
        </div>
        <div class="bg-cream-50 rounded-xl p-3 text-center">
          <div class="text-2xl mb-1">🍳</div>
          <div class="text-xl font-bold text-brown-900">{{ dataStats.cookingRecords }}</div>
          <div class="text-xs text-brown-800/60">{{ t('backup.overview.cookingRecords') }}</div>
        </div>
        <div class="bg-cream-50 rounded-xl p-3 text-center">
          <div class="text-2xl mb-1">📝</div>
          <div class="text-xl font-bold text-brown-900">{{ dataStats.notes }}</div>
          <div class="text-xs text-brown-800/60">{{ t('backup.overview.notes') }}</div>
        </div>
        <div class="bg-cream-50 rounded-xl p-3 text-center">
          <div class="text-2xl mb-1">🏆</div>
          <div class="text-xl font-bold text-brown-900">{{ dataStats.badges }}</div>
          <div class="text-xs text-brown-800/60">{{ t('backup.overview.badges') }}</div>
        </div>
        <div class="bg-cream-50 rounded-xl p-3 text-center">
          <div class="text-2xl mb-1">⭐</div>
          <div class="text-xl font-bold text-brown-900">{{ dataStats.favorites }}</div>
          <div class="text-xs text-brown-800/60">{{ t('backup.overview.favorites') }}</div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-cream-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-brown-800/60">{{ t('backup.overview.totalRecords') }}</span>
          <span class="font-medium text-brown-900">{{ totalRecords }} {{ t('backup.overview.records') }}</span>
        </div>
      </div>
    </div>

    <div class="card-soft p-5">
      <div class="flex items-center gap-2 mb-4">
        <Download class="text-blue-500" :size="22" />
        <h3 class="text-display text-lg text-brown-900">{{ t('backup.export.title') }}</h3>
      </div>
      <p class="text-sm text-brown-800/70 mb-4">
        {{ t('backup.export.description') }}
      </p>
      
      <div v-if="showExportOptions" class="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div class="mb-3">
          <label class="text-sm font-medium text-brown-900 block mb-2">{{ t('backup.export.selectScope') }}</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="option in exportScopeOptions"
              :key="option.value"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border-2"
              :class="{
                'bg-blue-100 border-blue-400 text-blue-700': exportScope === option.value,
                'bg-white border-cream-300 text-brown-800/70 hover:border-cream-400': exportScope !== option.value,
              }"
              @click="exportScope = option.value as ExportScope"
            >
              <span>{{ option.emoji }}</span>
              <span>{{ t(option.labelKey) }}</span>
            </button>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98] transition-all"
            @click="doDownload"
          >
            <Download :size="16" />
            {{ t('backup.export.download') }}
          </button>
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] transition-all"
            @click="doCopyToClipboard"
          >
            <component :is="copiedToClipboard ? Check : Copy" :size="16" />
            {{ copiedToClipboard ? t('backup.export.copied') : t('backup.export.copy') }}
          </button>
        </div>
      </div>

      <button
        v-if="!showExportOptions"
        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98] transition-all"
        @click="handleExport"
      >
        <Download :size="18" />
        {{ t('backup.export.button') }}
      </button>
    </div>

    <div class="card-soft p-5">
      <div class="flex items-center gap-2 mb-4">
        <Upload class="text-orange-500" :size="22" />
        <h3 class="text-display text-lg text-brown-900">{{ t('backup.import.title') }}</h3>
      </div>
      <p class="text-sm text-brown-800/70 mb-4">
        {{ t('backup.import.description') }}
      </p>

      <input
        ref="fileInputRef"
        type="file"
        accept=".json,application/json"
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="!selectedFile" class="border-2 border-dashed border-cream-300 rounded-xl p-8 text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer" @click="triggerFileInput">
        <div class="text-4xl mb-3">📁</div>
        <p class="text-brown-800/70 text-sm mb-1">{{ t('backup.import.selectFile') }}</p>
        <p class="text-brown-800/50 text-xs">{{ t('backup.import.supportFormat') }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="text-2xl">📄</div>
            <div>
              <div class="text-sm font-medium text-brown-900">{{ selectedFile.name }}</div>
              <div class="text-xs text-brown-800/60">{{ (selectedFile.size / 1024).toFixed(1) }} KB</div>
            </div>
          </div>
          <button
            class="p-2 text-brown-800/50 hover:text-red-500 transition-colors"
            @click="clearFile"
          >
            <Trash2 :size="18" />
          </button>
        </div>

        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all"
          @click="validateFile"
        >
          <Check :size="16" />
          {{ t('backup.import.validate') }}
        </button>

        <div v-if="validationResult" class="space-y-2">
          <div
            class="p-3 rounded-xl text-sm"
            :class="{
              'bg-green-50 border border-green-200 text-green-800': validationResult.valid && validationResult.warnings.length === 0,
              'bg-amber-50 border border-amber-200 text-amber-800': validationResult.valid && validationResult.warnings.length > 0,
              'bg-red-50 border border-red-200 text-red-800': !validationResult.valid,
            }"
          >
            <div class="flex items-center gap-2 font-medium mb-1">
              <component
                :is="validationResult.valid ? Check : AlertTriangle"
                :size="16"
              />
              {{ validationResult.valid ? t('backup.import.validateSuccess') : t('backup.import.validateFailed') }}
            </div>
            <div v-if="validationResult.errors.length > 0" class="text-xs space-y-1 mt-2">
              <div v-for="(error, idx) in validationResult.errors" :key="idx" class="flex items-start gap-1">
                <span>•</span>
                <span>{{ error }}</span>
              </div>
            </div>
            <div v-if="validationResult.warnings.length > 0" class="text-xs space-y-1 mt-2">
              <div v-for="(warning, idx) in validationResult.warnings" :key="idx" class="flex items-start gap-1">
                <span>⚠️</span>
                <span>{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="validationResult?.valid" class="space-y-3">
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div class="text-sm font-medium text-amber-800 mb-2">{{ t('backup.import.selectMode') }}</div>
            <div class="space-y-2">
              <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all" :class="importMode === 'overwrite' ? 'bg-white shadow-sm border-2 border-amber-400' : 'bg-white/50 border-2 border-transparent hover:bg-white/80'">
                <input
                  type="radio"
                  v-model="importMode"
                  value="overwrite"
                  class="mt-0.5"
                />
                <div>
                  <div class="text-sm font-medium text-brown-900">🔄 {{ t('backup.import.overwrite') }}</div>
                  <div class="text-xs text-brown-800/60 mt-0.5">{{ t('backup.import.overwriteDesc') }}</div>
                </div>
              </label>
              <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all" :class="importMode === 'merge' ? 'bg-white shadow-sm border-2 border-emerald-400' : 'bg-white/50 border-2 border-transparent hover:bg-white/80'">
                <input
                  type="radio"
                  v-model="importMode"
                  value="merge"
                  class="mt-0.5"
                />
                <div>
                  <div class="text-sm font-medium text-brown-900">➕ {{ t('backup.import.merge') }}</div>
                  <div class="text-xs text-brown-800/60 mt-0.5">{{ t('backup.import.mergeDesc') }}</div>
                </div>
              </label>
            </div>
          </div>

          <button
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] transition-all"
            @click="doImport"
          >
            <RefreshCw :size="18" />
            {{ t('backup.import.button') }}
          </button>
        </div>

        <div v-if="importResult" class="space-y-2">
          <div
            class="p-3 rounded-xl text-sm"
            :class="{
              'bg-green-50 border border-green-200 text-green-800': importResult.success,
              'bg-red-50 border border-red-200 text-red-800': !importResult.success,
            }"
          >
            <div class="flex items-center gap-2 font-medium mb-1">
              <component :is="importResult.success ? Check : AlertTriangle" :size="16" />
              {{ importResult.success ? t('backup.import.success') : t('backup.import.failed') }}
            </div>
            <div v-if="importResult.success" class="text-xs mt-1">
              {{ t('backup.import.imported', { n: importResult.importedRecords }) }}
            </div>
            <div v-if="importResult.errors.length > 0" class="text-xs space-y-1 mt-2">
              <div v-for="(error, idx) in importResult.errors" :key="idx" class="flex items-start gap-1">
                <span>•</span>
                <span>{{ error }}</span>
              </div>
            </div>
            <div v-if="importResult.warnings.length > 0" class="text-xs space-y-1 mt-2">
              <div v-for="(warning, idx) in importResult.warnings" :key="idx" class="flex items-start gap-1">
                <span>⚠️</span>
                <span>{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-soft p-5 bg-gradient-to-br from-blue-50 to-cream-100 border-blue-200">
      <div class="flex items-start gap-3">
        <Info class="text-blue-500 flex-shrink-0 mt-0.5" :size="20" />
        <div class="text-sm text-brown-800/70 space-y-1.5 leading-relaxed">
          <p><strong class="text-brown-900">{{ t('backup.tips.title') }}：</strong></p>
          <ul class="space-y-1">
            <li>• {{ t('backup.tips.tip1') }}</li>
            <li>• {{ t('backup.tips.tip2') }}</li>
            <li>• {{ t('backup.tips.tip3') }}</li>
            <li>• {{ t('backup.tips.tip4') }}</li>
          </ul>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showConfirmDialog"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelImport"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="text-center mb-5">
            <div class="text-5xl mb-3">{{ importMode === 'overwrite' ? '⚠️' : '📥' }}</div>
            <h3 class="text-xl font-bold text-brown-900 mb-2">
              {{ importMode === 'overwrite' ? t('backup.import.confirmOverwriteTitle') : t('backup.import.confirmMergeTitle') }}
            </h3>
            <p class="text-sm text-brown-800/70">
              <template v-if="importMode === 'overwrite'">
                {{ t('backup.import.confirmOverwriteDesc') }}
              </template>
              <template v-else>
                {{ t('backup.import.confirmMergeDesc') }}
              </template>
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-cream-200 text-brown-800 hover:bg-cream-300 transition-all"
              @click="cancelImport"
            >
              {{ t('backup.import.cancel') }}
            </button>
            <button
              class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all"
              :class="importMode === 'overwrite' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'"
              @click="confirmImport"
            >
              {{ t('backup.import.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
