<script setup lang="ts">
/** Dropdown menu (DropdownSharer): icon + label items, hover #f0f0f0, closes on Esc / outside click. */
export interface MenuItem { label: string; icon?: string; to?: string; href?: string }
defineProps<{ label: string; icon?: string; items: MenuItem[] }>()
const open = ref(false)
const root = ref<HTMLElement>()
const menuId = useId()

function onDocClick(e: MouseEvent) { if (!root.value?.contains(e.target as Node)) open.value = false }
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { open.value = false; (root.value?.querySelector('button') as HTMLElement)?.focus() } }
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="sp-dropdown" @keydown="onKey">
    <button type="button" class="sp-dropdown__toggle" :aria-expanded="open" aria-haspopup="true" :aria-controls="menuId" :aria-label="label" @click="open = !open">
      <SpIcon :name="icon ?? 'fa6-solid:share-nodes'" size="1.5rem" />
    </button>
    <ul v-show="open" :id="menuId" class="sp-dropdown__menu">
      <li v-for="it in items" :key="it.label">
        <component :is="it.to ? resolveComponent('NuxtLink') : 'a'" v-bind="it.to ? { to: it.to } : { href: it.href ?? '#' }" class="sp-dropdown__item" @click="open = false">
          <SpIcon v-if="it.icon" :name="it.icon" /> {{ it.label }}
        </component>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sp-dropdown { position: relative; display: inline-block; }
.sp-dropdown__toggle { padding: 0.5rem; color: var(--sp-gray-800); background: none; border: 0; border-radius: var(--sp-radius-sm); }
.sp-dropdown__menu { position: absolute; right: 0; z-index: var(--sp-z-dropdown); min-width: 10rem; margin: var(--sp-space-1) 0 0; padding: 0; list-style: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-sm); box-shadow: var(--sp-shadow-card); overflow: hidden; }
.sp-dropdown__item { display: flex; align-items: center; gap: var(--sp-space-2); padding: 0.5rem 1rem; color: var(--sp-gray-800); text-decoration: none; transition: background var(--sp-duration) var(--sp-ease); }
.sp-dropdown__item:hover { background: var(--sp-color-bg-hover); color: var(--sp-gray-800); }
</style>
