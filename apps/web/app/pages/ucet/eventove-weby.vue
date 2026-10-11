<script setup lang="ts">
import { eventSites } from '~/data/mock/account'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Moje eventové weby – SelfPlan', robots: 'noindex, nofollow' })

const status: Record<string, [string, 'neutral' | 'warning' | 'success' | 'danger' | 'home']> = {
  local_draft: ['Lokální koncept', 'neutral'], draft: ['Koncept', 'neutral'], payment_pending: ['Čeká na platbu', 'warning'],
  paid_unpublished: ['Zaplaceno, nezveřejněno', 'home'], published: ['Zveřejněno', 'success'], expired: ['Vypršelo', 'danger'],
}
</script>

<template>
  <div>
    <SpPageHeader title="Moje eventové weby" text="Každý web je za samostatnou platbu 490 Kč a funguje 12 měsíců od prvního zveřejnění.">
      <SpButton to="/eventovy-web/editor">Nový web</SpButton>
    </SpPageHeader>
    <div class="sp-stack">
      <SpSurface v-for="s in eventSites" :key="s.id" variant="card" class="site">
        <div>
          <h2>{{ s.name }}</h2>
          <p class="sp-text-sm sp-text-secondary">Šablona: {{ s.template }} · soukromí: {{ s.privacy === 'odkaz' ? 'neveřejný odkaz' : s.privacy }}</p>
          <SpBadge :variant="status[s.status]![1]">{{ status[s.status]![0] }}</SpBadge>
          <p v-if="s.expiresAt" class="sp-text-xs sp-text-muted sp-mt-2">Platí do {{ fmtDate(s.expiresAt) }}. Před vypršením vás upozorníme a nabídneme export dat.</p>
        </div>
        <div v-if="s.status === 'published'" class="rsvp">
          <p class="sp-text-sm sp-mb-1"><strong>RSVP</strong> (vidíte jen vy)</p>
          <span><b>{{ s.rsvpYes }}</b> přijde</span><span><b>{{ s.rsvpNo }}</b> nepřijde</span><span><b>{{ s.rsvpWaiting }}</b> čeká</span>
        </div>
        <div class="sp-row sp-row--tight">
          <SpButton size="sm" variant="border" to="/eventovy-web/editor">Upravit</SpButton>
          <SpButton v-if="s.status === 'published'" size="sm" variant="border" :to="`/w/${s.slug}`">Otevřít web</SpButton>
          <SpButton v-if="s.status === 'published'" size="sm" variant="link">Stáhnout QR kód</SpButton>
          <SpButton v-if="s.status === 'published'" size="sm" variant="link">Export RSVP (CSV)</SpButton>
        </div>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.site { display: grid; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); }
.site h2 { margin: 0 0 0.2rem; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
.rsvp { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); align-items: baseline; font-size: var(--sp-text-sm); }
.rsvp p { flex-basis: 100%; }
.rsvp b { font-size: var(--sp-text-lg); }
@media (min-width: 768px) { .site { grid-template-columns: 1fr auto; align-items: start; } .site > :last-child { grid-column: 1 / -1; } }
</style>
