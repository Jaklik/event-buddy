<script setup lang="ts">
/** KPI tile (dashboard): big number, label, optional hint/trend and a link. Zero is shown neutrally, never as a failure. */
defineProps<{ value: string | number; label: string; hint?: string; icon?: string; to?: string }>()
</script>

<template>
  <component :is="to ? resolveComponent('NuxtLink') : 'div'" v-bind="to ? { to } : {}" class="sp-stat">
    <span v-if="icon" class="sp-stat__icon"><SpIcon :name="icon" size="1.25rem" /></span>
    <span class="sp-stat__body">
      <span class="sp-stat__value">{{ value }}</span>
      <span class="sp-stat__label">{{ label }}</span>
      <span v-if="hint" class="sp-stat__hint">{{ hint }}</span>
    </span>
  </component>
</template>

<style scoped>
.sp-stat { display: flex; align-items: center; gap: var(--sp-space-3); padding: var(--sp-space-3); color: inherit; text-decoration: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); }
a.sp-stat:hover { box-shadow: var(--sp-shadow-card); color: inherit; }
.sp-stat__icon { display: grid; place-items: center; flex: none; width: 2.75rem; height: 2.75rem; color: var(--sp-color-brand-strong); background: var(--sp-color-brand-soft); border-radius: var(--sp-radius-sm); }
.sp-stat__body { display: flex; flex-direction: column; min-width: 0; }
.sp-stat__value { font-family: var(--sp-font-heading); font-size: var(--sp-text-2xl); font-weight: var(--sp-font-weight-regular); line-height: 1.1; }
.sp-stat__label { font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.sp-stat__hint { font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
</style>
