<script setup lang="ts">
import { RouterView } from 'vue-router';
import OnboardingOverlay from '@/components/OnboardingOverlay.vue';
import TimerAlertToast from '@/components/timer/TimerAlertToast.vue';
import { useKitchenTimer } from '@/composables/useKitchenTimer';

useKitchenTimer();
</script>

<template>
  <div class="min-h-screen pb-10">
    <RouterView v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    <OnboardingOverlay />
    <TimerAlertToast />
  </div>
</template>
