<script setup lang="ts">
/** Inspiration / advice teaser: image, title, category tag. Same radius and hover lift as the supplier card. */
defineProps<{ to: string; title: string; image: string; imageAlt?: string; tag?: string }>()
</script>

<template>
  <article class="sp-article">
    <NuxtLink :to="to" class="sp-article__link">
      <img class="sp-article__image" :src="image" :alt="imageAlt ?? ''" loading="lazy" width="400" height="260" />
      <div class="sp-article__body">
        <h3 class="sp-article__title">{{ title }}</h3>
        <SpBadge v-if="tag" class="sp-article__tag">{{ tag }}</SpBadge>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.sp-article { height: 100%; overflow: hidden; background: var(--sp-color-bg); border-radius: var(--sp-radius-md); box-shadow: 0 0 0 1px var(--sp-color-line); transition: transform var(--sp-duration) var(--sp-ease), box-shadow var(--sp-duration) var(--sp-ease); }
.sp-article:hover, .sp-article:focus-within { transform: translateY(-5px); box-shadow: 0 0 0 1px var(--sp-color-line), var(--sp-shadow-card); }
.sp-article__link { display: flex; flex-direction: column; height: 100%; color: inherit; text-decoration: none; }
.sp-article__link:hover { color: inherit; }
.sp-article__image { width: 100%; aspect-ratio: 5 / 3; object-fit: cover; }
.sp-article__body { display: flex; flex-direction: column; flex: 1; gap: var(--sp-space-2); padding: var(--sp-space-3); }
.sp-article__title { margin: 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); line-height: 1.25; }
.sp-article__tag { align-self: flex-start; margin-top: auto; text-transform: uppercase; letter-spacing: 0.02em; }
</style>
