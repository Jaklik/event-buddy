<script setup lang="ts">
/** Footer link columns (categories, event types, contact, legal). Links are data; `cookies` renders the settings button. */
export interface FooterColumn { title: string; links: { label: string; to?: string; href?: string; action?: 'cookies' }[] }
defineProps<{ columns: FooterColumn[] }>()
const emit = defineEmits<{ cookies: [] }>()
</script>

<template>
  <div class="sp-footer-nav">
    <div class="sp-container">
      <div class="sp-footer-nav__grid">
        <nav v-for="col in columns" :key="col.title" :aria-label="col.title">
          <h2 class="sp-footer-nav__title">{{ col.title }}</h2>
          <ul>
            <li v-for="l in col.links" :key="l.label">
              <button v-if="l.action === 'cookies'" type="button" class="sp-footer-nav__link" @click="emit('cookies')">{{ l.label }}</button>
              <NuxtLink v-else-if="l.to" :to="l.to" class="sp-footer-nav__link">{{ l.label }}</NuxtLink>
              <a v-else :href="l.href" class="sp-footer-nav__link">{{ l.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sp-footer-nav { margin-top: var(--sp-space-4); padding-block: var(--sp-space-4); background: var(--sp-color-bg-warm); border-top: 1px solid var(--sp-color-line); }
.sp-footer-nav__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-space-4); }
@media (min-width: 768px) { .sp-footer-nav__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.sp-footer-nav__title { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-bold); }
ul { margin: 0; padding: 0; list-style: none; }
li { margin-bottom: 0.35rem; }
.sp-footer-nav__link { padding: 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-strong); text-decoration: none; background: none; border: 0; text-align: left; }
.sp-footer-nav__link:hover { text-decoration: underline; color: var(--sp-color-text-strong); }
</style>
