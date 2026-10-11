<script setup lang="ts">
import { siteTemplates } from '~/data/mock/eventsite'

// Temporary alias: /svatebni-web gets its own wedding-specific landing page later (spec §9.1).
definePageMeta({ alias: ['/svatebni-web'] })

useSeoMeta({
  title: 'Vlastní eventový web s RSVP za 490 Kč | SelfPlan',
  description: 'Vytvořte si web pro svatbu, oslavu nebo firemní akci s RSVP, harmonogramem a dress codem. Náhled zdarma, zveřejnění za 490 Kč na 12 měsíců.',
})
useHead({ link: [{ rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl}/eventovy-web` }] })

const typeFilter = ref('')
const types = [{ v: '', l: 'Vše' }, { v: 'svatba', l: 'Svatba' }, { v: 'narozeniny', l: 'Narozeniny' }, { v: 'oslava', l: 'Oslava' }, { v: 'firemni', l: 'Firemní akce' }]
const shown = computed(() => siteTemplates.filter((t) => !typeFilter.value || t.types.includes(typeFilter.value)))
const faq = [
  { q: 'Potřebuji registraci?', a: 'Šablony a editor můžete zkoušet bez registrace. Účet je potřeba až při prvním trvalém uložení.' },
  { q: 'Kdy platím?', a: 'Až před zveřejněním. Samotná tvorba a náhled jsou zdarma.' },
  { q: 'Mohu web upravovat po zveřejnění?', a: 'Ano, úpravy jsou v ceně po celou dobu provozu.' },
  { q: 'Jak funguje RSVP?', a: 'Hosté odpovídají na veřejném formuláři nebo přes osobní odkaz. Odkazy sdílíte vy; SelfPlan pozvánky e-mailem nerozesílá. Seznam hostů vidíte jen vy.' },
  { q: 'Je web veřejný?', a: 'Výchozí je neveřejný odkaz (nezobrazuje se ve vyhledávačích). Indexaci můžete zapnout sami.' },
  { q: 'Jak dlouho web funguje?', a: '12 kalendářních měsíců od prvního zveřejnění.' },
]
</script>

<template>
  <div>
    <SpHero eyebrow="Svatba · oslava · firemní akce" title="Vlastní eventový web za 490 Kč" text="RSVP, program, dress code i informace pro hosty na jednom místě. Jednorázově, na 12 měsíců.">
      <SpButton to="/eventovy-web/editor" size="lg">Vyzkoušet šablony</SpButton>
      <SpButton to="/w/ukazka" variant="border" size="lg">Prohlédnout ukázkový web</SpButton>
      <template #media><img src="/dev/home-notifications.jpg" alt="" width="420" height="420"></template>
    </SpHero>
    <p class="sp-container sp-text-sm sp-text-secondary sp-text-center">Vytvořte si web zdarma v náhledu. Platíte až za zveřejnění.</p>

    <SpSection id="kroky" title="Tři kroky k webu">
      <ol class="sp-grid sp-grid--md-3 steps">
        <li><SpCircleIcon icon="fa6-solid:palette" /><h3>1. Vyberte šablonu</h3><p>Šablony pro svatby, oslavy i firemní akce, kdykoli je můžete změnit.</p></li>
        <li><SpCircleIcon icon="fa6-solid:pen" /><h3>2. Přizpůsobte web</h3><p>Texty, program, dress code a barvy. Sekce zapnete nebo vypnete a změníte pořadí.</p></li>
        <li><SpCircleIcon icon="fa6-solid:rocket" /><h3>3. Zaplaťte a zveřejněte</h3><p>490 Kč jednorázově, bez předplatného. Web je v provozu 12 měsíců.</p></li>
      </ol>
    </SpSection>

    <SpSection id="sablony" title="Šablony">
      <div class="seg" role="group" aria-label="Typ akce">
        <button v-for="t in types" :key="t.v" type="button" :class="{ 'is-on': typeFilter === t.v }" :aria-pressed="typeFilter === t.v" @click="typeFilter = t.v">{{ t.l }}</button>
      </div>
      <div class="sp-grid sp-grid--md-3 tpl">
        <NuxtLink v-for="t in shown" :key="t.id" :to="`/eventovy-web/editor?sablona=${t.id}`" class="tpl__card" :style="{ '--a': t.accent, '--s': t.soft }">
          <span class="tpl__thumb"><i /><b /><b /></span>
          <strong>{{ t.name }}</strong>
          <small>{{ t.types.join(' · ') }}</small>
        </NuxtLink>
      </div>
    </SpSection>

    <SpSection id="cena" title="Cena">
      <SpSurface variant="warm" class="price">
        <p class="price__n">490 Kč</p>
        <p>jednorázově za jednu událost · 12 měsíců provozu · RSVP · propojení s plánovačem · bez předplatného</p>
        <SpButton to="/eventovy-web/editor">Vytvořit web</SpButton>
      </SpSurface>
    </SpSection>

    <SpSection id="faq" title="Časté dotazy">
      <div class="faq"><details v-for="f in faq" :key="f.q"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details></div>
    </SpSection>
  </div>
</template>

<style scoped>
.steps { margin: 0; padding: 0; list-style: none; }
.steps h3 { margin: var(--sp-space-2) 0 var(--sp-space-1); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-lg); }
.steps p { margin: 0; color: var(--sp-color-text-secondary); }
.seg { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); }
.seg button { padding: 0.4rem 1rem; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-color: var(--sp-color-primary); }
.tpl__card { display: grid; gap: 0.25rem; padding: var(--sp-space-2); color: inherit; text-decoration: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); transition: box-shadow var(--sp-duration) var(--sp-ease), transform var(--sp-duration) var(--sp-ease); }
.tpl__card:hover { box-shadow: var(--sp-shadow-card); transform: translateY(-3px); color: inherit; }
.tpl__thumb { display: grid; gap: 0.4rem; padding: 1rem; background: var(--s); border-radius: var(--sp-radius-sm); min-height: 8rem; align-content: start; }
.tpl__thumb i { height: 1.2rem; width: 60%; background: var(--a); border-radius: 3px; }
.tpl__thumb b { height: 0.5rem; background: color-mix(in srgb, var(--a) 40%, #fff); border-radius: 3px; }
.tpl__card small { color: var(--sp-color-text-muted); text-transform: capitalize; }
.price { text-align: center; padding: var(--sp-space-4); }
.price__n { margin: 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-3xl); font-weight: var(--sp-font-weight-light); }
.faq details { padding: var(--sp-space-2) 0; border-bottom: 1px solid var(--sp-color-line); }
.faq summary { cursor: pointer; font-weight: var(--sp-font-weight-semibold); }
.faq p { margin: var(--sp-space-2) 0 0; color: var(--sp-color-text-secondary); }
</style>
