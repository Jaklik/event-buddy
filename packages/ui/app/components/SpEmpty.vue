<script setup lang="ts">
/** Empty state: friendly message plus the next action. Never shows fake data or zero-as-failure. */
defineProps<{ title: string; text?: string; icon?: string }>()
</script>

<template>
  <div class="sp-empty">
    <SpIcon :name="icon ?? 'fa6-regular:folder-open'" size="2rem" class="sp-empty__icon" />
    <h3 class="sp-empty__title">{{ title }}</h3>
    <p v-if="text" class="sp-empty__text">{{ text }}</p>
    <div class="sp-empty__actions"><slot /></div>
  </div>
</template>

<style scoped>
.sp-empty { padding: var(--sp-space-5) var(--sp-space-3); text-align: center; background: var(--sp-color-bg-warm); border-radius: var(--sp-radius-md); }
.sp-empty__icon { color: var(--sp-color-brand); }
.sp-empty__title { margin: var(--sp-space-2) 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
.sp-empty__text { max-width: 28rem; margin: 0 auto var(--sp-space-3); color: var(--sp-color-text-secondary); }
.sp-empty__actions { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); justify-content: center; }
</style>
