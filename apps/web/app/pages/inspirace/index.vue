<script setup lang="ts">
import { collections, photos } from '~/data/mock/content'

useSeoMeta({ title: 'Inspirace pro svatby, oslavy a firemní akce | SelfPlan', description: 'Skutečné realizace a nápady podle typu akce, stylu a barev. AI inspirace je jasně označená a lze ji vyfiltrovat.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/inspirace` }] })

const route = useRoute()
const router = useRouter()
const one = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const q = ref(one('q'))
const event = computed({ get: () => one('typ'), set: (v: string) => router.replace({ query: { ...route.query, typ: v || undefined } }) })
const mode = computed({ get: () => one('zdroj') || 'all', set: (v: string) => router.replace({ query: { ...route.query, zdroj: v === 'all' ? undefined : v } }) })
const favorites = ref<number[]>([])
onMounted(() => { try { favorites.value = JSON.parse(localStorage.getItem('sp:inspiration:fav:v1') ?? '[]') } catch { /* ignore */ } })
function fav(id: number) {
  favorites.value = favorites.value.includes(id) ? favorites.value.filter((x) => x !== id) : [...favorites.value, id]
  try { localStorage.setItem('sp:inspiration:fav:v1', JSON.stringify(favorites.value)) } catch { /* blocked */ }
}
const list = computed(() => photos.filter((p) =>
  (!event.value || p.eventType === event.value)
  && (mode.value === 'all' || (mode.value === 'real' ? p.real : p.ai))
  && (!q.value || p.title.toLowerCase().includes(q.value.toLowerCase())),
))
const events = [{ v: '', l: 'Všechny akce' }, { v: 'svatba', l: 'Svatby' }, { v: 'narozeniny', l: 'Narozeniny' }, { v: 'oslava', l: 'Oslavy' }, { v: 'firemni', l: 'Firemní akce' }]
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <span>Inspirace</span></nav>
    <SpHeading :level="1">Inspirace</SpHeading>
    <p class="sp-text-secondary">Skutečné realizace a nápady. Snímky vytvořené pomocí AI jsou vždy označeny a mají vlastní filtr.</p>

    <section aria-label="Kolekce" class="sp-grid sp-grid--cols-2 sp-grid--lg-4 sp-mb-4">
      <NuxtLink v-for="c in collections" :key="c.slug" :to="`/inspirace?kolekce=${c.slug}`" class="col"><img :src="c.image" alt="" loading="lazy"><span><strong>{{ c.title }}</strong><small>{{ c.count }} fotografií</small></span></NuxtLink>
    </section>

    <div class="bar">
      <div class="seg" role="group" aria-label="Typ akce"><button v-for="e in events" :key="e.v" type="button" :class="{ 'is-on': event === e.v }" :aria-pressed="event === e.v" @click="event = e.v">{{ e.l }}</button></div>
      <div class="seg" role="group" aria-label="Zdroj"><button type="button" :class="{ 'is-on': mode === 'all' }" @click="mode = 'all'">Vše</button><button type="button" :class="{ 'is-on': mode === 'real' }" @click="mode = 'real'">Skutečné realizace</button><button type="button" :class="{ 'is-on': mode === 'ai' }" @click="mode = 'ai'">AI inspirace</button></div>
      <div class="search"><SpInput v-model="q" label="Hledat" /></div>
    </div>

    <SpEmpty v-if="!list.length" title="Nic jsme nenašli" text="Zkuste jiný filtr nebo hledaný výraz."><SpButton variant="border" @click="q = ''; event = ''; mode = 'all'">Zrušit filtry</SpButton></SpEmpty>
    <ul v-else class="masonry" aria-label="Fotografie">
      <li v-for="p in list" :key="p.id">
        <NuxtLink :to="`/inspirace/${p.slug}`" class="ph"><img :src="p.image" :alt="p.title" loading="lazy"><span v-if="p.ai" class="ph__ai">AI</span></NuxtLink>
        <button type="button" class="ph__fav" :aria-pressed="favorites.includes(p.id)" :aria-label="favorites.includes(p.id) ? 'Odebrat z oblíbených' : 'Uložit do oblíbených'" @click="fav(p.id)"><SpIcon :name="favorites.includes(p.id) ? 'fa6-solid:heart' : 'fa6-regular:heart'" /></button>
        <p class="ph__t">{{ p.title }}</p>
      </li>
    </ul>

    <SpSurface variant="warm" class="sp-mt-4 up"><div><h2>Máte vlastní fotografie?</h2><p class="sp-mb-0">Přidávat fotografie mohou uživatelé s ověřeným e-mailem a dodavatelé. Fotografie projdou automatickou kontrolou a následnou moderací.</p></div><SpButton to="/inspirace/pridat">Přidat fotografii</SpButton></SpSurface>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.col { position: relative; display: block; overflow: hidden; color: #fff; text-decoration: none; border-radius: var(--sp-radius-md); aspect-ratio: 4 / 3; }
.col img { width: 100%; height: 100%; object-fit: cover; }
.col span { position: absolute; inset: auto 0 0 0; display: grid; padding: var(--sp-space-3); background: linear-gradient(transparent, rgb(0 0 0 / 0.6)); }
.col small { opacity: 0.85; }
.bar { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--sp-space-3); margin-bottom: var(--sp-space-3); }
.seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); overflow: hidden; }
.seg button { padding: 0.4rem 0.9rem; font-size: var(--sp-text-sm); background: var(--sp-color-bg); border: 0; }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); }
.search { flex: 1; min-width: 12rem; max-width: 20rem; }
.search :deep(.sp-input) { margin: 0; }
.masonry { columns: 2; column-gap: var(--sp-space-3); margin: 0; padding: 0; list-style: none; }
@media (min-width: 768px) { .masonry { columns: 3; } }
@media (min-width: 992px) { .masonry { columns: 4; } }
.masonry li { position: relative; break-inside: avoid; margin-bottom: var(--sp-space-3); }
.ph { position: relative; display: block; overflow: hidden; border-radius: var(--sp-radius-md); }
.ph img { display: block; width: 100%; height: auto; transition: transform var(--sp-duration) var(--sp-ease); }
.ph:hover img { transform: scale(1.03); }
.ph__ai { position: absolute; left: var(--sp-space-2); top: var(--sp-space-2); padding: 0.1rem 0.5rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-bold); color: var(--sp-color-on-brand); background: var(--sp-color-brand); border-radius: 4px; }
.ph__fav { position: absolute; right: var(--sp-space-2); top: var(--sp-space-2); display: grid; place-items: center; width: 2.25rem; height: 2.25rem; background: rgb(255 255 255 / 0.9); border: 0; border-radius: 50%; }
.ph__fav[aria-pressed='true'] { color: var(--sp-color-danger); }
.ph__t { margin: 0.3rem 0 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.up { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-3); }
.up h2 { margin: 0 0 0.25rem; font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-lg); }
</style>
