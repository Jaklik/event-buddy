<script setup lang="ts">
useSeoMeta({ title: 'Nahlásit problém / navrhnout funkci – SelfPlan', robots: 'noindex, follow' })
const form = reactive({ type: 'chyba', text: '', email: '' })
const sent = ref(false)
</script>

<template>
  <div class="sp-container page">
    <SpHeading :level="1">Nahlásit problém / navrhnout funkci</SpHeading>
    <p class="sp-text-secondary">Vaše zpětná vazba nám pomáhá. Můžete ji poslat i bez přihlášení.</p>
    <SpAlert v-if="sent" variant="success">Děkujeme, podnět jsme přijali.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="box" @submit.prevent="sent = true">
      <SpSelect v-model="form.type" label="Typ" :options="[{ value: 'chyba', label: 'Problém' }, { value: 'napad', label: 'Nápad / funkce' }]" />
      <SpInput v-model="form.text" label="Popis" multiline :rows="5" required />
      <SpInput v-model="form.email" label="E-mail (pro odpověď, nepovinné)" type="email" />
      <SpButton type="submit">Odeslat</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.page { max-width: 36rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.box { padding: var(--sp-space-4); margin-top: var(--sp-space-3); }
</style>
