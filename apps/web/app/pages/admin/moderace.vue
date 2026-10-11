<script setup lang="ts">
import { reports as seed } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Moderace – Administrace', robots: 'noindex, nofollow' })
const rows = ref(seed.map((r) => ({ ...r })))
</script>

<template>
  <div>
    <SpPageHeader title="Nahlášený obsah" text="Inspirace, bazar, recenze a profily. Každý zásah má důvod, autor se informuje a může se odvolat. AI snímky musí být označeny." />
    <SpTable striped caption="Nahlášení">
      <thead><tr><th>Obsah</th><th>Důvod</th><th>Nahlásil</th><th>Kdy</th><th>Stav</th><th></th></tr></thead>
      <tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.target }}</td><td>{{ r.reason }}</td><td>{{ r.by }}</td><td>{{ r.at }}</td><td><SpBadge :variant="r.status === 'otevřeno' ? 'warning' : 'success'">{{ r.status }}</SpBadge></td><td><div v-if="r.status === 'otevřeno'" class="sp-row sp-row--tight"><SpButton size="sm" variant="border" @click="r.status = 'vyřešeno'">Ponechat</SpButton><SpButton size="sm" variant="danger" @click="r.status = 'vyřešeno'">Skrýt</SpButton></div></td></tr></tbody>
    </SpTable>
  </div>
</template>
