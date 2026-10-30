<script setup lang="ts">
/**
 * Footer link columns. Four columns on desktop; on mobile each group is a collapsible section (collapsed after mount,
 * open without JavaScript). Links are real anchors; `action: 'cookies'` renders a button that reopens consent settings.
 */
export interface FooterColumn { title: string; links: { label: string; to?: string; href?: string; action?: 'cookies' }[] }
defineProps<{ columns: FooterColumn[] }>()
const emit = defineEmits<{ cookies: [] }>()
const open = ref(true)
const desktop = ref(true)
onMounted(() => {
  const mq = window.matchMedia('(min-width: 768px)')
  const apply = () => { desktop.value = mq.matches; open.value = mq.matches }
  apply()
  mq.addEventListener('change', apply)
})
const openState = reactive<Record<string, boolean>>({})
const isOpen = (t: string) => (desktop.value ? true : (openState[t] ?? false))
</script>

<template>
  <div class="sp-footer-nav">
    <div class="sp-container">
      <div class="sp-footer-nav__grid">
        <nav v-for="col in columns" :key="col.title" :aria-label="col.title" class="col">
          <h2 class="col__title">
            <button v-if="!desktop" type="button" class="col__toggle" :aria-expanded="isOpen(col.title)" @click="openState[col.title] = !isOpen(col.title)">{{ col.title }}<SpIcon :name="isOpen(col.title) ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" /></button>
            <template v-else>{{ col.title }}</template>
          </h2>
          <ul v-show="isOpen(col.title)">
            <li v-for="l in col.links" :key="l.label">
              <button v-if="l.action === 'cookies'" type="button" class="col__link" @click="emit('cookies')">{{ l.label }}</button>
              <NuxtLink v-else-if="l.to" :to="l.to" class="col__link">{{ l.label }}</NuxtLink>
              <a v-else :href="l.href" class="col__link">{{ l.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sp-footer-nav { margin-top: var(--sp-space-4); padding-block: var(--sp-space-4); background: var(--sp-color-bg-warm); border-top: 1px solid var(--sp-color-line); }
.sp-footer-nav__grid { display: grid; gap: 0; }
@media (min-width: 768px) { .sp-footer-nav__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-space-4); } }
.col { border-bottom: 1px solid var(--sp-color-line); }
@media (min-width: 768px) { .col { border-bottom: 0; } }
.col__title { margin: 0; font-family: var(--sp-font-body); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-bold); }
@media (min-width: 768px) { .col__title { margin-bottom: var(--sp-space-2); } }
.col__toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: var(--sp-control-h); padding: 0; font: inherit; color: inherit; background: none; border: 0; text-align: left; }
ul { margin: 0 0 var(--sp-space-2); padding: 0; list-style: none; }
li { margin: 0; }
.col__link { display: inline-flex; align-items: center; min-height: 2.5rem; padding: 0; font: inherit; font-size: var(--sp-text-sm); color: var(--sp-color-primary); text-decoration: none; background: none; border: 0; text-align: left; }
.col__link:hover { text-decoration: underline; color: var(--sp-color-primary-hover); }
@media (min-width: 768px) { .col__link { min-height: 2rem; } }
</style>
