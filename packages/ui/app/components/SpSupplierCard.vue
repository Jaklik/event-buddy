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
  vip?: boolean
  favorite?: boolean
  availability?: 'free' | 'busy' | 'unknown' | null
  priceLevel?: string | null
  capacity?: { min: number; max: number }
  /** demo/sample data: labelled and never shown as a real rating or offer */
  demo?: boolean
  compact?: boolean
}>()
const broken = ref(false)
const emit = defineEmits<{ toggleFavorite: [] }>()
</script>

<template>
  <article class="sp-supplier-card" :class="{ 'sp-supplier-card--compact': compact }">
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
      <div class="sp-supplier-card__media">
        <img v-if="image && !broken" class="sp-supplier-card__image" :src="image" :alt="imageAlt ?? ''" loading="lazy" @error="broken = true" />
        <div v-else class="sp-supplier-card__image sp-supplier-card__image--placeholder" aria-hidden="true"><SpIcon name="fa6-solid:camera-retro" size="2rem" /><span>Fotografie bude doplněna</span></div>
        <span v-if="demo" class="sp-supplier-card__demo">Ukázka</span>
      </div>

      <div class="sp-supplier-card__body">
        <div class="sp-supplier-card__meta">
          <SpBadge v-if="category">{{ category }}</SpBadge>
          <SpBadge v-if="vip" variant="neutral">VIP</SpBadge>
          <span v-if="sponsored" class="sp-supplier-card__sponsored">Sponzorováno</span>
          <SpAvailabilityBadge v-if="availability" :state="availability" class="sp-supplier-card__avail" />
        </div>
        <SpHeading :level="3" as="h3" class="sp-supplier-card__title">{{ name }}</SpHeading>
        <p v-if="summary" class="sp-supplier-card__text">{{ summary }}</p>
        <p v-if="capacity || priceLevel" class="sp-supplier-card__facts">
          <span v-if="capacity"><SpIcon name="fa6-solid:users" /> {{ capacity.min }}–{{ capacity.max }} osob</span>
          <span v-if="priceLevel" :title="'Cenová úroveň dle modelové zakázky'"><SpIcon name="fa6-solid:tag" /> {{ priceLevel }}</span>
        </p>
      </div>

      <div class="sp-supplier-card__footer">
        <span v-if="location" class="sp-supplier-card__location"><SpIcon name="fa6-solid:location-dot" /> {{ location }}</span>
        <span v-if="rating" class="sp-supplier-card__rating" :title="demo ? 'Ukázkové hodnocení, nejde o skutečné recenze' : undefined"><SpStars :value="rating" /> <span class="sp-text-sm">{{ rating.toFixed(1).replace('.', ',') }}<template v-if="ratingCount"> ({{ ratingCount }})</template><template v-if="demo"> · ukázka</template></span></span>
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
.sp-supplier-card__media { position: relative; }
.sp-supplier-card__image { display: block; width: 100%; aspect-ratio: 4 / 3; height: auto; object-fit: cover; border-top-left-radius: var(--sp-radius-md); border-top-right-radius: var(--sp-radius-md); }
.sp-supplier-card__demo { position: absolute; left: var(--sp-space-2); top: var(--sp-space-2); padding: 0.1rem 0.55rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-on-brand); background: var(--sp-color-brand); border-radius: 4px; }
.sp-supplier-card__image--placeholder { display: grid; place-content: center; justify-items: center; gap: var(--sp-space-2); background: var(--sp-color-bg-warm); color: var(--sp-color-brand-strong); font-size: var(--sp-text-xs); text-align: center; }
.sp-supplier-card__body { display: flex; flex-direction: column; flex: 1; padding: var(--sp-space-3); }
.sp-supplier-card__meta { display: flex; align-items: center; gap: var(--sp-space-2); margin-bottom: var(--sp-space-2); min-height: 1.5rem; }
.sp-supplier-card__sponsored { font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.sp-supplier-card__title { margin-bottom: var(--sp-space-2); }
.sp-supplier-card__meta { flex-wrap: wrap; }
.sp-supplier-card__avail { margin-left: auto; }
.sp-supplier-card__facts { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); margin: var(--sp-space-2) 0 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
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

<style scoped>
/* Compact variant for the sponsored strip: horizontal, small, clearly secondary to organic results. */
.sp-supplier-card--compact { height: auto; }
.sp-supplier-card--compact .sp-supplier-card__link { flex-direction: row; align-items: stretch; }
.sp-supplier-card--compact .sp-supplier-card__media { flex: 0 0 7.5rem; }
.sp-supplier-card--compact .sp-supplier-card__image { height: 100%; aspect-ratio: auto; border-radius: var(--sp-radius-md) 0 0 var(--sp-radius-md); }
.sp-supplier-card--compact .sp-supplier-card__body { padding: var(--sp-space-2) var(--sp-space-3); }
.sp-supplier-card--compact .sp-supplier-card__text, .sp-supplier-card--compact .sp-supplier-card__facts, .sp-supplier-card--compact .sp-supplier-card__footer { display: none; }
.sp-supplier-card--compact .sp-supplier-card__title { margin: 0; font-size: var(--sp-text-md); }
.sp-supplier-card--compact .sp-supplier-card__fav { top: var(--sp-space-1); right: var(--sp-space-1); width: 2rem; height: 2rem; font-size: 1rem; }
</style>
