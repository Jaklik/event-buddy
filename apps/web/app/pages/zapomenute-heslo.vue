<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Obnova hesla – SelfPlan', robots: 'noindex' })
const email = ref('')
const sent = ref(false)
</script>

<template>
  <div>
    <SpHeading :level="1" class="sp-mb-2">Obnova hesla</SpHeading>
    <template v-if="!sent">
      <p class="sp-text-sm sp-mb-4">Zadejte e-mail a pošleme vám odkaz pro nastavení nového hesla.</p>
      <form novalidate @submit.prevent="sent = true">
        <SpInput v-model="email" label="E-mail" type="email" autocomplete="email" required />
        <SpButton type="submit" block>Poslat odkaz</SpButton>
      </form>
    </template>
    <!-- Spec: one neutral answer, never reveal whether the account exists. -->
    <SpAlert v-else variant="info">Pokud účet s touto adresou existuje, poslali jsme na ni odkaz pro obnovu hesla. Odkaz je jednorázový a platí 24 hodin.</SpAlert>
    <p class="sp-mt-4 sp-text-sm"><NuxtLink to="/prihlaseni">Zpět na přihlášení</NuxtLink></p>
  </div>
</template>
