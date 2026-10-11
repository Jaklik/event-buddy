<script setup lang="ts">
import { calendarEvents, deals, stats, supplierInquiries, supplierTasks } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Přehled dodavatele – SelfPlan', robots: 'noindex, nofollow' })

const newInq = supplierInquiries.filter((i) => i.status === 'nova')
const upcoming = calendarEvents.filter((e) => e.tone === 'busy' || e.tone === 'brand')
const openTasks = supplierTasks.filter((t) => !t.done)
</script>

<template>
  <div>
    <SpPageHeader title="Vítejte, Zámek Loučeň (ukázka)" text="Aktivita za posledních 30 dní.">
      <SpButton variant="border" to="/dodavatele/1-zamek-loucen-ukazka">Zobrazit veřejný profil</SpButton>
    </SpPageHeader>

    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4 sp-mb-4">
      <SpStat :value="stats.views.toLocaleString('cs')" label="Zobrazení profilu" :hint="`+${stats.viewsDelta} %`" icon="fa6-regular:eye" />
      <SpStat :value="stats.inquiries" label="Poptávky" :hint="`+${stats.inquiriesDelta} %`" icon="fa6-regular:paper-plane" to="/dodavatel/poptavky" />
      <SpStat :value="stats.confirmed" label="Potvrzené zakázky" icon="fa6-regular:calendar-check" to="/dodavatel/crm" />
      <SpStat :value="String(stats.rating).replace('.', ',')" label="Hodnocení" :hint="`${stats.ratingCount} recenzí`" icon="fa6-regular:star" to="/dodavatel/recenze" />
    </div>

    <div class="cols">
      <SpSurface variant="card" class="box">
        <header class="box__head"><h2>Nové poptávky</h2><NuxtLink to="/dodavatel/poptavky" class="sp-text-sm">Všechny</NuxtLink></header>
        <ul class="list">
          <li v-for="i in newInq" :key="i.id"><div><strong>{{ i.customer }}</strong><span class="sp-text-sm sp-text-muted"> · {{ i.eventType }}, {{ fmtDate(i.date) }}, {{ i.guests }} osob</span></div><SpButton size="sm" variant="border" to="/dodavatel/poptavky">Zobrazit</SpButton></li>
        </ul>
      </SpSurface>
      <SpSurface variant="card" class="box">
        <header class="box__head"><h2>Nadcházející zakázky</h2><NuxtLink to="/dodavatel/kalendar" class="sp-text-sm">Kalendář</NuxtLink></header>
        <ul class="list"><li v-for="e in upcoming" :key="e.date"><div><strong>{{ fmtDate(e.date) }}</strong> <span class="sp-text-sm">{{ e.label }}</span></div></li></ul>
        <h3 class="box__sub">Úkoly</h3>
        <ul class="list"><li v-for="t in openTasks" :key="t.id"><div>{{ t.title }} <span class="sp-text-sm sp-text-muted">(do {{ fmtDate(t.due) }})</span></div></li></ul>
      </SpSurface>
    </div>

    <SpAlert variant="info" class="sp-mt-4">V CRM máte {{ deals.length }} zakázek. Úkol v CRM sám o sobě nikdy neblokuje veřejný termín.</SpAlert>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-3); }
@media (min-width: 992px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--sp-space-2); }
.box__head h2 { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.box__sub { margin: var(--sp-space-3) 0 var(--sp-space-1); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-text-secondary); }
.list { margin: 0; padding: 0; list-style: none; }
.list li { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-space-2); padding: var(--sp-space-2) 0; border-top: 1px solid var(--sp-color-line); }
.list li:first-child { border-top: 0; }
</style>
