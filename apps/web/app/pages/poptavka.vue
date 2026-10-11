<script setup lang="ts">
import { categoryLabel, suppliers } from '~/data/mock/suppliers'

useSeoMeta({ title: 'Hromadná poptávka – SelfPlan', robots: 'noindex, nofollow' })
const { loggedIn } = useMockSession()
const picked = ref<number[]>([1, 3, 8])
const step = ref(1)
const form = reactive({ date: '2027-06-26', place: '', guests: '', text: '' })
const sent = ref(false)
const chosen = computed(() => suppliers.filter((s) => picked.value.includes(s.id)))
const toggle = (id: number, on: boolean) => (picked.value = on ? [...picked.value, id] : picked.value.filter((x) => x !== id))
</script>

<template>
  <div class="sp-container page">
    <SpHeading :level="1">Hromadná poptávka</SpHeading>
    <p class="sp-text-secondary">Oslovte více dodavatelů najednou. Každý dostane samostatnou poptávku a odpovědi se nesmíchají. Před odesláním uvidíte všechny příjemce.</p>
    <SpAlert v-if="!loggedIn" variant="info">Pro odeslání se přihlaste. <NuxtLink to="/prihlaseni?redirect=/poptavka">Přihlásit se</NuxtLink></SpAlert>
    <SpAlert v-if="sent" variant="success">Poptávky byly odeslány {{ chosen.length }} dodavatelům. Odpovědi najdete v sekci Poptávky.</SpAlert>
    <template v-else>
      <ol class="steps" aria-label="Postup"><li :class="{ on: step === 1 }">1. Dodavatelé</li><li :class="{ on: step === 2 }">2. Údaje o akci</li><li :class="{ on: step === 3 }">3. Kontrola</li></ol>
      <SpSurface variant="card" class="box">
        <div v-if="step === 1">
          <SpCheckbox v-for="s in suppliers.slice(0, 10)" :key="s.id" :model-value="picked.includes(s.id)" :label="`${s.name} (${categoryLabel(s.categoryCode)})`" @update:model-value="toggle(s.id, $event)" />
          <SpButton :disabled="!picked.length" @click="step = 2">Pokračovat ({{ picked.length }})</SpButton>
        </div>
        <form v-else-if="step === 2" @submit.prevent="step = 3">
          <SpInput v-model="form.date" label="Datum akce" type="date" />
          <SpInput v-model="form.place" label="Místo konání" required />
          <SpInput v-model="form.guests" label="Orientační počet hostů" type="number" />
          <SpInput v-model="form.text" label="Popis poptávky" multiline :rows="4" />
          <div class="sp-row sp-row--tight"><SpButton variant="border" type="button" @click="step = 1">Zpět</SpButton><SpButton type="submit">Pokračovat</SpButton></div>
        </form>
        <div v-else>
          <p>Poptávka bude odeslána těmto dodavatelům:</p>
          <ul><li v-for="s in chosen" :key="s.id">{{ s.name }}</li></ul>
          <p class="sp-text-sm sp-text-secondary">Termín {{ fmtDate(form.date) }}, {{ form.place || 'místo neuvedeno' }}. Hromadné oslovení je omezeno proti spamu a zaznamenává se.</p>
          <div class="sp-row sp-row--tight"><SpButton variant="border" @click="step = 2">Zpět</SpButton><SpButton :disabled="!loggedIn" @click="sent = true">Odeslat poptávky</SpButton></div>
        </div>
      </SpSurface>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 44rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.steps { display: flex; gap: var(--sp-space-3); margin: var(--sp-space-3) 0; padding: 0; list-style: none; font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.steps .on { color: var(--sp-color-text-strong); font-weight: var(--sp-font-weight-semibold); }
.box { padding: var(--sp-space-4); }
</style>
