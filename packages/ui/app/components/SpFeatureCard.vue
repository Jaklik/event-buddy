<script setup lang="ts">
/**
 * Tool/feature card (planner, event website, inspiration, bazaar, advice).
 * Spec §4.5: every card has title, short benefit, visual, availability state and a valid target.
 * `soon` renders a non-link card with the label "Připravujeme" - never a dead CTA.
 */
const props = withDefaults(defineProps<{ title: string; text: string; icon?: string; to?: string; status?: 'live' | 'soon' }>(), { status: 'live' })
const tag = computed(() => (props.status === 'live' && props.to ? resolveComponent('NuxtLink') : 'div'))
</script>

<template>
  <component :is="tag" v-bind="status === 'live' && to ? { to } : {}" class="sp-feature" :class="{ 'is-soon': status === 'soon' }">
    <span class="sp-feature__icon"><SpIcon v-if="icon" :name="icon" size="1.5rem" /></span>
    <span class="sp-feature__body">
      <span class="sp-feature__title">{{ title }}<SpBadge v-if="status === 'soon'" variant="neutral" class="sp-feature__soon">Připravujeme</SpBadge></span>
      <span class="sp-feature__text">{{ text }}</span>
    </span>
    <SpIcon v-if="status === 'live' && to" name="fa6-solid:arrow-right" class="sp-feature__arrow" />
  </component>
</template>

<style scoped>
.sp-feature {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-space-3);
  height: 100%;
  padding: var(--sp-space-3);
  color: inherit;
  text-decoration: none;
  background: var(--sp-color-bg);
  border: 1px solid var(--sp-color-line);
  border-radius: var(--sp-radius-md);
  transition: transform var(--sp-duration) var(--sp-ease), box-shadow var(--sp-duration) var(--sp-ease);
}
a.sp-feature { padding-bottom: calc(var(--sp-space-3) + 1.25rem); }
a.sp-feature:hover, a.sp-feature:focus-visible { transform: translateY(-3px); box-shadow: var(--sp-shadow-card); color: inherit; }
.sp-feature__icon { flex: none; display: grid; place-items: center; width: 3rem; height: 3rem; color: var(--sp-color-brand-strong); background: var(--sp-color-brand-soft); border-radius: var(--sp-radius-sm); }
.sp-feature__body { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; overflow-wrap: anywhere; hyphens: auto; }
.sp-feature__title { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-space-2); font-weight: var(--sp-font-weight-semibold); }
.sp-feature__text { font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.sp-feature__arrow { position: absolute; right: var(--sp-space-3); bottom: var(--sp-space-3); color: var(--sp-color-text-secondary); }
.sp-feature.is-soon { background: var(--sp-color-bg-warm); border-style: dashed; }
.sp-feature.is-soon .sp-feature__icon { opacity: 0.7; }
</style>
