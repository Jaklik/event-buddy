<script setup lang="ts">
useSeoMeta({ title: 'Služby SelfPlan – koordinace svateb a akcí | SelfPlan', description: 'Koordinace obřadu, svatebního dne, kompletní plánování, konzultace a koordinace oslav a firemních akcí. Individuální nabídka.' })
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/koordinace` }] })

// Services per Koordinace spec §1. Prices are NOT approved yet, so none are shown (only "individuální nabídka").
const services = [
  { code: 'obrad', title: 'Koordinace obřadu', text: 'Průběh obřadu, domluva s oddávajícím a dodavateli, harmonogram.', icon: 'fa6-solid:ring' },
  { code: 'den', title: 'Koordinace svatebního dne', text: 'Dohled nad celým dnem od příprav po večerní zábavu.', icon: 'fa6-regular:calendar-check' },
  { code: 'plan', title: 'Kompletní plánování svatby', text: 'Od výběru místa a dodavatelů po realizaci.', icon: 'fa6-solid:clipboard-list' },
  { code: 'konz', title: 'Konzultace', text: 'Jednorázová konzultace 30 nebo 60 minut online či osobně.', icon: 'fa6-regular:comments' },
  { code: 'ostatni', title: 'Koordinace oslav a firemních akcí', text: 'Narozeniny, oslavy a firemní akce na základě individuální nabídky.', icon: 'fa6-solid:briefcase' },
]
const includes = ['Příprava harmonogramu a komunikace s dodavateli', 'Koordinace na místě po celou domluvenou dobu', 'Řešení nečekaných situací, plán B', 'Předání akce organizátorovi a poděkování']
const excluded = ['Pronájmy, materiál a služby třetích stran', 'Neobjednané přesčasy', 'Nutné ubytování mimo domluvený rozsah (hradí klient)']
</script>

<template>
  <div>
    <SpHero eyebrow="Služby SelfPlan" title="Koordinace svateb a akcí" text="Pomůžeme s přípravou a koordinací. Největší zkušenosti máme se svatbami; ostatní akce řešíme na základě individuální nabídky.">
      <SpButton to="/koordinace/poptavka" size="lg">Poptat koordinaci</SpButton>
      <SpButton to="/recenze" variant="border" size="lg">Reference od klientů</SpButton>
      <template #media><img src="/dev/home-planner.jpg" alt="" width="420" height="420"></template>
    </SpHero>

    <SpSection id="sluzby" title="Co nabízíme">
      <div class="sp-grid sp-grid--md-2 sp-grid--lg-5"><SpFeatureCard v-for="s in services" :key="s.code" :title="s.title" :text="s.text" :icon="s.icon" to="/koordinace/poptavka" /></div>
    </SpSection>

    <SpSection id="rozsah" title="Rozsah služby">
      <div class="sp-grid sp-grid--md-2">
        <SpSurface variant="card" class="box"><h3>Zahrnuto</h3><ul><li v-for="i in includes" :key="i"><SpIcon name="fa6-solid:check" /> {{ i }}</li></ul></SpSurface>
        <SpSurface variant="warm" class="box"><h3>Není zahrnuto</h3><ul><li v-for="i in excluded" :key="i"><SpIcon name="fa6-solid:xmark" /> {{ i }}</li></ul></SpSurface>
      </div>
    </SpSection>

    <SpSection id="oblast" title="Kde působíme">
      <p>Osobně koordinujeme akce v okolí Přelouče (běžně do cca 60 minut jízdy) a v celé Praze. Doprava do 30 minut jízdy z Přelouče je v ceně; delší doprava se kalkuluje individuálně. Vzdálenější akce lze domluvit po konzultaci.</p>
    </SpSection>

    <SpSection id="cena" title="Cena">
      <SpSurface variant="warm" class="box"><p class="sp-mb-2">Ceny služeb jsou vždy individuální a závisí na rozsahu, termínu a místě. Pošlete poptávku a připravíme nabídku bez závazku.</p><SpButton to="/koordinace/poptavka">Poslat poptávku</SpButton></SpSurface>
    </SpSection>
  </div>
</template>

<style scoped>
.box { padding: var(--sp-space-3) var(--sp-space-4); }
.box h3 { margin: 0 0 var(--sp-space-2); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-lg); }
.box ul { margin: 0; padding: 0; list-style: none; display: grid; gap: var(--sp-space-2); }
.box li { display: flex; gap: var(--sp-space-2); align-items: baseline; }
</style>
