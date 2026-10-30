<script setup lang="ts">
import { catBySlug } from '~/data/mock/taxonomy'

const route = useRoute()
const cat = catBySlug(String(route.params.slug))
if (!cat) throw createError({ statusCode: 404, statusMessage: 'Kategorie nenalezena', fatal: true })
</script>

<template>
  <CatalogueView :category="cat!.code" />
</template>
