<script setup lang="ts">
/**
 * Supplier gallery (Gallery): one large image + 2x2 grid on desktop, stacked on mobile.
 * Clicking opens the lightbox (native dialog) with prev/next and keyboard arrows.
 */
const props = defineProps<{ images: string[]; alt: string }>()
const open = ref(false)
const idx = ref(0)
const dialog = ref<HTMLDialogElement>()
const show = (i: number) => { idx.value = i; open.value = true; nextTick(() => dialog.value?.showModal()) }
const step = (d: number) => { idx.value = (idx.value + d + props.images.length) % props.images.length }
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}
</script>

<template>
  <div class="sp-gallery">
    <button type="button" class="sp-gallery__main" :aria-label="`Zobrazit fotografii 1 z ${images.length}`" @click="show(0)">
      <img :src="images[0]" :alt="alt" fetchpriority="high" />
    </button>
    <div class="sp-gallery__grid">
      <button v-for="(src, i) in images.slice(1, 5)" :key="src + i" type="button" class="sp-gallery__item" :aria-label="`Zobrazit fotografii ${i + 2} z ${images.length}`" @click="show(i + 1)">
        <img :src="src" alt="" loading="lazy" />
      </button>
    </div>
    <button v-if="images.length > 5" type="button" class="sp-gallery__all" @click="show(0)"><SpIcon name="fa6-regular:images" /> Zobrazit galerii ({{ images.length }})</button>

    <dialog v-if="open" ref="dialog" class="sp-lightbox" aria-label="Galerie" @close="open = false" @keydown="onKey" @click.self="dialog?.close()">
      <button type="button" class="sp-lightbox__close" aria-label="Zavřít" @click="dialog?.close()"><SpIcon name="fa6-solid:xmark" size="1.25rem" /></button>
      <button v-if="images.length > 1" type="button" class="sp-lightbox__nav sp-lightbox__nav--prev" aria-label="Předchozí" @click="step(-1)"><SpIcon name="fa6-solid:chevron-left" /></button>
      <img class="sp-lightbox__img" :src="images[idx]" :alt="`${alt} – fotografie ${idx + 1}`" />
      <button v-if="images.length > 1" type="button" class="sp-lightbox__nav sp-lightbox__nav--next" aria-label="Další" @click="step(1)"><SpIcon name="fa6-solid:chevron-right" /></button>
      <p class="sp-lightbox__count">{{ idx + 1 }} / {{ images.length }}</p>
    </dialog>
  </div>
</template>

<style scoped>
.sp-gallery { position: relative; display: grid; gap: var(--sp-space-2); }
.sp-gallery button { padding: 0; border: 0; background: none; overflow: hidden; }
.sp-gallery img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: var(--sp-radius-md); transition: opacity var(--sp-duration) var(--sp-ease); }
.sp-gallery button:hover img { opacity: 0.9; }
.sp-gallery__main { aspect-ratio: 4 / 3; }
.sp-gallery__grid { display: none; }
.sp-gallery__all { position: absolute; right: var(--sp-space-3); bottom: var(--sp-space-3); display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.9rem !important; font-size: var(--sp-text-sm); background: rgb(255 255 255 / 0.92) !important; border-radius: var(--sp-radius-pill); }
@media (min-width: 768px) {
  .sp-gallery { grid-template-columns: 1fr 1fr; }
  .sp-gallery__main { aspect-ratio: auto; min-height: 22rem; }
  .sp-gallery__grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: var(--sp-space-2); }
}
.sp-lightbox { width: min(1100px, 96vw); max-height: 94vh; padding: 0; background: #111; border: 0; border-radius: var(--sp-radius-md); overflow: hidden; }
.sp-lightbox::backdrop { background: rgb(0 0 0 / 0.8); }
.sp-lightbox__img { display: block; width: 100%; max-height: 88vh; object-fit: contain; }
.sp-lightbox__close, .sp-lightbox__nav { position: absolute; display: grid; place-items: center; width: 2.5rem; height: 2.5rem; color: #fff; background: rgb(0 0 0 / 0.5); border: 0; border-radius: 50%; }
.sp-lightbox__close { top: var(--sp-space-3); right: var(--sp-space-3); }
.sp-lightbox__nav { top: 50%; transform: translateY(-50%); }
.sp-lightbox__nav--prev { left: var(--sp-space-3); }
.sp-lightbox__nav--next { right: var(--sp-space-3); }
.sp-lightbox__count { position: absolute; bottom: var(--sp-space-2); left: 0; right: 0; margin: 0; color: #fff; text-align: center; font-size: var(--sp-text-sm); }
</style>
