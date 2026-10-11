<script setup lang="ts">
import { deals as seed, stages, type Deal, type DealStage } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'CRM a zakázky – SelfPlan', robots: 'noindex, nofollow' })

const deals = ref<Deal[]>(seed.map((d) => ({ ...d })))
const order = stages.map((s) => s.id)
function move(d: Deal, dir: -1 | 1) {
  const i = order.indexOf(d.stage) + dir
  if (i >= 0 && i < order.length) d.stage = order[i] as DealStage
}
const by = (s: DealStage) => deals.value.filter((d) => d.stage === s)
const total = (s: DealStage) => by(s).reduce((a, d) => a + d.value, 0)
const addOpen = ref(false)
const form = reactive({ title: '', customer: '', date: '', value: 0 })
function add() {
  deals.value.push({ id: Date.now(), title: form.title || 'Nová zakázka', customer: form.customer || 'Zákazník', date: form.date || '2027-01-01', value: Number(form.value) || 0, stage: 'nova', source: 'mimo', note: 'Zakázka mimo SelfPlan: soukromý CRM záznam.' })
  addOpen.value = false
}
</script>

<template>
  <div>
    <SpPageHeader title="CRM a zakázky" text="Zdarma. Zakázky ze SelfPlanu i ty, které jste získali jinde. Ručně vložené zakázky jsou soukromé a nevykazují se jako zprostředkované platformou.">
      <SpButton @click="addOpen = true">Přidat zakázku</SpButton>
    </SpPageHeader>

    <div class="board">
      <section v-for="s in stages" :key="s.id" class="col" :aria-label="s.label">
        <header class="col__head"><h2>{{ s.label }} <small>{{ by(s.id).length }}</small></h2><span class="sp-text-xs sp-text-muted">{{ money(total(s.id)) }}</span></header>
        <article v-for="d in by(s.id)" :key="d.id" class="deal">
          <h3>{{ d.title }}</h3>
          <p class="deal__who">{{ d.customer }} · {{ fmtDate(d.date) }}</p>
          <p class="deal__val">{{ money(d.value) }}</p>
          <div class="deal__foot">
            <SpBadge :variant="d.source === 'selfplan' ? 'home' : 'neutral'">{{ d.source === 'selfplan' ? 'SelfPlan' : 'Mimo SelfPlan' }}</SpBadge>
            <span class="deal__move">
              <button type="button" :disabled="s.id === 'nova'" aria-label="Posunout o fázi zpět" @click="move(d, -1)"><SpIcon name="fa6-solid:chevron-left" /></button>
              <button type="button" :disabled="s.id === 'hotovo'" aria-label="Posunout o fázi dopředu" @click="move(d, 1)"><SpIcon name="fa6-solid:chevron-right" /></button>
            </span>
          </div>
        </article>
        <p v-if="!by(s.id).length" class="col__empty">Prázdné</p>
      </section>
    </div>

    <SpModal v-model="addOpen" title="Nová zakázka">
      <form class="sp-stack" @submit.prevent="add">
        <SpInput v-model="form.title" label="Název zakázky" />
        <SpInput v-model="form.customer" label="Zákazník" />
        <SpInput v-model="form.date" label="Datum akce" type="date" />
        <SpInput v-model="form.value" label="Hodnota (Kč)" type="number" />
        <SpButton type="submit">Uložit</SpButton>
      </form>
    </SpModal>
  </div>
</template>

<style scoped>
.board { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(15rem, 1fr); gap: var(--sp-space-3); overflow-x: auto; padding-bottom: var(--sp-space-2); }
.col { padding: var(--sp-space-2); background: var(--sp-color-bg-neutral); border-radius: var(--sp-radius-md); min-height: 12rem; }
.col__head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); }
.col__head h2 { margin: 0; font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); }
.col__head small { color: var(--sp-color-text-muted); }
.col__empty { margin: var(--sp-space-3) 0; text-align: center; font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.deal { margin-bottom: var(--sp-space-2); padding: var(--sp-space-2) var(--sp-space-3); background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-sm); }
.deal h3 { margin: 0; font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); }
.deal__who { margin: 0.2rem 0; font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.deal__val { margin: 0 0 var(--sp-space-2); font-weight: var(--sp-font-weight-semibold); }
.deal__foot { display: flex; align-items: center; justify-content: space-between; }
.deal__move button { padding: 0.25rem 0.4rem; background: none; border: 0; border-radius: 4px; color: var(--sp-color-text-secondary); }
.deal__move button:hover:not(:disabled) { background: var(--sp-color-bg-neutral); color: var(--sp-color-text-strong); }
.deal__move button:disabled { opacity: 0.3; }
</style>
