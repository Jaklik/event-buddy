<script setup lang="ts">
useSeoMeta({ title: 'Přidat fotografii – SelfPlan', robots: 'noindex, nofollow' })
const { loggedIn } = useMockSession()
const sent = ref(false)
const form = reactive({ title: '', type: 'svatba', rights: false, ai: false })
</script>

<template>
  <div class="sp-container page">
    <SpHeading :level="1">Přidat fotografii</SpHeading>
    <SpAlert v-if="!loggedIn" variant="info">Fotografie mohou přidávat přihlášení uživatelé s ověřeným e-mailem. <NuxtLink to="/prihlaseni?redirect=/inspirace/pridat">Přihlásit se</NuxtLink></SpAlert>
    <SpAlert v-else-if="sent" variant="success">Fotografie prošla kontrolou a je zveřejněna. Následná moderace ji může skrýt, pokud porušuje pravidla.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="box" @submit.prevent="sent = true">
      <div class="drop">Přetáhněte fotografii nebo ji vyberte (JPG/PNG/WebP, max. 5 MB). Metadata EXIF včetně polohy se odstraní.</div>
      <SpInput v-model="form.title" label="Název" required />
      <SpSelect v-model="form.type" label="Typ akce" :options="[{ value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny' }, { value: 'oslava', label: 'Oslava' }, { value: 'firemni', label: 'Firemní akce' }]" />
      <SpCheckbox v-model="form.ai" label="Fotografie byla vytvořena pomocí AI (bude označena)" />
      <SpCheckbox v-model="form.rights" label="Mám práva k fotografii a na snímku nejsou rozpoznatelné osoby bez jejich souhlasu." />
      <SpButton type="submit" :disabled="!form.rights">Odeslat</SpButton>
    </SpSurface>
  </div>
</template>

<style scoped>
.page { max-width: 40rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.box { padding: var(--sp-space-4); margin-top: var(--sp-space-3); }
.drop { margin-bottom: var(--sp-space-3); padding: var(--sp-space-5) var(--sp-space-3); text-align: center; color: var(--sp-color-text-secondary); background: var(--sp-color-bg-subtle); border: 2px dashed var(--sp-color-border); border-radius: var(--sp-radius-md); }
</style>
