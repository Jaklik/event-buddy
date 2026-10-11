<script setup lang="ts">
import { inquiries, messages } from '~/data/mock/account'
import { suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Poptávka – SelfPlan', robots: 'noindex, nofollow' })

const route = useRoute()
const inquiry = inquiries.find((i) => i.id === Number(route.params.id))
if (!inquiry) throw createError({ statusCode: 404, statusMessage: 'Poptávka nenalezena' })
const supplier = suppliers.find((s) => s.id === inquiry.supplierId)!
const thread = ref(messages.filter((m) => m.inquiryId === inquiry.id))
const text = ref('')
function send() {
  if (!text.value.trim()) return
  thread.value.push({ id: Date.now(), inquiryId: inquiry!.id, from: 'customer', author: 'Vy', at: 'právě teď', text: text.value })
  text.value = ''
}
</script>

<template>
  <div>
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/ucet/poptavky">Poptávky</NuxtLink> / <span>{{ supplier.name }}</span></nav>
    <SpPageHeader :title="`Poptávka: ${supplier.name}`">
      <SpBadge :variant="inquiryStatus[inquiry.status].variant">{{ inquiryStatus[inquiry.status].label }}</SpBadge>
    </SpPageHeader>

    <div class="grid">
      <section aria-label="Konverzace">
        <ol class="thread">
          <li v-for="m in thread" :key="m.id" class="msg" :class="`msg--${m.from}`">
            <p class="msg__meta"><strong>{{ m.author }}</strong> · {{ m.at }}</p>
            <p class="msg__text">{{ m.text }}</p>
          </li>
        </ol>
        <form class="reply" @submit.prevent="send">
          <SpInput v-model="text" label="Vaše odpověď" multiline :rows="3" />
          <SpButton type="submit">Odeslat zprávu</SpButton>
        </form>
        <p class="sp-text-xs sp-text-muted">Konverzace probíhá výhradně zde. E-mailové oznámení vás jen přesměruje sem.</p>
      </section>

      <aside>
        <SpSurface variant="card" class="info">
          <h2>Shrnutí poptávky</h2>
          <dl>
            <dt>Typ akce</dt><dd>{{ inquiry.eventType }}</dd>
            <dt>Termín</dt><dd>{{ fmtDate(inquiry.date) }}</dd>
            <dt>Místo</dt><dd>{{ inquiry.place }}</dd>
            <dt>Počet hostů</dt><dd>{{ inquiry.guests }}</dd>
            <dt v-if="inquiry.budget">Nabídka / rozpočet</dt><dd v-if="inquiry.budget">{{ money(inquiry.budget) }}</dd>
          </dl>
          <SpButton v-if="inquiry.status === 'nabidka'" block>Přijmout nabídku</SpButton>
          <SpButton v-if="['nova', 'nabidka', 'vyjednavani'].includes(inquiry.status)" block variant="border" class="sp-mt-2">Přidat do rozpočtu akce</SpButton>
          <SpButton block variant="link" :to="`/dodavatele/${supplier.slug}`">Profil dodavatele</SpButton>
        </SpSurface>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.grid { display: grid; gap: var(--sp-space-4); align-items: start; }
@media (min-width: 992px) { .grid { grid-template-columns: minmax(0, 1fr) 18rem; } }
.thread { display: flex; flex-direction: column; gap: var(--sp-space-3); margin: 0 0 var(--sp-space-4); padding: 0; list-style: none; }
.msg { max-width: 85%; padding: var(--sp-space-3); border-radius: var(--sp-radius-md); }
.msg--customer { align-self: flex-end; background: var(--sp-color-bg-neutral); }
.msg--supplier { align-self: flex-start; background: var(--sp-color-bg-warm); }
.msg__meta { margin: 0 0 0.25rem; font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.msg__text { margin: 0; }
.reply { display: grid; gap: var(--sp-space-2); justify-items: start; }
.reply :deep(.sp-input) { width: 100%; margin: 0; }
.info { padding: var(--sp-space-3); display: grid; gap: var(--sp-space-2); }
.info h2 { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.info dl { display: grid; grid-template-columns: auto 1fr; gap: 0.25rem var(--sp-space-3); margin: 0; font-size: var(--sp-text-sm); }
.info dt { color: var(--sp-color-text-muted); }
.info dd { margin: 0; text-align: right; }
</style>
