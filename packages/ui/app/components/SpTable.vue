<script setup lang="ts">
/** Admin/data table (Bootstrap `table table-striped table-responsive`). Slot content is a normal <thead>/<tbody>. */
defineProps<{ striped?: boolean; caption?: string }>()
</script>

<template>
  <div class="sp-table-wrap" tabindex="0" role="region" :aria-label="caption ?? 'Tabulka'">
    <table class="sp-table" :class="{ 'sp-table--striped': striped }">
      <caption v-if="caption" class="sp-visually-hidden">{{ caption }}</caption>
      <slot />
    </table>
  </div>
</template>

<style scoped>
.sp-table-wrap { overflow-x: auto; }
.sp-table { width: 100%; margin-bottom: var(--sp-space-3); vertical-align: top; }
.sp-table :deep(th), .sp-table :deep(td) { padding: 0.5rem; text-align: left; border-bottom: 1px solid var(--sp-color-border); }
.sp-table :deep(th) { font-weight: var(--sp-font-weight-semibold); white-space: nowrap; }
.sp-table--striped :deep(tbody tr:nth-of-type(odd) > *) { background: rgb(0 0 0 / 0.05); }
</style>
