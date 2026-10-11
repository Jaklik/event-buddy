<script setup lang="ts">
import { inquiries } from '~/data/mock/account'
import { suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Moje poptávky – SelfPlan', robots: 'noindex, nofollow' })

const filter = ref<'all' | 'open' | 'closed'>('all')
const rows = computed(() => inquiries
  .filter((i) => filter.value === 'all' || (filter.value === 'open' ? !['odmitnuta', 'uzavrena'].includes(i.status) : ['odmitnuta', 'uzavrena'].includes(i.status)))
  .map((i) => ({ ...i, supplier: suppliers.find((s) => s.id === i.supplierId)! })))
</script>

<template>
  <div>
    <SpPageHeader title="Moje poptávky" text="Stav poptávek, odpovědi dodavatelů a porovnání nabídek.">
      <SpButton to="/dodavatele">Poptat dodavatele</SpButton>
    </SpPageHeader>

    <div class="tabs" role="tablist" aria-label="Filtr poptávek">
      <button v-for="t in [['all', 'Všechny'], ['open', 'Aktivní'], ['closed', 'Uzavřené']]" :key="t[0]" type="button" role="tab" :aria-selected="filter === t[0]" :class="{ 'is-on': filter === t[0] }" @click="filter = t[0] as 'all' | 'open' | 'closed'">{{ t[1] }}</button>
    </div>

    <SpEmpty v-if="!rows.length" title="Zatím žádné poptávky" text="Vyberte dodavatele a pošlete nezávaznou poptávku.">
      <SpButton to="/dodavatele">Najít dodavatele</SpButton>
    </SpEmpty>
    <SpTable v-else striped caption="Poptávky">
      <thead><tr><th>Dodavatel</th><th>Akce</th><th>Termín</th><th>Stav</th><th></th></tr></thead>
      <tbody>
        <tr v-for="i in rows" :key="i.id">
          <td><NuxtLink :to="`/dodavatele/${i.supplier.slug}`">{{ i.supplier.name }}</NuxtLink><br><small class="sp-text-muted">{{ i.lastMessage }}</small></td>
          <td>{{ i.eventType }}</td>
          <td class="sp-nowrap">{{ fmtDate(i.date) }}</td>
          <td><SpBadge :variant="inquiryStatus[i.status].variant">{{ inquiryStatus[i.status].label }}</SpBadge> <SpBadge v-if="i.unread" variant="neutral">Nové</SpBadge></td>
          <td><SpButton size="sm" variant="border" :to="`/ucet/poptavky/${i.id}`">Detail</SpButton></td>
        </tr>
      </tbody>
    </SpTable>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: var(--sp-space-1); margin-bottom: var(--sp-space-3); border-bottom: 1px solid var(--sp-color-line); }
.tabs button { padding: 0.6rem 1rem; background: none; border: 0; border-bottom: 2px solid transparent; color: var(--sp-color-text-secondary); }
.tabs button.is-on { color: var(--sp-color-text-strong); font-weight: var(--sp-font-weight-semibold); border-bottom-color: var(--sp-color-primary); }
</style>
