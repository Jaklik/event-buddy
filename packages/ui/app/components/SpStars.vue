<script setup lang="ts">
/** Read-only star rating (Common__star + Review__star--inactive). Accessible text via aria-label. */
const props = withDefaults(defineProps<{ value: number; max?: number; size?: string }>(), { max: 5 })
const rounded = computed(() => Math.round(props.value))
</script>

<template>
  <span class="sp-stars" role="img" :aria-label="`Hodnocení ${value} z ${max}`" :style="size ? { fontSize: size } : undefined">
    <SpIcon v-for="n in max" :key="n" :name="n <= rounded ? 'fa6-solid:star' : 'fa6-regular:star'" :class="n <= rounded ? 'sp-stars__on' : 'sp-stars__off'" />
  </span>
</template>

<style scoped>
.sp-stars { display: inline-flex; gap: 0.125rem; }
.sp-stars__on { color: var(--sp-color-brand); }
.sp-stars__off { color: var(--sp-color-brand); opacity: 0.5; }
</style>
