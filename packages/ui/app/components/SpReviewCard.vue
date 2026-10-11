<script setup lang="ts">
/**
 * Review / reference card (Review, Common__content_yellow): warm box, radius .5rem, 3-line clamp + "Číst více".
 * Reference cards for coordination (kind="reference") must never be styled or labeled as platform reviews.
 */
const props = defineProps<{ author: string; date?: string; text: string; rating?: number; context?: string; kind?: 'review' | 'reference' }>()
const emit = defineEmits<{ more: [] }>()
const long = computed(() => props.text.length > 140)
</script>

<template>
  <SpSurface variant="warm" as="article" class="sp-review">
    <header class="sp-review__header">
      <p v-if="date" class="sp-review__date sp-text-sm sp-text-muted">{{ date }}</p>
      <p class="sp-review__author">{{ author }}</p>
      <p v-if="context" class="sp-text-sm sp-text-muted">{{ context }}</p>
    </header>
    <blockquote class="sp-review__text" :class="{ 'is-clamped': long }">{{ text }}</blockquote>
    <footer class="sp-review__footer">
      <SpStars v-if="rating" :value="rating" />
      <button v-if="long" type="button" class="sp-review__more" @click="emit('more')">Číst více</button>
    </footer>
  </SpSurface>
</template>

<style scoped>
.sp-review { display: flex; flex-direction: column; height: 100%; }
.sp-review__header { margin-bottom: var(--sp-space-3); }
.sp-review__header p { margin: 0 0 0.25rem; }
.sp-review__author { font-weight: var(--sp-font-weight-semibold); }
.sp-review__text { margin: 0 0 var(--sp-space-2); flex: 1; }
.sp-review__text.is-clamped { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; text-overflow: ellipsis; }
.sp-review__footer { display: flex; align-items: center; justify-content: space-between; margin-top: var(--sp-space-2); }
.sp-review__more { padding: 0; background: none; border: 0; color: var(--sp-color-primary); text-decoration: underline; }
.sp-review__more:hover { color: var(--sp-color-primary-hover); }
</style>
