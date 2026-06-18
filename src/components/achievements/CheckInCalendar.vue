<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next';
import { useCookingStore } from '@/stores/cooking';

const store = useCookingStore();

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());
const slideDirection = ref<'left' | 'right'>('right');
const animationKey = ref(0);

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const monthTitle = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`;
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const daysInPrevMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate();
});

const calendarDays = computed(() => {
  const days: Array<{
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
    dateStr: string;
    isCheckedIn: boolean;
  }> = [];

  const prevMonthDays = firstDayOfMonth.value;
  const prevYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
  const prevMonth = currentMonth.value === 0 ? 11 : currentMonth.value - 1;

  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = daysInPrevMonth.value - i;
    const date = new Date(prevYear, prevMonth, day);
    const dateStr = formatDate(date);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
      isFuture: date > today,
      dateStr,
      isCheckedIn: store.hasCheckedInOn(dateStr),
    });
  }

  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    const dateStr = formatDate(date);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday,
      isFuture: date > today && !isToday,
      dateStr,
      isCheckedIn: store.hasCheckedInOn(dateStr),
    });
  }

  const remainingDays = 42 - days.length;
  const nextYear = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
  const nextMonth = currentMonth.value === 11 ? 0 : currentMonth.value + 1;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    const dateStr = formatDate(date);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
      isFuture: date > today,
      dateStr,
      isCheckedIn: store.hasCheckedInOn(dateStr),
    });
  }

  return days;
});

const monthlyStats = computed(() => {
  let checkedDays = 0;
  let totalValidDays = 0;

  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    const dateStr = formatDate(date);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    if (date <= today || isToday) {
      totalValidDays++;
      if (store.hasCheckedInOn(dateStr)) {
        checkedDays++;
      }
    }
  }

  const rate = totalValidDays > 0 ? Math.round((checkedDays / totalValidDays) * 100) : 0;

  return {
    checkedDays,
    totalValidDays,
    rate,
  };
});

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function prevMonth(): void {
  slideDirection.value = 'left';
  animationKey.value++;
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth(): void {
  slideDirection.value = 'right';
  animationKey.value++;
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function goToToday(): void {
  const newMonth = today.getMonth();
  const newYear = today.getFullYear();
  if (newMonth > currentMonth.value || newYear > currentYear.value) {
    slideDirection.value = 'right';
  } else {
    slideDirection.value = 'left';
  }
  animationKey.value++;
  currentMonth.value = newMonth;
  currentYear.value = newYear;
}

const isCurrentMonth = computed(() => {
  return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth();
});

const enterFromClass = computed(() => {
  return slideDirection.value === 'right'
    ? 'translate-x-8 opacity-0'
    : '-translate-x-8 opacity-0';
});
</script>

<template>
  <div class="card-soft p-5 sm:p-6">
    <div class="flex items-center justify-between mb-5">
      <button
        class="w-9 h-9 flex items-center justify-center rounded-2xl text-brown-700 hover:bg-cream-200 active:scale-95 transition-all"
        @click="prevMonth"
      >
        <ChevronLeft :size="22" :stroke-width="2.5" />
      </button>

      <div class="flex items-center gap-2">
        <h2 class="text-display text-xl sm:text-2xl text-brown-900">
          {{ monthTitle }}
        </h2>
        <button
          v-if="!isCurrentMonth"
          class="chip bg-apricot-500/15 text-apricot-600 border border-apricot-500/30 hover:bg-apricot-500/25 transition-colors"
          @click="goToToday"
        >
          今天
        </button>
      </div>

      <button
        class="w-9 h-9 flex items-center justify-center rounded-2xl text-brown-700 hover:bg-cream-200 active:scale-95 transition-all"
        @click="nextMonth"
      >
        <ChevronRight :size="22" :stroke-width="2.5" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="(day, idx) in weekDays"
        :key="day"
        class="text-center text-xs font-medium py-2"
        :class="idx === 0 || idx === 6 ? 'text-apricot-500' : 'text-brown-700/60'"
      >
        {{ day }}
      </div>
    </div>

    <div class="relative overflow-hidden">
      <Transition
        mode="out-in"
        @enter="(el) => { el.classList.add('transition-all', 'duration-300', 'ease-out'); }"
        @leave="(el) => { el.classList.add('transition-all', 'duration-200', 'ease-in'); }"
      >
        <div
          :key="animationKey"
          :class="enterFromClass"
          class="grid grid-cols-7 gap-1"
          data-calendar-grid
        >
          <div
            v-for="(cell, idx) in calendarDays"
            :key="idx"
            class="relative aspect-square flex items-center justify-center rounded-xl transition-all duration-200"
            :class="[
              !cell.isCurrentMonth ? 'text-brown-800/25' : '',
              cell.isCurrentMonth && cell.isFuture ? 'text-brown-800/20' : '',
              cell.isCurrentMonth && !cell.isFuture && !cell.isCheckedIn ? 'text-brown-800' : '',
              cell.isCheckedIn ? 'bg-matcha-500/20 rounded-xl' : '',
            ]"
          >
            <div
              v-if="cell.isToday"
              class="absolute inset-0.5 rounded-xl border-2 border-apricot-500 flex items-center justify-center"
            >
              <div class="absolute inset-1 rounded-xl bg-apricot-500/10" />
            </div>

            <span
              class="relative z-10 text-sm sm:text-base transition-colors"
              :class="[
                cell.isCheckedIn ? 'font-bold text-matcha-600' : '',
                cell.isToday && !cell.isCheckedIn ? 'font-bold text-apricot-600' : '',
              ]"
            >
              {{ cell.day }}
            </span>

            <div
              v-if="cell.isCheckedIn && cell.isCurrentMonth"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-apricot-500" />
              <Check
                v-if="cell.isToday"
                :size="10"
                class="text-matcha-600 -ml-0.5"
                :stroke-width="3"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="mt-6 pt-5 border-t border-cream-300/70">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="flex items-baseline gap-1">
            <span class="text-display text-2xl text-apricot-600">{{ monthlyStats.checkedDays }}</span>
            <span class="text-sm text-brown-800/60">/ {{ monthlyStats.totalValidDays }}天</span>
          </div>
          <div class="chip bg-apricot-500/15 text-apricot-600 border border-apricot-500/25">
            完成率 {{ monthlyStats.rate }}%
          </div>
        </div>
        <div
          v-if="store.streakDays > 0"
          class="chip bg-matcha-500/20 text-matcha-600 border border-matcha-500/30 font-medium"
        >
          <span class="text-base leading-none mr-0.5">🔥</span>
          连续 {{ store.streakDays }} 天
        </div>
      </div>

      <div class="h-3 rounded-full bg-cream-200/80 overflow-hidden border border-cream-300/60">
        <div
          class="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          :style="{
            width: `${monthlyStats.rate}%`,
            background: 'linear-gradient(90deg, #FFA66D, #FF8C42, #F57C2E)',
          }"
        >
          <div
            class="absolute inset-0 opacity-40"
            style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 2s infinite;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
