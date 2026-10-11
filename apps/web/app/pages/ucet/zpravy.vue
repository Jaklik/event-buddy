<script setup lang="ts">
import { inquiries, messages } from '~/data/mock/account'
import { suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Zprávy – SelfPlan', robots: 'noindex, nofollow' })

// One conversation thread per inquiry (spec: no second source of truth in e-mail).
const threads = inquiries
  .map((i) => ({ inquiry: i, supplier: suppliers.find((s) => s.id === i.supplierId)!, last: messages.filter((m) => m.inquiryId === i.id).at(-1) }))
  .filter((t) => t.last)
</script>

<template>
  <div>
    <SpPageHeader title="Zprávy" text="Konverzace s dodavateli podle poptávek." />
    <SpEmpty v-if="!threads.length" title="Zatím žádné zprávy" text="Zprávy se objeví po odeslání první poptávky." />
    <ul v-else class="threads">
      <li v-for="t in threads" :key="t.inquiry.id">
        <NuxtLink :to="`/ucet/poptavky/${t.inquiry.id}`" class="thread" :class="{ 'is-unread': t.inquiry.unread }">
          <SpCircleIcon size="2.75rem">{{ t.supplier.name.slice(0, 1) }}</SpCircleIcon>
          <span class="thread__body">
            <strong>{{ t.supplier.name }}</strong>
            <span class="thread__text">{{ t.last!.text }}</span>
          </span>
          <small>{{ t.last!.at.slice(0, 10) }}</small>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.threads { margin: 0; padding: 0; list-style: none; border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); overflow: hidden; }
.threads li + li { border-top: 1px solid var(--sp-color-line); }
.thread { display: flex; align-items: center; gap: var(--sp-space-3); padding: var(--sp-space-3); color: inherit; text-decoration: none; }
.thread:hover { background: var(--sp-color-bg-neutral); color: inherit; }
.thread.is-unread { background: var(--sp-color-bg-warm); }
.thread__body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.thread__text { overflow: hidden; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); text-overflow: ellipsis; white-space: nowrap; }
.thread small { color: var(--sp-color-text-muted); white-space: nowrap; }
</style>
