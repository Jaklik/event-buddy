<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Poptávky – Administrace', robots: 'noindex, nofollow' })
const rows = [
  { id: 1, state: 'distribuováno', who: 'Tereza N.', n: 3, at: '2026-10-02', delivered: '3 / 3' },
  { id: 2, state: 'zodpovězeno', who: 'Lucie N.', n: 1, at: '2026-10-05', delivered: '1 / 1' },
  { id: 3, state: 'vytvořeno', who: 'Eva D.', n: 5, at: '2026-10-10', delivered: '4 / 5' },
]
</script>

<template>
  <div>
    <SpPageHeader title="Poptávky" text="Technický přehled stavů a doručení. Obsah soukromé komunikace se zde neukazuje." />
    <SpTable striped caption="Poptávky"><thead><tr><th>#</th><th>Zákazník</th><th>Příjemců</th><th>Doručeno</th><th>Stav</th><th>Vytvořeno</th></tr></thead>
      <tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.id }}</td><td>{{ r.who }}</td><td>{{ r.n }}</td><td>{{ r.delivered }}</td><td><SpBadge variant="home">{{ r.state }}</SpBadge></td><td>{{ fmtDate(r.at) }}</td></tr></tbody></SpTable>
  </div>
</template>
