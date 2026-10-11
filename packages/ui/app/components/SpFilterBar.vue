<script setup lang="ts">
/**
 * Search/filter panel (Filter): tinted background, radius 1rem, transparent inner fields with muted icons,
 * round 40px submit button (full-width on mobile). Wrap a form; fields are SpFilterField.
 */
defineProps<{ submitLabel?: string }>()
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <form class="sp-filter" role="search" @submit.prevent="emit('submit')">
    <div class="sp-filter__fields"><slot /></div>
    <SpButton type="submit" circle class="sp-filter__submit" :label="submitLabel ?? 'Hledat'">
      <SpIcon name="fa6-solid:magnifying-glass" /><span class="sp-filter__submit-text">{{ submitLabel ?? 'Hledat' }}</span>
    </SpButton>
  </form>
</template>

<style scoped>
.sp-filter { display: flex; flex-direction: column; gap: var(--sp-space-2); padding: var(--sp-space-2); background: var(--sp-color-bg-input); border-radius: var(--sp-radius-md); }
.sp-filter__fields { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
.sp-filter__submit { width: 100%; border-radius: var(--sp-radius-sm); background: var(--sp-color-text-secondary); }
.sp-filter__submit:hover { background: var(--sp-color-text-secondary); }
.sp-filter__submit-text { margin-left: var(--sp-space-2); }
@media (min-width: 768px) {
  .sp-filter { flex-direction: row; align-items: center; padding: 0 var(--sp-space-3); }
  .sp-filter__fields { flex-direction: row; align-items: center; gap: var(--sp-space-3); }
  .sp-filter__submit { width: 40px; border-radius: var(--sp-radius-full); }
  .sp-filter__submit-text { display: none; }
}
</style>
