<script setup lang="ts">
/**
 * Accessible tab list (WAI-ARIA tabs pattern): arrow keys move between tabs, Home/End jump.
 * Panels are rendered by the parent with `v-show="active === id"` and `role="tabpanel"`.
 * `idPrefix` links tab and panel ids: tab `${idPrefix}-tab-${id}`, panel `${idPrefix}-panel-${id}`.
 */
export interface TabItem { id: string; label: string; badge?: number | string }
const props = defineProps<{ items: TabItem[]; idPrefix?: string; label?: string }>()
const active = defineModel<string>({ required: true })
const prefix = props.idPrefix ?? 'tabs'
const buttons = ref<HTMLElement[]>([])
function onKey(e: KeyboardEvent, i: number) {
  const n = props.items.length
  const to = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
  if (to < 0) return
  e.preventDefault()
  active.value = props.items[to]!.id
  nextTick(() => buttons.value[to]?.focus())
}
</script>

<template>
  <div class="sp-tabs" role="tablist" :aria-label="label ?? 'Záložky'">
    <button
      v-for="(t, i) in items" :key="t.id" :ref="(el) => { if (el) buttons[i] = el as HTMLElement }" type="button" role="tab"
      :id="`${prefix}-tab-${t.id}`" :aria-controls="`${prefix}-panel-${t.id}`" :aria-selected="active === t.id" :tabindex="active === t.id ? 0 : -1"
      class="sp-tabs__tab" :class="{ 'is-active': active === t.id }" @click="active = t.id" @keydown="onKey($event, i)"
    >{{ t.label }}<span v-if="t.badge" class="sp-tabs__badge">{{ t.badge }}</span></button>
  </div>
</template>

<style scoped>
.sp-tabs { display: flex; gap: var(--sp-space-1); margin-bottom: var(--sp-space-3); overflow-x: auto; border-bottom: 1px solid var(--sp-color-line); scrollbar-width: none; }
.sp-tabs__tab { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1rem; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); white-space: nowrap; background: none; border: 0; border-bottom: 2px solid transparent; }
.sp-tabs__tab:hover { color: var(--sp-color-text-strong); }
.sp-tabs__tab.is-active { color: var(--sp-color-text-strong); font-weight: var(--sp-font-weight-semibold); border-bottom-color: var(--sp-color-primary); }
.sp-tabs__badge { padding: 0 0.4rem; font-size: var(--sp-text-xs); color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-radius: var(--sp-radius-pill); }
</style>
