<script setup lang="ts">
import { categories } from '~/data/mock/suppliers'
import { regionOptions, type AvailabilityMode } from '~/repositories/suppliers'

/** Catalogue filter panel. State lives in the URL (shareable, keeps the date from the homepage); every change replaces the query. */
const route = useRoute()
const router = useRouter()

const list = (k: string) => String(route.query[k] ?? '').split(',').filter(Boolean)
const one = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')

function setQuery(patch: Record<string, string | undefined>) {
  const q: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch, page: undefined })) if (typeof v === 'string' && v) q[k] = v
  router.replace({ query: q })
}
function toggleIn(key: string, value: string, on: boolean) {
  const cur = new Set(list(key))
  on ? cur.add(value) : cur.delete(value)
  setQuery({ [key]: [...cur].join(',') })
}

const date = computed({ get: () => one('date'), set: (v: string) => setQuery({ date: v }) })
const region = computed({ get: () => one('region'), set: (v: string) => setQuery({ region: v }) })
const availability = computed({
  get: () => (one('availability') || 'all') as AvailabilityMode,
  set: (v: string | number) => setQuery({ availability: String(v) === 'all' ? '' : String(v) }),
})
const vip = computed({ get: () => one('vip') === '1', set: (v: boolean) => setQuery({ vip: v ? '1' : '' }) })
const hasFilters = computed(() => ['category', 'date', 'region', 'price', 'availability', 'vip'].some((k) => one(k)))
const regionOpts = [{ value: '', label: 'Celá ČR' }, ...regionOptions.map((r) => ({ value: r, label: r }))]
</script>

<template>
  <SpSurface variant="card" as="form" class="filters" @submit.prevent>
    <div class="filters__head">
      <h2 class="filters__title">Filtry</h2>
      <button v-if="hasFilters" type="button" class="filters__reset" @click="router.replace({ query: {} })">Zrušit filtry</button>
    </div>

    <fieldset class="filters__group">
      <legend>Kategorie</legend>
      <SpCheckbox v-for="c in categories" :key="c.code" :model-value="list('category').includes(c.code)" :label="c.label" @update:model-value="toggleIn('category', c.code, $event)" />
    </fieldset>

    <div class="filters__group">
      <SpInput v-model="date" label="Datum akce" type="date" />
      <SpSelect v-model="region" label="Lokalita" :options="regionOpts" />
    </div>

    <fieldset class="filters__group">
      <legend>Dostupnost</legend>
      <SpRadio v-model="availability" name="availability" value="all" label="Všichni dodavatelé" />
      <SpRadio v-model="availability" name="availability" value="free-or-unknown" label="Volní i k ověření" :disabled="!date" />
      <SpRadio v-model="availability" name="availability" value="free" label="Pouze ověřeně volní" :disabled="!date" />
      <p v-if="!date" class="filters__note">Vyberte datum akce. Prázdné datum neznamená „volno“.</p>
    </fieldset>

    <fieldset class="filters__group">
      <legend>Cenová úroveň</legend>
      <SpCheckbox v-for="p in ['$', '$$', '$$$']" :key="p" :model-value="list('price').includes(p)" :label="p" @update:model-value="toggleIn('price', p, $event)" />
      <p class="filters__note">Podle modelové zakázky; zobrazuje se jen při dostatku srovnatelných cen.</p>
    </fieldset>

    <SpSwitch v-model="vip" label="Pouze VIP" />
  </SpSurface>
</template>

<style scoped>
.filters { padding: var(--sp-space-3); }
.filters__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-space-3); }
.filters__title { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.filters__reset { padding: 0; font-size: var(--sp-text-sm); color: var(--sp-color-primary); text-decoration: underline; background: none; border: 0; }
.filters__group { min-width: 0; margin: 0 0 var(--sp-space-3); padding: 0 0 var(--sp-space-3); border: 0; border-bottom: 1px solid var(--sp-color-line); }
.filters__group legend { padding: 0; margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); }
.filters__note { margin: var(--sp-space-1) 0 0; font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
:deep(.sp-check) { margin-bottom: var(--sp-space-2); }
</style>
