<script setup lang="ts">
import { payments as seed } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Platby – Administrace', robots: 'noindex, nofollow' })
const rows = ref(seed.map((p) => ({ ...p })))
const st: Record<string, [string, 'warning' | 'success' | 'danger']> = { ceka: ['Čeká na platbu', 'warning'], zaplaceno: ['Uhrazeno', 'success'], 'po-splatnosti': ['Po splatnosti', 'danger'] }
// Idempotent: a payment can be confirmed only once; the second click is ignored.
function confirm(p: (typeof rows.value)[number]) { if (p.status !== 'zaplaceno') p.status = 'zaplaceno' }
</script>

<template>
  <div>
    <SpPageHeader title="Platby a objednávky" text="Platba převodem s ručním potvrzením. Systém je připraven na pozdější napojení brány, párování banky a fakturační služby." />
    <SpTable striped caption="Platby">
      <thead><tr><th>Objednávka</th><th>Produkt</th><th>Plátce</th><th>Částka</th><th>VS</th><th>Splatnost</th><th>Stav</th><th></th></tr></thead>
      <tbody><tr v-for="p in rows" :key="p.id"><td>{{ p.order }}</td><td>{{ p.product }}</td><td>{{ p.payer }}</td><td class="sp-nowrap">{{ money(p.amount) }}</td><td>{{ p.vs }}</td><td>{{ fmtDate(p.due) }}</td><td><SpBadge :variant="st[p.status]![1]">{{ st[p.status]![0] }}</SpBadge></td><td><SpButton v-if="p.status !== 'zaplaceno'" size="sm" @click="confirm(p)">Potvrdit platbu</SpButton></td></tr></tbody>
    </SpTable>
    <p class="sp-text-xs sp-text-muted sp-mt-2">Potvrzení je idempotentní, opakované kliknutí nezaloží druhou transakci ani nespustí kampaň dvakrát. Provozovatel není plátce DPH; sazby nejsou zapsány napevno.</p>
  </div>
</template>
