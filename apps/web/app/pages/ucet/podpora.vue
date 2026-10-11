<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Podpora – SelfPlan', robots: 'noindex, nofollow' })
const form = reactive({ type: 'chyba', text: '' })
const sent = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Podpora" text="Nahlaste problém, navrhněte funkci nebo se zeptejte." />
    <SpAlert v-if="sent" variant="success">Děkujeme, podnět jsme přijali. Odpověď najdete v účtu a e-mailem.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="box" @submit.prevent="sent = true">
      <SpSelect v-model="form.type" label="Typ podnětu" :options="[{ value: 'chyba', label: 'Nahlásit problém' }, { value: 'napad', label: 'Navrhnout funkci' }, { value: 'dotaz', label: 'Dotaz' }]" />
      <SpInput v-model="form.text" label="Popis" multiline :rows="5" />
      <p class="sp-text-xs sp-text-muted">Příloha (obrázek, max. 5 MB) bude volitelná; soubory se kontrolují a přístup k nim je omezený.</p>
      <SpButton type="submit">Odeslat podnět</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.box { max-width: 36rem; padding: var(--sp-space-4); }
</style>
