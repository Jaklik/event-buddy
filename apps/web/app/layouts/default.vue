<script setup lang="ts">
import { eventTypes } from '~/data/home'
import { taxonomy } from '~/data/mock/taxonomy'
import { site } from '~/data/site'

const config = useRuntimeConfig()
const { role, loggedIn, displayName, logout } = useMockSession()

// Main navigation per Homepage spec §3. All modules launch together (Migrace §1), so the full menu is the target state.
const nav = [
  { label: 'Dodavatelé', to: '/dodavatele' },
  { label: 'Plánování', to: '/planovac-akci' },
  { label: 'Inspirace', to: '/inspirace' },
  { label: 'Bazar', to: '/bazar' },
  { label: 'Poradna', to: '/poradna' },
  { label: 'Pro dodavatele', to: '/pro-dodavatele' },
]
const panelLink = computed(() => ({ guest: '/prihlaseni', customer: '/ucet', supplier: '/dodavatel', admin: '/admin' })[role.value])

// Footer groups per Homepage dodatek v3 §3A. Only public, published categories are listed (no coordination, no "Prodejci a trhy").
const footerColumns = [
  {
    title: 'Dodavatelé',
    links: [
      { label: 'Všichni dodavatelé', to: '/dodavatele' },
      ...['venue_and_equipment', 'photography_and_video', 'catering_and_dining', 'decoration_and_flowers', 'music_and_entertainment']
        .map((code) => taxonomy.find((c) => c.code === code)!)
        .map((c) => ({ label: c.label, to: `/dodavatele/kategorie/${c.slug}` })),
      { label: 'Další kategorie', to: '/dodavatele' },
    ],
  },
  {
    title: 'Plánování',
    links: [
      { label: 'Plánovač událostí', to: '/planovac-akci' },
      { label: 'Vlastní eventový web', to: '/eventovy-web' },
      { label: 'Inspirace', to: '/inspirace' },
      { label: 'Eventový bazar', to: '/bazar' },
      { label: 'Poradna', to: '/poradna' },
    ],
  },
  { title: 'Typy událostí', links: eventTypes },
  {
    title: 'SelfPlan a informace',
    links: [
      { label: 'Pro dodavatele', to: '/pro-dodavatele' },
      { label: 'Profesionální koordinace / Služby SelfPlan', to: '/koordinace' },
      { label: 'Kontakt', to: '/kontakt' },
      { label: 'Nahlásit problém / navrhnout funkci', to: '/zpetna-vazba' },
      { label: 'Obchodní podmínky', to: '/obchodni-podminky' },
      { label: 'Ochrana osobních údajů', to: '/ochrana-osobnich-udaju' },
      { label: 'Pravidla obsahu', to: '/pravidla-obsahu' },
      { label: 'Nastavení cookies', action: 'cookies' as const },
    ],
  },
]
const { openSettings } = useConsent()
</script>

<template>
  <div class="layout">
    <SpHeader :items="nav">
      <template #actions>
        <template v-if="loggedIn">
          <SpHeaderAction :to="panelLink" icon="fa6-regular:user">{{ displayName }}</SpHeaderAction>
          <SpHeaderAction icon="fa6-solid:right-from-bracket" @click="logout(); navigateTo('/')">Odhlásit</SpHeaderAction>
        </template>
        <template v-else>
          <SpHeaderAction to="/prihlaseni" icon="fa6-regular:user">Přihlásit se</SpHeaderAction>
          <SpHeaderAction to="/registrace" icon="fa6-regular:circle-user">Registrovat se</SpHeaderAction>
        </template>
      </template>
    </SpHeader>
    <main id="main" class="layout__main"><slot /></main>
    <SpFooterNav :columns="footerColumns" @cookies="openSettings" />
    <SpFooter :operator="site.operator" :ico="site.ico" />
    <CookieConsent />
    <DevRoleSwitcher v-if="config.public.mock" />
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; flex-direction: column; }
.layout__main { flex: 1; }
</style>
