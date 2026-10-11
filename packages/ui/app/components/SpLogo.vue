<script setup lang="ts">
/** Original SelfPlan wordmark (public/brand/logo.svg, fill #1F2835). Link to home by default. */
withDefaults(defineProps<{ width?: number; to?: string }>(), { width: 100, to: '/' })
</script>

<template>
  <NuxtLink :to="to" class="sp-logo" aria-label="SelfPlan – domů">
    <img src="/brand/logo.svg" alt="SelfPlan" :width="width" :height="Math.round(width * 0.2675)" />
  </NuxtLink>
</template>

<style scoped>
.sp-logo { display: inline-flex; align-items: center; padding-block: 0.3125rem; margin-right: var(--sp-space-3); }
.sp-logo img { display: block; height: auto; }
</style>
