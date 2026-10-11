<script setup lang="ts">
/**
 * Top bar (Top / Top__*): white, hairline bottom border, logo + nav on the left,
 * auth/actions on the right. Mobile (<768px): hamburger opens a stacked menu.
 * Nav items are data so pages can show only modules that are actually live.
 */
export interface NavItem { label: string; to: string }
const props = defineProps<{ items: NavItem[] }>()
const route = useRoute()
const open = ref(false)
watch(() => route.fullPath, () => (open.value = false))
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
const menuId = useId()
</script>

<template>
  <header class="sp-header">
    <a class="sp-skip-link" href="#main">Přeskočit na obsah</a>
    <div class="sp-container sp-header__bar">
      <div class="sp-header__left">
        <SpLogo />
        <nav class="sp-header__nav" aria-label="Hlavní navigace">
          <ul>
            <li v-for="item in props.items" :key="item.to">
              <NuxtLink :to="item.to" class="sp-header__link" :class="{ 'is-active': isActive(item.to) }" :aria-current="isActive(item.to) ? 'page' : undefined">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sp-header__actions"><slot name="actions" /></div>

      <button
        type="button"
        class="sp-header__toggle"
        :aria-expanded="open"
        :aria-controls="menuId"
        aria-label="Menu"
        @click="open = !open"
      >
        <SpIcon :name="open ? 'fa6-solid:xmark' : 'fa6-solid:bars'" size="1.25rem" />
      </button>
    </div>

    <div v-show="open" :id="menuId" class="sp-header__mobile">
      <ul>
        <li v-for="item in props.items" :key="item.to">
          <NuxtLink :to="item.to" class="sp-header__link" :class="{ 'is-active': isActive(item.to) }">{{ item.label }}</NuxtLink>
        </li>
      </ul>
      <div class="sp-header__mobile-actions"><slot name="actions" /></div>
    </div>
  </header>
</template>

<style scoped>
.sp-header { position: relative; background: var(--sp-color-bg); border-bottom: 1px solid var(--sp-color-pipe); }
.sp-header__bar { display: flex; align-items: center; justify-content: space-between; min-height: 3.5rem; flex-wrap: nowrap; }
.sp-header__left { display: flex; align-items: center; min-width: 0; }
.sp-header ul { display: flex; margin: 0; padding: 0; list-style: none; }

.sp-header__nav, .sp-header__actions { display: none; }
@media (min-width: 768px) {
  .sp-header__nav { display: block; }
  .sp-header__actions { display: flex; align-items: center; justify-content: flex-end; }
  .sp-header__toggle, .sp-header__mobile { display: none !important; }
}

.sp-header__link {
  display: block;
  padding: 0.5rem 0.5rem;
  color: rgb(0 0 0 / 0.55);
  text-decoration: none;
  transition: color var(--sp-duration-fast) var(--sp-ease);
}
.sp-header__link:hover { color: rgb(0 0 0 / 0.7); }
.sp-header__link.is-active { color: rgb(0 0 0 / 0.9); font-weight: var(--sp-font-weight-semibold); }

.sp-header__toggle { padding: 0.5rem; background: none; border: 0; color: var(--sp-color-text-strong); }
.sp-header__mobile { padding: var(--sp-space-2) var(--sp-gutter) var(--sp-space-3); border-top: 1px solid var(--sp-color-line); }
.sp-header__mobile ul { flex-direction: column; }
.sp-header__mobile-actions { display: flex; flex-wrap: wrap; gap: var(--sp-space-2); margin-top: var(--sp-space-2); }
</style>
