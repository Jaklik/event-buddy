<script setup lang="ts">
import { categories, categoryItems, tools, devFixtures } from '~/data/home'

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

const searchCategories = [{ value: '', label: 'Všechny kategorie' }, ...categories.map((c) => ({ value: c.code, label: c.label }))]
const search = reactive({ category: '', location: '', date: '' })
</script>

<template>
  <div>
    <SpHero
      title="Naplánujte svou událost jednoduše se SelfPlanem"
      text="Najděte dodavatele, inspiraci a nástroje pro přípravu svatby, oslavy i firemní akce na jednom místě."
    >
      <SpButton to="/dodavatele" size="lg">Najít dodavatele</SpButton>
      <SpButton to="/planovac-akci" variant="brand" size="lg">Začít plánovat událost</SpButton>
      <template #media>
        <img src="/dev/home-jumbotron.jpg" alt="" width="420" height="420" fetchpriority="high" />
      </template>
    </SpHero>

    <div class="sp-container home__search">
      <SpFilterBar action="/dodavatele" submit-label="Najít dodavatele">
        <SpFilterField v-model="search.category" name="category" label="Co hledáte?" icon="fa6-regular:folder" :options="searchCategories" />
        <SpFilterField v-model="search.date" name="date" label="Datum akce" icon="fa6-regular:calendar" type="date" />
        <SpFilterField v-model="search.location" name="location" label="Lokalita" icon="fa6-solid:location-dot" placeholder="Celá ČR" />
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
.home__ads { padding-block: var(--sp-space-3); }
.home__more { font-size: var(--sp-text-sm); text-align: center; text-decoration: none; }
.home__more:hover { text-decoration: underline; }
</style>
