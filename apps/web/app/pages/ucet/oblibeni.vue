<script setup lang="ts">
import { categories, categoryLabel, suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Oblíbení dodavatelé – SelfPlan', robots: 'noindex, nofollow' })

const favorites = useFavorites()
const cat = ref('')
// Demo: if nothing is saved yet, show a few suppliers so the screen can be reviewed.
const demo = computed(() => (favorites.ids.value.length ? [] : suppliers.slice(0, 3).map((s) => s.id)))
const list = computed(() => suppliers.filter((s) => (favorites.ids.value.length ? favorites.has(s.id) : demo.value.includes(s.id)) && (!cat.value || s.categoryCode === cat.value)))
</script>

<template>
  <div>
    <SpPageHeader title="Oblíbení dodavatelé" text="Uložení dodavatelé. Bez přihlášení se ukládají jen v tomto prohlížeči a po přihlášení se sloučí s účtem.">
      <div class="filter"><SpSelect v-model="cat" label="Kategorie" :options="[{ value: '', label: 'Všechny kategorie' }, ...categories.map((c) => ({ value: c.code, label: c.label }))]" /></div>
    </SpPageHeader>
    <SpAlert v-if="demo.length" variant="info" class="sp-mb-3">Zatím nemáte nic uloženo. Zobrazujeme ukázku; srdíčko u dodavatele ho přidá do oblíbených.</SpAlert>
    <SpEmpty v-if="!list.length" title="Nic tu zatím není" text="Označte dodavatele srdíčkem a najdete je tady."><SpButton to="/dodavatele">Najít dodavatele</SpButton></SpEmpty>
    <div v-else class="sp-grid sp-grid--md-2 sp-grid--lg-3">
      <SpSupplierCard v-for="s in list" :key="s.id" :to="`/dodavatele/${s.slug}`" :name="s.name" :image="s.images[0]" :category="categoryLabel(s.categoryCode)" :location="`${s.city}, ${s.region}`" :summary="s.summary" :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :price-level="s.priceLevel" :favorite="favorites.has(s.id) || demo.includes(s.id)" @toggle-favorite="favorites.toggle(s.id)" />
    </div>
  </div>
</template>

<style scoped>
.filter { min-width: 14rem; }
.filter :deep(.sp-select) { margin: 0; }
</style>
