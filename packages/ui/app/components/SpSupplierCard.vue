<script setup lang="ts">
/**
 * Supplier list card (Supplier-card): radius 1rem, 225px image, Barlow 300 title,
 * dashed footer, hover lifts 5px with shadow. The favorite heart sits top-right.
 * `sponsored` shows the mandatory "Sponzorováno" label. Missing data is simply not rendered.
 */
defineProps<{
  to: string
  name: string
  image?: string
  imageAlt?: string
  category?: string
  location?: string
  summary?: string
  rating?: number
  ratingCount?: number
  sponsored?: boolean
  favorite?: boolean
}>()
const emit = defineEmits<{ toggleFavorite: [] }>()
</script>

<template>
  <article class="sp-supplier-card">
    <button
      type="button"
      class="sp-supplier-card__fav"
      :aria-pressed="favorite"
      :aria-label="favorite ? `Odebrat ${name} z oblíbených` : `Přidat ${name} do oblíbených`"
      @click="emit('toggleFavorite')"
    >
      <SpIcon :name="favorite ? 'fa6-solid:heart' : 'fa6-regular:heart'" />
    </button>

    <NuxtLink :to="to" class="sp-supplier-card__link">
      <img v-if="image" class="sp-supplier-card__image" :src="image" :alt="imageAlt ?? ''" loading="lazy" />
      <div v-else class="sp-supplier-card__image sp-supplier-card__image--placeholder" aria-hidden="true"><SpIcon name="fa6-regular:image" size="2rem" /></div>

      <div class="sp-supplier-card__body">
        <div class="sp-supplier-card__meta">
          <SpBadge v-if="category">{{ category }}</SpBadge>
          <span v-if="sponsored" class="sp-supplier-card__sponsored">Sponzorováno</span>
        </div>
        <SpHeading :level="2" as="h3" class="sp-supplier-card__title">{{ name }}</SpHeading>
        <p v-if="summary" class="sp-supplier-card__text">{{ summary }}</p>
      </div>

      <div class="sp-supplier-card__footer">
        <span v-if="location" class="sp-supplier-card__location"><SpIcon name="fa6-solid:location-dot" /> {{ location }}</span>
        <span v-if="rating" class="sp-supplier-card__rating"><SpStars :value="rating" /> <span class="sp-text-sm">{{ rating.toFixed(1).replace('.', ',') }}<template v-if="ratingCount"> ({{ ratingCount }})</template></span></span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.sp-supplier-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--sp-color-bg);
  border-radius: var(--sp-radius-md);
  box-shadow: 0 0 0 1px var(--sp-color-line);
  transition: transform var(--sp-duration) var(--sp-ease), box-shadow var(--sp-duration) var(--sp-ease);
}
.sp-supplier-card:hover, .sp-supplier-card:focus-within { transform: translateY(-5px); box-shadow: 0 0 0 1px var(--sp-color-line), var(--sp-shadow-card); }
.sp-supplier-card__link { display: flex; flex-direction: column; flex: 1; color: inherit; text-decoration: none; }
.sp-supplier-card__link:hover { color: inherit; }
.sp-supplier-card__image { width: 100%; height: 225px; object-fit: cover; border-top-left-radius: var(--sp-radius-md); border-top-right-radius: var(--sp-radius-md); }
.sp-supplier-card__image--placeholder { display: grid; place-items: center; background: var(--sp-color-bg-warm); color: var(--sp-color-brand); }
.sp-supplier-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--sp-space-3); }
.sp-supplier-card__meta { display: flex; align-items: center; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); min-height: 1.5rem; }
.sp-supplier-card__sponsored { font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.sp-supplier-card__title { margin-bottom: var(--sp-space-2); }
.sp-supplier-card__text { margin: 0 0 auto; color: var(--sp-color-text-secondary); }
.sp-supplier-card__footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--sp-space-2); padding: var(--sp-space-3); border-top: 1px dashed var(--sp-color-line); font-size: var(--sp-text-sm); }
.sp-supplier-card__rating { display: inline-flex; align-items: center; gap: var(--sp-space-1); }
.sp-supplier-card__fav {
  position: absolute;
  top: var(--sp-space-3);
  right: var(--sp-space-3);
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  color: #333;
  background: rgb(255 255 255 / 0.9);
  border: 0;
  border-radius: 50%;
}
.sp-supplier-card__fav[aria-pressed='true'] { color: var(--sp-color-danger); }
</style>
