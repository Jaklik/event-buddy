<script setup lang="ts">
/**
 * Content box. Variants from Common__content*:
 *  neutral  light grey-blue, radius 2rem   (Common__content)
 *  warm     warm beige, radius .5rem       (Common__content_yellow, review cards, empty states)
 *  card     white with hairline border, radius 1rem (Bootstrap card used by Sidebar / Supplier-card)
 *  input    tinted like form inputs, radius 1rem   (Filter panel)
 */
withDefaults(defineProps<{ variant?: 'neutral' | 'warm' | 'card' | 'input'; as?: string; flush?: boolean }>(), {
  variant: 'neutral',
  as: 'div',
})
</script>

<template>
  <component :is="as" class="sp-surface" :class="[`sp-surface--${variant}`, { 'sp-surface--flush': flush }]">
    <slot />
  </component>
</template>

<style scoped>
.sp-surface { padding: var(--sp-space-4); }
.sp-surface--flush { padding: 0; }
.sp-surface--neutral { background: var(--sp-color-bg-neutral); border-radius: var(--sp-radius-lg); }
.sp-surface--warm { background: var(--sp-color-bg-warm); border-radius: var(--sp-radius-sm); }
.sp-surface--card {
  background: var(--sp-color-bg);
  border: 1px solid var(--sp-color-line);
  border-radius: var(--sp-radius-md);
  overflow: hidden;
}
.sp-surface--input { background: var(--sp-color-bg-input); border-radius: var(--sp-radius-md); padding-inline: var(--sp-space-3); }
</style>
