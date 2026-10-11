<script setup lang="ts">
import { articles, articleTypeLabel } from '~/data/mock/content'

const route = useRoute()
const a = articles.find((x) => x.slug === String(route.params.slug))
if (!a) throw createError({ statusCode: 404, statusMessage: 'Článek nenalezen', fatal: true })
useSeoMeta({ title: `${a.title} | Poradna SelfPlan`, description: a.perex, ogImage: a.image })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/poradna/${a.slug}` }] })
const related = articles.filter((x) => x.id !== a.id && (x.eventType === a.eventType || x.type === a.type)).slice(0, 3)
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/poradna">Poradna</NuxtLink> / <span>{{ a.title }}</span></nav>
    <article class="art">
      <p><SpBadge>{{ articleTypeLabel[a.type] }}</SpBadge> <span class="sp-text-sm sp-text-muted">{{ fmtDate(a.date) }}</span></p>
      <SpHeading :level="1">{{ a.title }}</SpHeading>
      <p class="perex">{{ a.perex }}</p>
      <img :src="a.image" :alt="a.title" class="hero">
      <p v-for="(p, i) in a.body" :key="i">{{ p }}</p>
      <SpAlert v-if="a.type === 'smlouva'" variant="warning">Vzor je informativní a nenahrazuje právní poradenství.</SpAlert>
      <SpSurface variant="warm" class="cta"><h2>Navazující nástroje</h2><div class="sp-row sp-row--tight"><SpButton size="sm" to="/planovac-akci">Plánovač</SpButton><SpButton size="sm" variant="border" to="/dodavatele">Najít dodavatele</SpButton></div></SpSurface>
    </article>
    <h2 class="h2">Související</h2>
    <div class="sp-grid sp-grid--md-3"><SpArticleCard v-for="r in related" :key="r.id" :to="`/poradna/${r.slug}`" :title="r.title" :image="r.image" :tag="r.tag" /></div>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.art { max-width: 44rem; margin-bottom: var(--sp-space-5); }
.perex { font-size: var(--sp-text-lg); color: var(--sp-color-text-secondary); }
.hero { width: 100%; margin: var(--sp-space-3) 0; border-radius: var(--sp-radius-md); aspect-ratio: 16 / 9; object-fit: cover; }
.cta { margin-top: var(--sp-space-4); }
.cta h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.h2 { margin: 0 0 var(--sp-space-3); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
</style>
