<script setup lang="ts">
/**
 * Page section with a Barlow heading and an optional "see all" link on the right (as on the homepage mockup).
 * `headingLevel` sets the real tag; the visual size stays "Heading 2".
 */
withDefaults(defineProps<{ title: string; link?: { label: string; to: string }; headingLevel?: 'h2' | 'h3'; id?: string }>(), { headingLevel: 'h2' })
</script>

<template>
  <section class="sp-section" :aria-labelledby="id ? `${id}-title` : undefined" :id="id">
    <div class="sp-container">
      <header class="sp-section__header">
        <SpHeading :id="id ? `${id}-title` : undefined" :level="2" :as="headingLevel" class="sp-section__title">{{ title }}</SpHeading>
        <NuxtLink v-if="link" :to="link.to" class="sp-section__link">{{ link.label }} <SpIcon name="fa6-solid:arrow-right" /></NuxtLink>
      </header>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.sp-section { padding-block: var(--sp-space-4); }
.sp-section__header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--sp-space-3); margin-bottom: var(--sp-space-3); }
.sp-section__title { margin: 0; font-weight: var(--sp-font-weight-medium); }
.sp-section__link { font-size: var(--sp-text-sm); text-decoration: none; white-space: nowrap; }
.sp-section__link:hover { text-decoration: underline; }
</style>
