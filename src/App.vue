<script setup lang="ts">
import { RouterView } from 'vue-router';
import OnboardingOverlay from '@/components/OnboardingOverlay.vue';
</script>

<template>
  <div class="min-h-screen pb-10">
    <RouterView v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    <OnboardingOverlay />
  </div>
</template>
