<script setup lang="ts">
/** Progress bar. `value` is null for "no tasks" and renders a neutral state, not 0 % (spec: empty ≠ failure). */
const props = defineProps<{ value: number | null; label?: string }>()
</script>

<template>
  <div class="sp-progress">
    <div class="sp-progress__bar" role="progressbar" :aria-valuenow="props.value ?? undefined" aria-valuemin="0" aria-valuemax="100" :aria-label="label ?? 'Postup'">
      <span class="sp-progress__fill" :style="{ width: `${props.value ?? 0}%` }" />
    </div>
    <span class="sp-progress__text">{{ props.value === null ? 'Zatím bez úkolů' : `${props.value} %` }}</span>
  </div>
</template>

<style scoped>
.sp-progress { display: flex; align-items: center; gap: var(--sp-space-2); }
.sp-progress__bar { flex: 1; height: 0.5rem; overflow: hidden; background: var(--sp-color-bg-neutral); border-radius: var(--sp-radius-pill); }
.sp-progress__fill { display: block; height: 100%; background: var(--sp-color-primary); border-radius: inherit; transition: width var(--sp-duration) var(--sp-ease); }
.sp-progress__text { min-width: 4.5rem; font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); text-align: right; }
</style>
