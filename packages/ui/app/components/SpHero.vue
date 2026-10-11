<script setup lang="ts">
/**
 * Hero (Jumbotron): soft beige gradient, radius 20px, min-height 600px, text left (7/12) and image right (5/12).
 * Below 768px stacked and centered. Exactly one hero per page, title is the page <h1>.
 */
defineProps<{ eyebrow?: string; title: string; text?: string }>()
</script>

<template>
  <section class="sp-hero">
    <div class="sp-container sp-hero__box">
      <div class="sp-hero__content">
        <p v-if="eyebrow" class="sp-hero__eyebrow">{{ eyebrow }}</p>
        <SpHeading level="display" class="sp-hero__title">{{ title }}</SpHeading>
        <p v-if="text" class="sp-hero__text">{{ text }}</p>
        <div class="sp-hero__actions"><slot /></div>
      </div>
      <div v-if="$slots.media" class="sp-hero__media"><slot name="media" /></div>
    </div>
  </section>
</template>

<style scoped>
.sp-hero { padding: var(--sp-space-3); margin-bottom: var(--sp-space-4); border-radius: var(--sp-radius-md); }
.sp-hero__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto;
  padding-block: var(--sp-space-4);
  background: linear-gradient(180deg, var(--sp-color-brand-gradient-from), var(--sp-color-brand-gradient-to));
  border-radius: var(--sp-radius-hero);
}
.sp-hero__content { padding-inline: var(--sp-space-3); text-align: center; flex: 7 1 0; }
.sp-hero__media { display: flex; justify-content: center; align-items: center; padding: var(--sp-space-4) var(--sp-space-3) 0; flex: 5 1 0; }
.sp-hero__media :deep(img) { max-width: 100%; border-radius: var(--sp-radius-image); box-shadow: var(--sp-shadow-image); }
.sp-hero__eyebrow { margin-bottom: var(--sp-space-3); font-size: 1.2rem; font-weight: var(--sp-font-weight-semibold); text-transform: uppercase; color: var(--sp-color-brand-strong); }
.sp-hero__title { margin-bottom: var(--sp-space-3); }
.sp-hero__text { max-width: 600px; margin: 0 auto var(--sp-space-4); font-size: var(--sp-text-md); }
.sp-hero__actions { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); justify-content: center; }

@media (min-width: 768px) {
  .sp-hero__box { flex-direction: row; min-height: 600px; padding-block: var(--sp-space-5); }
  .sp-hero__content { text-align: left; }
  .sp-hero__text { margin-left: 0; }
  .sp-hero__actions { justify-content: flex-start; }
  .sp-hero__media { padding-top: 0; }
}
</style>
