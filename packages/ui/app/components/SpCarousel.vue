<script setup lang="ts">
/**
 * Rotating carousel following the Homepage spec §4.4:
 *  - auto-advance every `interval` ms (default 7000, configurable)
 *  - arrows, indicators and a pause/play button
 *  - pauses on hover, focus-within and manual interaction
 *  - does not advance when off-screen or when the tab is hidden
 *  - never autoplays with prefers-reduced-motion
 *  - `sponsored` labels every slide "Sponzorováno"
 * Indicators use the original pill style (active 2.5 x .75rem, others .5rem dots).
 */
export interface Slide { id: string | number; image: string; alt: string; title?: string; text?: string; href?: string; cta?: string; sponsored?: boolean }
const props = withDefaults(defineProps<{ slides: Slide[]; interval?: number; label?: string; autoplay?: boolean }>(), {
  interval: 7000,
  label: 'Doporučené nabídky',
  autoplay: true,
})

const index = ref(0)
const userPaused = ref(false)
const hovering = ref(false)
const focused = ref(false)
const offscreen = ref(false)
const tabHidden = ref(false)
const reduceMotion = ref(false)
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setInterval> | undefined

const count = computed(() => props.slides.length)
const running = computed(
  () => props.autoplay && count.value > 1 && !userPaused.value && !hovering.value && !focused.value && !offscreen.value && !tabHidden.value && !reduceMotion.value,
)

function go(i: number) { index.value = (i + count.value) % count.value }
const next = () => go(index.value + 1)
const prev = () => go(index.value - 1)

watch(running, (on) => {
  clearInterval(timer)
  if (on) timer = setInterval(next, props.interval)
}, { immediate: false })

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = mq.matches
  mq.addEventListener('change', (e) => (reduceMotion.value = e.matches))
  document.addEventListener('visibilitychange', () => (tabHidden.value = document.hidden))
  tabHidden.value = document.hidden
  if (root.value && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (offscreen.value = !e?.isIntersecting), { threshold: 0.3 }).observe(root.value)
  }
  if (running.value) timer = setInterval(next, props.interval)
})
onBeforeUnmount(() => clearInterval(timer))

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') { e.preventDefault(); userPaused.value = true; next() }
  if (e.key === 'ArrowLeft') { e.preventDefault(); userPaused.value = true; prev() }
}
</script>

<template>
  <section
    ref="root"
    class="sp-carousel"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="focused = true"
    @focusout="focused = false"
    @keydown="onKey"
  >
    <div class="sp-carousel__viewport" :aria-live="running ? 'off' : 'polite'">
      <article
        v-for="(s, i) in props.slides"
        :key="s.id"
        class="sp-carousel__slide"
        :class="{ 'is-active': i === index }"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${i + 1} z ${count}`"
        :aria-hidden="i === index ? undefined : 'true'"
        :inert="i !== index || undefined"
      >
        <img class="sp-carousel__image" :src="s.image" :alt="s.alt" :loading="i === 0 ? 'eager' : 'lazy'" width="1200" height="400" />
        <div v-if="s.title || s.text || s.sponsored" class="sp-carousel__caption">
          <span v-if="s.sponsored" class="sp-carousel__tag">Sponzorováno</span>
          <h3 v-if="s.title" class="sp-carousel__title">{{ s.title }}</h3>
          <p v-if="s.text" class="sp-carousel__text">{{ s.text }}</p>
          <SpButton v-if="s.href" :href="s.href" variant="border" size="sm" class="sp-carousel__cta">{{ s.cta ?? 'Zobrazit' }}</SpButton>
        </div>
      </article>
    </div>

    <template v-if="count > 1">
      <button type="button" class="sp-carousel__arrow sp-carousel__arrow--prev" aria-label="Předchozí" @click="userPaused = true; prev()">
        <SpIcon name="fa6-solid:chevron-left" />
      </button>
      <button type="button" class="sp-carousel__arrow sp-carousel__arrow--next" aria-label="Další" @click="userPaused = true; next()">
        <SpIcon name="fa6-solid:chevron-right" />
      </button>

      <div class="sp-carousel__controls">
        <button type="button" class="sp-carousel__pause" :aria-label="userPaused || !autoplay ? 'Spustit automatické přepínání' : 'Pozastavit automatické přepínání'" @click="userPaused = !userPaused">
          <SpIcon :name="userPaused || !autoplay ? 'fa6-solid:play' : 'fa6-solid:pause'" />
        </button>
        <div class="sp-carousel__dots" role="tablist" aria-label="Výběr snímku">
          <button
            v-for="(s, i) in props.slides"
            :key="s.id"
            type="button"
            role="tab"
            class="sp-carousel__dot"
            :class="{ 'is-active': i === index }"
            :aria-selected="i === index"
            :aria-label="`Snímek ${i + 1}`"
            @click="userPaused = true; go(i)"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.sp-carousel { position: relative; overflow: hidden; border-radius: var(--sp-radius-md); background: var(--sp-color-bg-warm); }
.sp-carousel__viewport { position: relative; aspect-ratio: 3 / 1; min-height: 11rem; }
.sp-carousel__slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity var(--sp-duration) var(--sp-ease), visibility var(--sp-duration); }
.sp-carousel__slide.is-active { opacity: 1; visibility: visible; }
.sp-carousel__image { width: 100%; height: 100%; object-fit: cover; }
.sp-carousel__caption { position: absolute; inset: auto 0 0 0; padding: var(--sp-space-3) var(--sp-space-4) var(--sp-space-5); color: #fff; background: rgb(0 0 0 / 0.5); }
.sp-carousel__tag { display: inline-block; margin-bottom: var(--sp-space-1); padding: 0.1rem 0.5rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-semibold); background: rgb(255 255 255 / 0.2); border-radius: 0.25rem; }
.sp-carousel__title { margin: 0; font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-medium); font-size: var(--sp-text-xl); }
.sp-carousel__text { margin: var(--sp-space-1) 0 var(--sp-space-2); }
.sp-carousel__cta { color: #fff; border-color: #fff; }

.sp-carousel__arrow {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  transform: translateY(-50%);
  color: var(--sp-color-text-strong);
  background: rgb(255 255 255 / 0.85);
  border: 0;
  border-radius: 50%;
}
.sp-carousel__arrow:hover { background: #fff; }
.sp-carousel__arrow--prev { left: var(--sp-space-3); }
.sp-carousel__arrow--next { right: var(--sp-space-3); }

.sp-carousel__controls { position: absolute; inset: auto 0 var(--sp-space-2) 0; display: flex; align-items: center; justify-content: center; gap: var(--sp-space-2); pointer-events: none; }
.sp-carousel__controls > * { pointer-events: auto; }
.sp-carousel__pause { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; font-size: 0.7rem; color: var(--sp-color-text-strong); background: rgb(255 255 255 / 0.85); border: 0; border-radius: 50%; }
.sp-carousel__dots { display: flex; align-items: center; gap: 0.5rem; }
.sp-carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  background: hsl(29 41% 81% / 0.8);
  border: 0;
  border-radius: 50%;
  transition: width var(--sp-duration) var(--sp-ease), height var(--sp-duration) var(--sp-ease);
}
.sp-carousel__dot.is-active { width: 2.5rem; height: 0.75rem; background: hsl(29 41% 81%); border-radius: 1rem; }
</style>
