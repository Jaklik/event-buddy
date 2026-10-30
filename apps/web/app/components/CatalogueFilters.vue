<script setup lang="ts">
import { attrsFor, type AttrDef } from '~/data/mock/taxonomy'
import { priceFilterAvailable, regionOptions } from '~/repositories/suppliers'

/**
 * Catalogue filters. State lives in the URL. Common filters (region, event type, date + availability, price, VIP)
 * are always shown; category-specific ones appear only after a category is chosen. "Další filtry" holds extended ones.
 */
const props = defineProps<{ category?: string }>()
const route = useRoute()
const router = useRouter()

const one = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const list = (k: string) => one(k).split(',').filter(Boolean)
function setQuery(patch: Record<string, string | undefined>) {
  const q: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch, page: undefined })) if (typeof v === 'string' && v) q[k] = v
  router.replace({ query: q })
}

const region = computed({ get: () => one('region'), set: (v: string) => setQuery({ region: v }) })
const eventType = computed({ get: () => one('typ'), set: (v: string) => setQuery({ typ: v }) })
const date = computed({ get: () => one('date'), set: (v: string) => setQuery({ date: v, dostupnost: v ? one('dostupnost') : undefined }) })
const availability = computed({ get: () => one('dostupnost') || 'all', set: (v: string | number) => setQuery({ dostupnost: String(v) === 'all' ? undefined : String(v) }) })
const vip = computed({ get: () => one('vip') === '1', set: (v: boolean) => setQuery({ vip: v ? '1' : undefined }) })
const guests = computed({ get: () => one('hostu'), set: (v: string | number) => setQuery({ hostu: v === '' || Number(v) <= 0 ? undefined : String(v) }) })
const regionOpts = [{ value: '', label: 'Celá ČR' }, ...regionOptions.map((r) => ({ value: r, label: r }))]
const eventOpts = [{ value: '', label: 'Všechny typy akcí' }, { value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny' }, { value: 'oslava', label: 'Oslava' }, { value: 'firemni', label: 'Firemní akce' }]
const showPrice = computed(() => priceFilterAvailable(props.category))

const defs = computed(() => attrsFor(props.category, one('podkategorie') || undefined, 'filter'))
const basic = computed(() => defs.value.filter((d) => d.level === 'basic'))
const extended = computed(() => defs.value.filter((d) => d.level === 'extended'))
const isGuests = (d: AttrDef) => d.key === 'capacity'

const attr = (k: string) => one(`a_${k}`)
const setAttr = (k: string, v: string | undefined) => setQuery({ [`a_${k}`]: v })
const multi = (k: string) => attr(k).split(',').filter(Boolean)
function toggleMulti(k: string, v: string, on: boolean) {
  const cur = new Set(multi(k)); on ? cur.add(v) : cur.delete(v)
  setAttr(k, [...cur].join(','))
}
function togglePrice(p: string, on: boolean) {
  const cur = new Set(list('cena')); on ? cur.add(p) : cur.delete(p)
  setQuery({ cena: [...cur].join(',') })
}
const extendedActive = computed(() => extended.value.some((d) => attr(d.key)))
</script>

<template>
  <form class="filters" role="search" aria-label="Filtry dodavatelů" @submit.prevent>
    <fieldset class="filters__group">
      <legend>Kde a kdy</legend>
      <SpSelect v-model="region" label="Lokalita (místo konání akce)" :options="regionOpts" />
      <SpSelect v-model="eventType" label="Typ akce" :options="eventOpts" />
      <SpInput v-model="date" label="Datum akce (nepovinné)" type="date" />
      <p class="filters__note">Bez data se dostupnost nezjišťuje a nikdo se neprezentuje jako volný.</p>
      <div class="filters__radios" role="radiogroup" aria-label="Dostupnost">
        <SpRadio v-model="availability" name="availability" value="all" label="Všichni dodavatelé" />
        <SpRadio v-model="availability" name="availability" value="free-or-unknown" label="Volní i k ověření" :disabled="!date" />
        <SpRadio v-model="availability" name="availability" value="free" label="Pouze ověřeně volní" :disabled="!date" />
      </div>
      <details class="filters__help"><summary>Co znamená volný, k ověření a obsazeno?</summary>
        <p><strong>Volný termín</strong>: dodavatel má aktuální evidenci a termín je volný. <strong>K ověření</strong>: údaje chybí nebo jsou zastaralé, termín je nutné potvrdit s dodavatelem. <strong>Obsazeno</strong>: termín je blokovaný. Zobrazení volného termínu není rezervace.</p>
      </details>
    </fieldset>

    <fieldset v-if="category && basic.length" class="filters__group">
      <legend>Parametry kategorie</legend>
      <template v-for="d in basic" :key="d.key">
        <SpInput v-if="isGuests(d)" v-model="guests" :label="d.label" type="number" :hint="d.help" />
        <template v-else-if="d.type === 'bool' || d.type === 'tri'">
          <SpCheckbox :model-value="attr(d.key) === '1'" :label="d.label" @update:model-value="setAttr(d.key, $event ? '1' : undefined)" />
          <p v-if="d.help" class="filters__note filters__note--tight">{{ d.help }}</p>
        </template>
        <SpInput v-else-if="d.type === 'number'" :model-value="attr(d.key)" :label="`${d.label} (min.)`" type="number" @update:model-value="setAttr(d.key, $event === '' ? undefined : String($event))" />
        <SpSelect v-else-if="d.type === 'select'" :model-value="attr(d.key)" :label="d.label" :options="[{ value: '', label: 'Všechny' }, ...(d.options ?? [])]" @update:model-value="setAttr(d.key, String($event) || undefined)" />
        <div v-else-if="d.type === 'multi'" class="filters__multi"><p class="filters__sub">{{ d.label }}</p>
          <SpCheckbox v-for="o in d.options" :key="o.value" :model-value="multi(d.key).includes(o.value)" :label="o.label" @update:model-value="toggleMulti(d.key, o.value, $event)" />
        </div>
      </template>
      <p v-if="category === 'venue_and_equipment'" class="filters__note">Místo s neuvedenou krytou kapacitou se při filtru „kryté prostory“ nezobrazí jako splňující požadavek.</p>
    </fieldset>

    <details v-if="category && extended.length" class="filters__more" :open="extendedActive">
      <summary>Další filtry</summary>
      <template v-for="d in extended" :key="d.key">
        <SpInput v-if="isGuests(d)" v-model="guests" :label="d.label" type="number" />
        <template v-else-if="d.type === 'bool' || d.type === 'tri'">
          <SpCheckbox :model-value="attr(d.key) === '1'" :label="d.label" @update:model-value="setAttr(d.key, $event ? '1' : undefined)" />
          <p v-if="d.help" class="filters__note filters__note--tight">{{ d.help }}</p>
        </template>
        <SpInput v-else-if="d.type === 'number'" :model-value="attr(d.key)" :label="`${d.label} (min.)`" type="number" @update:model-value="setAttr(d.key, $event === '' ? undefined : String($event))" />
        <SpSelect v-else-if="d.type === 'select'" :model-value="attr(d.key)" :label="d.label" :options="[{ value: '', label: 'Všechny' }, ...(d.options ?? [])]" @update:model-value="setAttr(d.key, String($event) || undefined)" />
        <div v-else-if="d.type === 'multi'" class="filters__multi"><p class="filters__sub">{{ d.label }}</p>
          <SpCheckbox v-for="o in d.options" :key="o.value" :model-value="multi(d.key).includes(o.value)" :label="o.label" @update:model-value="toggleMulti(d.key, o.value, $event)" />
        </div>
      </template>
    </details>

    <fieldset v-if="showPrice" class="filters__group">
      <legend>Cenová úroveň</legend>
      <SpCheckbox v-for="p in ['$', '$$', '$$$']" :key="p" :model-value="list('cena').includes(p)" :label="p" @update:model-value="togglePrice(p, $event)" />
      <p class="filters__note">Podle modelové zakázky; jen tam, kde existuje věrohodné srovnání.</p>
    </fieldset>

    <div class="filters__vip"><SpSwitch v-model="vip" label="Pouze VIP" /><p class="filters__note filters__note--tight">VIP nemění pořadí ostatních výsledků a není zárukou kvality.</p></div>
  </form>
</template>

<style scoped>
.filters__group { min-width: 0; margin: 0 0 var(--sp-space-3); padding: 0 0 var(--sp-space-3); border: 0; border-bottom: 1px solid var(--sp-color-line); }
.filters__group legend { padding: 0; margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-bold); }
.filters__note { margin: var(--sp-space-1) 0 var(--sp-space-2); font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.filters__note--tight { margin-top: 0; padding-left: 1.85rem; }
.filters__sub { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-medium); }
.filters__multi { margin-bottom: var(--sp-space-2); }
.filters__more { margin-bottom: var(--sp-space-3); padding-bottom: var(--sp-space-3); border-bottom: 1px solid var(--sp-color-line); }
.filters__more summary, .filters__help summary { cursor: pointer; font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-medium); color: var(--sp-color-primary); margin-bottom: var(--sp-space-2); }
.filters__help p { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
:deep(.sp-check) { margin-bottom: var(--sp-space-2); }
</style>
