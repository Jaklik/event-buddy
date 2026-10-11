<script setup lang="ts">
import { adminKpis, queue } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Administrace – SelfPlan', robots: 'noindex, nofollow' })
const prio: Record<string, 'danger' | 'neutral'> = { vysoká: 'danger', normální: 'neutral' }
</script>

<template>
  <div>
    <SpPageHeader title="Dashboard" text="Pracovní fronta a klíčová čísla." />
    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4 sp-mb-4">
      <SpStat :value="adminKpis.newUsers" label="Noví uživatelé (30 dní)" icon="fa6-solid:user-plus" to="/admin/uzivatele" />
      <SpStat :value="adminKpis.activeSuppliers" label="Aktivní dodavatelé" icon="fa6-regular:building" to="/admin/dodavatele" />
      <SpStat :value="adminKpis.inquiries" label="Poptávky (30 dní)" icon="fa6-regular:paper-plane" to="/admin/poptavky" />
      <SpStat :value="money(adminKpis.revenue)" label="Tržby (30 dní)" icon="fa6-solid:coins" to="/admin/platby" />
      <SpStat :value="adminKpis.awaitingPayment" label="Čeká na platbu" icon="fa6-solid:hourglass-half" to="/admin/platby" />
      <SpStat :value="adminKpis.newReviews" label="Nové recenze" icon="fa6-regular:star" to="/admin/recenze" />
      <SpStat :value="adminKpis.reports" label="Nahlášený obsah" icon="fa6-regular:flag" to="/admin/moderace" />
    </div>
    <SpSurface variant="card" class="q">
      <h2>Pracovní fronta</h2>
      <ul><li v-for="i in queue" :key="i.id"><div><SpBadge variant="home">{{ i.type }}</SpBadge> <strong>{{ i.title }}</strong><small>stáří {{ i.age }}</small></div><span><SpBadge :variant="prio[i.priority]">{{ i.priority }}</SpBadge> <SpButton size="sm" variant="border" :to="i.to">Otevřít</SpButton></span></li></ul>
    </SpSurface>
    <p class="sp-text-xs sp-text-muted sp-mt-3">Důležité události přijdou i e-mailem (bez duplicit). Administrátor nevidí soukromé CRM, RSVP seznamy ani obsah zpráv bez auditovaného důvodu.</p>
  </div>
</template>

<style scoped>
.q { padding: var(--sp-space-3) var(--sp-space-4); }
.q h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.q ul { margin: 0; padding: 0; list-style: none; }
.q li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-2); padding: var(--sp-space-2) 0; border-top: 1px solid var(--sp-color-line); }
.q li:first-child { border-top: 0; }
.q small { margin-left: var(--sp-space-2); color: var(--sp-color-text-muted); }
</style>
