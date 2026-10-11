<script setup lang="ts">
import { categories } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Nový dodavatelský profil – SelfPlan', robots: 'noindex, nofollow' })

const step = ref(1)
const form = reactive({ name: '', category: '', region: '', ico: '', phone: '', web: '', description: '' })
const submitted = ref(false)
const steps = ['Základ', 'Kontakt a IČO', 'Popis a fotografie', 'Odeslání']
// Duplicate check demo: the same ICO may be used by several profiles, so this is only a warning, never a block.
const dupWarning = computed(() => form.name.toLowerCase().includes('loučeň'))
const next = () => (step.value = Math.min(4, step.value + 1))
</script>

<template>
  <div>
    <SpPageHeader title="Nový dodavatelský profil" text="Koncept se ukládá průběžně. Profil se zveřejní až po schválení administrátorem." />
    <ol class="steps" aria-label="Postup">
      <li v-for="(s, i) in steps" :key="s" :class="{ 'is-on': step === i + 1, 'is-done': step > i + 1 }" :aria-current="step === i + 1 ? 'step' : undefined"><span>{{ i + 1 }}</span> {{ s }}</li>
    </ol>

    <SpAlert v-if="submitted" variant="success">Profil byl odeslán ke schválení. O výsledku vás budeme informovat e-mailem.</SpAlert>
    <SpSurface v-else variant="card" as="form" class="form" @submit.prevent="step === 4 ? (submitted = true) : next()">
      <template v-if="step === 1">
        <SpInput v-model="form.name" label="Název značky" required />
        <SpAlert v-if="dupWarning" variant="warning">Podobný profil už existuje. Můžete požádat o jeho správu, nebo pokračovat, pokud jde o samostatnou značku. Rozhodnutí posoudí administrátor.</SpAlert>
        <SpSelect v-model="form.category" label="Hlavní kategorie" placeholder="Vyberte" :options="categories.map((c) => ({ value: c.code, label: c.label }))" required />
        <SpSelect v-model="form.region" label="Působnost" :options="[{ value: 'cr', label: 'Celá ČR' }, { value: 'region', label: 'Vybrané kraje' }]" />
      </template>
      <template v-else-if="step === 2">
        <SpInput v-model="form.ico" label="IČO (nepovinné)" hint="Stejné IČO smí mít více odlišných profilů." />
        <SpInput v-model="form.phone" label="Telefon" type="tel" />
        <SpInput v-model="form.web" label="Web" type="url" />
      </template>
      <template v-else-if="step === 3">
        <SpInput v-model="form.description" label="Popis služeb" multiline :rows="5" />
        <div class="drop">Přetáhněte fotografie sem nebo je vyberte. Max. 10 obrázků, 2 MB na obrázek.</div>
      </template>
      <template v-else>
        <p>Zkontrolujte údaje a odešlete profil ke schválení. Neověřený e-mail neumožní profil odeslat.</p>
        <dl class="sum"><dt>Název</dt><dd>{{ form.name || '–' }}</dd><dt>Kategorie</dt><dd>{{ categories.find((c) => c.code === form.category)?.label ?? '–' }}</dd><dt>IČO</dt><dd>{{ form.ico || '–' }}</dd></dl>
      </template>
      <div class="sp-row sp-mt-3">
        <SpButton v-if="step > 1" variant="border" @click="step--">Zpět</SpButton>
        <SpButton type="submit">{{ step === 4 ? 'Odeslat ke schválení' : 'Pokračovat' }}</SpButton>
      </div>
    </SpSurface>
  </div>
</template>

<style scoped>
.steps { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); margin: 0 0 var(--sp-space-4); padding: 0; list-style: none; font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.steps span { display: inline-grid; place-items: center; width: 1.6rem; height: 1.6rem; margin-right: 0.3rem; border: 1px solid var(--sp-color-line-strong); border-radius: 50%; }
.steps .is-on { color: var(--sp-color-text-strong); font-weight: var(--sp-font-weight-semibold); }
.steps .is-on span { color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-color: var(--sp-color-primary); }
.steps .is-done span { background: var(--sp-color-brand-soft); }
.form { max-width: 34rem; padding: var(--sp-space-4); }
.drop { padding: var(--sp-space-5) var(--sp-space-3); text-align: center; color: var(--sp-color-text-secondary); background: var(--sp-color-bg-subtle); border: 2px dashed var(--sp-color-border); border-radius: var(--sp-radius-md); }
.sum { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem var(--sp-space-3); }
.sum dt { color: var(--sp-color-text-muted); }
.sum dd { margin: 0; }
</style>
