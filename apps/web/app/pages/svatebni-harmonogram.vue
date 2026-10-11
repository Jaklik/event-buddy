<script setup lang="ts">
useSeoMeta({
  title: 'Svatební harmonogram – plán svatebního dne | SelfPlan',
  description: 'Vygenerujte časový harmonogram svatebního dne podle času obřadu. Upravte položky a uložte si ho zdarma.',
})
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/svatebni-harmonogram` }] })

const ceremony = ref('13:00')
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return (h ?? 0) * 60 + (m ?? 0) }
const fmt = (m: number) => { const x = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}` }
// Offsets in minutes relative to the ceremony; the user can retime any row manually.
const template = [
  { offset: -180, title: 'Příprava nevěsty, líčení a účes' }, { offset: -90, title: 'Příjezd fotografa, přípravy ženicha' }, { offset: -30, title: 'Příjezd hostů, uvítací nápoj' },
  { offset: 0, title: 'Svatební obřad' }, { offset: 40, title: 'Gratulace a přípitek' }, { offset: 75, title: 'Skupinové focení' }, { offset: 135, title: 'Svatební hostina' },
  { offset: 300, title: 'Krájení dortu' }, { offset: 360, title: 'První tanec a zábava' }, { offset: 720, title: 'Závěr akce' },
]
const rows = ref(template.map((t, i) => ({ id: i, title: t.title, time: '' })))
const manual = ref<Record<number, string>>({})
const times = computed(() => rows.value.map((r, i) => manual.value[r.id] ?? fmt(toMin(ceremony.value) + template[i]!.offset))
)
const { loggedIn } = useMockSession()
</script>

<template>
  <div class="sp-container tool">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/planovac-akci">Plánovač</NuxtLink> / <span>Harmonogram</span></nav>
    <SpHeading :level="1">Svatební harmonogram</SpHeading>
    <p class="sp-text-secondary">Zadejte čas obřadu a časy ostatních bodů se dopočítají. Kterýkoli čas můžete přepsat.</p>
    <div class="when"><SpInput v-model="ceremony" label="Čas obřadu" type="time" /></div>

    <ol class="timeline">
      <li v-for="(r, i) in rows" :key="r.id">
        <input class="time" type="time" :value="times[i]" :aria-label="`Čas: ${r.title}`" @change="manual[r.id] = ($event.target as HTMLInputElement).value">
        <input v-model="r.title" class="title" :aria-label="`Název bodu ${i + 1}`">
      </li>
    </ol>

    <SpSurface variant="warm"><h2 class="h2">Uložit a sdílet s dodavateli</h2><p>Po registraci se harmonogram převede do akce a můžete jej propojit s eventovým webem.</p><SpButton :to="loggedIn ? '/ucet/akce/1' : '/registrace'">{{ loggedIn ? 'Převést do akce' : 'Uložit do účtu' }}</SpButton></SpSurface>
  </div>
</template>

<style scoped>
.tool { max-width: 44rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.when { max-width: 14rem; margin-top: var(--sp-space-3); }
.timeline { margin: 0 0 var(--sp-space-4); padding: 0 0 0 var(--sp-space-3); list-style: none; border-left: 2px solid var(--sp-color-brand); }
.timeline li { display: flex; gap: var(--sp-space-3); align-items: center; padding: var(--sp-space-1) 0; }
.time { width: 6.5rem; padding: 0.4rem; font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-brand-strong); background: var(--sp-color-bg-input); border: 1px solid transparent; border-radius: var(--sp-radius-input); }
.title { flex: 1; padding: 0.5rem 0.6rem; background: transparent; border: 1px solid transparent; border-radius: var(--sp-radius-input); }
.title:hover, .title:focus { background: var(--sp-color-bg-input); outline: none; }
.h2 { margin: 0 0 var(--sp-space-1); font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
</style>
