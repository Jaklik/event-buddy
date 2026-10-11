<script setup lang="ts">
import { adProducts } from '~/utils/ads'
import { adOrders } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Reklama – Administrace', robots: 'noindex, nofollow' })
// Demo occupancy per product (fictional).
const used: Record<string, number> = { 'home-main': 2, billboard: 1, 'home-carousel': 5, catalog: 9, detail: 3 }
</script>

<template>
  <div>
    <SpPageHeader title="Reklamní inventář" text="Kapacity a ceny jsou konfigurovatelné; změna neruší potvrzené objednávky. Rezervace kapacity je atomická, nelze přeprodat poslední místo." />
    <SpTable striped caption="Inventář">
      <thead><tr><th>Produkt</th><th>Zaváděcí / 30 dní</th><th>Standardní / 30 dní</th><th>Obsazenost</th></tr></thead>
      <tbody><tr v-for="p in adProducts" :key="p.id"><td>{{ p.label }}</td><td>{{ money(p.intro) }}</td><td>{{ money(p.standard) }}</td><td><SpBadge :variant="used[p.id]! >= p.capacity ? 'danger' : 'success'">{{ used[p.id] }} / {{ p.capacity }}</SpBadge></td></tr></tbody>
    </SpTable>
    <h2 class="h2">Objednávky</h2>
    <SpTable striped caption="Objednávky reklamy">
      <thead><tr><th>Dodavatel</th><th>Produkt</th><th>Období</th><th>Cena</th><th>Stav</th><th></th></tr></thead>
      <tbody><tr v-for="o in adOrders" :key="o.id"><td>{{ o.supplier }}</td><td>{{ o.productLabel }}</td><td>{{ fmtDate(o.from) }} – {{ fmtDate(o.to) }}</td><td>{{ money(o.price) }}</td><td><SpBadge :variant="o.status === 'aktivni' ? 'success' : 'warning'">{{ o.status === 'aktivni' ? 'Aktivní' : 'Čeká na platbu' }}</SpBadge></td><td><SpButton size="sm" variant="border">Detail</SpButton></td></tr></tbody>
    </SpTable>
    <p class="sp-text-xs sp-text-muted">Platnost ceny 30 dní. Konkrétní objednávka má uloženou historickou cenu; změna ceníku ji zpětně nepřepočítá. Nezaplacená rezervace po 7 dnech uvolní kapacitu.</p>
  </div>
</template>

<style scoped>
.h2 { margin: var(--sp-space-4) 0 var(--sp-space-2); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
</style>
