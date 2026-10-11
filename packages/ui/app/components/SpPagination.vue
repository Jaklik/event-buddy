<script setup lang="ts">
/** Pagination (Kaminari/Bootstrap look, brand colored current page). Emits the new page number. */
const props = defineProps<{ pages: number }>()
const page = defineModel<number>({ default: 1 })
const visible = computed(() => {
  const set = new Set([1, props.pages, page.value - 1, page.value, page.value + 1])
  return [...set].filter((n) => n >= 1 && n <= props.pages).sort((a, b) => a - b)
})
</script>

<template>
  <nav v-if="pages > 1" class="sp-pagination" aria-label="Stránkování">
    <button type="button" class="sp-pagination__item" :disabled="page <= 1" aria-label="Předchozí stránka" @click="page--"><SpIcon name="fa6-solid:chevron-left" /></button>
    <template v-for="(n, i) in visible" :key="n">
      <span v-if="i > 0 && n - (visible[i - 1] ?? 0) > 1" class="sp-pagination__gap" aria-hidden="true">…</span>
      <button type="button" class="sp-pagination__item" :class="{ 'is-current': n === page }" :aria-current="n === page ? 'page' : undefined" @click="page = n">{{ n }}</button>
    </template>
    <button type="button" class="sp-pagination__item" :disabled="page >= pages" aria-label="Další stránka" @click="page++"><SpIcon name="fa6-solid:chevron-right" /></button>
  </nav>
</template>

<style scoped>
.sp-pagination { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.25rem; }
.sp-pagination__item { min-width: 2.5rem; height: 2.5rem; padding: 0 0.5rem; background: var(--sp-color-bg); border: 1px solid var(--sp-color-border); border-radius: var(--sp-radius-sm); color: var(--sp-color-primary); }
.sp-pagination__item:hover:not(:disabled) { background: var(--sp-color-bg-neutral); }
.sp-pagination__item.is-current { background: var(--sp-color-primary); border-color: var(--sp-color-primary); color: var(--sp-color-on-primary); }
.sp-pagination__item:disabled { color: var(--sp-color-text-muted); opacity: 0.6; }
.sp-pagination__gap { padding: 0 0.25rem; color: var(--sp-color-text-muted); }
</style>
