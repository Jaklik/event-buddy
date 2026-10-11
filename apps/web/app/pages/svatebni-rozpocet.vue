<script setup lang="ts">
useSeoMeta({
  title: 'Svatební rozpočet – kalkulačka nákladů | SelfPlan',
  description: 'Zadejte celkový rozpočet a počet hostů a rozdělte ho mezi místo, catering, fotografa, hudbu a další. Zdarma, bez registrace.',
})
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/svatebni-rozpocet` }] })

const total = ref(450000)
const guests = ref(80)
// Typical shares are a starting point for the user to edit, not market data.
const rows = reactive([
  { name: 'Místo konání', share: 26, value: 0 }, { name: 'Catering a nápoje', share: 28, value: 0 }, { name: 'Fotografie a video', share: 10, value: 0 },
  { name: 'Hudba a zábava', share: 6, value: 0 }, { name: 'Dekorace a květiny', share: 8, value: 0 }, { name: 'Oblečení a krása', share: 10, value: 0 },
  { name: 'Tisk a drobnosti', share: 4, value: 0 }, { name: 'Rezerva', share: 8, value: 0 },
])
const planned = (r: { share: number }) => Math.round((total.value * r.share) / 100)
const spent = (r: { value: number }) => Number(r.value) || 0
const shareSum = computed(() => rows.reduce((a, r) => a + r.share, 0))
const spentSum = computed(() => rows.reduce((a, r) => a + spent(r), 0))
const perGuest = computed(() => (guests.value > 0 ? Math.round(total.value / guests.value) : 0))
const { loggedIn } = useMockSession()
</script>

<template>
  <div class="sp-container tool">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/planovac-akci">Plánovač</NuxtLink> / <span>Rozpočet</span></nav>
    <SpHeading :level="1">Svatební rozpočet</SpHeading>
    <p class="sp-text-secondary">Výchozí rozdělení je jen odhad pro začátek, upravte procenta podle sebe. Rozpočet zůstává v prohlížeči, dokud se nepřihlásíte.</p>

    <div class="inputs">
      <SpInput v-model.number="total" label="Celkový rozpočet (Kč)" type="number" />
      <SpInput v-model.number="guests" label="Počet hostů" type="number" />
    </div>
    <p class="perguest"><strong>{{ money(perGuest) }}</strong> na jednoho hosta</p>

    <SpTable striped caption="Rozdělení rozpočtu">
      <thead><tr><th>Kategorie</th><th>Podíl (%)</th><th>Plán</th><th>Skutečná cena</th></tr></thead>
      <tbody>
        <tr v-for="r in rows" :key="r.name">
          <td>{{ r.name }}</td>
          <td><input v-model.number="r.share" class="cell" type="number" min="0" max="100" :aria-label="`Podíl ${r.name}`"></td>
          <td>{{ money(planned(r)) }}</td>
          <td><input v-model.number="r.value" class="cell cell--wide" type="number" min="0" :aria-label="`Skutečná cena ${r.name}`"></td>
        </tr>
        <tr class="total"><td>Celkem</td><td :class="{ bad: shareSum !== 100 }">{{ shareSum }} %</td><td>{{ money(total) }}</td><td>{{ money(spentSum) }}</td></tr>
      </tbody>
    </SpTable>
    <SpAlert v-if="shareSum !== 100" variant="warning" class="sp-mb-3">Podíly dávají {{ shareSum }} %. Upravte je, aby součet byl 100 %.</SpAlert>
    <SpAlert v-if="spentSum > total" variant="danger" class="sp-mb-3">Skutečné náklady přesahují rozpočet o {{ money(spentSum - total) }}.</SpAlert>

    <SpSurface variant="warm"><h2 class="h2">Uložit a propojit s dodavateli</h2><p>Po registraci převedeme rozpočet do akce, kde odliší odhad, nabídku, potvrzenou a skutečnou cenu.</p><SpButton :to="loggedIn ? '/ucet/akce/1' : '/registrace'">{{ loggedIn ? 'Převést do akce' : 'Uložit do účtu' }}</SpButton></SpSurface>
  </div>
</template>

<style scoped>
.tool { max-width: 48rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.inputs { display: grid; gap: var(--sp-space-3); margin-top: var(--sp-space-3); }
@media (min-width: 576px) { .inputs { grid-template-columns: 1fr 1fr; } }
.perguest { margin: 0 0 var(--sp-space-3); }
.cell { width: 5rem; padding: 0.3rem 0.4rem; background: var(--sp-color-bg-input); border: 1px solid transparent; border-radius: var(--sp-radius-input); }
.cell--wide { width: 8rem; }
.cell:focus { outline: none; border-color: var(--sp-color-primary); }
.total td { font-weight: var(--sp-font-weight-bold); }
.bad { color: var(--sp-color-danger); }
.h2 { margin: 0 0 var(--sp-space-1); font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
</style>
