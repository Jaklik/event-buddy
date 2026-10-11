<script setup lang="ts">
// Only modules that actually exist are listed (spec: no dead links; unfinished modules say "Připravujeme").
const nav = [
  { label: 'Dodavatelé', to: '/dodavatele' },
  { label: 'Koordinace', to: '/koordinace' },
  { label: 'Recenze', to: '/recenze' },
  { label: 'Styleguide', to: '/styleguide' },
]
</script>

<template>
  <div class="layout">
    <SpHeader :items="nav">
      <template #actions>
        <SpHeaderAction href="tel:+420000000000" icon="fa6-regular:comment">Kontakt</SpHeaderAction>
        <SpHeaderAction to="/prihlaseni" icon="fa6-regular:user">Přihlásit se</SpHeaderAction>
      </template>
    </SpHeader>
    <main id="main" class="layout__main"><slot /></main>
    <SpFooter copyright="© SelfPlan. Všechna práva vyhrazena.">
      <NuxtLink to="/ochrana-osobnich-udaju">Ochrana osobních údajů</NuxtLink>
      <NuxtLink to="/obchodni-podminky">Obchodní podmínky</NuxtLink>
      <button type="button">Nastavení cookies</button>
    </SpFooter>
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; flex-direction: column; }
.layout__main { flex: 1; }
</style>
