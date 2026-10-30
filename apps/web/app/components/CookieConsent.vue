<script setup lang="ts">
/** Cookie bar + settings dialog. "Nastavení cookies" anywhere (footer) reopens the dialog, it does not just link to the policy. */
const { choice, decided, settingsOpen, save, acceptAll, rejectOptional, openSettings } = useConsent()
const mounted = ref(false)
onMounted(() => (mounted.value = true))
const draft = reactive({ analytics: false, marketing: false, functional: false })
watch(settingsOpen, (v) => { if (v) Object.assign(draft, { analytics: !!choice.value?.analytics, marketing: !!choice.value?.marketing, functional: !!choice.value?.functional }) })
const purposes = [
  { key: 'necessary', title: 'Nezbytné', text: 'Přihlášení, bezpečnost, ochrana před boty, uložení této volby. Nelze vypnout.', locked: true },
  { key: 'functional', title: 'Funkční', text: 'Zapamatování preferencí a pohodlí (např. uložené filtry).' },
  { key: 'analytics', title: 'Analytické', text: 'Měření návštěvnosti a výkonu webu. Jen s vaším souhlasem.' },
  { key: 'marketing', title: 'Marketingové', text: 'Měření reklam a personalizace. Jen s vaším souhlasem.' },
] as const
</script>

<template>
  <ClientOnly>
    <SpCookieBar :visible="mounted && !decided" @accept="acceptAll" @reject="rejectOptional" @customize="openSettings">
      Používáme nezbytné cookies. Analytické, funkční a marketingové použijeme jen s vaším souhlasem. Svůj výběr můžete kdykoli změnit v patičce.
    </SpCookieBar>
    <SpModal v-model="settingsOpen" title="Nastavení cookies">
      <ul class="cc">
        <li v-for="p in purposes" :key="p.key">
          <div><strong>{{ p.title }}</strong><p>{{ p.text }}</p></div>
          <SpSwitch v-if="!('locked' in p)" v-model="draft[p.key as 'analytics' | 'marketing' | 'functional']" :label="p.title" />
          <span v-else class="cc__on">Vždy zapnuto</span>
        </li>
      </ul>
      <p class="cc__note">Podrobnosti najdete v <NuxtLink to="/cookies" @click="settingsOpen = false">zásadách cookies</NuxtLink>. Souhlas můžete odvolat stejně snadno, jako jste ho udělili.</p>
      <template #footer>
        <SpButton variant="border" @click="rejectOptional">Odmítnout vše</SpButton>
        <SpButton variant="border" @click="save({ ...draft })">Uložit výběr</SpButton>
        <SpButton @click="acceptAll">Přijmout vše</SpButton>
      </template>
    </SpModal>
  </ClientOnly>
</template>

<style scoped>
.cc { margin: 0 0 var(--sp-space-3); padding: 0; list-style: none; }
.cc li { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-space-3); padding: var(--sp-space-3) 0; border-bottom: 1px solid var(--sp-color-line); }
.cc p { margin: 0.2rem 0 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.cc__on { font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); white-space: nowrap; }
.cc__note { font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
:deep(.sp-switch__label) { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
