<script setup lang="ts">
import { defaultContent, defaultSections, siteTemplates } from '~/data/mock/eventsite'

// Public event site. Default privacy = unlisted link + noindex; never in the sitemap (spec §6).
const route = useRoute()
const slug = String(route.params.slug)
const template = siteTemplates[slug === 'ukazka' ? 3 : 0]!
useSeoMeta({ title: `${defaultContent.title} – svatební web`, robots: 'noindex, nofollow', description: 'Informace pro svatební hosty.' })
definePageMeta({ layout: false })
</script>

<template>
  <EventSitePreview :template="template" :sections="defaultSections" :content="defaultContent" />
</template>
