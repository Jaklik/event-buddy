<script setup lang="ts">
import { listings } from '~/data/mock/content'

const route = useRoute()
const l = listings.find((x) => x.slug === String(route.params.slug))
if (!l) throw createError({ statusCode: 404, statusMessage: 'Inzerát nenalezen', fatal: true })
useSeoMeta({ title: `${l.title} | Bazar SelfPlan`, description: `${l.title}, ${l.city}. Cena ${l.price} Kč.`, ogImage: l.image, robots: l.status === 'sold' ? 'noindex, follow' : 'index, follow' })
const { loggedIn } = useMockSession()
const sent = ref(false)
const msg = ref('')
const reportOpen = ref(false)
const days = daysUntil(l.expiresAt)
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <NuxtLink to="/bazar">Bazar</NuxtLink> / <span>{{ l.title }}</span></nav>
    <div class="grid">
      <img class="img" :src="l.image" :alt="l.title">
      <div>
        <SpHeading :level="1">{{ l.title }}</SpHeading>
        <p class="price">{{ money(l.price) }}</p>
        <p class="meta"><SpBadge>{{ l.category }}</SpBadge> <SpBadge variant="neutral">{{ l.condition }}</SpBadge> <span><SpIcon name="fa6-solid:location-dot" /> {{ l.city }} (přibližná lokalita)</span></p>
        <SpAlert v-if="l.status === 'sold'" variant="warning">Tento inzerát je označen jako prodaný.</SpAlert>
        <p>{{ l.description }}</p>
        <p class="sp-text-xs sp-text-muted">Zveřejněno {{ fmtDate(l.createdAt) }} · platí do {{ fmtDate(l.expiresAt) }} ({{ days }} dní). Kontakt na prodejce se nezobrazuje veřejně; zprávu doručíme e-mailem.</p>
        <SpSurface variant="card" class="contact">
          <h2>Kontaktovat prodejce</h2>
          <SpAlert v-if="sent" variant="success">Zpráva byla odeslána prodejci.</SpAlert>
          <SpAlert v-else-if="!loggedIn" variant="info">Pro odeslání zprávy se přihlaste. <NuxtLink :to="`/prihlaseni?redirect=${route.fullPath}`">Přihlásit se</NuxtLink></SpAlert>
          <form v-else @submit.prevent="sent = true"><SpInput v-model="msg" label="Vaše zpráva" multiline :rows="3" /><SpButton type="submit" :disabled="l.status === 'sold'">Odeslat zprávu</SpButton></form>
        </SpSurface>
        <p class="sp-mt-2"><SpButton variant="link" size="sm" @click="reportOpen = true"><SpIcon name="fa6-regular:flag" /> Nahlásit inzerát</SpButton></p>
      </div>
    </div>
    <SpModal v-model="reportOpen" title="Nahlásit inzerát"><form class="sp-stack" @submit.prevent="reportOpen = false"><SpSelect label="Důvod" :options="[{ value: 'podvod', label: 'Podezření na podvod' }, { value: 'zakazane', label: 'Zakázané zboží' }, { value: 'spam', label: 'Spam / duplicita' }]" /><SpInput label="Popis" multiline :rows="3" /><SpButton type="submit">Odeslat</SpButton></form></SpModal>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.grid { display: grid; gap: var(--sp-space-4); }
@media (min-width: 992px) { .grid { grid-template-columns: 1fr 1fr; align-items: start; } }
.img { width: 100%; border-radius: var(--sp-radius-md); aspect-ratio: 4 / 3; object-fit: cover; }
.price { margin: 0 0 var(--sp-space-2); font-family: var(--sp-font-heading); font-size: var(--sp-text-2xl); color: var(--sp-color-primary); }
.meta { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); align-items: center; font-size: var(--sp-text-sm); }
.contact { padding: var(--sp-space-3); margin-top: var(--sp-space-3); }
.contact h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
</style>
