<script setup lang="ts">
import { stats } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Statistiky – SelfPlan', robots: 'noindex, nofollow' })

const period = ref('30')
const bars = [48, 62, 55, 71, 66, 80, 74, 92, 85, 77, 90, 104]
const max = Math.max(...bars)
const answered = 24
</script>

<template>
  <div>
    <SpPageHeader title="Statistiky" text="Návštěvy, poptávky, odpovědi a zakázky. Úspěšnost se počítá jen ze stavů, které sami zadáváte.">
      <SpSelect v-model="period" label="Období" :options="[{ value: '30', label: 'Posledních 30 dní' }, { value: '90', label: 'Posledních 90 dní' }, { value: '365', label: 'Posledních 12 měsíců' }]" class="period" />
    </SpPageHeader>
    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4 sp-mb-4">
      <SpStat :value="stats.views.toLocaleString('cs')" label="Zobrazení profilu" icon="fa6-regular:eye" />
      <SpStat :value="stats.inquiries" label="Doručené poptávky" icon="fa6-regular:paper-plane" />
      <SpStat :value="`${Math.round((answered / stats.inquiries) * 100)} %`" label="Zodpovězeno" :hint="`${answered} z ${stats.inquiries} poptávek`" icon="fa6-regular:comments" />
      <SpStat :value="`${Math.round((stats.confirmed / stats.inquiries) * 100)} %`" label="Úspěšnost" :hint="`${stats.confirmed} potvrzených z ${stats.inquiries} poptávek`" icon="fa6-solid:chart-line" />
    </div>
    <SpSurface variant="card" class="chart">
      <h2>Zobrazení profilu v čase</h2>
      <div class="bars" role="img" aria-label="Sloupcový graf zobrazení profilu za posledních 12 týdnů">
        <span v-for="(b, i) in bars" :key="i" :style="{ height: `${(b / max) * 100}%` }" :title="`Týden ${i + 1}: ${b}`" />
      </div>
    </SpSurface>
    <p class="sp-text-xs sp-text-muted sp-mt-3">Měření respektuje souhlasy s cookies. Zobrazení reklam se počítá jen tehdy, když byla reklama skutečně vidět.</p>
  </div>
</template>

<style scoped>
.period { min-width: 14rem; }
.period :deep(.sp-select) { margin: 0; }
.chart { padding: var(--sp-space-3) var(--sp-space-4); }
.chart h2 { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.bars { display: flex; align-items: flex-end; gap: var(--sp-space-2); height: 12rem; }
.bars span { flex: 1; background: var(--sp-color-primary); border-radius: 4px 4px 0 0; opacity: 0.85; }
</style>
