<script setup lang="ts">
/**
 * Heading rule from the old system: Barlow weight 300 for headings, Public Sans for everything else.
 *  level 1 = Common__heading (2rem)   level 2 = Common__heading2 (1.5rem)   level 3 = Common__heading3 (1.25rem)
 *  display = hero heading (3rem, Barlow, weight 300)
 * `as` sets the real HTML tag independent of the visual level (keep a single h1 per page).
 */
const props = withDefaults(
  defineProps<{ level?: 1 | 2 | 3 | 'display'; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' }>(),
  { level: 1 },
)
const tag = computed(() => props.as ?? (props.level === 'display' ? 'h1' : `h${props.level}`))
</script>

<template>
  <component :is="tag" class="sp-heading" :class="`sp-heading--${level}`"><slot /></component>
</template>

<style scoped>
.sp-heading {
  font-family: var(--sp-font-heading);
  font-weight: var(--sp-font-weight-light);
  line-height: var(--sp-leading-tight);
  color: inherit;
}
.sp-heading--1 { font-size: var(--sp-text-2xl); }
.sp-heading--2 { font-size: var(--sp-text-xl); }
.sp-heading--3 { font-size: var(--sp-text-lg); }
.sp-heading--display { font-size: var(--sp-text-3xl); }
@media (max-width: 767.98px) {
  .sp-heading--display { font-size: calc(1.375rem + 1.5vw); }
}
</style>
