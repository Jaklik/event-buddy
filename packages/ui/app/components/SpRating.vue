<script setup lang="ts">
/** Interactive rating (Form__rating). Radio group semantics: arrow keys change value. */
const props = withDefaults(defineProps<{ label?: string; max?: number; error?: string }>(), { max: 5, label: 'Hodnocení' })
const model = defineModel<number>({ default: 0 })
const hover = ref(0)
const active = computed(() => hover.value || model.value)
const name = useId()
</script>

<template>
  <fieldset class="sp-rating" :aria-invalid="error ? 'true' : undefined">
    <legend class="sp-visually-hidden">{{ props.label }}</legend>
    <label v-for="n in props.max" :key="n" class="sp-rating__star" @mouseenter="hover = n" @mouseleave="hover = 0">
      <input v-model="model" class="sp-visually-hidden" type="radio" :name="name" :value="n" :aria-label="`${n} z ${props.max}`" />
      <SpIcon :name="n <= active ? 'fa6-solid:star' : 'fa6-regular:star'" :class="{ 'sp-rating__on': n <= active }" />
    </label>
    <p v-if="error" class="sp-rating__error">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.sp-rating { display: flex; flex-wrap: wrap; gap: 0.25rem; padding: 0; margin: 0 0 var(--sp-space-3); border: 0; font-size: 1.5rem; }
.sp-rating__star { position: relative; cursor: pointer; color: var(--sp-color-star-off); line-height: 1; }
.sp-rating__star:has(input:focus-visible) { outline: var(--sp-focus-ring); outline-offset: 2px; border-radius: 4px; }
.sp-rating__on { color: var(--sp-color-star); }
.sp-rating__error { flex-basis: 100%; margin: 0; font-size: var(--sp-text-xs); color: var(--sp-color-danger); }
</style>
