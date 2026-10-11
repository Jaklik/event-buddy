<script setup lang="ts">
import { articles, articleTypeLabel } from '~/data/mock/content'

useSeoMeta({ title: 'Poradna – články, tipy, hry, tradice a vzory smluv | SelfPlan', description: 'Praktické rady pro plánování svateb, oslav a firemních akcí. Články, FAQ, svatební hry, tradice a vzory smluv zdarma.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/poradna` }] })

const type = ref('')
const q = ref('')
const types = [{ v: '', l: 'Vše' }, ...Object.entries(articleTypeLabel).map(([v, l]) => ({ v, l }))]
const list = computed(() => articles.filter((a) => (!type.value || a.type === type.value) && (!q.value || (a.title + a.perex).toLowerCase().includes(q.value.toLowerCase()))))
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <span>Poradna</span></nav>
    <SpPageHeader title="Poradna" text="Články, odpovědi na časté otázky, svatební hry, tradice a vzory smluv. Vše zdarma a bez registrace." />
    <div class="bar">
      <div class="seg" role="group" aria-label="Typ obsahu"><button v-for="t in types" :key="t.v" type="button" :class="{ 'is-on': type === t.v }" :aria-pressed="type === t.v" @click="type = t.v">{{ t.l }}</button></div>
      <div class="search"><SpInput v-model="q" label="Hledat v poradně" /></div>
    </div>
    <SpEmpty v-if="!list.length" title="Nic jsme nenašli" text="Zkuste jiný výraz nebo typ obsahu." />
    <div v-else class="sp-grid sp-grid--md-2 sp-grid--lg-3">
      <SpArticleCard v-for="a in list" :key="a.id" :to="`/poradna/${a.slug}`" :title="a.title" :image="a.image" :tag="a.tag" />
    </div>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.bar { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); align-items: flex-start; margin-bottom: var(--sp-space-3); }
.seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); overflow: hidden; }
.seg button { padding: 0.4rem 0.9rem; font-size: var(--sp-text-sm); background: var(--sp-color-bg); border: 0; }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); }
.search { flex: 1; min-width: 12rem; max-width: 22rem; }
.search :deep(.sp-input) { margin: 0; }
</style>
