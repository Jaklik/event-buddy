<script setup lang="ts">
import { calendarEvents } from '~/data/mock/supplier'
import { availabilityFor } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Kalendář a dostupnost – SelfPlan', robots: 'noindex, nofollow' })

type DayState = 'free' | 'busy' | 'unknown' | 'tentative'
const view = ref<'private' | 'public'>('private')
const month = ref('2027-06')
const blocks = ref<Record<string, DayState>>({ '2027-06-26': 'busy' })
const selected = ref('')
const states = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  const out: Record<string, DayState> = {}
  for (let d = 1; d <= new Date(y!, m!, 0).getDate(); d++) {
    const iso = `${month.value}-${String(d).padStart(2, '0')}`
    out[iso] = blocks.value[iso] ?? availabilityFor(1, iso)
  }
  return out
})
function setBlock(s: DayState | '') {
  if (!selected.value) return
  const b = { ...blocks.value }
  s ? (b[selected.value] = s) : delete b[selected.value]
  blocks.value = b
}
</script>

<template>
  <div>
    <SpPageHeader title="Kalendář a dostupnost" text="Zakázky, ruční blokace a předběžné rezervace. Veřejně se ukazuje jen stav dne: volno, obsazeno nebo k ověření.">
      <div class="seg" role="group" aria-label="Zobrazení">
        <button type="button" :aria-pressed="view === 'private'" :class="{ 'is-on': view === 'private' }" @click="view = 'private'">Soukromý pohled</button>
        <button type="button" :aria-pressed="view === 'public'" :class="{ 'is-on': view === 'public' }" @click="view = 'public'">Jak to vidí zákazník</button>
      </div>
    </SpPageHeader>

    <div class="cols">
      <SpSurface variant="card" class="box">
        <SpCalendar v-if="view === 'private'" :month="month" :states="states" :events="calendarEvents" selectable :selected="selected" :legend="true" @select="selected = $event" @month-change="month = $event" />
        <SpCalendar v-else :month="month" :states="states" :legend="true" @month-change="month = $event" />
      </SpSurface>
      <aside class="side">
        <SpSurface variant="card" class="box">
          <h2>Ruční úprava dne</h2>
          <p v-if="!selected" class="sp-text-sm sp-text-secondary">Vyberte den v kalendáři (soukromý pohled).</p>
          <template v-else>
            <p class="sp-text-sm"><strong>{{ fmtDateLong(selected) }}</strong></p>
            <div class="sp-stack sp-stack--tight">
              <SpButton size="sm" variant="border" @click="setBlock('busy')">Označit jako obsazeno</SpButton>
              <SpButton size="sm" variant="border" @click="setBlock('tentative')">Předběžná rezervace</SpButton>
              <SpButton size="sm" variant="border" @click="setBlock('free')">Označit jako volno</SpButton>
              <SpButton size="sm" variant="link" @click="setBlock('')">Zrušit ruční úpravu</SpButton>
            </div>
          </template>
        </SpSurface>
        <SpAlert variant="info">Úkoly a administrativa den neblokují. Termín, který nelze ověřit, se zákazníkům ukazuje jako „k ověření“, nikdy jako volný.</SpAlert>
        <SpSurface variant="warm" class="box">
          <h2>Externí kalendáře <SpBadge variant="neutral">Připravujeme</SpBadge></h2>
          <p class="sp-text-sm sp-mb-0">Jednosměrný import blokujících událostí z Google a Outlook kalendáře přijde v další fázi. SelfPlan do vašeho kalendáře nezapisuje.</p>
        </SpSurface>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-3); align-items: start; }
@media (min-width: 992px) { .cols { grid-template-columns: minmax(0, 1fr) 20rem; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.side { display: grid; gap: var(--sp-space-3); }
.seg { display: inline-flex; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); overflow: hidden; }
.seg button { padding: 0.45rem 1rem; font-size: var(--sp-text-sm); background: var(--sp-color-bg); border: 0; }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); }
</style>
