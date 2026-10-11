<script setup lang="ts">
/** Page title row for panels: heading, optional description and a right-aligned action slot. */
defineProps<{ title: string; text?: string }>()
</script>

<template>
  <header class="sp-page-header">
    <div>
      <SpHeading :level="1" class="sp-page-header__title">{{ title }}</SpHeading>
      <p v-if="text" class="sp-page-header__text">{{ text }}</p>
    </div>
    <div class="sp-page-header__actions"><slot /></div>
  </header>
</template>

<style scoped>
.sp-page-header { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--sp-space-3); margin-bottom: var(--sp-space-4); }
.sp-page-header__title { margin-bottom: 0.25rem; }
.sp-page-header__text { margin: 0; color: var(--sp-color-text-secondary); }
.sp-page-header__actions { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); }
</style>
