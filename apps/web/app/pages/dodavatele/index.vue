<script setup lang="ts">
import { catByCode, taxonomy } from '~/data/mock/taxonomy'

// Legacy URLs (/dodavatele?category=code) become the category landing page with a permanent redirect (301).
const route = useRoute()
const legacy = typeof route.query.category === 'string' ? catByCode(route.query.category) : undefined
if (legacy) {
  const { category: _c, ...rest } = route.query
  await navigateTo({ path: `/dodavatele/kategorie/${legacy.slug}`, query: rest }, { redirectCode: 301, replace: true })
}
</script>

<template>
  <CatalogueView />
</template>
