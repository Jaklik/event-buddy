<script setup lang="ts">
import { myReviews } from '~/data/mock/account'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Moje recenze – SelfPlan', robots: 'noindex, nofollow' })

const statusMap = { schvaleno: { l: 'Zveřejněno', v: 'success' }, ceka: { l: 'Čeká na schválení', v: 'warning' } } as const
</script>

<template>
  <div>
    <SpPageHeader title="Moje recenze" text="Úprava zveřejněné recenze vytvoří novou verzi ke schválení. Do schválení zůstává veřejná původní verze." />
    <div class="sp-stack">
      <SpSurface v-for="r in myReviews" :key="r.id" variant="card" class="rev">
        <header class="rev__head">
          <h2>{{ r.supplier }}</h2>
          <span>
            <SpBadge :variant="statusMap[r.status as keyof typeof statusMap].v">{{ statusMap[r.status as keyof typeof statusMap].l }}</SpBadge>
            <SpBadge v-if="r.pendingRevision" variant="warning">Upravená verze čeká na schválení</SpBadge>
          </span>
        </header>
        <SpStars :value="r.rating" />
        <p>{{ r.text }}</p>
        <p class="sp-text-xs sp-text-muted">Odesláno {{ fmtDate(r.date) }} · verze {{ r.revision }}</p>
        <div class="sp-row sp-row--tight"><SpButton size="sm" variant="border">Navrhnout úpravu</SpButton><SpButton size="sm" variant="link">Historie verzí</SpButton></div>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.rev { padding: var(--sp-space-3) var(--sp-space-4); }
.rev__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-2); margin-bottom: var(--sp-space-1); }
.rev__head h2 { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
</style>
