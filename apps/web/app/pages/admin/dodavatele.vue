<script setup lang="ts">
import { pendingProfiles } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Schvalování dodavatelů – Administrace', robots: 'noindex, nofollow' })
const rows = ref(pendingProfiles.map((p) => ({ ...p, state: 'ceka' as 'ceka' | 'ok' | 'vraceno' })))
const reason = ref('')
const returning = ref<number | null>(null)
</script>

<template>
  <div>
    <SpPageHeader title="Schvalování dodavatelů" text="Nový profil se nezveřejní, nezařadí do vyhledávání ani sitemap před schválením. Stejné IČO není důvod k zamítnutí." />
    <div class="sp-stack">
      <SpSurface v-for="p in rows" :key="p.id" variant="card" class="p">
        <div>
          <h2>{{ p.name }}</h2>
          <p class="sp-text-sm sp-text-secondary sp-mb-1">{{ p.category }} · vlastník {{ p.owner }} · odesláno {{ fmtDate(p.submitted) }}</p>
          <SpAlert v-if="p.duplicates.length" variant="warning"><strong>Možné duplicity:</strong> {{ p.duplicates.join('; ') }}</SpAlert>
          <SpBadge v-if="p.state !== 'ceka'" :variant="p.state === 'ok' ? 'success' : 'warning'">{{ p.state === 'ok' ? 'Schváleno' : 'Vráceno k doplnění' }}</SpBadge>
        </div>
        <div v-if="p.state === 'ceka'" class="sp-row sp-row--tight"><SpButton size="sm" @click="p.state = 'ok'">Schválit</SpButton><SpButton size="sm" variant="border" @click="returning = p.id">Vrátit s důvodem</SpButton><SpButton size="sm" variant="link">Porovnat s duplicitou</SpButton></div>
      </SpSurface>
    </div>
    <SpModal :model-value="returning !== null" title="Vrátit k doplnění" @update:model-value="returning = null">
      <SpInput v-model="reason" label="Důvod (uvidí žadatel)" multiline :rows="3" />
      <template #footer><SpButton variant="border" @click="returning = null">Zrušit</SpButton><SpButton @click="rows.find((r) => r.id === returning)!.state = 'vraceno'; returning = null; reason = ''">Vrátit</SpButton></template>
    </SpModal>
  </div>
</template>

<style scoped>
.p { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); }
.p h2 { margin: 0 0 0.2rem; font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-lg); }
</style>
