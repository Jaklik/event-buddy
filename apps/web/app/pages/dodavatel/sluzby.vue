<script setup lang="ts">
import { suppliers } from '~/data/mock/suppliers'
import { attrsFor, catByCode, taxonomy, triLabels, type AttrDef } from '~/data/mock/taxonomy'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Služby a ceny – SelfPlan', robots: 'noindex, nofollow' })

const s = suppliers[0]!
const packages = ref(s.packages.map((p) => ({ ...p })))
const scenario = reactive({ price: s.scenario?.totalPrice ?? 0, note: '', cannot: false })
const saved = ref(false)

// One profile can belong to several categories; each category has its own set of structured fields.
const myCategories = ref<string[]>([s.categoryCode])
const activeCat = ref(s.categoryCode)
const addCat = ref('')
const available = computed(() => taxonomy.filter((c) => !myCategories.value.includes(c.code)).map((c) => ({ value: c.code, label: c.label })))
function addCategory() { if (addCat.value) { myCategories.value.push(addCat.value); activeCat.value = addCat.value; addCat.value = '' } }

type Val = boolean | number | string | string[] | undefined
const values = reactive<Record<string, Val>>({ ...s.attrs })
const defs = computed(() => attrsFor(activeCat.value, undefined).filter((d) => d.scope !== 'inquiry'))
const groups = computed(() => {
  const g: Record<string, AttrDef[]> = {}
  for (const d of defs.value) (g[d.group] ??= []).push(d)
  return g
})
// Distinguish "Ne", "Ano" and "Neuvedeno"; an unanswered field is never treated as "No".
const triState = (k: string) => (values[k] === true ? 'yes' : values[k] === false ? 'no' : 'unset')
function setTri(k: string, v: string | number) { values[k] = v === 'yes' ? true : v === 'no' ? false : undefined }
const multiHas = (k: string, o: string) => Array.isArray(values[k]) && (values[k] as string[]).includes(o)
function toggleMulti(k: string, o: string, on: boolean) {
  const cur = new Set(Array.isArray(values[k]) ? (values[k] as string[]) : []); on ? cur.add(o) : cur.delete(o)
  values[k] = cur.size ? [...cur] : undefined
}
const errors = computed(() => {
  const e: string[] = []
  for (const d of defs.value) { const v = values[d.key]; if (d.type === 'number' && v !== undefined && (typeof v !== 'number' || v < 0 || !Number.isInteger(v))) e.push(`${d.label}: zadejte nezáporné celé číslo.`) }
  if (values.rain === true && values.rainCapacity === undefined) e.push('Kryté prostory pro případ deště: doplňte, kolik hostů krytá alternativa pojme.')
  if (values.rain === false && typeof values.rainCapacity === 'number' && values.rainCapacity > 0) e.push('Je uvedena krytá kapacita, ale kryté prostory jsou označeny jako „Ne“.')
  return e
})
const missing = computed(() => defs.value.filter((d) => d.level === 'basic' && (values[d.key] === undefined)).map((d) => d.label))
function numModel(k: string) { return values[k] === undefined ? '' : String(values[k]) }
function setNum(k: string, v: string | number) { values[k] = v === '' ? undefined : Number(v) }
</script>

<template>
  <div>
    <SpPageHeader title="Služby a ceny" text="Balíčky, modelová zakázka a parametry služeb podle kategorií." />
    <SpAlert v-if="saved && !errors.length" variant="success" dismissible class="sp-mb-3" @close="saved = false">Změny byly uloženy.</SpAlert>

    <SpSurface variant="card" class="box">
      <h2>Kategorie a parametry</h2>
      <div class="catbar" role="tablist" aria-label="Kategorie profilu">
        <button v-for="c in myCategories" :key="c" type="button" role="tab" :aria-selected="activeCat === c" :class="{ 'is-on': activeCat === c }" @click="activeCat = c">{{ catByCode(c)?.label }}</button>
      </div>
      <div class="addcat"><SpSelect v-model="addCat" label="Přidat další kategorii" placeholder="Vyberte" :options="available" /><SpButton variant="border" :disabled="!addCat" @click="addCategory">Přidat</SpButton></div>
      <p class="hint">U každé kategorie vyplňujete jen její parametry. Odpověď <strong>Ne</strong> znamená, že službu neposkytujete; <strong>Neuvedeno</strong> znamená, že údaj neznáme a katalog ho neukáže jako splněný.</p>

      <p v-if="!defs.length" class="sp-text-secondary">Pro tuto kategorii nejsou žádné strukturované parametry. Doplňte portfolio a popis služeb.</p>
      <fieldset v-for="(items, g) in groups" :key="g" class="grp">
        <legend>{{ g }}</legend>
        <div v-for="d in items" :key="d.key" class="field">
          <template v-if="d.type === 'bool'">
            <p class="field__l">{{ d.label }} <small v-if="d.scope === 'detail'">(jen v profilu)</small></p>
            <div class="seg" role="radiogroup" :aria-label="d.label"><button v-for="o in [['yes', 'Ano'], ['no', 'Ne'], ['unset', 'Neuvedeno']]" :key="o[0]" type="button" role="radio" :aria-checked="triState(d.key) === o[0]" :class="{ 'is-on': triState(d.key) === o[0] }" @click="setTri(d.key, o[0]!)">{{ o[1] }}</button></div>
          </template>
          <template v-else-if="d.type === 'tri'">
            <p class="field__l">{{ d.label }}</p>
            <div class="seg" role="radiogroup" :aria-label="d.label"><button v-for="o in [['no', triLabels.no], ['own', triLabels.own], ['can', triLabels.can], ['unset', 'Neuvedeno']]" :key="o[0]" type="button" role="radio" :aria-checked="(values[d.key] ?? 'unset') === o[0]" :class="{ 'is-on': (values[d.key] ?? 'unset') === o[0] }" @click="values[d.key] = o[0] === 'unset' ? undefined : o[0]">{{ o[1] }}</button></div>
          </template>
          <SpInput v-else-if="d.type === 'number'" :model-value="numModel(d.key)" :label="`${d.label}${d.unit ? ` (${d.unit})` : ''}`" type="number" :hint="d.help" @update:model-value="setNum(d.key, $event)" />
          <SpSelect v-else-if="d.type === 'select'" :model-value="(values[d.key] as string) ?? ''" :label="d.label" :options="[{ value: '', label: 'Neuvedeno' }, ...(d.options ?? [])]" @update:model-value="values[d.key] = String($event) || undefined" />
          <div v-else-if="d.type === 'multi'"><p class="field__l">{{ d.label }}</p><SpCheckbox v-for="o in d.options" :key="o.value" :model-value="multiHas(d.key, o.value)" :label="o.label" @update:model-value="toggleMulti(d.key, o.value, $event)" /></div>
          <p v-if="d.help && d.type !== 'number'" class="field__h">{{ d.help }}</p>
        </div>
      </fieldset>

      <SpAlert v-if="errors.length" variant="danger"><ul class="errs"><li v-for="e in errors" :key="e">{{ e }}</li></ul></SpAlert>
      <SpAlert v-else-if="missing.length" variant="info">Užitečné doplnit: {{ missing.join(', ') }}. Nic z toho vás neblokuje.</SpAlert>
      <SpButton class="sp-mt-3" :disabled="!!errors.length" @click="saved = true">Uložit parametry</SpButton>
    </SpSurface>

    <SpSurface variant="card" class="box sp-mt-3">
      <h2>Jak se profil zobrazí v katalogu</h2>
      <div class="prev"><SpSupplierCard to="#" :name="s.name" :image="s.images[0]" :category="catByCode(activeCat)?.label" :location="`${s.city}, ${s.region}`" :summary="s.summary" :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :price-level="s.priceLevel" :capacity="s.capacity" demo /></div>
    </SpSurface>

    <SpSurface variant="card" class="box sp-mt-3">
      <h2>Balíčky</h2>
      <div v-for="p in packages" :key="p.name" class="pk">
        <SpInput v-model="p.name" label="Název balíčku" />
        <SpInput v-model="p.priceFrom" label="Cena od (Kč)" type="number" />
        <SpInput v-model="p.description" label="Krátký popis" />
      </div>
      <SpButton variant="border" size="sm">Přidat balíček</SpButton>
    </SpSurface>

    <SpSurface variant="warm" class="box sp-mt-3">
      <h2>Modelová zakázka</h2>
      <p class="sp-text-sm">Scénář pro vaši kategorii zadává administrátor: <strong>{{ s.scenario?.title }}</strong>. Uveďte realistickou orientační celkovou cenu za celý scénář. Povinné položky nelze vyloučit.</p>
      <SpInput v-model="scenario.price" label="Orientační celková cena (Kč)" type="number" :disabled="scenario.cannot" />
      <SpCheckbox v-model="scenario.cannot" label="Modelovou cenu nelze stanovit" />
      <SpInput v-model="scenario.note" label="Poznámka k ceně" multiline :rows="3" />
      <p class="sp-text-xs sp-text-muted">Cena je nezávazná orientace, ne garance dostupnosti ani konečné ceny. Cenová úroveň $/$$/$$$ se zobrazí jen při dostatku srovnatelných cen; nezávisí na VIP ani na reklamě.</p>
      <SpButton @click="saved = true">Uložit</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-xl); }
.catbar { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); }
.catbar button { min-height: 2.5rem; padding: 0.3rem 1rem; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); }
.catbar button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-color: var(--sp-color-primary); }
.addcat { display: flex; gap: var(--sp-space-2); align-items: flex-start; max-width: 28rem; }
.addcat :deep(.sp-select) { flex: 1; margin: 0; }
.hint { font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.grp { margin: 0 0 var(--sp-space-3); padding: var(--sp-space-2) 0 0; border: 0; border-top: 1px solid var(--sp-color-line); }
.grp legend { padding: 0 var(--sp-space-2) 0 0; font-weight: var(--sp-font-weight-bold); font-size: var(--sp-text-sm); }
.field { margin-bottom: var(--sp-space-3); }
.field__l { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-medium); }
.field__l small { color: var(--sp-color-text-muted); font-weight: var(--sp-font-weight-regular); }
.field__h { margin: var(--sp-space-1) 0 0; font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); overflow: hidden; }
.seg button { min-height: 2.25rem; padding: 0.3rem 0.9rem; font-size: var(--sp-text-sm); background: var(--sp-color-bg); border: 0; border-right: 1px solid var(--sp-color-line); }
.seg button:last-child { border-right: 0; }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); }
.errs { margin: 0; padding-left: 1.2rem; }
.prev { max-width: 22rem; }
.pk { display: grid; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); }
@media (min-width: 768px) { .pk { grid-template-columns: 2fr 1fr 3fr; } }
</style>
