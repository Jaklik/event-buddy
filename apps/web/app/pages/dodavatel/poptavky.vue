<script setup lang="ts">
import { supplierInquiries } from '~/data/mock/supplier'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Poptávky – SelfPlan', robots: 'noindex, nofollow' })

const selected = ref(supplierInquiries[0]!.id)
const cur = computed(() => supplierInquiries.find((i) => i.id === selected.value)!)
const reply = ref('')
const sent = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Poptávky a komunikace" text="Inbox poptávek ze SelfPlanu. Odpovědi vidí zákazník v jednom vlákně." />
    <div class="inbox">
      <ul class="inbox__list" aria-label="Poptávky">
        <li v-for="i in supplierInquiries" :key="i.id">
          <button type="button" :class="{ 'is-on': selected === i.id, 'is-unread': i.unread }" @click="selected = i.id; sent = false">
            <strong>{{ i.customer }}</strong>
            <span>{{ i.eventType }} · {{ fmtDate(i.date) }}</span>
            <SpBadge :variant="inquiryStatus[i.status].variant">{{ inquiryStatus[i.status].label }}</SpBadge>
          </button>
        </li>
      </ul>
      <SpSurface variant="card" class="inbox__detail">
        <h2>{{ cur.customer }}</h2>
        <p class="sp-text-sm sp-text-secondary">{{ cur.eventType }} · {{ fmtDate(cur.date) }} · {{ cur.guests }} osob</p>
        <blockquote class="msg">{{ cur.text }}</blockquote>
        <SpAlert v-if="sent" variant="success">Odpověď byla odeslána.</SpAlert>
        <form v-else @submit.prevent="sent = true">
          <SpInput v-model="reply" label="Vaše odpověď" multiline :rows="4" />
          <div class="sp-row sp-row--tight"><SpButton type="submit">Odpovědět</SpButton><SpButton variant="border" type="button">Odeslat nabídku</SpButton><SpButton variant="link" type="button">Odmítnout</SpButton></div>
        </form>
        <p class="sp-text-xs sp-text-muted sp-mt-3">Změna stavu poptávky: nová → nabídka odeslána → vyjednávání → potvrzena / odmítnuta. Potvrzená zakázka se propíše do CRM a kalendáře.</p>
      </SpSurface>
    </div>
  </div>
</template>

<style scoped>
.inbox { display: grid; gap: var(--sp-space-3); align-items: start; }
@media (min-width: 992px) { .inbox { grid-template-columns: 20rem 1fr; } }
.inbox__list { margin: 0; padding: 0; list-style: none; border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); overflow: hidden; }
.inbox__list li + li { border-top: 1px solid var(--sp-color-line); }
.inbox__list button { display: grid; gap: 0.2rem; justify-items: start; width: 100%; padding: var(--sp-space-3); text-align: left; background: var(--sp-color-bg); border: 0; }
.inbox__list button span { font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.inbox__list button:hover { background: var(--sp-color-bg-neutral); }
.inbox__list button.is-unread { background: var(--sp-color-bg-warm); }
.inbox__list button.is-on { box-shadow: inset 3px 0 0 var(--sp-color-primary); }
.inbox__detail { padding: var(--sp-space-4); }
.inbox__detail h2 { margin: 0; font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); }
.msg { margin: var(--sp-space-3) 0; padding: var(--sp-space-3); background: var(--sp-color-bg-neutral); border-radius: var(--sp-radius-md); }
</style>
