<script setup lang="ts">
definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Nastavení – SelfPlan', robots: 'noindex, nofollow' })

const prefs = reactive({ reply: true, status: true, review: true, planner: true, newsletter: false })
const deleteOpen = ref(false)
const exported = ref(false)
</script>

<template>
  <div>
    <SpPageHeader title="Nastavení" text="Oznámení, souhlasy a správa účtu." />
    <div class="cols">
      <SpSurface variant="card" class="box">
        <h2>Oznámení</h2>
        <p class="sp-text-sm sp-text-secondary">Provozní zprávy (ověření e-mailu, bezpečnost) se posílají vždy. Níže jsou volitelná oznámení; e-mail i centrum oznámení v účtu, bez SMS.</p>
        <SpSwitch v-model="prefs.reply" label="Odpověď dodavatele" />
        <SpSwitch v-model="prefs.status" label="Změna stavu poptávky" class="sp-mt-2" />
        <SpSwitch v-model="prefs.review" label="Výsledek moderace recenze" class="sp-mt-2" />
        <SpSwitch v-model="prefs.planner" label="Připomínky z plánovače" class="sp-mt-2" />
      </SpSurface>
      <SpSurface variant="card" class="box">
        <h2>Marketing</h2>
        <SpCheckbox v-model="prefs.newsletter" label="Chci dostávat novinky e-mailem" />
        <p class="sp-text-xs sp-text-muted">Souhlas je dobrovolný a můžete ho kdykoli odvolat. Evidujeme znění, čas a způsob udělení.</p>
        <h2 class="sp-mt-4">Vaše data</h2>
        <SpButton variant="border" size="sm" @click="exported = true">Exportovat moje data</SpButton>
        <SpAlert v-if="exported" variant="info" class="sp-mt-2">Export připravujeme. Odkaz ke stažení přijde e-mailem.</SpAlert>
        <h2 class="sp-mt-4">Zrušení účtu</h2>
        <p class="sp-text-sm sp-text-secondary">Zrušením účtu odstraníme osobní údaje v souladu s retenční politikou. Zákonně nutné záznamy uchováme odděleně.</p>
        <SpButton variant="danger" size="sm" @click="deleteOpen = true">Zrušit účet</SpButton>
      </SpSurface>
    </div>
    <SpModal v-model="deleteOpen" title="Opravdu zrušit účet?">
      <p>Tuto akci nelze vrátit. Rozpracované akce a oblíbené budou odstraněny.</p>
      <template #footer><SpButton variant="border" @click="deleteOpen = false">Ponechat účet</SpButton><SpButton variant="danger" @click="deleteOpen = false">Zrušit účet</SpButton></template>
    </SpModal>
  </div>
</template>

<style scoped>
.cols { display: grid; gap: var(--sp-space-3); }
@media (min-width: 992px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h2 { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
</style>
