<script setup lang="ts">
import { inactiveCategories, taxonomy } from '~/data/mock/taxonomy'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Kategorie – Administrace', robots: 'noindex, nofollow' })

const rows = ref(taxonomy.map((c, i) => ({ ...c, order: i + 1, active: true })))
const edit = ref<(typeof rows.value)[number] | null>(null)
const saved = ref(false)
function move(i: number, d: number) {
  const j = i + d
  if (j < 0 || j >= rows.value.length) return
  const a = [...rows.value]; [a[i], a[j]] = [a[j]!, a[i]!]; rows.value = a.map((r, k) => ({ ...r, order: k + 1 }))
}
</script>

<template>
  <div>
    <SpPageHeader title="Kategorie a podkategorie" text="Správa názvů, popisů, pořadí, URL a aktivity bez zásahu vývojáře. Změna URL vytvoří 301 přesměrování a zachová ID původní entity." />
    <SpAlert v-if="saved" variant="success" dismissible class="sp-mb-3" @close="saved = false">Změny uloženy, 301 přesměrování a sitemap se aktualizují.</SpAlert>

    <SpTable striped caption="Veřejné kategorie">
      <thead><tr><th>Pořadí</th><th>Kategorie</th><th>Slug</th><th>Podkategorie</th><th>Aktivní</th><th></th></tr></thead>
      <tbody>
        <tr v-for="(c, i) in rows" :key="c.code">
          <td class="sp-nowrap"><button type="button" class="mv" :disabled="i === 0" aria-label="Posunout výš" @click="move(i, -1)"><SpIcon name="fa6-solid:chevron-up" /></button><button type="button" class="mv" :disabled="i === rows.length - 1" aria-label="Posunout níž" @click="move(i, 1)"><SpIcon name="fa6-solid:chevron-down" /></button> {{ c.order }}</td>
          <td><strong>{{ c.label }}</strong><br><small class="sp-text-muted">{{ c.code }}</small></td>
          <td><code>/dodavatele/kategorie/{{ c.slug }}</code></td>
          <td>{{ c.subs.map((s) => s.label).join(', ') }}</td>
          <td><SpSwitch v-model="c.active" :label="c.active ? 'Aktivní' : 'Skryto'" /></td>
          <td><SpButton size="sm" variant="border" @click="edit = c">Upravit</SpButton></td>
        </tr>
      </tbody>
    </SpTable>

    <h2 class="h2">Zrušené a skryté kategorie</h2>
    <p class="sp-text-secondary sp-text-sm">Stávající dodavatelé se nikdy nemažou. U každé zrušené kategorie administrátorka určí cílové zařazení, skrytí nebo přesměrování.</p>
    <SpTable striped caption="Zrušené kategorie">
      <thead><tr><th>Původní kategorie</th><th>Důvod</th><th>Mapování</th><th>Stav</th></tr></thead>
      <tbody><tr v-for="c in inactiveCategories" :key="c.code"><td>{{ c.label }}<br><small class="sp-text-muted">{{ c.code }}</small></td><td>{{ c.reason }}</td><td>{{ c.mapTo }}</td><td><SpBadge variant="warning">Mimo katalog a registraci</SpBadge></td></tr></tbody>
    </SpTable>
    <p class="sp-text-xs sp-text-muted sp-mt-2">Samostatné ubytování se nezavádí; počet lůžek je parametr míst konání. „Tvůrci obsahu na sociální sítě“ jsou podkategorie Fotografie a video.</p>

    <SpModal :model-value="!!edit" title="Úprava kategorie" @update:model-value="edit = null">
      <form v-if="edit" class="sp-stack" @submit.prevent="edit = null; saved = true">
        <SpInput v-model="edit.label" label="Název (obecný, bez svatebních variant)" />
        <SpInput v-model="edit.slug" label="URL slug" hint="Změna slugu vytvoří 301 ze staré adresy." />
        <SpInput v-model="edit.intro" label="Krátký popis a SEO text" multiline :rows="3" />
        <SpButton type="submit">Uložit</SpButton>
      </form>
    </SpModal>
  </div>
</template>

<style scoped>
.h2 { margin: var(--sp-space-5) 0 var(--sp-space-1); font-size: var(--sp-text-xl); }
.mv { padding: 0.25rem 0.4rem; background: none; border: 0; color: var(--sp-color-text-secondary); }
.mv:disabled { opacity: 0.3; }
</style>
