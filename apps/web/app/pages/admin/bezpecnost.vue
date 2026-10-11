<script setup lang="ts">
import { adminUsers, auditLog } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Bezpečnost – Administrace', robots: 'noindex, nofollow' })
const suspicious = adminUsers.filter((u) => u.status === 'podezřelý')
</script>

<template>
  <div>
    <SpPageHeader title="Bezpečnost" text="Podezřelé účty, ochrana registrací a auditní log. Účty se nemažou automaticky jen kvůli neobvyklému jménu nebo doméně." />
    <SpAlert variant="info" class="sp-mb-3">Administrátorský účet vyžaduje MFA. Anti-bot (Turnstile nebo ekvivalent) a rate limiting chrání registraci, přihlášení, reset hesla a poptávky.</SpAlert>
    <h2 class="h2">Fronta podezřelých účtů</h2>
    <SpTable striped caption="Podezřelé účty">
      <thead><tr><th>E-mail</th><th>Důvod označení</th><th>Registrace</th><th></th></tr></thead>
      <tbody><tr v-for="u in suspicious" :key="u.id"><td>{{ u.email }}</td><td>Vysoká rychlost registrací, neověřený e-mail</td><td>{{ fmtDate(u.created) }}</td><td class="sp-row sp-row--tight"><SpButton size="sm" variant="border">Ověřit</SpButton><SpButton size="sm" variant="danger">Omezit</SpButton></td></tr></tbody>
    </SpTable>
    <h2 class="h2">Auditní log</h2>
    <SpTable striped caption="Auditní log">
      <thead><tr><th>Čas</th><th>Kdo</th><th>Akce</th><th>Entita</th></tr></thead>
      <tbody><tr v-for="a in auditLog" :key="a.at + a.action"><td class="sp-nowrap">{{ a.at }}</td><td>{{ a.actor }}</td><td>{{ a.action }}</td><td>{{ a.entity }}</td></tr></tbody>
    </SpTable>
    <p class="sp-text-xs sp-text-muted">Log neobsahuje hesla ani celé tokeny; citlivá data jsou redigována.</p>
  </div>
</template>

<style scoped>
.h2 { margin: var(--sp-space-4) 0 var(--sp-space-2); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
</style>
