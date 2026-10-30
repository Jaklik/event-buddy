<script setup lang="ts">
import { categoryItems, tools, devFixtures } from '~/data/home'
import { taxonomy } from '~/data/mock/taxonomy'
import { regionOptions } from '~/repositories/suppliers'

const config = useRuntimeConfig()
const route = useRoute()
const siteUrl = config.public.siteUrl

// Working metadata from the Homepage spec §6 (final copy to be tuned from search analysis).
const title = 'SelfPlan – dodavatelé a plánování svateb i dalších událostí'
const description =
  'Najděte dodavatele, inspiraci a nástroje pro plánování svatby, oslavy nebo firemní akce. Vše pro vaši událost na jednom místě.'
useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ogType: 'website', ogUrl: siteUrl })
useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'SelfPlan', url: siteUrl, logo: `${siteUrl}/brand/logo.svg` }),
    },
  ],
})

// Content sources. Empty lists hide their section; sample data only with ?preview=1 in dev.
const preview = import.meta.dev && route.query.preview === '1'
const campaigns = preview ? devFixtures.campaigns : []
const articles = preview ? devFixtures.articles : []
const references = preview ? devFixtures.references : []

// Search inputs respect the approved catalogue: public categories and regions only; the date is optional and never prefilled.
const searchCategories = [{ value: '', label: 'Všechny kategorie' }, ...taxonomy.map((c) => ({ value: c.code, label: c.label }))]
const searchRegions = [{ value: '', label: 'Celá ČR' }, ...regionOptions.map((r) => ({ value: r, label: r }))]
const searchEvents = [{ value: '', label: 'Všechny typy akcí' }, { value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny a oslavy' }, { value: 'firemni', label: 'Firemní akce' }]
const search = reactive({ category: '', region: '', typ: '', date: '' })
</script>

<template>
  <div>
    <SpHero
      title="Naplánujte svou událost jednoduše se SelfPlanem"
      text="Najděte dodavatele, inspiraci a nástroje pro přípravu svatby, oslavy i firemní akce na jednom místě."
    >
      <SpButton to="/dodavatele" size="lg" class="home__cta">Najít dodavatele</SpButton>
      <SpButton to="/planovac-akci" variant="brand" size="lg" class="home__cta">Začít plánovat událost</SpButton>
      <template #media>
        <picture class="home__hero">
          <source media="(max-width: 767.98px)" srcset="/images/hero-event-800.jpg" width="800" height="533">
          <img src="/images/hero-event.jpg" alt="Hosté na letní zahradní oslavě při západu slunce u prostřeného stolu s květinami" width="1536" height="1024" fetchpriority="high" decoding="async">
        </picture>
      </template>
    </SpHero>

    <div class="sp-container home__search">
      <SpFilterBar action="/dodavatele" submit-label="Najít dodavatele">
        <SpFilterField v-model="search.category" name="category" label="Co hledáte?" icon="fa6-regular:folder" :options="searchCategories" />
        <SpFilterField v-model="search.typ" name="typ" label="Typ akce" icon="fa6-regular:calendar-check" :options="searchEvents" />
        <SpFilterField v-model="search.region" name="region" label="Lokalita" icon="fa6-solid:location-dot" :options="searchRegions" />
        <SpFilterField v-model="search.date" name="date" label="Datum akce (nepovinné)" icon="fa6-regular:calendar" type="date" />
      </SpFilterBar>
    </div>

    <SpSection id="kategorie" title="Dodavatelé podle kategorie" :link="{ label: 'Všichni dodavatelé', to: '/dodavatele' }">
      <SpCategoryStrip :items="categoryItems" />
    </SpSection>

    <div v-if="campaigns.length" class="sp-container home__ads">
      <SpCarousel :slides="campaigns" label="Sponzorované nabídky" />
    </div>

    <SpSection id="nastroje" title="Užitečné nástroje pro plánování">
      <div class="sp-grid sp-grid--md-2 sp-grid--lg-5">
        <SpFeatureCard v-for="t in tools" :key="t.to" :title="t.title" :text="t.text" :icon="t.icon" :to="t.to" />
      </div>
    </SpSection>

    <SpSection v-if="articles.length" id="inspirace" title="Nechte se inspirovat" :link="{ label: 'Zobrazit vše', to: '/inspirace' }">
      <div class="sp-grid sp-grid--md-2 sp-grid--lg-4">
        <SpArticleCard v-for="a in articles" :key="a.title" v-bind="a" />
      </div>
    </SpSection>

    <SpSection v-if="references.length" id="reference" title="Reference z osobní koordinace svateb">
      <div class="sp-grid sp-grid--md-3">
        <SpReviewCard v-for="r in references" :key="r.author" v-bind="r" kind="reference" />
      </div>
    </SpSection>

    <SpCtaBand
      title="Profesionální pomoc s přípravou a koordinací akcí"
      text="Pomůžeme s přípravou a koordinací svatby, oslavy či jiné události. Největší zkušenosti máme se svatbami, ostatní akce řešíme na základě individuální nabídky."
    >
      <SpButton to="/koordinace" variant="cta">Zjistit více</SpButton>
    </SpCtaBand>

    <SpCtaBand
      variant="cool"
      title="Jste dodavatel eventových služeb?"
      text="Prezentujte své služby na SelfPlanu a oslovte nové zákazníky."
      :points="['Vlastní profil a galerie', 'Možnost přijímat poptávky', 'Přehledné statistiky', 'Placená propagace (připravujeme)']"
    >
      <SpButton to="/pro-dodavatele" variant="cta">Zaregistrovat se zdarma</SpButton>
      <NuxtLink to="/pro-dodavatele" class="home__more">Více informací <SpIcon name="fa6-solid:arrow-right" /></NuxtLink>
    </SpCtaBand>
  </div>
</template>

<style scoped>
.home__search { margin-bottom: var(--sp-space-3); }
/* Two equal CTAs: same height, similar width, typography and contrast; full width on mobile. */
.home__cta { flex: 1 1 15rem; max-width: 20rem; min-width: 0; }
@media (max-width: 575.98px) { .home__cta { flex-basis: 100%; max-width: none; } }
.home__hero { display: block; width: 100%; background: var(--sp-color-bg-warm); border-radius: var(--sp-radius-image); box-shadow: var(--sp-shadow-image); overflow: hidden; }
.home__hero img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 0; box-shadow: none; }
.home__ads { padding-block: var(--sp-space-3); }
.home__more { font-size: var(--sp-text-sm); text-align: center; text-decoration: none; }
.home__more:hover { text-decoration: underline; }
</style>
