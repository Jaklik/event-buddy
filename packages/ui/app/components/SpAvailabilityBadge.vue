<script setup lang="ts">
/**
 * Availability state (spec §22): VOLNO / OBSAZENO / K OVĚŘENÍ. Unknown is never shown as free.
 * Always icon + text, never color alone.
 */
const props = defineProps<{ state: 'free' | 'busy' | 'unknown' }>()
const map = {
  free: { label: 'Volný termín', icon: 'fa6-solid:circle-check' },
  busy: { label: 'Obsazeno', icon: 'fa6-solid:circle-xmark' },
  unknown: { label: 'Dostupnost k ověření', icon: 'fa6-solid:circle-question' },
} as const
const m = computed(() => map[props.state])
</script>

<template>
  <span class="sp-avail" :class="`sp-avail--${state}`"><SpIcon :name="m.icon" /> {{ m.label }}</span>
</template>

<style scoped>
.sp-avail { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.15rem 0.6rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-semibold); border-radius: var(--sp-radius-pill); white-space: nowrap; }
.sp-avail--free { color: #0f5f0f; background: var(--sp-color-success-bg); }
.sp-avail--busy { color: #8c1414; background: var(--sp-color-danger-bg); }
.sp-avail--unknown { color: #664d03; background: var(--sp-color-warning-bg); }
</style>
