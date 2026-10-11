<script setup lang="ts">
import { articles, articleTypeLabel } from '~/data/mock/content'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Obsah a SEO – Administrace', robots: 'noindex, nofollow' })
const edit = ref<(typeof articles)[number] | null>(null)
</script>

<template>
  <div>
    <SpPageHeader title="Obsah a SEO" text="Články, FAQ, hry, tradice, vzory smluv a reference. Žádný page builder, rozložení homepage mění vývojář.">
      <SpButton>Nový obsah</SpButton>
    </SpPageHeader>
    <SpTable striped caption="Obsah">
      <thead><tr><th>Titulek</th><th>Typ</th><th>Slug</th><th>Stav</th><th></th></tr></thead>
      <tbody><tr v-for="a in articles" :key="a.id"><td>{{ a.title }}</td><td>{{ articleTypeLabel[a.type] }}</td><td><code>/poradna/{{ a.slug }}</code></td><td><SpBadge variant="success">Publikováno</SpBadge></td><td><SpButton size="sm" variant="border" @click="edit = a">Upravit</SpButton></td></tr></tbody>
    </SpTable>
    <SpModal :model-value="!!edit" title="Úprava obsahu" @update:model-value="edit = null">
      <form v-if="edit" class="sp-stack" @submit.prevent="edit = null">
        <SpInput v-model="edit.title" label="Titulek" />
        <SpInput v-model="edit.perex" label="Perex" multiline :rows="2" />
        <SpInput :model-value="edit.slug" label="Slug" hint="Změna slugu nabídne 301 přesměrování." />
        <SpInput label="SEO title" /><SpInput label="Meta description" multiline :rows="2" />
        <SpSelect label="Indexace" :options="[{ value: 'index', label: 'index, follow' }, { value: 'noindex', label: 'noindex' }]" />
        <SpButton type="submit">Uložit</SpButton>
      </form>
    </SpModal>
  </div>
</template>
