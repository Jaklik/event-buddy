<script setup lang="ts">
useSeoMeta({
  title: 'Plánovač akcí – svatba, oslava, firemní akce | SelfPlan',
  description: 'Plánujte svatbu, narozeniny nebo firemní akci. Zdarma vyzkoušejte checklist, rozpočtovou kalkulačku a generátor harmonogramu bez registrace.',
})
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/planovac-akci` }] })

const tools = [
  { title: 'Svatební checklist', text: 'Interaktivní seznam úkolů podle času do svatby.', icon: 'fa6-regular:square-check', to: '/svatebni-checklist' },
  { title: 'Rozpočtová kalkulačka', text: 'Rozdělte rozpočet mezi kategorie a hlídejte odchylky.', icon: 'fa6-solid:calculator', to: '/svatebni-rozpocet' },
  { title: 'Generátor harmonogramu', text: 'Sestavte časový plán svatebního dne.', icon: 'fa6-regular:clock', to: '/svatebni-harmonogram' },
]
const types = [
  { title: 'Svatba', text: 'Rozhodovací průvodce od místa po poslední tanec.', to: '/planovac-svatby' },
  { title: 'Narozeniny a oslavy', text: 'Jednoduchý plán pro rodinné i přátelské oslavy.', to: '/planovac-narozenin' },
  { title: 'Firemní akce', text: 'Program, rozpočet a dodavatelé pro firemní událost.', to: '/planovac-firemni-akce' },
]
const { loggedIn } = useMockSession()
</script>

<template>
  <div>
    <SpHero title="Plánovač akcí" text="Svatba, narozeniny, rodinná oslava nebo firemní akce. Začněte hned, bez registrace. Registrace je potřeba až pro trvalé uložení.">
      <SpButton to="/svatebni-checklist" size="lg">Vyzkoušet zdarma</SpButton>
      <SpButton :to="loggedIn ? '/ucet/akce' : '/registrace'" variant="border" size="lg">{{ loggedIn ? 'Moje akce' : 'Uložit si plán' }}</SpButton>
    </SpHero>

    <SpSection id="nastroje" title="Bezplatné nástroje bez registrace">
      <div class="sp-grid sp-grid--md-3"><SpFeatureCard v-for="t in tools" :key="t.to" v-bind="t" /></div>
    </SpSection>
    <SpSection id="typy" title="Plánování podle typu akce">
      <div class="sp-grid sp-grid--md-3"><SpFeatureCard v-for="t in types" :key="t.to" v-bind="t" icon="fa6-regular:calendar-check" /></div>
    </SpSection>
    <SpSection title="Jak plánovač funguje" id="jak">
      <ol class="how">
        <li><strong>Odpovězte na pár otázek.</strong> Typ akce, termín (i přibližný), místo, hosté a rozpočet.</li>
        <li><strong>Dostanete doporučený plán.</strong> Úkoly a termíny relativně k datu akce; vaše ruční úpravy se nepřepíšou.</li>
        <li><strong>Propojte s dodavateli.</strong> Poptávky, nabídky a rozpočet na jednom místě.</li>
      </ol>
    </SpSection>
  </div>
</template>

<style scoped>
.how { display: grid; gap: var(--sp-space-3); margin: 0; padding-left: 1.25rem; max-width: 42rem; }
</style>
