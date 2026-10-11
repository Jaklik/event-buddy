<script setup lang="ts">
useSeoMeta({ title: 'Pro dodavatele – prezentace, poptávky a CRM zdarma | SelfPlan', description: 'Prezentujte své služby na SelfPlanu, přijímejte poptávky a spravujte zakázky v bezplatném CRM. Placená propagace volitelně.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/pro-dodavatele` }] })
import { adProducts, INTRO_UNTIL } from '~/utils/ads'
const benefits = [
  { title: 'Profil a galerie zdarma', text: 'Fotografie, popis služeb, kontakty a dostupnost. Profil se zveřejní po schválení.', icon: 'fa6-regular:image' },
  { title: 'Poptávky na jednom místě', text: 'Poptávky ze SelfPlanu a historie komunikace s nezávaznými nabídkami.', icon: 'fa6-regular:paper-plane' },
  { title: 'CRM a kalendář zdarma', text: 'Zakázky, úkoly a kalendář dostupnosti, i pro zakázky získané jinde.', icon: 'fa6-solid:users' },
  { title: 'Více profilů pod jedním účtem', text: 'Více značek nebo provozů s oddělenými daty a statistikami.', icon: 'fa6-regular:building' },
]
</script>

<template>
  <div>
    <SpHero eyebrow="Pro dodavatele" title="Oslovte nové zákazníky na SelfPlanu" text="Zdarma získáte profil, poptávky, kalendář a základní CRM. Nezaručujeme zakázky, dáváme vám nástroje, abyste je získali a zvládli.">
      <SpButton to="/registrace?typ=dodavatel" size="lg">Zaregistrovat se zdarma</SpButton>
      <SpButton to="#propagace" variant="border" size="lg">Placená propagace</SpButton>
      <template #media><img src="/dev/home-suppliers.jpg" alt="" width="420" height="420"></template>
    </SpHero>
    <SpSection id="vyhody" title="Co získáte"><div class="sp-grid sp-grid--md-2 sp-grid--lg-4"><SpFeatureCard v-for="b in benefits" :key="b.title" v-bind="b" /></div></SpSection>
    <SpSection id="jak" title="Jak to funguje">
      <ol class="how"><li><strong>Zaregistrujte se</strong> a ověřte e-mail.</li><li><strong>Vyplňte profil</strong> a odešlete ho ke schválení administrátorem.</li><li><strong>Přijímejte poptávky</strong> a odpovídejte přímo ze SelfPlanu.</li></ol>
    </SpSection>
    <SpSection id="propagace" title="Placená propagace (volitelně)">
      <p class="sp-text-secondary">Každá placená pozice je označena „Sponzorováno“ a nemění organické řazení ani hodnocení. Ceny za 30 dní; zaváděcí ceny platí do {{ fmtDate(INTRO_UNTIL) }}, dále standardní. Konečné ceny (neplátce DPH).</p>
      <SpTable striped caption="Ceník propagace za 30 dní">
        <thead><tr><th>Produkt</th><th>Zaváděcí</th><th>Standardní od 1. 6. 2027</th></tr></thead>
        <tbody><tr v-for="p in adProducts" :key="p.id"><td>{{ p.label }}</td><td>{{ money(p.intro) }}</td><td>{{ money(p.standard) }}</td></tr></tbody>
      </SpTable>
      <p class="sp-text-sm sp-text-secondary">Délky 30 / 90 / 365 dní se slevou 0 / 10 / 20 %. Katalog: každý další kraj +50 % základní ceny. Počet zobrazení ani zakázek nezaručujeme.</p>
    </SpSection>
    <SpCtaBand variant="cool" title="Začněte ještě dnes" text="Registrace i základní funkce jsou zdarma."><SpButton to="/registrace?typ=dodavatel">Zaregistrovat se zdarma</SpButton></SpCtaBand>
  </div>
</template>

<style scoped>
.how { display: grid; gap: var(--sp-space-3); max-width: 42rem; margin: 0; padding-left: 1.25rem; }
</style>
