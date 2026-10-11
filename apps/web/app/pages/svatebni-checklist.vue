<script setup lang="ts">
useSeoMeta({
  title: 'Svatební checklist – co a kdy zařídit | SelfPlan',
  description: 'Interaktivní svatební checklist podle času do svatby. Odškrtávejte úkoly, přidávejte vlastní a uložte si je do účtu zdarma.',
})
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/svatebni-checklist` }] })

interface Item { id: string; text: string; done: boolean }
interface Group { id: string; title: string; items: Item[] }
const KEY = 'sp:tool:checklist:v1'
const seed: Group[] = [
  { id: '12', title: '12+ měsíců předem', items: [{ id: 'a1', text: 'Stanovit rozpočet a přibližný počet hostů', done: false }, { id: 'a2', text: 'Vybrat termín a místo konání', done: false }, { id: 'a3', text: 'Domluvit termín obřadu na radnici / s oddávajícím', done: false }] },
  { id: '9', title: '9–12 měsíců předem', items: [{ id: 'b1', text: 'Rezervovat fotografa a kameramana', done: false }, { id: 'b2', text: 'Vybrat catering a zkušební ochutnávku', done: false }, { id: 'b3', text: 'Rezervovat hudbu / DJ', done: false }] },
  { id: '6', title: '6–9 měsíců předem', items: [{ id: 'c1', text: 'Vybrat svatební šaty a oblek', done: false }, { id: 'c2', text: 'Objednat svatební oznámení', done: false }, { id: 'c3', text: 'Zajistit ubytování pro hosty', done: false }] },
  { id: '3', title: '3–6 měsíců předem', items: [{ id: 'd1', text: 'Rozeslat oznámení a vybírat odpovědi', done: false }, { id: 'd2', text: 'Domluvit květinovou výzdobu', done: false }, { id: 'd3', text: 'Zajistit prstýnky', done: false }] },
  { id: '1', title: 'Poslední měsíc', items: [{ id: 'e1', text: 'Potvrdit harmonogram s dodavateli', done: false }, { id: 'e2', text: 'Zkouška líčení a účesu', done: false }, { id: 'e3', text: 'Připravit plán B pro špatné počasí', done: false }] },
]
const groups = ref<Group[]>(structuredClone(seed))
const hydrated = ref(false)
onMounted(() => {
  try { const raw = localStorage.getItem(KEY); if (raw) groups.value = JSON.parse(raw) } catch { /* ignore */ }
  hydrated.value = true
})
watch(groups, (v) => { if (hydrated.value) try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage blocked */ } }, { deep: true })

const total = computed(() => groups.value.reduce((a, g) => a + g.items.length, 0))
const done = computed(() => groups.value.reduce((a, g) => a + g.items.filter((i) => i.done).length, 0))
const custom = ref('')
function addCustom() {
  if (!custom.value.trim()) return
  groups.value[0]!.items.push({ id: `x${Date.now()}`, text: custom.value, done: false })
  custom.value = ''
}
function reset() { groups.value = structuredClone(seed) }
const { loggedIn } = useMockSession()
</script>

<template>
  <div class="sp-container tool">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/planovac-akci">Plánovač</NuxtLink> / <span>Svatební checklist</span></nav>
    <SpHeading :level="1">Svatební checklist</SpHeading>
    <p class="sp-text-secondary">Odškrtávejte hotové úkoly a přidejte vlastní. Výsledek zůstává jen v tomto prohlížeči, dokud se nepřihlásíte.</p>
    <SpProgress :value="total ? Math.round((done / total) * 100) : null" label="Hotovo" class="sp-mb-4" />

    <div class="sp-stack sp-stack--loose">
      <SpSurface v-for="g in groups" :key="g.id" variant="card" as="fieldset" class="group">
        <legend>{{ g.title }}</legend>
        <SpCheckbox v-for="i in g.items" :key="i.id" v-model="i.done" :label="i.text" />
      </SpSurface>
    </div>

    <form class="add" @submit.prevent="addCustom"><SpInput v-model="custom" label="Vlastní úkol" /><SpButton type="submit" variant="border">Přidat</SpButton></form>

    <SpSurface variant="warm" class="save">
      <h2>Chcete si checklist uložit?</h2>
      <p>{{ loggedIn ? 'Převedeme ho do vaší akce a upravíme termíny podle data svatby.' : 'Po registraci ho převedeme do vaší akce a upravíme termíny podle data svatby. Nic se neztratí.' }}</p>
      <div class="sp-row sp-row--tight"><SpButton :to="loggedIn ? '/ucet/akce' : '/registrace'">{{ loggedIn ? 'Převést do akce' : 'Uložit do účtu' }}</SpButton><SpButton variant="link" @click="reset">Vrátit původní seznam</SpButton></div>
    </SpSurface>
  </div>
</template>

<style scoped>
.tool { max-width: 48rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.group { margin: 0; border: 1px solid var(--sp-color-line); padding: var(--sp-space-3) var(--sp-space-4); }
.group legend { padding: 0 0.4rem; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); }
.add { display: flex; gap: var(--sp-space-2); align-items: flex-start; margin: var(--sp-space-4) 0; }
.add :deep(.sp-input) { flex: 1; margin: 0; }
.save h2 { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-lg); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); }
</style>
