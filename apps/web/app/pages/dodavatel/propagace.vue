<script setup lang="ts">
import { adOrders } from '~/data/mock/supplier'
import { adProducts, calcAdPrice, durations, INTRO_UNTIL } from '~/utils/ads'
import type { AdProduct } from '~/data/mock/types'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Propagace a reklama – SelfPlan', robots: 'noindex, nofollow' })

const form = reactive({ product: 'catalog' as AdProduct, days: 30, regions: 1, from: '2026-11-01' })
const calc = computed(() => calcAdPrice(form.product, form.days, form.regions, form.from))
const def = computed(() => adProducts.find((p) => p.id === form.product)!)
const statusMap: Record<string, [string, 'neutral' | 'warning' | 'success' | 'danger' | 'home']> = { zadost: ['Žádost', 'warning'], schvaleno: ['Schváleno', 'home'], 'ceka-na-platbu': ['Čeká na platbu', 'warning'], aktivni: ['Aktivní', 'success'], dokonceno: ['Dokončeno', 'neutral'], zamitnuto: ['Zamítnuto', 'danger'] }
const ordered = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Propagace a reklama" text="Časově omezená placená propagace. Každá pozice je označena „Sponzorováno“ a oddělena od organického řazení. Objednávka podléhá schválení." />
    <SpAlert variant="info" class="sp-mb-3">Zaváděcí ceny platí pro objednávky do {{ fmtDate(INTRO_UNTIL) }}. Cena je konečná (neplátce DPH). Nezaručujeme počet zobrazení ani zakázek.</SpAlert>

    <div class="cols">
      <SpSurface variant="card" as="form" class="box" @submit.prevent="ordered = true">
        <h2>Nová objednávka</h2>
        <SpSelect v-model="form.product" label="Produkt" :options="adProducts.map((p) => ({ value: p.id, label: p.label }))" />
        <p class="sp-text-sm sp-text-secondary">{{ def.note }} Kapacita {{ def.capacity }}.</p>
        <SpSelect v-model="form.days" label="Délka" :options="durations.map((d) => ({ value: d.days, label: `${d.days} dní${d.discount ? ` (sleva ${d.discount * 100} %)` : ''}` }))" />
        <SpInput v-if="form.product === 'catalog'" v-model="form.regions" label="Počet krajů" type="number" hint="Každý další kraj +50 % základní ceny; jen v oblastech skutečného působení." />
        <SpInput v-model="form.from" label="Začátek" type="date" />
        <div class="price" aria-live="polite">
          <span>Cena celkem</span><strong>{{ money(calc.price) }}</strong>
          <small>{{ money(calc.base) }} / 30 dní ({{ calc.intro ? 'zaváděcí' : 'standardní' }}) × {{ form.days / 30 }}{{ calc.discount ? `, sleva ${calc.discount * 100} %` : '' }}</small>
        </div>
        <SpAlert v-if="ordered" variant="success">Žádost byla odeslána ke kontrole. Po schválení vám pošleme platební údaje. Kapacita se rezervuje po schválení.</SpAlert>
        <SpButton v-else type="submit">Odeslat žádost</SpButton>
      </SpSurface>

      <section aria-label="Moje objednávky">
        <h2 class="h2">Moje objednávky</h2>
        <SpSurface v-for="o in adOrders" :key="o.id" variant="card" class="order">
          <div><strong>{{ o.productLabel }}</strong><p class="sp-text-sm sp-text-muted sp-mb-0">{{ fmtDate(o.from) }} – {{ fmtDate(o.to) }} · {{ o.days }} dní · {{ money(o.price) }}</p></div>
          <div class="order__r"><SpBadge :variant="statusMap[o.status]![1]">{{ statusMap[o.status]![0] }}</SpBadge><span v-if="o.impressions" class="sp-text-xs sp-text-muted">{{ o.impressions }} zobrazení · {{ o.clicks }} kliků</span></div>
        </SpSurface>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-4); align-items: start; }
@media (min-width: 992px) { .cols { grid-template-columns: 24rem 1fr; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2, .h2 { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.price { display: grid; margin: var(--sp-space-3) 0; padding: var(--sp-space-3); background: var(--sp-color-bg-warm); border-radius: var(--sp-radius-sm); }
.price strong { font-family: var(--sp-font-heading); font-size: var(--sp-text-2xl); font-weight: var(--sp-font-weight-regular); }
.price small { color: var(--sp-color-text-secondary); }
.order { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); padding: var(--sp-space-3) var(--sp-space-4); }
.order__r { display: grid; gap: 0.25rem; justify-items: end; }
</style>
