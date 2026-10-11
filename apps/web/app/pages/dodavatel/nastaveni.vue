<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Nastavení dodavatele – SelfPlan', robots: 'noindex, nofollow' })
const n = reactive({ inquiry: true, reply: true, upcoming: true, weekly: false })
</script>

<template>
  <div>
    <SpPageHeader title="Nastavení" text="Oznámení a správa přístupů k profilu." />
    <div class="cols">
      <SpSurface variant="card" class="box">
        <h2>Oznámení</h2>
        <SpSwitch v-model="n.inquiry" label="Nová poptávka" />
        <SpSwitch v-model="n.reply" label="Odpověď zákazníka" class="sp-mt-2" />
        <SpSwitch v-model="n.upcoming" label="Blížící se zakázka" class="sp-mt-2" />
        <SpSwitch v-model="n.weekly" label="Týdenní souhrn" class="sp-mt-2" />
      </SpSurface>
      <SpSurface variant="warm" class="box">
        <h2>Spolupracovníci <SpBadge variant="neutral">Připravujeme</SpBadge></h2>
        <p class="sp-text-sm sp-mb-0">Přístup dalších správců k jednomu profilu přijde v další fázi. Architektura oprávnění je na to připravená.</p>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-3); }
@media (min-width: 992px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
</style>
