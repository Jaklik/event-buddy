<script setup lang="ts">
import { myProfiles } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Moje profily – SelfPlan', robots: 'noindex, nofollow' })

const state = { APPROVED: ['Zveřejněno', 'success'], SUBMITTED: ['Čeká na schválení', 'warning'], DRAFT: ['Koncept', 'neutral'], CHANGES_REQUESTED: ['Vráceno k doplnění', 'danger'], SUSPENDED: ['Pozastaveno', 'danger'] } as const
const active = ref(1)
</script>

<template>
  <div>
    <SpPageHeader title="Moje profily" text="Jeden účet může spravovat neomezeně dodavatelských profilů. Data, poptávky i statistiky jsou mezi profily oddělené.">
      <SpButton to="/dodavatel/profily/novy">Přidat podnikání</SpButton>
    </SpPageHeader>
    <div class="sp-stack">
      <SpSurface v-for="p in myProfiles" :key="p.id" variant="card" class="p" :class="{ 'is-active': active === p.id }">
        <div>
          <h2>{{ p.name }}</h2>
          <p class="sp-text-sm sp-text-muted">{{ p.category }}</p>
          <SpBadge :variant="state[p.status as keyof typeof state][1]">{{ state[p.status as keyof typeof state][0] }}</SpBadge>
          <p v-if="p.status === 'SUBMITTED'" class="sp-text-xs sp-text-muted sp-mt-2">Profil není veřejný, nezobrazuje se ve vyhledávání ani v sitemap, dokud ho administrátor neschválí.</p>
        </div>
        <div class="sp-row sp-row--tight">
          <SpButton size="sm" :variant="active === p.id ? 'cta' : 'border'" @click="active = p.id">{{ active === p.id ? 'Aktivní profil' : 'Přepnout' }}</SpButton>
          <SpButton size="sm" variant="border" to="/dodavatel/sluzby">Upravit</SpButton>
          <SpButton v-if="p.url" size="sm" variant="link" :to="p.url">Veřejný náhled</SpButton>
        </div>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.p { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); }
.p.is-active { border-color: var(--sp-color-primary); }
.p h2 { margin: 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
.p p { margin: 0.2rem 0 var(--sp-space-2); }
</style>
