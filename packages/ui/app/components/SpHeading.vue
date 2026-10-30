<script setup lang="ts">
/**
 * Brand manual: Sentient for accent headings, Public Sans for everything else.
 *  level 1 = H1 (32-56px fluid)   level 2 = H2 (24-36px)   level 3 = H3 (19-24px)   display = same size as H1 (hero)
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
  font-weight: var(--sp-font-weight-medium);
  line-height: var(--sp-leading-tight);
  letter-spacing: -0.005em;
  color: inherit;
}
.sp-heading--1 { font-size: var(--sp-text-h1); }
.sp-heading--2 { font-size: var(--sp-text-h2); }
.sp-heading--3 { font-size: var(--sp-text-h3); }
.sp-heading--display { font-size: var(--sp-text-h1); }
</style>
