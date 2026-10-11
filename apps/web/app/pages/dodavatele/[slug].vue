<script setup lang="ts">
import { availabilityFor, categoryLabel } from '~/data/mock/suppliers'
import { getRelatedSuppliers, getSupplier, getSupplierReviews } from '~/repositories/suppliers'
type DayState = 'free' | 'busy' | 'unknown' | 'tentative'

const route = useRoute()
const favorites = useFavorites()
const slug = String(route.params.slug)

const { data: supplier } = await useAsyncData(`supplier-${slug}`, () => getSupplier(slug))
if (!supplier.value) throw createError({ statusCode: 404, statusMessage: 'Dodavatel nenalezen', fatal: true })
const s = supplier.value
const { data: reviews } = await useAsyncData(`reviews-${s.id}`, () => getSupplierReviews(s.id), { default: () => [] })
const { data: related } = await useAsyncData(`related-${s.id}`, () => getRelatedSuppliers(s), { default: () => [] })

const date = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))
const dateAvail = computed(() => (date.value ? availabilityFor(s.id, date.value) : null))

// Public calendar: only free / busy / unknown per day, never client names (spec §4, §22).
const calMonth = ref(date.value ? date.value.slice(0, 7) : new Date().toISOString().slice(0, 7))
const states = computed(() => {
  const [y, m] = calMonth.value.split('-').map(Number)
  const out: Record<string, DayState> = {}
  for (let d = 1; d <= new Date(y!, m!, 0).getDate(); d++) {
    const iso = `${calMonth.value}-${String(d).padStart(2, '0')}`
    out[iso] = availabilityFor(s.id, iso)
  }
  return out
})

const canonical = `${useRuntimeConfig().public.siteUrl}/dodavatele/${s.slug}`
useSeoMeta({
  title: `${s.name} – ${categoryLabel(s.categoryCode)} | SelfPlan`,
  description: s.summary,
  ogTitle: s.name,
  ogDescription: s.summary,
  ogImage: s.images[0],
  robots: 'index, follow',
})
useHead({ link: [{ rel: 'canonical', href: canonical }] })

const sections = computed(() => [
  { id: 'prehled', label: 'Přehled' },
  { id: 'sluzby', label: 'Služby a ceny' },
  { id: 'dostupnost', label: 'Dostupnost' },
  { id: 'recenze', label: 'Recenze' },
  { id: 'kontakt', label: 'Kontakt' },
])
const inquiryOpen = ref(false)
const money = (n: number) => new Intl.NumberFormat('cs', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
const avg = computed(() => (s.rating ? s.rating.toFixed(1).replace('.', ',') : null))
</script>

<template>
  <div class="detail">
    <div class="sp-container">
      <nav class="detail__crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/dodavatele">Dodavatelé</NuxtLink> / <NuxtLink :to="`/dodavatele?category=${s.categoryCode}`">{{ categoryLabel(s.categoryCode) }}</NuxtLink> / <span>{{ s.name }}</span></nav>
      <SpGallery :images="s.images" :alt="s.name" />

      <header class="detail__head">
        <div class="detail__title">
          <SpHeading :level="1">{{ s.name }}</SpHeading>
          <p class="detail__meta">
            <SpBadge>{{ categoryLabel(s.categoryCode) }}</SpBadge>
            <span v-if="s.verified" class="detail__verified"><SpIcon name="fa6-solid:circle-check" /> Ověřený dodavatel</span>
            <SpBadge v-if="s.vip" variant="neutral">VIP</SpBadge>
            <span v-if="s.rating" class="detail__rating"><SpStars :value="s.rating" /> <strong>{{ avg }}</strong> ({{ s.reviewCount }} recenzí)</span>
            <span><SpIcon name="fa6-solid:location-dot" /> {{ s.city }}, {{ s.region }}</span>
          </p>
          <p v-if="dateAvail" class="detail__datecheck">
            Termín {{ new Intl.DateTimeFormat('cs').format(new Date(date)) }}: <SpAvailabilityBadge :state="dateAvail" />
          </p>
        </div>
        <div class="detail__cta">
          <SpButton size="lg" @click="inquiryOpen = true">Nezávazně poptat přes SelfPlan</SpButton>
          <SpButton variant="border" :to="'/planovac-akci'">Uložit do plánovače</SpButton>
          <SpButton variant="link" :aria-pressed="favorites.has(s.id)" @click="favorites.toggle(s.id)">
            <SpIcon :name="favorites.has(s.id) ? 'fa6-solid:heart' : 'fa6-regular:heart'" /> {{ favorites.has(s.id) ? 'V oblíbených' : 'Do oblíbených' }}
          </SpButton>
        </div>
      </header>
    </div>

    <SpAnchorNav :items="sections" label="Sekce profilu" />

    <div class="sp-container detail__body">
      <div class="detail__main">
        <section id="prehled" class="detail__section">
          <SpHeading :level="2">O nás</SpHeading>
          <p>{{ s.description }}</p>
          <ul class="detail__facts">
            <li v-if="s.capacity"><SpIcon name="fa6-solid:users" /> Kapacita {{ s.capacity.min }}–{{ s.capacity.max }} osob</li>
            <li><SpIcon name="fa6-solid:language" /> {{ s.languages.join(', ') }}</li>
            <li v-if="s.priceLevel"><SpIcon name="fa6-solid:tag" /> Cenová úroveň {{ s.priceLevel }} <span class="sp-text-muted">(podle modelové zakázky)</span></li>
          </ul>
        </section>

        <section id="sluzby" class="detail__section">
          <SpHeading :level="2">Služby a ceny</SpHeading>
          <div class="detail__packages">
            <SpSurface v-for="p in s.packages" :key="p.name" variant="card" class="package">
              <h3 class="package__name">{{ p.name }}</h3>
              <p class="package__price">od {{ money(p.priceFrom) }}</p>
              <p class="package__desc">{{ p.description }}</p>
              <ul><li v-for="i in p.includes" :key="i"><SpIcon name="fa6-solid:check" /> {{ i }}</li></ul>
            </SpSurface>
          </div>
          <SpSurface v-if="s.scenario" variant="warm" class="scenario">
            <h3 class="scenario__title">Modelová zakázka</h3>
            <p class="scenario__what">{{ s.scenario.title }}</p>
            <p>{{ s.scenario.description }}</p>
            <p class="scenario__price">Orientační cena dodavatele: <strong>{{ money(s.scenario.totalPrice) }}</strong></p>
            <p class="sp-text-sm sp-text-secondary sp-mb-0">Aktualizováno {{ new Intl.DateTimeFormat('cs').format(new Date(s.scenario.updatedAt)) }}. {{ s.scenario.note }}</p>
          </SpSurface>
          <p v-else class="sp-text-muted">Cenová úroveň zatím neurčena. Dodavatel zatím neuvedl modelovou zakázku.</p>
        </section>

        <section id="dostupnost" class="detail__section">
          <SpHeading :level="2">Dostupnost termínů</SpHeading>
          <p class="sp-text-secondary sp-text-sm">Zobrazujeme jen stav dne. Volný termín není rezervace; konečné potvrzení vždy dává dodavatel.</p>
          <div class="detail__cal"><SpCalendar :month="calMonth" :states="states" @month-change="calMonth = $event" /></div>
        </section>

        <section id="recenze" class="detail__section">
          <SpHeading :level="2">Recenze</SpHeading>
          <div class="sp-row sp-mb-3">
            <span v-if="s.rating"><SpStars :value="s.rating" /> <strong>{{ avg }}</strong> z {{ s.reviewCount }} recenzí na SelfPlanu</span>
            <span v-else class="sp-text-muted">Zatím žádné recenze na SelfPlanu.</span>
            <a v-if="s.googleRatingUrl" :href="s.googleRatingUrl" target="_blank" rel="noopener" class="sp-text-sm">Hodnocení na Google <SpIcon name="fa6-solid:arrow-up-right-from-square" /></a>
          </div>
          <div v-if="reviews.length" class="sp-grid sp-grid--md-2">
            <SpReviewCard v-for="r in reviews" :key="r.id" :author="r.author" :date="r.date" :text="r.text" :rating="r.rating" :context="r.kind === 'komunikace' ? 'Hodnocení komunikace před objednávkou' : 'Hodnocení realizace'" />
          </div>
        </section>

        <section id="kontakt" class="detail__section">
          <SpHeading :level="2">Kontakt</SpHeading>
          <ul class="detail__contact">
            <li><SpIcon name="fa6-solid:phone" /> <a :href="`tel:${s.phone.replace(/\s/g, '')}`">{{ s.phone }}</a></li>
            <li><SpIcon name="fa6-regular:envelope" /> <a :href="`mailto:${s.email}`">{{ s.email }}</a></li>
            <li><SpIcon name="fa6-solid:globe" /> <a :href="s.website" target="_blank" rel="noopener">{{ s.website.replace('https://', '') }}</a></li>
            <li v-if="s.social.instagram"><SpIcon name="fa6-brands:instagram" /> <a :href="s.social.instagram" target="_blank" rel="noopener">Instagram</a></li>
            <li v-if="s.social.facebook"><SpIcon name="fa6-brands:facebook-f" /> <a :href="s.social.facebook" target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </section>
      </div>

      <aside class="detail__side">
        <SpSurface variant="card" class="side-card">
          <h2 class="side-card__title">Poptávka přes SelfPlan</h2>
          <p class="sp-text-sm sp-text-secondary">Historie komunikace, porovnání nabídek a propojení s plánovačem na jednom místě.</p>
          <SpButton block @click="inquiryOpen = true">Nezávazně poptat</SpButton>
        </SpSurface>
      </aside>
    </div>

    <section v-if="related.length" class="sp-container detail__related">
      <SpHeading :level="2">Mohlo by se vám líbit</SpHeading>
      <div class="sp-grid sp-grid--md-3">
        <SpSupplierCard v-for="r in related" :key="r.id" :to="`/dodavatele/${r.slug}`" :name="r.name" :image="r.images[0]" :category="categoryLabel(r.categoryCode)" :location="`${r.city}, ${r.region}`" :summary="r.summary" :rating="r.rating ?? undefined" :rating-count="r.reviewCount" :price-level="r.priceLevel" :favorite="favorites.has(r.id)" @toggle-favorite="favorites.toggle(r.id)" />
      </div>
    </section>

    <SpModal v-model="inquiryOpen" :title="`Poptávka: ${s.name}`">
      <InquiryForm :supplier-name="s.name" :supplier-id="s.id" :date="date" />
    </SpModal>
  </div>
</template>

<style scoped>
.detail { padding-bottom: var(--sp-space-5); }
.detail__crumbs { margin: var(--sp-space-3) 0 var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.detail__head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: var(--sp-space-3); padding-block: var(--sp-space-4); }
.detail__meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-space-2) var(--sp-space-3); margin: 0; font-size: var(--sp-text-sm); }
.detail__verified { color: var(--sp-color-success); font-weight: var(--sp-font-weight-medium); }
.detail__rating { display: inline-flex; align-items: center; gap: 0.35rem; }
.detail__datecheck { margin: var(--sp-space-2) 0 0; font-size: var(--sp-text-sm); }
.detail__cta { display: flex; flex-direction: column; gap: var(--sp-space-2); min-width: 16rem; }
.detail__body { display: grid; gap: var(--sp-space-4); padding-top: var(--sp-space-4); align-items: start; }
.detail__section { padding-bottom: var(--sp-space-4); margin-bottom: var(--sp-space-4); border-bottom: 1px solid var(--sp-color-line); scroll-margin-top: 4rem; }
.detail__facts, .detail__contact { display: grid; gap: var(--sp-space-2); margin: 0; padding: 0; list-style: none; }
.detail__packages { display: grid; gap: var(--sp-space-3); margin-bottom: var(--sp-space-3); }
.package__name { margin: 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
.package__price { margin: var(--sp-space-1) 0; font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-primary); }
.package__desc { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.package ul { margin: 0; padding: 0; list-style: none; font-size: var(--sp-text-sm); }
.package li { display: flex; gap: var(--sp-space-2); align-items: center; }
.scenario__title { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.scenario__what { margin: 0 0 var(--sp-space-1); font-weight: var(--sp-font-weight-medium); }
.scenario__price { font-size: var(--sp-text-md); }
.detail__cal { max-width: 28rem; }
.side-card { position: sticky; top: 4rem; display: grid; gap: var(--sp-space-3); }
.side-card__title { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.detail__related { padding-top: var(--sp-space-3); }
@media (min-width: 768px) { .detail__packages { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 992px) { .detail__body { grid-template-columns: minmax(0, 1fr) 20rem; } }
@media (max-width: 991.98px) { .detail__side { display: none; } .detail__cta { min-width: 0; width: 100%; } }
</style>
