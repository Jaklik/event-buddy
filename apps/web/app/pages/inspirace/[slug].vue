<script setup lang="ts">
import { photos } from '~/data/mock/content'
import { suppliers } from '~/data/mock/suppliers'

const route = useRoute()
const p = photos.find((x) => x.slug === String(route.params.slug))
if (!p) throw createError({ statusCode: 404, statusMessage: 'Fotografie nenalezena', fatal: true })
useSeoMeta({ title: `${p.title} | Inspirace SelfPlan`, description: `${p.title}: ${p.eventType}, styl ${p.style}.`, ogImage: p.image })
const supplier = p.supplierSlug ? suppliers.find((s) => s.slug === p.supplierSlug) : null
const similar = photos.filter((x) => x.id !== p.id && x.eventType === p.eventType).slice(0, 4)
const reportOpen = ref(false)
const reported = ref(false)
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/inspirace">Inspirace</NuxtLink> / <span>{{ p.title }}</span></nav>
    <div class="grid">
      <figure class="fig"><img :src="p.image" :alt="p.title"><span v-if="p.ai" class="ai">Vytvořeno pomocí AI</span></figure>
      <div>
        <SpHeading :level="1">{{ p.title }}</SpHeading>
        <p class="meta"><SpBadge>{{ p.eventType }}</SpBadge> <SpBadge variant="neutral">{{ p.style }}</SpBadge> <SpBadge variant="neutral">{{ p.color }}</SpBadge></p>
        <p v-if="p.ai" class="sp-text-sm sp-text-secondary">Tento snímek je vizualizace vytvořená umělou inteligencí, nejde o skutečnou realizaci.</p>
        <p v-else class="sp-text-sm sp-text-secondary">Skutečná realizace. Autor: {{ p.author }}.</p>
        <SpSurface v-if="supplier" variant="card" class="sup"><p class="sp-mb-1 sp-text-sm">Realizace dodavatele</p><NuxtLink :to="`/dodavatele/${supplier.slug}`"><strong>{{ supplier.name }}</strong></NuxtLink><p class="sp-text-sm sp-mb-2">{{ supplier.summary }}</p><SpButton size="sm" :to="`/dodavatele/${supplier.slug}`">Zobrazit profil</SpButton></SpSurface>
        <div class="sp-row sp-row--tight sp-mt-3"><SpButton variant="border" to="/planovac-akci">Uložit do plánovače</SpButton><SpButton variant="link" @click="reportOpen = true"><SpIcon name="fa6-regular:flag" /> Nahlásit obsah</SpButton></div>
      </div>
    </div>
    <h2 class="h2">Podobné fotografie</h2>
    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4"><NuxtLink v-for="s in similar" :key="s.id" :to="`/inspirace/${s.slug}`"><img class="sim" :src="s.image" :alt="s.title" loading="lazy"></NuxtLink></div>
    <SpModal v-model="reportOpen" title="Nahlásit obsah">
      <SpAlert v-if="reported" variant="success">Děkujeme, nahlášení zkontrolujeme. O rozhodnutí vás budeme informovat.</SpAlert>
      <form v-else class="sp-stack" @submit.prevent="reported = true"><SpSelect label="Důvod" :options="[{ value: 'prava', label: 'Porušuje autorská práva' }, { value: 'osoby', label: 'Rozpoznatelné osoby bez souhlasu' }, { value: 'nevhodne', label: 'Nevhodný obsah' }, { value: 'ai', label: 'Chybí označení AI' }]" /><SpInput label="Doplňující popis" multiline :rows="3" /><SpButton type="submit">Odeslat nahlášení</SpButton></form>
    </SpModal>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.grid { display: grid; gap: var(--sp-space-4); margin-bottom: var(--sp-space-5); }
@media (min-width: 992px) { .grid { grid-template-columns: 3fr 2fr; align-items: start; } }
.fig { position: relative; margin: 0; }
.fig img { width: 100%; border-radius: var(--sp-radius-md); }
.ai { position: absolute; left: var(--sp-space-3); top: var(--sp-space-3); padding: 0.2rem 0.7rem; font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-on-brand); background: var(--sp-color-brand); border-radius: 6px; }
.meta { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); }
.sup { padding: var(--sp-space-3); }
.h2 { margin: 0 0 var(--sp-space-3); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
.sim { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--sp-radius-md); }
</style>
