<script setup lang="ts">
/** In-page section navigation (profile tabs): plain anchor links, sticky below the header, highlights the section in view. */
export interface AnchorItem { id: string; label: string }
const props = defineProps<{ items: AnchorItem[]; label?: string }>()
const active = ref(props.items[0]?.id ?? '')
onMounted(() => {
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = e.target.id
  }, { rootMargin: '-30% 0px -60% 0px' })
  for (const it of props.items) { const el = document.getElementById(it.id); if (el) obs.observe(el) }
  onBeforeUnmount(() => obs.disconnect())
})
</script>

<template>
  <nav class="sp-anchor" :aria-label="label ?? 'Sekce stránky'">
    <ul>
      <li v-for="it in items" :key="it.id"><a :href="`#${it.id}`" :class="{ 'is-active': active === it.id }" :aria-current="active === it.id ? 'true' : undefined">{{ it.label }}</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.sp-anchor { position: sticky; top: 0; z-index: 10; background: var(--sp-color-bg); border-bottom: 1px solid var(--sp-color-line); }
.sp-anchor ul { display: flex; gap: var(--sp-space-3); margin: 0; padding: 0; list-style: none; overflow-x: auto; scrollbar-width: none; }
.sp-anchor a { display: block; padding: 0.75rem 0.25rem; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); text-decoration: none; white-space: nowrap; border-bottom: 2px solid transparent; }
.sp-anchor a:hover { color: var(--sp-color-text-strong); }
.sp-anchor a.is-active { color: var(--sp-color-text-strong); font-weight: var(--sp-font-weight-semibold); border-bottom-color: var(--sp-color-primary); }
</style>
