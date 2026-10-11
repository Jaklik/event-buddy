<script setup lang="ts">
import { categoryLabel } from '~/data/mock/suppliers'
import { listSuppliers, type AvailabilityMode, type SortKey } from '~/repositories/suppliers'
import type { PriceLevel } from '~/data/mock/types'

const route = useRoute()
const router = useRouter()
const favorites = useFavorites()

const list = (k: string) => String(route.query[k] ?? '').split(',').filter(Boolean)
const one = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')

const query = computed(() => ({
  categories: list('category'),
  date: one('date') || undefined,
  region: one('region') || undefined,
  priceLevels: list('price') as PriceLevel[],
  availability: (one('availability') || 'all') as AvailabilityMode,
  vipOnly: one('vip') === '1',
  sort: (one('sort') || 'relevance') as SortKey,
  page: Number(one('page')) || 1,
}))

const { data, status } = await useAsyncData('catalogue', () => listSuppliers(query.value), { watch: [query] })

const heading = computed(() => {
  const cats = query.value.categories
  if (cats.length === 1) return categoryLabel(cats[0]!)
  return 'Dodavatelé'
})
const dateLabel = computed(() => (query.value.date ? new Intl.DateTimeFormat('cs', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(query.value.date)) : ''))

// SEO: filtered/dated result pages are not indexed (spec: no mass indexing of parameter combinations).
const filtered = computed(() => Object.keys(route.query).some((k) => k !== 'category') || list('category').length > 1)
useSeoMeta({
  title: () => `${heading.value} – výběr dodavatelů pro svatbu a akce | SelfPlan`,
  description: 'Katalog ověřených dodavatelů pro svatby, oslavy a firemní akce. Filtrujte podle kategorie, lokality, termínu a ceny.',
  robots: () => (filtered.value ? 'noindex, follow' : 'index, follow'),
})

const sortOptions = [
  { value: 'relevance', label: 'Nejlepší shody' },
  { value: 'name', label: 'Název' },
  { value: 'distance', label: 'Vzdálenost' },
  { value: 'price', label: 'Cena modelové zakázky' },
]
const sort = computed({
  get: () => query.value.sort,
  set: (v: string | number) => router.replace({ query: { ...route.query, sort: v === 'relevance' ? undefined : String(v), page: undefined } }),
})
const page = computed({
  get: () => query.value.page,
  set: (p: number) => router.push({ query: { ...route.query, page: p > 1 ? String(p) : undefined } }),
})
const filtersOpen = ref(false)
</script>

<template>
  <div class="sp-container catalogue">
    <nav class="catalogue__crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <span>Dodavatelé</span></nav>
    <header class="catalogue__head">
      <div>
        <SpHeading :level="1">{{ heading }}<template v-if="dateLabel"> v termínu {{ dateLabel }}</template></SpHeading>
        <p class="sp-text-secondary" aria-live="polite">{{ status === 'pending' ? 'Načítám…' : `Nalezeno ${data?.total ?? 0} dodavatelů` }}</p>
      </div>
      <div class="catalogue__tools">
        <SpButton variant="border" size="sm" class="catalogue__filter-btn" :aria-expanded="filtersOpen" @click="filtersOpen = !filtersOpen"><SpIcon name="fa6-solid:sliders" /> Filtry</SpButton>
        <div class="catalogue__sort"><SpSelect v-model="sort" label="Řadit podle" :options="sortOptions" /></div>
      </div>
    </header>

    <div class="catalogue__body">
      <aside class="catalogue__filters" :class="{ 'is-open': filtersOpen }"><CatalogueFilters /></aside>

      <section class="catalogue__results" aria-label="Výsledky hledání">
        <SpAlert v-if="query.date" variant="info" class="sp-mb-3">
          Dostupnost vychází z údajů, které dodavatelé uvádějí. <strong>K ověření</strong> znamená, že termín nelze potvrdit. Zobrazení volného termínu není rezervace.
        </SpAlert>

        <template v-if="data?.sponsored.length">
          <h2 class="catalogue__sub">Sponzorované pozice</h2>
          <div class="sp-grid sp-grid--md-2 sp-grid--lg-3 sp-mb-4">
            <SpSupplierCard
              v-for="s in data.sponsored" :key="`sp-${s.id}`" :to="`/dodavatele/${s.slug}${query.date ? `?date=${query.date}` : ''}`"
              :name="s.name" :image="s.images[0]" :category="categoryLabel(s.categoryCode)" :location="`${s.city}, ${s.region}`" :summary="s.summary"
              :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :availability="s.availability" :price-level="s.priceLevel" :capacity="s.capacity"
              sponsored :vip="s.vip" :favorite="favorites.has(s.id)" @toggle-favorite="favorites.toggle(s.id)"
            />
          </div>
          <h2 class="catalogue__sub">Všichni dodavatelé</h2>
        </template>

        <div v-if="data?.items.length" class="sp-grid sp-grid--md-2 sp-grid--lg-3">
          <SpSupplierCard
            v-for="s in data.items" :key="s.id" :to="`/dodavatele/${s.slug}${query.date ? `?date=${query.date}` : ''}`"
            :name="s.name" :image="s.images[0]" :category="categoryLabel(s.categoryCode)" :location="`${s.city}, ${s.region}`" :summary="s.summary"
            :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :availability="s.availability" :price-level="s.priceLevel" :capacity="s.capacity"
            :vip="s.vip" :favorite="favorites.has(s.id)" @toggle-favorite="favorites.toggle(s.id)"
          />
        </div>
        <SpSurface v-else-if="status !== 'pending'" variant="warm">
          <SpHeading :level="3" as="h2">Nic jsme nenašli</SpHeading>
          <p>Zkuste změnit datum, lokalitu nebo zrušit některý filtr. Případně pošlete <NuxtLink to="/poptavka">poptávku více dodavatelům</NuxtLink>.</p>
          <SpButton variant="border" @click="router.replace({ query: {} })">Zrušit filtry</SpButton>
        </SpSurface>

        <div v-if="data && data.pages > 1" class="sp-mt-4"><SpPagination v-model="page" :pages="data.pages" /></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.catalogue { padding-block: var(--sp-space-3) var(--sp-space-5); }
.catalogue__crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.catalogue__head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--sp-space-3); margin-bottom: var(--sp-space-3); }
.catalogue__tools { display: flex; align-items: center; gap: var(--sp-space-2); }
.catalogue__sort { min-width: 14rem; }
.catalogue__sort :deep(.sp-select) { margin: 0; }
.catalogue__body { display: grid; gap: var(--sp-space-4); align-items: start; }
.catalogue__filters { display: none; }
.catalogue__filters.is-open { display: block; }
.catalogue__sub { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-text-secondary); }
@media (min-width: 992px) {
  .catalogue__body { grid-template-columns: 17rem minmax(0, 1fr); }
  .catalogue__filters { display: block; position: sticky; top: var(--sp-space-3); }
  .catalogue__filter-btn { display: none; }
}
</style>
