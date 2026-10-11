<script setup lang="ts">
/** Round icon/initial badge (Sidebar__circle): 4rem, brand background, readable on-brand text. */
defineProps<{ icon?: string; size?: string }>()
</script>

<template>
  <span class="sp-circle" :style="size ? { width: size, height: size } : undefined" aria-hidden="true">
    <SpIcon v-if="icon" :name="icon" /><slot />
  </span>
</template>

<style scoped>
.sp-circle { display: inline-flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; font-size: 1.5rem; font-weight: var(--sp-font-weight-bold); color: var(--sp-color-on-brand); background: var(--sp-color-brand); border-radius: 50%; }
</style>
