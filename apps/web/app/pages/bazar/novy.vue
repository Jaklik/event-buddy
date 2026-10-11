<script setup lang="ts">
import { listingCategories } from '~/data/mock/content'

useSeoMeta({ title: 'Přidat inzerát – Bazar SelfPlan', robots: 'noindex, nofollow' })
const { loggedIn } = useMockSession()
const form = reactive({ title: '', description: '', category: '', price: '', condition: 'Dobrý stav', city: '', handover: 'osobne', rules: false })
const errors = reactive<Record<string, string>>({})
const done = ref(false)
function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.title) errors.title = 'Zadejte název.'
  if (!form.category) errors.category = 'Vyberte kategorii.'
  if (!form.price) errors.price = 'Zadejte cenu v Kč.'
  if (!form.city) errors.city = 'Zadejte obec nebo oblast.'
  if (!form.rules) errors.rules = 'Potvrďte pravidla bazaru.'
  if (Object.keys(errors).length) return
  done.value = true
}
</script>

<template>
  <div class="sp-container page">
    <SpHeading :level="1">Přidat inzerát</SpHeading>
    <p class="sp-text-secondary">Inzerát je zdarma, platí 60 dní. 7 dní před koncem vám pošleme e-mail s možností bezplatného prodloužení.</p>
    <SpAlert v-if="!loggedIn" variant="info">Formulář si můžete prohlédnout, ale publikovat inzerát mohou jen přihlášení uživatelé s ověřeným e-mailem. <NuxtLink to="/prihlaseni?redirect=/bazar/novy">Přihlásit se</NuxtLink></SpAlert>
    <SpAlert v-if="done" variant="success">Inzerát prošel automatickou kontrolou a je zveřejněn na 60 dní.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="box" novalidate @submit.prevent="submit">
      <SpInput v-model="form.title" label="Název" required :error="errors.title" />
      <SpInput v-model="form.description" label="Popis" multiline :rows="4" />
      <SpSelect v-model="form.category" label="Kategorie" placeholder="Vyberte" :options="listingCategories.map((c) => ({ value: c, label: c }))" :error="errors.category" />
      <div class="two"><SpInput v-model="form.price" label="Cena (Kč)" type="number" required :error="errors.price" /><SpSelect v-model="form.condition" label="Stav" :options="['Nové', 'Velmi dobrý', 'Dobrý stav', 'Použité'].map((c) => ({ value: c, label: c }))" /></div>
      <SpInput v-model="form.city" label="Obec / oblast" required :error="errors.city" />
      <SpSelect v-model="form.handover" label="Způsob předání" :options="[{ value: 'osobne', label: 'Osobní předání' }, { value: 'posta', label: 'Zásilka (domluvou)' }]" />
      <div class="drop">Alespoň jedna fotografie (až 10). Metadata EXIF včetně GPS se odstraní.</div>
      <SpCheckbox v-model="form.rules" label="Potvrzuji pravidla bazaru. SelfPlan nezpracovává platbu za zboží ani dopravu." :error="errors.rules" />
      <SpButton type="submit" :disabled="!loggedIn">Zveřejnit inzerát</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.page { max-width: 40rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.box { padding: var(--sp-space-4); margin-top: var(--sp-space-3); }
.two { display: grid; gap: var(--sp-space-2); }
@media (min-width: 576px) { .two { grid-template-columns: 1fr 1fr; } }
.drop { margin-bottom: var(--sp-space-3); padding: var(--sp-space-4); text-align: center; color: var(--sp-color-text-secondary); background: var(--sp-color-bg-subtle); border: 2px dashed var(--sp-color-border); border-radius: var(--sp-radius-md); }
</style>
