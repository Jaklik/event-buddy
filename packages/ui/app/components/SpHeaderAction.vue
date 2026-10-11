<script setup lang="ts">
/** Link in the header action area (Top__auth-link): primary colored, icon + label, pipe separator. */
defineProps<{ to?: string; href?: string; icon?: string }>()
</script>

<template>
  <component :is="to ? resolveComponent('NuxtLink') : href ? 'a' : 'button'" v-bind="to ? { to } : href ? { href } : { type: 'button' }" class="sp-header-action">
    <SpIcon v-if="icon" :name="icon" />
    <span><slot /></span>
  </component>
</template>

<style scoped>
.sp-header-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 1rem 0.375rem 0.75rem;
  color: var(--sp-color-primary);
  text-decoration: none;
  background: none;
  border: 0;
  border-right: 1px solid var(--sp-color-pipe);
  border-radius: 0;
}
.sp-header-action:hover { color: var(--sp-color-primary); text-decoration: underline; }
.sp-header-action:last-child { border-right: 0; margin-left: 0.8rem; padding-right: 0; }
/* tablets: icon only, as in the old header */
@media (min-width: 576px) and (max-width: 991.98px) {
  .sp-header-action span { display: none; }
}
</style>
