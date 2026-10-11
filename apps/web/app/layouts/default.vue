<script setup lang="ts">
import { categories, eventTypes } from '~/data/home'

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

const footerColumns = [
  { title: 'Dodavatelé', links: categories.slice(0, 6).map((c) => ({ label: c.label, to: `/dodavatele?category=${c.code}` })) },
  { title: 'Typy akcí', links: eventTypes },
  {
    title: 'Kontakt',
    links: [
      { label: 'Služby SelfPlan (koordinace)', to: '/koordinace' },
      { label: 'Pro dodavatele', to: '/pro-dodavatele' },
      { label: 'Nahlásit problém / navrhnout funkci', to: '/zpetna-vazba' },
    ],
  },
  {
    title: 'Informace',
    links: [
      { label: 'Obchodní podmínky', to: '/obchodni-podminky' },
      { label: 'Ochrana osobních údajů', to: '/ochrana-osobnich-udaju' },
      { label: 'Pravidla obsahu', to: '/pravidla-obsahu' },
      { label: 'Nastavení cookies', action: 'cookies' as const },
    ],
  },
]
function openCookies() {
  // wired to the consent module (CMP) later
}
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
    <SpFooterNav :columns="footerColumns" @cookies="openCookies" />
    <SpFooter copyright="© SelfPlan. Všechna práva vyhrazena." />
    <DevRoleSwitcher v-if="config.public.mock" />
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; flex-direction: column; }
.layout__main { flex: 1; }
</style>
