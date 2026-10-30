<script setup lang="ts">
import { attrsFor } from '~/data/mock/taxonomy'
/**
 * Inquiry form (individual inquiry to one supplier profile). Spec: bound to a concrete profile, date prefilled
 * from the catalogue filter, verified e-mail required to send, non-binding. Dummy submit for the frontend phase.
 */
const props = defineProps<{ supplierName: string; supplierId: number; date?: string; eventType?: string; place?: string; guests?: string; category?: string; sub?: string }>()
const emit = defineEmits<{ sent: [] }>()
const { loggedIn } = useMockSession()
const route = useRoute()

// Prefilled from the catalogue filters so the customer does not retype them (spec §36).
const form = reactive({ date: props.date ?? '', eventType: props.eventType || 'svatba', place: props.place ?? '', guests: props.guests ?? '', rainCapacity: '', message: '' })
const extra = reactive<Record<string, boolean>>({})
const isVenue = computed(() => props.category === 'venue_and_equipment')
const inquiryAttrs = computed(() => attrsFor(props.category, props.sub, 'inquiry'))
const errors = reactive<Record<string, string>>({})
const done = ref(false)
const eventTypes = [
  { value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny' }, { value: 'oslava', label: 'Rodinná oslava' }, { value: 'firemni', label: 'Firemní akce' }, { value: 'jina', label: 'Jiná akce' },
]
function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.date) errors.date = 'Vyberte datum akce.'
  if (!form.place.trim()) errors.place = 'Uveďte místo konání.'
  if (form.message.trim().length < 10) errors.message = 'Napište alespoň krátký popis (10 znaků).'
  if (Object.keys(errors).length) return
  done.value = true
  emit('sent')
}
</script>

<template>
  <div v-if="!loggedIn">
    <SpAlert variant="info">Pro odeslání poptávky se přihlaste nebo zaregistrujte. Rozpracovaný formulář se po přihlášení obnoví.</SpAlert>
    <div class="sp-row sp-mt-3">
      <SpButton :to="`/prihlaseni?redirect=${encodeURIComponent(route.fullPath)}`">Přihlásit se</SpButton>
      <SpButton variant="border" :to="`/registrace`">Registrovat se</SpButton>
    </div>
  </div>
  <div v-else-if="done">
    <SpAlert variant="success">Poptávka byla odeslána dodavateli <strong>{{ supplierName }}</strong>. Odpověď najdete v sekci Poptávky a ve zprávách.</SpAlert>
    <div class="sp-row sp-mt-3"><SpButton to="/ucet/poptavky">Moje poptávky</SpButton></div>
  </div>
  <form v-else novalidate @submit.prevent="submit">
    <p class="inquiry__note">Nezávazná poptávka. Nejde o rezervaci ani závaznou cenovou nabídku.</p>
    <SpInput v-model="form.date" label="Datum akce" type="date" required :error="errors.date" />
    <SpSelect v-model="form.eventType" label="Typ akce" :options="eventTypes" />
    <SpInput v-model="form.place" label="Místo konání" required :error="errors.place" />
    <SpInput v-model="form.guests" label="Orientační počet hostů" type="number" />
    <SpInput v-if="isVenue" v-model="form.rainCapacity" label="Požadovaná kapacita krytých prostor pro případ deště (nepovinné)" type="number" hint="Kolik hostů se musí vejít do krytých prostor." />
    <fieldset v-if="inquiryAttrs.length" class="inquiry__extra"><legend>Požadavky na catering</legend>
      <SpCheckbox v-for="a in inquiryAttrs" :key="a.key" v-model="extra[a.key]" :label="a.label" />
    </fieldset>
    <SpInput v-model="form.message" label="Popis poptávky" multiline :rows="4" required :error="errors.message" />
    <SpButton type="submit" block>Odeslat poptávku</SpButton>
  </form>
</template>

<style scoped>
.inquiry__extra { margin: 0 0 var(--sp-space-3); padding: 0; border: 0; }
.inquiry__extra legend { padding: 0; margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); font-weight: var(--sp-font-weight-bold); }
.inquiry__note { margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
</style>
