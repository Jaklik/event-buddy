<script setup lang="ts">
useSeoMeta({ title: 'Reference z osobní koordinace svateb | SelfPlan', description: 'Reference klientů na osobní koordinaci svateb. Nejde o hodnocení platformy SelfPlan ani dodavatelů.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/recenze` }] })

// Reference = clients' feedback on personal coordination, entered by the admin with consent. Never platform reviews.
const refs = [
  { author: 'Klienti 1 (vzorová data)', date: 'červen 2025', place: 'Středočeský kraj', text: 'Ukázkový text reference pro kontrolu vzhledu stránky. Skutečné reference doplní administrátorka s evidencí souhlasu klienta.' },
  { author: 'Klienti 2 (vzorová data)', date: 'září 2025', place: 'Praha', text: 'Druhý ukázkový text. Reference se nikdy neprezentují jako recenze platformy SelfPlan ani dodavatelů.' },
  { author: 'Klienti 3 (vzorová data)', date: 'květen 2026', place: 'Pardubický kraj', text: 'Třetí ukázkový text reference s fotografií, kterou klienti poskytli ke zveřejnění.' },
]
</script>

<template>
  <div class="sp-container page">
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/">Domů</NuxtLink> / <span>Reference</span></nav>
    <SpPageHeader title="Reference z osobní koordinace svateb" text="Zpětná vazba klientů, kterým jsme koordinovali svatbu. Nejde o hodnocení platformy ani jednotlivých dodavatelů.">
      <SpButton to="/koordinace/poptavka">Poptat koordinaci</SpButton>
    </SpPageHeader>
    <div class="sp-grid sp-grid--md-3">
      <figure v-for="r in refs" :key="r.author" class="ref">
        <img src="/dev/home-jumbotron.jpg" alt="Společná fotografie s klienty (ukázka)" loading="lazy">
        <SpReviewCard :author="r.author" :date="r.date" :context="r.place" :text="r.text" kind="reference" />
      </figure>
    </div>
    <p class="sp-text-xs sp-text-muted sp-mt-3">Hodnocení dodavatelů najdete na jejich profilech v katalogu.</p>
  </div>
</template>

<style scoped>
.page { padding-block: var(--sp-space-3) var(--sp-space-5); }
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.ref { display: grid; gap: var(--sp-space-2); margin: 0; }
.ref img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--sp-radius-md); }
</style>
