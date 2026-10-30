<script setup lang="ts">
import { attrDefs, catByCode, taxonomy } from '~/data/mock/taxonomy'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Parametry a filtry – Administrace', robots: 'noindex, nofollow' })

const scopeLabel = { filter: 'Veřejný filtr', detail: 'Jen v detailu', inquiry: 'Jen v poptávce' } as const
const typeLabel = { bool: 'Ano / Ne / Neuvedeno', tri: 'Neposkytuje / Má vlastní / Umí zajistit', number: 'Číslo', multi: 'Více možností', select: 'Jedna možnost' } as const
const cat = ref('')
const rows = computed(() => attrDefs.filter((a) => !cat.value || a.appliesTo.includes(cat.value) || (catByCode(cat.value)?.subs ?? []).some((s) => a.appliesTo.includes(s.code))))
const where = (a: (typeof attrDefs)[number]) => a.appliesTo.map((c) => catByCode(c)?.label ?? taxonomy.flatMap((t) => t.subs).find((s) => s.code === c)?.label ?? c).join(', ')
</script>

<template>
  <div>
    <SpPageHeader title="Parametry a filtry" text="Katalog parametrů podle kategorie. Ne každý parametr je filtr: u každého se určuje, zda je to veřejný filtr, údaj jen v detailu, nebo jen v poptávce. Relevance podle typu akce je UX doporučení, ne povinnost.">
      <SpSelect v-model="cat" label="Kategorie" :options="[{ value: '', label: 'Všechny' }, ...taxonomy.map((c) => ({ value: c.code, label: c.label }))]" class="sel" />
    </SpPageHeader>
    <SpTable striped caption="Parametry">
      <thead><tr><th>Parametr</th><th>Typ</th><th>Platí pro</th><th>Použití</th><th>Úroveň</th><th>Skupina</th></tr></thead>
      <tbody>
        <tr v-for="a in rows" :key="a.key">
          <td><strong>{{ a.label }}</strong><br><small class="sp-text-muted">{{ a.help ?? a.key }}</small></td>
          <td>{{ typeLabel[a.type] }}<template v-if="a.unit"> ({{ a.unit }})</template></td>
          <td>{{ where(a) }}</td>
          <td><SpBadge :variant="a.scope === 'filter' ? 'success' : 'neutral'">{{ scopeLabel[a.scope] }}</SpBadge></td>
          <td>{{ a.level === 'basic' ? 'Základní' : 'Rozšířený („Další filtry“)' }}</td>
          <td>{{ a.group }}</td>
        </tr>
      </tbody>
    </SpTable>
    <p class="sp-text-xs sp-text-muted sp-mt-2">Úplná dynamická editace polí je rozsah k vyčíslení zvlášť; minimem je bezpečná správa číselníků, pořadí a viditelnosti. Číselníky žánrů, kuchyní a jazyků se doplní před finálním naplněním dat. Pro kryté prostory pro případ deště se všude používá stejný název.</p>
  </div>
</template>

<style scoped>
.sel { min-width: 16rem; }
.sel :deep(.sp-select) { margin: 0; }
</style>
