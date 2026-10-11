<script setup lang="ts">
import { reviewQueue } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Moderace recenzí – Administrace', robots: 'noindex, nofollow' })
const rows = ref(reviewQueue.map((r) => ({ ...r, state: 'ceka' as 'ceka' | 'ok' | 'zamitnuto' | 'doplnit' })))
</script>

<template>
  <div>
    <SpPageHeader title="Moderace recenzí" text="Negativní, ale autentické recenze se nesmí systematicky potlačovat. Každé rozhodnutí má důvod a zapisuje se do auditu." />
    <div class="sp-stack">
      <SpSurface v-for="r in rows" :key="r.id" variant="card" class="r">
        <div><strong>{{ r.supplier }}</strong> <SpBadge variant="neutral">{{ r.kind }}</SpBadge><div><SpStars :value="r.rating" /> <span class="sp-text-sm sp-text-muted">{{ r.author }}</span></div><p class="sp-mb-0">{{ r.text }}</p></div>
        <div v-if="r.state === 'ceka'" class="sp-row sp-row--tight"><SpButton size="sm" @click="r.state = 'ok'">Schválit</SpButton><SpButton size="sm" variant="border" @click="r.state = 'doplnit'">Vyžádat doplnění</SpButton><SpButton size="sm" variant="danger" @click="r.state = 'zamitnuto'">Zamítnout</SpButton></div>
        <SpBadge v-else :variant="r.state === 'ok' ? 'success' : 'warning'">{{ { ok: 'Schváleno', zamitnuto: 'Zamítnuto', doplnit: 'Vráceno k doplnění' }[r.state] }}</SpBadge>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.r { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); }
</style>
