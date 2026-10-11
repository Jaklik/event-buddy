<script setup lang="ts">
import { listings } from '~/data/mock/content'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Moje inzeráty – SelfPlan', robots: 'noindex, nofollow' })

const mine = ref(listings.slice(0, 4).map((l) => ({ ...l })))
const st: Record<string, [string, 'success' | 'warning' | 'neutral' | 'danger']> = { active: ['Aktivní', 'success'], expiring: ['Brzy končí', 'warning'], sold: ['Prodáno', 'neutral'], archived: ['Archiv (30 dní)', 'danger'] }
const promos = [{ id: 'h7', label: 'Zvýraznění 7 dní', price: 39 }, { id: 'h30', label: 'Zvýraznění 30 dní', price: 99 }, { id: 't7', label: 'TOP pozice v kategorii 7 dní', price: 79 }]
const promoFor = ref<number | null>(null)
const extend = (l: (typeof mine.value)[number]) => { l.status = 'active'; l.expiresAt = '2027-01-18' }
</script>

<template>
  <div>
    <SpPageHeader title="Moje inzeráty" text="Aktivní inzeráty platí 60 dní. Prodloužení je zdarma. Po expiraci 30 dní neveřejný archiv, poté smazání.">
      <SpButton to="/bazar/novy">Přidat inzerát</SpButton>
    </SpPageHeader>
    <div class="sp-stack">
      <SpSurface v-for="l in mine" :key="l.id" variant="card" class="row">
        <img :src="l.image" alt="" width="80" height="80">
        <div class="row__b">
          <NuxtLink :to="`/bazar/${l.slug}`"><strong>{{ l.title }}</strong></NuxtLink>
          <p class="sp-text-sm sp-text-secondary sp-mb-1">{{ money(l.price) }} · platí do {{ fmtDate(l.expiresAt) }} ({{ Math.max(0, daysUntil(l.expiresAt)) }} dní)</p>
          <SpBadge :variant="st[l.status]![1]">{{ st[l.status]![0] }}</SpBadge>
        </div>
        <div class="sp-row sp-row--tight">
          <SpButton size="sm" variant="border" @click="extend(l)">Prodloužit zdarma</SpButton>
          <SpButton size="sm" variant="border" @click="l.status = 'sold'">Označit prodané</SpButton>
          <SpButton size="sm" variant="brand" @click="promoFor = l.id">Propagovat</SpButton>
        </div>
      </SpSurface>
    </div>
    <SpModal :model-value="promoFor !== null" title="Propagace inzerátu" @update:model-value="promoFor = null">
      <ul class="promo"><li v-for="p in promos" :key="p.id"><span>{{ p.label }}</span><strong>{{ money(p.price) }}</strong></li></ul>
      <p class="sp-text-sm sp-text-secondary">Placená propagace je vždy označena „Sponzorováno“. Cena je konečná (neplátce DPH). Propagace se neprodlužuje automaticky.</p>
      <template #footer><SpButton @click="promoFor = null">Pokračovat k platbě (ukázka)</SpButton></template>
    </SpModal>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-space-3); padding: var(--sp-space-3); }
.row img { width: 5rem; height: 5rem; object-fit: cover; border-radius: var(--sp-radius-sm); }
.row__b { flex: 1; min-width: 12rem; }
.promo { margin: 0 0 var(--sp-space-3); padding: 0; list-style: none; }
.promo li { display: flex; justify-content: space-between; padding: var(--sp-space-2) 0; border-bottom: 1px solid var(--sp-color-line); }
</style>
