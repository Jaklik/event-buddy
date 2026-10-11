<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Osobní údaje – SelfPlan', robots: 'noindex, nofollow' })
const form = reactive({ first: 'Tereza', last: 'Nováková', phone: '+420 777 000 000', email: 'tereza@example.cz' })
const pw = reactive({ current: '', next: '' })
const saved = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Osobní údaje" />
    <SpAlert v-if="saved" variant="success" dismissible class="sp-mb-3" @close="saved = false">Údaje byly uloženy.</SpAlert>
    <div class="cols">
      <SpSurface variant="card" as="form" class="box" @submit.prevent="saved = true">
        <h2>Profil</h2>
        <SpInput v-model="form.first" label="Jméno" autocomplete="given-name" />
        <SpInput v-model="form.last" label="Příjmení" autocomplete="family-name" />
        <SpInput v-model="form.phone" label="Telefon" type="tel" autocomplete="tel" />
        <SpInput v-model="form.email" label="E-mail" type="email" hint="Změna e-mailu vyžaduje ověření nové adresy." />
        <SpButton type="submit">Uložit změny</SpButton>
      </SpSurface>
      <SpSurface variant="card" as="form" class="box" @submit.prevent="saved = true">
        <h2>Heslo a přihlášení</h2>
        <SpPasswordInput v-model="pw.current" label="Současné heslo" autocomplete="current-password" />
        <SpPasswordInput v-model="pw.next" label="Nové heslo" autocomplete="new-password" hint="Alespoň 10 znaků." />
        <SpButton type="submit">Změnit heslo</SpButton>
        <hr>
        <p class="sp-text-sm">Propojené přihlášení: <SpIcon name="fa6-brands:google" /> Google <SpBadge variant="neutral">nepropojeno</SpBadge></p>
        <SpButton variant="border" size="sm">Propojit Google účet</SpButton>
        <SpButton variant="link" size="sm">Odhlásit ostatní zařízení</SpButton>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-3); }
@media (min-width: 992px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
</style>
