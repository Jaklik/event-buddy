<script setup lang="ts">
/**
 * Font Awesome 6 glyphs served locally via @nuxt/icon (no external kit script).
 * Pass the FULL name as a literal so the build can bundle it:
 *   <SpIcon name="fa6-solid:heart" />   <SpIcon name="fa6-regular:star" />   <SpIcon name="fa6-brands:facebook-f" />
 * Decorative by default; pass `label` when the icon is the only content.
 */
const props = defineProps<{ name: string; label?: string; size?: string }>()
</script>

<template>
  <Icon
    :name="props.name"
    class="sp-icon"
    :style="props.size ? { fontSize: props.size } : undefined"
    :aria-hidden="props.label ? undefined : 'true'"
    :aria-label="props.label"
    :role="props.label ? 'img' : undefined"
  />
</template>

<style scoped>
.sp-icon {
  display: inline-block;
  flex: none;
  vertical-align: -0.125em;
}
</style>
