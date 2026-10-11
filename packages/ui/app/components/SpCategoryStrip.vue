<script setup lang="ts">
/**
 * Horizontal strip of supplier categories: round icon/photo + label, links to an indexable category page.
 * Scrolls with arrow buttons and the keyboard (it is a normal scroll container, no hidden content).
 * Items come from the managed category selection; an empty list renders nothing (spec: hide on data error).
 */
export interface CategoryItem { label: string; to: string; icon?: string; image?: string }
const props = defineProps<{ items: CategoryItem[]; label?: string }>()
const scroller = ref<HTMLElement>()
const canPrev = ref(false)
const canNext = ref(false)
function update() {
  const el = scroller.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scrollBy(dir: 1 | -1) {
  const el = scroller.value
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
onMounted(() => { update(); window.addEventListener('resize', update) })
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
  <nav v-if="props.items.length" class="sp-cat" :aria-label="props.label ?? 'Kategorie dodavatelů'">
    <button type="button" class="sp-cat__arrow" :disabled="!canPrev" aria-label="Posunout kategorie doleva" @click="scrollBy(-1)"><SpIcon name="fa6-solid:chevron-left" /></button>
    <ul ref="scroller" class="sp-cat__list" @scroll.passive="update">
      <li v-for="c in props.items" :key="c.to" class="sp-cat__item">
        <NuxtLink :to="c.to" class="sp-cat__link">
          <span class="sp-cat__media">
            <img v-if="c.image" :src="c.image" alt="" loading="lazy" width="72" height="72" />
            <SpIcon v-else-if="c.icon" :name="c.icon" size="1.75rem" />
          </span>
          <span class="sp-cat__label">{{ c.label }}</span>
        </NuxtLink>
      </li>
    </ul>
    <button type="button" class="sp-cat__arrow" :disabled="!canNext" aria-label="Posunout kategorie doprava" @click="scrollBy(1)"><SpIcon name="fa6-solid:chevron-right" /></button>
  </nav>
</template>

<style scoped>
.sp-cat { display: flex; align-items: center; gap: var(--sp-space-2); }
.sp-cat__list { display: flex; flex: 1; gap: var(--sp-space-3); margin: 0; padding: var(--sp-space-2) 0; list-style: none; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none; }
.sp-cat__list::-webkit-scrollbar { display: none; }
.sp-cat__item { flex: 0 0 auto; scroll-snap-align: start; }
.sp-cat__link { display: flex; flex-direction: column; align-items: center; gap: var(--sp-space-2); width: 6rem; color: var(--sp-color-text-strong); text-align: center; text-decoration: none; }
.sp-cat__media {
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  overflow: hidden;
  color: var(--sp-color-brand-strong);
  background: var(--sp-color-brand-soft);
  border: 2px solid var(--sp-color-bg);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--sp-color-line);
  transition: transform var(--sp-duration) var(--sp-ease), box-shadow var(--sp-duration) var(--sp-ease);
}
.sp-cat__media img { width: 100%; height: 100%; object-fit: cover; }
.sp-cat__link:hover .sp-cat__media, .sp-cat__link:focus-visible .sp-cat__media { transform: translateY(-3px); box-shadow: 0 0 0 1px var(--sp-color-line), var(--sp-shadow-card); }
.sp-cat__label { font-size: var(--sp-text-sm); line-height: 1.25; }
.sp-cat__link:hover .sp-cat__label { text-decoration: underline; }
.sp-cat__arrow { flex: none; display: none; place-items: center; width: 2rem; height: 2rem; color: var(--sp-color-text-strong); background: none; border: 0; border-radius: 50%; }
.sp-cat__arrow:disabled { opacity: 0.25; }
@media (min-width: 768px) { .sp-cat__arrow { display: grid; } }
</style>
