<script setup lang="ts">
import { listingCategories, listings } from '~/data/mock/content'

useSeoMeta({ title: 'Eventový bazar – použité dekorace a vybavení | SelfPlan', description: 'Prodejte nebo najděte použité svatební a eventové dekorace a vybavení. Inzerce soukromých prodejců.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/bazar` }] })

const q = ref('')
const cat = ref('')
const sort = ref('new')
const max = ref<number | ''>('')
const list = computed(() => {
  const rows = listings.filter((l) => l.status !== 'sold' && (!cat.value || l.category === cat.value) && (!q.value || l.title.toLowerCase().includes(q.value.toLowerCase())) && (max.value === '' || l.price <= Number(max.value)))
  if (sort.value === 'asc') rows.sort((a, b) => a.price - b.price)
  if (sort.value === 'desc') rows.sort((a, b) => b.price - a.price)
  // Paid placements go first but are always labelled; organic order otherwise newest first.
  return rows.sort((a, b) => Number(b.top) - Number(a.top))
})
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <span>Bazar</span></nav>
    <SpPageHeader title="Eventový bazar" text="Použité dekorace a vybavení od soukromých prodejců. Platba i předání probíhají mimo SelfPlan.">
      <SpButton to="/bazar/novy">Přidat inzerát</SpButton>
    </SpPageHeader>

    <form class="filters" role="search" @submit.prevent>
      <SpInput v-model="q" label="Hledat" />
      <SpSelect v-model="cat" label="Kategorie" :options="[{ value: '', label: 'Všechny kategorie' }, ...listingCategories.map((c) => ({ value: c, label: c }))]" />
      <SpInput v-model="max" label="Cena do (Kč)" type="number" />
      <SpSelect v-model="sort" label="Řadit" :options="[{ value: 'new', label: 'Nejnovější' }, { value: 'asc', label: 'Cena vzestupně' }, { value: 'desc', label: 'Cena sestupně' }]" />
    </form>

    <SpEmpty v-if="!list.length" title="Žádné inzeráty" text="Zkuste změnit filtr, nebo přidejte vlastní inzerát."><SpButton to="/bazar/novy">Přidat inzerát</SpButton></SpEmpty>
    <div v-else class="sp-grid sp-grid--cols-2 sp-grid--lg-4">
      <NuxtLink v-for="l in list" :key="l.id" :to="`/bazar/${l.slug}`" class="card">
        <span class="card__img"><img :src="l.image" :alt="l.title" loading="lazy"><span v-if="l.top" class="card__tag">TOP · Sponzorováno</span><span v-else-if="l.highlighted" class="card__tag">Zvýrazněno · Sponzorováno</span></span>
        <span class="card__body"><strong>{{ l.title }}</strong><span class="card__price">{{ money(l.price) }}</span><small>{{ l.category }} · {{ l.city }}</small></span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.filters { display: grid; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-3) 0; background: var(--sp-color-bg-input); border-radius: var(--sp-radius-md); }
@media (min-width: 768px) { .filters { grid-template-columns: 2fr 1.5fr 1fr 1.2fr; } }
.card { display: flex; flex-direction: column; overflow: hidden; color: inherit; text-decoration: none; background: var(--sp-color-bg); border-radius: var(--sp-radius-md); box-shadow: 0 0 0 1px var(--sp-color-line); transition: transform var(--sp-duration) var(--sp-ease), box-shadow var(--sp-duration) var(--sp-ease); }
.card:hover { transform: translateY(-5px); box-shadow: 0 0 0 1px var(--sp-color-line), var(--sp-shadow-card); color: inherit; }
.card__img { position: relative; display: block; aspect-ratio: 1; }
.card__img img { width: 100%; height: 100%; object-fit: cover; }
.card__tag { position: absolute; left: var(--sp-space-2); top: var(--sp-space-2); padding: 0.1rem 0.5rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-on-brand); background: var(--sp-color-brand); border-radius: 4px; }
.card__body { display: grid; gap: 0.2rem; padding: var(--sp-space-3); }
.card__price { font-weight: var(--sp-font-weight-bold); color: var(--sp-color-primary); }
.card small { color: var(--sp-color-text-muted); }
</style>
