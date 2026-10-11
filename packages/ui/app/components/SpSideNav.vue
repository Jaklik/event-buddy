<script setup lang="ts">
/**
 * Side navigation for account / supplier / admin panels (Sidebar card, original style).
 * Desktop: vertical card. Mobile: horizontal scrolling pills so the content stays first.
 */
export interface SideNavItem { label: string; to: string; icon?: string; badge?: number | string; exact?: boolean }
defineProps<{ items: SideNavItem[]; title?: string; subtitle?: string; label?: string }>()
const route = useRoute()
const isActive = (i: SideNavItem) => (i.exact ? route.path === i.to : route.path === i.to || route.path.startsWith(`${i.to}/`))
</script>

<template>
  <nav class="sp-side" :aria-label="label ?? 'Navigace účtu'">
    <div v-if="title" class="sp-side__head">
      <SpCircleIcon class="sp-side__avatar" size="3rem">{{ title.slice(0, 1) }}</SpCircleIcon>
      <div class="sp-side__who"><strong>{{ title }}</strong><span v-if="subtitle">{{ subtitle }}</span></div>
    </div>
    <ul class="sp-side__list">
      <li v-for="i in items" :key="i.to">
        <NuxtLink :to="i.to" class="sp-side__link" :class="{ 'is-active': isActive(i) }" :aria-current="isActive(i) ? 'page' : undefined">
          <SpIcon v-if="i.icon" :name="i.icon" class="sp-side__icon" />
          <span class="sp-side__text">{{ i.label }}</span>
          <span v-if="i.badge" class="sp-side__badge">{{ i.badge }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sp-side { background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); padding: var(--sp-space-2); }
.sp-side__head { display: none; align-items: center; gap: var(--sp-space-3); padding: var(--sp-space-3); border-bottom: 1px solid var(--sp-color-line); margin-bottom: var(--sp-space-2); }
.sp-side__who { display: flex; flex-direction: column; min-width: 0; }
.sp-side__who strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sp-side__who span { font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.sp-side__list { display: flex; gap: 0.25rem; margin: 0; padding: 0; list-style: none; overflow-x: auto; scrollbar-width: none; }
.sp-side__link { display: flex; align-items: center; gap: var(--sp-space-2); padding: 0.5rem 0.9rem; font-size: var(--sp-text-sm); color: var(--sp-color-text-strong); text-decoration: none; white-space: nowrap; border-radius: var(--sp-radius-sm); }
.sp-side__link:hover { background: var(--sp-color-bg-neutral); color: var(--sp-color-text-strong); }
.sp-side__link.is-active { font-weight: var(--sp-font-weight-semibold); background: var(--sp-color-brand-soft); color: var(--sp-color-brand-strong); }
.sp-side__icon { width: 1.2rem; text-align: center; }
.sp-side__badge { margin-left: auto; min-width: 1.4rem; padding: 0 0.4rem; font-size: var(--sp-text-xs); font-weight: var(--sp-font-weight-bold); text-align: center; color: var(--sp-color-on-primary); background: var(--sp-color-primary); border-radius: var(--sp-radius-pill); }
@media (min-width: 992px) {
  .sp-side__head { display: flex; }
  .sp-side__list { flex-direction: column; overflow: visible; }
}
</style>
