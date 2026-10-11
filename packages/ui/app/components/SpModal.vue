<script setup lang="ts">
/**
 * Dialog on the native <dialog> element: focus trap, Esc to close and inert background come from the browser.
 * Visuals follow the old modal (radius 1rem, overlay rgba(0,0,0,.5) + blur(2px), max-width 600px).
 */
const props = defineProps<{ title: string }>()
const open = defineModel<boolean>({ default: false })
const dialog = ref<HTMLDialogElement>()
const titleId = useId()
let opener: HTMLElement | null = null

watch(open, (v) => {
  const d = dialog.value
  if (!d) return
  if (v && !d.open) { opener = document.activeElement as HTMLElement | null; d.showModal() }
  if (!v && d.open) d.close()
})
function onClose() {
  open.value = false
  opener?.focus()
}
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="sp-modal" :aria-labelledby="titleId" @close="onClose" @click="onBackdrop">
    <div class="sp-modal__content">
      <header class="sp-modal__header">
        <h2 :id="titleId" class="sp-modal__title">{{ props.title }}</h2>
        <button type="button" class="sp-modal__close" aria-label="Zavřít" @click="dialog?.close()"><SpIcon name="fa6-solid:xmark" /></button>
      </header>
      <div class="sp-modal__body"><slot /></div>
      <footer v-if="$slots.footer" class="sp-modal__footer"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>

<style scoped>
.sp-modal { width: min(600px, 95vw); max-height: 90vh; padding: 0; border: 0; border-radius: var(--sp-radius-md); box-shadow: var(--sp-shadow-modal); color: var(--sp-color-text); }
.sp-modal::backdrop { background: var(--sp-color-overlay); backdrop-filter: blur(2px); }
.sp-modal__content { display: flex; flex-direction: column; max-height: 90vh; }
.sp-modal__header { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); border-bottom: 1px solid var(--sp-color-border); }
.sp-modal__title { margin: 0; font-size: var(--sp-text-xl); font-weight: var(--sp-font-weight-semibold); color: var(--sp-gray-800); }
.sp-modal__close { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; font-size: 1.25rem; color: var(--sp-gray-500); background: none; border: 0; border-radius: 50%; }
.sp-modal__close:hover { background: var(--sp-gray-100); color: var(--sp-gray-800); }
.sp-modal__body { padding: var(--sp-space-4); overflow-y: auto; }
.sp-modal__footer { display: flex; justify-content: flex-end; gap: var(--sp-space-2); padding: var(--sp-space-3) var(--sp-space-4); border-top: 1px solid var(--sp-color-border); }
</style>
