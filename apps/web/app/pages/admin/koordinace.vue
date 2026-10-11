<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Koordinace – Administrace', robots: 'noindex, nofollow' })
const jobs = [
  { id: 1, client: 'Tereza N.', service: 'Koordinace svatebního dne', date: '2027-06-26', place: 'Loučeň', state: 'potvrzeno', coordinator: 'vlastní' },
  { id: 2, client: 'Alfa s.r.o.', service: 'Firemní akce', date: '2026-12-05', place: 'Praha', state: 'nabídka', coordinator: '—' },
  { id: 3, client: 'Eva D.', service: 'Konzultace 60 min', date: '2026-10-20', place: 'online', state: 'poptávka', coordinator: '—' },
]
</script>

<template>
  <div>
    <SpPageHeader title="Koordinace" text="Poptávka → nabídka → potvrzeno → realizace → dokončeno. Externí koordinátory přiřazuje administrátorka ručně; veřejná registrace do této role neexistuje." />
    <SpTable striped caption="Zakázky koordinace"><thead><tr><th>Klient</th><th>Služba</th><th>Termín</th><th>Místo</th><th>Stav</th><th>Koordinátor</th></tr></thead>
      <tbody><tr v-for="j in jobs" :key="j.id"><td>{{ j.client }}</td><td>{{ j.service }}</td><td>{{ fmtDate(j.date) }}</td><td>{{ j.place }}</td><td><SpBadge variant="home">{{ j.state }}</SpBadge></td><td>{{ j.coordinator }}</td></tr></tbody></SpTable>
    <p class="sp-text-xs sp-text-muted sp-mt-2">Ceny služeb a poplatek externím koordinátorům zatím nejsou schváleny, proto se nezobrazují.</p>
  </div>
</template>
