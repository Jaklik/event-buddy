<script setup lang="ts">
/**
 * Wide call-to-action band: optional image, title, text, checklist and actions.
 *  warm = professional help / coordination   |   cool = supplier recruitment
 * Colors come from existing tokens only (warm: bg-warm, cool: bg-neutral).
 */
withDefaults(defineProps<{ title: string; text?: string; variant?: 'warm' | 'cool'; image?: string; imageAlt?: string; points?: string[] }>(), { variant: 'warm' })
</script>

<template>
  <section class="sp-cta" :class="`sp-cta--${variant}`">
    <div class="sp-container">
      <div class="sp-cta__box">
        <img v-if="image" class="sp-cta__image" :src="image" :alt="imageAlt ?? ''" loading="lazy" width="200" height="200" />
        <div class="sp-cta__content">
          <SpHeading :level="3" as="h2" class="sp-cta__title">{{ title }}</SpHeading>
          <p v-if="text" class="sp-cta__text">{{ text }}</p>
          <ul v-if="points?.length" class="sp-cta__points">
            <li v-for="p in points" :key="p"><SpIcon name="fa6-solid:check" /> {{ p }}</li>
          </ul>
        </div>
        <div class="sp-cta__actions"><slot /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sp-cta { padding-block: var(--sp-space-3); }
.sp-cta__box { display: flex; flex-direction: column; gap: var(--sp-space-3); padding: var(--sp-space-4); border-radius: var(--sp-radius-md); }
.sp-cta--warm .sp-cta__box { background: var(--sp-color-bg-warm); }
.sp-cta--cool .sp-cta__box { background: var(--sp-color-bg-neutral); }
.sp-cta__image { width: 8rem; height: 8rem; object-fit: cover; border-radius: var(--sp-radius-md); align-self: center; }
.sp-cta__content { flex: 1; }
.sp-cta__title { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-xl); font-weight: var(--sp-font-weight-regular); }
.sp-cta__text { margin: 0; color: var(--sp-color-text-secondary); }
.sp-cta__points { display: grid; gap: var(--sp-space-1) var(--sp-space-4); margin: var(--sp-space-3) 0 0; padding: 0; list-style: none; font-size: var(--sp-text-sm); }
.sp-cta__points li { display: flex; align-items: center; gap: var(--sp-space-2); }
.sp-cta__points :deep(.sp-icon) { color: var(--sp-color-primary); }
.sp-cta__actions { display: flex; flex-direction: column; gap: var(--sp-space-2); align-items: stretch; }
@media (min-width: 768px) {
  .sp-cta__box { flex-direction: row; align-items: center; padding: var(--sp-space-3) var(--sp-space-4); }
  .sp-cta__image { align-self: auto; }
  .sp-cta__points { grid-template-columns: repeat(2, auto); width: max-content; }
  .sp-cta__actions { align-items: center; min-width: 14rem; }
}
</style>
