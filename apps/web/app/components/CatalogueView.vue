<script setup lang="ts">
import { catByCode, subLabel, taxonomy } from '~/data/mock/taxonomy'
import { categoryOverview, listSuppliers } from '~/repositories/suppliers'
import { activeFilters, COMMON_KEYS, parseCatalogueQuery } from '~/utils/catalogueQuery'

/**
 * Catalogue: entry overview (no category) or SEO category landing page. Shared by
 * /dodavatele and /dodavatele/kategorie/[slug]. All state is in the URL.
 */
const props = defineProps<{ category?: string }>()
const route = useRoute()
const router = useRouter()
const favorites = useFavorites()

const cat = computed(() => (props.category ? catByCode(props.category) : undefined))
const query = computed(() => parseCatalogueQuery(route.query as Record<string, string>, props.category))
const { data, status } = await useAsyncData(`catalogue-${props.category ?? 'all'}`, () => listSuppliers(query.value), { watch: [query] })
const { data: overview } = await useAsyncData('catalogue-overview', () => categoryOverview())

const chips = computed(() => activeFilters(route.query as Record<string, string>, props.category))
const subFilterCount = computed(() => chips.value.filter((c) => c.id !== 'sub').length)

function clear(patch: Record<string, undefined>) {
  const q: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch, page: undefined })) if (typeof v === 'string' && v) q[k] = v
  router.replace({ query: q })
}
function clearAll() { router.replace({ query: {} }) }

/** Switching category keeps date, location, event type and sort; category-specific filters are dropped. */
function commonQuery() {
  const q: Record<string, string> = {}
  for (const k of COMMON_KEYS) if (typeof route.query[k] === 'string') q[k] = route.query[k] as string
  return q
}
const catLink = (slug?: string) => ({ path: slug ? `/dodavatele/kategorie/${slug}` : '/dodavatele', query: commonQuery() })
const subLink = (code?: string) => ({ query: { ...Object.fromEntries(Object.entries(route.query).filter(([k]) => !k.startsWith('page'))), podkategorie: code } as Record<string, string | undefined> })

const dateSuffix = computed(() => (query.value.date ? `?date=${query.value.date}` : ''))
const detailLink = (slug: string) => {
  const q = new URLSearchParams()
  if (query.value.date) q.set('date', query.value.date)
  if (query.value.eventType) q.set('typ', query.value.eventType)
  if (query.value.region) q.set('region', query.value.region)
  if (query.value.guests) q.set('hostu', String(query.value.guests))
  const s = q.toString()
  return `/dodavatele/${slug}${s ? `?${s}` : ''}`
}

const heading = computed(() => cat.value?.label ?? 'Dodavatelé')
const intro = computed(() => cat.value?.intro ?? 'Vyberte kategorii nebo hledejte ve všech dodavatelích. Datum a lokalita se zachovají při přechodu mezi kategoriemi i do poptávky.')
const dateLabel = computed(() => (query.value.date ? new Intl.DateTimeFormat('cs', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(query.value.date)) : ''))

// SEO: the clean category page is indexable; any filter/date/sort/page combination is noindex (no mass indexing).
const filtered = computed(() => Object.keys(route.query).length > 0)
const siteUrl = useRuntimeConfig().public.siteUrl // read in setup: runtime config is not available lazily during SSR head rendering
const canonical = computed(() => `${siteUrl}${props.category ? `/dodavatele/kategorie/${cat.value?.slug}` : '/dodavatele'}`)
useSeoMeta({
  title: () => `${heading.value} – výběr dodavatelů pro svatby, oslavy a firemní akce | SelfPlan`,
  description: () => cat.value ? `${cat.value.intro} Filtrujte podle lokality, termínu a parametrů.` : 'Katalog dodavatelů pro svatby, oslavy a firemní akce. Vyberte kategorii a filtrujte podle lokality, termínu a ceny.',
  robots: () => (filtered.value ? 'noindex, follow' : 'index, follow'),
})
useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))

const sortOptions = [{ value: 'relevance', label: 'Nejlepší shody' }, { value: 'name', label: 'Název' }, { value: 'distance', label: 'Vzdálenost' }, { value: 'price', label: 'Cena modelové zakázky' }]
const sort = computed(() => query.value.sort ?? 'relevance')
function setSort(v: string | number) {
  const q: Record<string, string> = {}
  for (const [k, val] of Object.entries({ ...route.query, sort: String(v) === 'relevance' ? undefined : String(v), page: undefined })) if (typeof val === 'string' && val) q[k] = val
  router.replace({ query: q })
}
const page = computed({
  get: () => query.value.page ?? 1,
  set: (p: number) => router.push({ query: { ...route.query, page: p > 1 ? String(p) : undefined } as Record<string, string | undefined> }),
})
const filtersOpen = ref(false)
</script>

<template>
  <div class="sp-container cv">
    <nav class="cv__crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink v-if="cat" :to="catLink()">Dodavatelé</NuxtLink><span v-else>Dodavatelé</span><template v-if="cat"> / <span>{{ cat.label }}</span></template></nav>

    <header class="cv__head">
      <SpHeading :level="1">{{ heading }}<template v-if="dateLabel"> v termínu {{ dateLabel }}</template></SpHeading>
      <p class="cv__intro">{{ intro }}</p>
    </header>

    <nav class="cv__cats" aria-label="Kategorie dodavatelů">
      <NuxtLink :to="catLink()" class="cv__chip" :class="{ 'is-on': !category }">Všechny</NuxtLink>
      <NuxtLink v-for="c in taxonomy" :key="c.code" :to="catLink(c.slug)" class="cv__chip" :class="{ 'is-on': category === c.code }" :aria-current="category === c.code ? 'page' : undefined">{{ c.label }}</NuxtLink>
    </nav>

    <nav v-if="cat && cat.subs.length > 1" class="cv__subs" aria-label="Podkategorie">
      <NuxtLink :to="subLink(undefined)" class="cv__sub" :class="{ 'is-on': !query.sub }">Vše v kategorii</NuxtLink>
      <NuxtLink v-for="s in cat.subs" :key="s.code" :to="subLink(s.code)" class="cv__sub" :class="{ 'is-on': query.sub === s.code }">{{ s.label }}</NuxtLink>
    </nav>

    <section v-if="!category && overview" class="cv__overview" aria-label="Rozcestník kategorií">
      <NuxtLink v-for="c in overview" :key="c.code" :to="catLink(c.slug)" class="cv__tile">
        <SpCircleIcon :icon="c.icon" size="3rem" />
        <span class="cv__tile-body"><strong>{{ c.label }}</strong><small>{{ c.count }} dodavatelů (ukázka)</small></span>
      </NuxtLink>
    </section>

    <div class="cv__bar">
      <p class="cv__count" aria-live="polite">{{ status === 'pending' ? 'Načítám…' : `Nalezeno ${data?.total ?? 0} dodavatelů` }}</p>
      <div class="cv__tools">
        <SpButton variant="border" class="cv__filter-btn" :aria-expanded="filtersOpen" @click="filtersOpen = true"><SpIcon name="fa6-solid:sliders" /> Filtry<span v-if="subFilterCount" class="cv__badge">{{ subFilterCount }}</span></SpButton>
        <div class="cv__sort"><SpSelect :model-value="sort" label="Řadit podle" :options="sortOptions" @update:model-value="setSort" /></div>
      </div>
    </div>
    <p v-if="sort === 'relevance'" class="cv__hint">„Nejlepší shody“ řadí podle shody lokality, termínu a požadavků. Placená propagace ani VIP pořadí neovlivňují.</p>

    <div v-if="chips.length" class="cv__active" aria-label="Aktivní filtry">
      <button v-for="c in chips" :key="c.id" type="button" class="cv__tag" @click="clear(c.remove)">{{ c.label }} <SpIcon name="fa6-solid:xmark" /><span class="sp-visually-hidden">Odebrat filtr</span></button>
      <button type="button" class="cv__clear" @click="clearAll">Vymazat vše</button>
    </div>

    <div class="cv__body">
      <aside class="cv__filters" aria-label="Filtry"><SpSurface variant="card" class="cv__filters-box"><CatalogueFilters :category="category" /></SpSurface></aside>

      <section class="cv__results" aria-label="Výsledky hledání">
        <SpAlert v-if="query.date" variant="info" class="sp-mb-3">Dostupnost vychází z údajů, které dodavatelé uvádějí. <strong>K ověření</strong> znamená, že termín nelze potvrdit. Zobrazení volného termínu není rezervace.</SpAlert>

        <section v-if="data?.sponsored.length" class="cv__sponsored" aria-label="Sponzorované pozice">
          <h2 class="cv__sub-h">Sponzorováno</h2>
          <div class="sp-grid sp-grid--md-2 sp-grid--tight">
            <SpSupplierCard
              v-for="s in data.sponsored" :key="`sp-${s.id}`" compact sponsored :to="detailLink(s.slug)" :name="s.name" :image="s.images[0]" :category="subLabel(s.categoryCode, s.subcategoryCode)"
              :availability="s.availability" :vip="s.vip" :demo="s.demo" :favorite="favorites.has(s.id)" @toggle-favorite="favorites.toggle(s.id)"
            />
          </div>
        </section>

        <div v-if="data?.items.length" class="sp-grid sp-grid--md-2 sp-grid--lg-3">
          <SpSupplierCard
            v-for="s in data.items" :key="s.id" :to="detailLink(s.slug)" :name="s.name" :image="s.images[0]" :category="subLabel(s.categoryCode, s.subcategoryCode)" :location="`${s.city}, ${s.region}`" :summary="s.summary"
            :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :availability="s.availability" :price-level="s.priceLevel" :capacity="s.categoryCode === 'venue_and_equipment' ? s.capacity : undefined"
            :vip="s.vip" :demo="s.demo" :favorite="favorites.has(s.id)" @toggle-favorite="favorites.toggle(s.id)"
          />
        </div>

        <SpSurface v-else-if="status !== 'pending'" variant="warm" class="cv__empty">
          <SpHeading :level="3" as="h2">Nic jsme nenašli</SpHeading>
          <p v-if="chips.length">Výběr omezují tyto filtry. Zrušte některý z nich:</p>
          <div v-if="chips.length" class="cv__active"><button v-for="c in chips" :key="c.id" type="button" class="cv__tag" @click="clear(c.remove)">{{ c.label }} <SpIcon name="fa6-solid:xmark" /></button></div>
          <p v-if="data && data.unknownCount" class="sp-mt-2">Dalších <strong>{{ data.unknownCount }}</strong> dodavatelů má dostupnost <strong>k ověření</strong>. <button type="button" class="cv__link" @click="clear({ dostupnost: undefined })">Zobrazit i je</button> (nebudou označeni jako volní).</p>
          <div class="sp-row sp-row--tight sp-mt-3"><SpButton variant="border" @click="clearAll">Vymazat vše</SpButton><SpButton to="/poptavka">Poslat poptávku více dodavatelům</SpButton></div>
        </SpSurface>

        <div v-if="data && data.pages > 1" class="sp-mt-4"><SpPagination v-model="page" :pages="data.pages" /></div>

      </section>
    </div>

    <SpDrawer v-if="filtersOpen" v-model="filtersOpen" title="Filtry">
      <CatalogueFilters :category="category" />
      <template #footer>
        <SpButton variant="border" @click="clearAll">Vymazat</SpButton>
        <SpButton @click="filtersOpen = false">Zobrazit výsledky ({{ data?.total ?? 0 }})</SpButton>
      </template>
    </SpDrawer>
  </div>
</template>

<style scoped>
.cv { padding-block: var(--sp-space-3) var(--sp-space-5); }
.cv__crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.cv__head { margin-bottom: var(--sp-space-3); }
.cv__intro { max-width: 46rem; margin: 0; color: var(--sp-color-text-secondary); font-size: var(--sp-text-md); }
.cv__cats, .cv__subs { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); }
.cv__chip, .cv__sub { display: inline-flex; align-items: center; min-height: 2.5rem; padding: 0.35rem 1rem; font-size: var(--sp-text-sm); color: var(--sp-color-text); text-decoration: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); }
.cv__chip:hover, .cv__sub:hover { background: var(--sp-color-bg-neutral); color: var(--sp-color-text); }
.cv__chip.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-color: var(--sp-color-primary); }
.cv__sub { min-height: 2.25rem; border-style: dashed; }
.cv__sub.is-on { background: var(--sp-color-brand-soft); border-style: solid; color: var(--sp-color-text); font-weight: var(--sp-font-weight-semibold); }
.cv__overview { display: grid; gap: var(--sp-space-3); grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); margin-bottom: var(--sp-space-4); }
.cv__tile { display: flex; align-items: center; gap: var(--sp-space-3); padding: var(--sp-space-3); color: inherit; text-decoration: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); transition: box-shadow var(--sp-duration) var(--sp-ease); }
.cv__tile:hover { box-shadow: var(--sp-shadow-card); color: inherit; }
.cv__tile-body { display: grid; }
.cv__tile small { color: var(--sp-color-text-muted); }
.cv__bar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--sp-space-3); margin-bottom: var(--sp-space-1); }
.cv__count { margin: 0; font-weight: var(--sp-font-weight-semibold); }
.cv__tools { display: flex; align-items: center; gap: var(--sp-space-2); flex-wrap: wrap; }
.cv__sort { min-width: 14rem; }
.cv__sort :deep(.sp-select) { margin: 0; }
.cv__filter-btn { gap: var(--sp-space-2); }
.cv__badge { min-width: 1.4rem; padding: 0 0.4rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-bold); color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-radius: var(--sp-radius-pill); }
.cv__hint { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.cv__active { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); }
.cv__tag { display: inline-flex; align-items: center; gap: 0.4rem; min-height: 2.25rem; padding: 0.25rem 0.8rem; font-size: var(--sp-text-sm); color: var(--sp-color-text); background: var(--sp-color-brand-soft); border: 0; border-radius: var(--sp-radius-pill); }
.cv__tag:hover { background: var(--sp-color-brand); }
.cv__clear, .cv__link { padding: 0 0.25rem; font-size: var(--sp-text-sm); color: var(--sp-color-primary); text-decoration: underline; background: none; border: 0; }
.cv__body { display: grid; gap: var(--sp-space-4); align-items: start; margin-top: var(--sp-space-2); }
.cv__filters { display: none; }
.cv__sub-h { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-text-secondary); font-family: var(--sp-font-body); }
.cv__sponsored { margin-bottom: var(--sp-space-4); }
.cv__empty { padding: var(--sp-space-4); }
.cv__filters-box { padding: var(--sp-space-3); }
@media (min-width: 992px) {
  .cv__body { grid-template-columns: 18rem minmax(0, 1fr); }
  .cv__filters { display: block; position: sticky; top: var(--sp-space-3); max-height: calc(100vh - 2rem); overflow-y: auto; }
  .cv__filter-btn { display: none; }
}
</style>
