<script setup lang="ts">
useSeoMeta({ title: 'Poptávka koordinace – SelfPlan', robots: 'noindex, nofollow' })
const { loggedIn } = useMockSession()
const form = reactive({ service: 'den', type: 'svatba', date: '', place: '', guests: '', text: '' })
const sent = ref(false)
const errors = reactive<Record<string, string>>({})
function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.place) errors.place = 'Uveďte místo konání.'
  if (!form.text || form.text.length < 10) errors.text = 'Popište krátce, s čím potřebujete pomoci.'
  if (Object.keys(errors).length) return
  sent.value = true
}
const services = [{ value: 'obrad', label: 'Koordinace obřadu' }, { value: 'den', label: 'Koordinace svatebního dne' }, { value: 'plan', label: 'Kompletní plánování svatby' }, { value: 'konz', label: 'Konzultace' }, { value: 'ostatni', label: 'Oslava / firemní akce' }]
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/koordinace">Koordinace</NuxtLink> / <span>Poptávka</span></nav>
    <SpHeading :level="1">Poptávka koordinace</SpHeading>
    <p class="sp-text-secondary">Odpovíme s individuální nabídkou. Poptávka je nezávazná.</p>
    <SpAlert v-if="!loggedIn" variant="info">Pro odeslání poptávky se přihlaste. Rozpracovaný formulář se po přihlášení obnoví. <NuxtLink to="/prihlaseni?redirect=/koordinace/poptavka">Přihlásit se</NuxtLink></SpAlert>
    <SpAlert v-if="sent" variant="success">Poptávka byla odeslána. Ozveme se s nabídkou. Stav najdete v sekci Poptávky.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="box" novalidate @submit.prevent="submit">
      <SpSelect v-model="form.service" label="Služba" :options="services" />
      <SpSelect v-model="form.type" label="Typ akce" :options="[{ value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny' }, { value: 'oslava', label: 'Oslava' }, { value: 'firemni', label: 'Firemní akce' }]" />
      <SpInput v-model="form.date" label="Datum akce" type="date" />
      <SpInput v-model="form.place" label="Místo konání" required :error="errors.place" hint="Podle místa vypočítáme dopravu (do 30 min z Přelouče v ceně)." />
      <SpInput v-model="form.guests" label="Orientační počet hostů" type="number" />
      <SpInput v-model="form.text" label="S čím potřebujete pomoci" multiline :rows="4" required :error="errors.text" />
      <SpButton type="submit" :disabled="!loggedIn">Odeslat poptávku</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.page { max-width: 40rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.box { padding: var(--sp-space-4); margin-top: var(--sp-space-3); }
</style>
