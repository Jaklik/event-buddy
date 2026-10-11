<script setup lang="ts">
import { suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Služby a ceny – SelfPlan', robots: 'noindex, nofollow' })

const s = suppliers[0]!
const packages = ref(s.packages.map((p) => ({ ...p })))
const scenario = reactive({ price: s.scenario?.totalPrice ?? 0, note: '', cannot: false })
const saved = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Služby a ceny" text="Balíčky, doplňky a modelová zakázka pro porovnání cen." />
    <SpAlert v-if="saved" variant="success" dismissible class="sp-mb-3" @close="saved = false">Změny byly uloženy.</SpAlert>

    <SpSurface variant="card" class="box">
      <h2>Balíčky</h2>
      <div class="pk" v-for="p in packages" :key="p.name">
        <SpInput v-model="p.name" label="Název balíčku" />
        <SpInput v-model="p.priceFrom" label="Cena od (Kč)" type="number" />
        <SpInput v-model="p.description" label="Krátký popis" />
      </div>
      <SpButton variant="border" size="sm">Přidat balíček</SpButton>
    </SpSurface>

    <SpSurface variant="warm" class="box sp-mt-3">
      <h2>Modelová zakázka</h2>
      <p class="sp-text-sm">Scénář pro vaši kategorii zadává administrátor: <strong>{{ s.scenario?.title }}</strong>. Uveďte realistickou orientační celkovou cenu za celý scénář. Povinné položky nelze vyloučit.</p>
      <SpInput v-model="scenario.price" label="Orientační celková cena (Kč)" type="number" :disabled="scenario.cannot" />
      <SpCheckbox v-model="scenario.cannot" label="Modelovou cenu nelze stanovit" />
      <SpInput v-model="scenario.note" label="Poznámka k ceně" multiline :rows="3" />
      <p class="sp-text-xs sp-text-muted">Cena je nezávazná orientace, ne garance dostupnosti ani konečné ceny. Cenová úroveň $/$$/$$$ se zobrazí jen při dostatku srovnatelných cen; nezávisí na VIP ani na reklamě.</p>
      <SpButton @click="saved = true">Uložit</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.pk { display: grid; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); }
@media (min-width: 768px) { .pk { grid-template-columns: 2fr 1fr 3fr; } }
</style>
