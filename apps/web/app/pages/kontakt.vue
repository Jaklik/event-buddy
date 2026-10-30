<script setup lang="ts">
import { site } from '~/data/site'
useSeoMeta({ title: 'Kontakt | SelfPlan', description: `Kontaktujte provozovatele SelfPlanu, ${site.operator}.` })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/kontakt` }] })
const form = reactive({ name: '', email: '', message: '' })
const sent = ref(false)
const errors = reactive<Record<string, string>>({})
function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.email.includes('@')) errors.email = 'Zadejte platný e-mail.'
  if (form.message.trim().length < 10) errors.message = 'Napište alespoň krátkou zprávu.'
  if (Object.keys(errors).length) return
  sent.value = true
}
</script>

<template>
  <div class="sp-container page">
    <SpHeading :level="1">Kontakt</SpHeading>
    <div class="grid">
      <SpSurface variant="card" class="box">
        <h2>Provozovatel</h2>
        <p><strong>{{ site.operator }}</strong><br>IČO {{ site.ico }}<br>{{ site.address }}</p>
        <p><a :href="`mailto:${site.contactEmail}`">{{ site.contactEmail }}</a></p>
        <p class="sp-text-sm sp-text-muted">Údaje se před zveřejněním ověřují proti oficiálním podkladům.</p>
      </SpSurface>
      <SpSurface variant="card" as="form" class="box" novalidate @submit.prevent="submit">
        <h2>Napište nám</h2>
        <SpAlert v-if="sent" variant="success">Děkujeme, zprávu jsme přijali.</SpAlert>
        <template v-else>
          <SpInput v-model="form.name" label="Jméno (nepovinné)" autocomplete="name" />
          <SpInput v-model="form.email" label="E-mail" type="email" autocomplete="email" required :error="errors.email" />
          <SpInput v-model="form.message" label="Zpráva" multiline :rows="5" required :error="errors.message" />
          <SpButton type="submit">Odeslat</SpButton>
          <p class="sp-text-sm sp-text-muted sp-mt-2">Problém s webem nebo nápad na funkci? <NuxtLink to="/zpetna-vazba">Použijte formulář zpětné vazby</NuxtLink>.</p>
        </template>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.grid { display: grid; gap: var(--sp-space-3); margin-top: var(--sp-space-3); }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1.4fr; align-items: start; } }
.box { padding: var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-h3); }
</style>
