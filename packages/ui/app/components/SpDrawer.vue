<script setup lang="ts">
/** Side panel on the native <dialog> (mobile filters): focus trap and Esc come from the browser, backdrop click closes. */
const props = defineProps<{ title: string }>()
const open = defineModel<boolean>({ default: false })
const dialog = ref<HTMLDialogElement>()
const titleId = useId()
let opener: HTMLElement | null = null
watch(open, async (v) => {
  await nextTick()
  const d = dialog.value
  if (!d) return
  if (v && !d.open) { opener = document.activeElement as HTMLElement | null; d.showModal() }
  if (!v && d.open) d.close()
}, { immediate: true, flush: 'post' })
onMounted(() => { if (open.value) dialog.value?.showModal() })
function onClose() { open.value = false; opener?.focus() }
</script>

<template>
  <dialog ref="dialog" class="sp-drawer" :aria-labelledby="titleId" @close="onClose" @click.self="dialog?.close()">
    <div class="sp-drawer__panel">
      <header class="sp-drawer__head">
        <h2 :id="titleId" class="sp-drawer__title">{{ props.title }}</h2>
        <button type="button" class="sp-drawer__close" aria-label="Zavřít" @click="dialog?.close()"><SpIcon name="fa6-solid:xmark" size="1.25rem" /></button>
      </header>
      <div class="sp-drawer__body"><slot /></div>
      <footer v-if="$slots.footer" class="sp-drawer__foot"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>

<style scoped>
.sp-drawer { width: 100%; max-width: 26rem; height: 100%; max-height: 100%; margin: 0 auto 0 0; padding: 0; border: 0; background: var(--sp-color-bg); color: var(--sp-color-text); }
.sp-drawer::backdrop { background: var(--sp-color-overlay); }
.sp-drawer__panel { display: flex; flex-direction: column; height: 100%; }
.sp-drawer__head { display: flex; align-items: center; justify-content: space-between; padding: var(--sp-space-3) var(--sp-space-3); border-bottom: 1px solid var(--sp-color-line); }
.sp-drawer__title { margin: 0; font-size: var(--sp-text-xl); }
.sp-drawer__close { display: grid; place-items: center; width: var(--sp-control-h); height: var(--sp-control-h); background: none; border: 0; border-radius: 50%; }
.sp-drawer__close:hover { background: var(--sp-color-bg-neutral); }
.sp-drawer__body { flex: 1; padding: var(--sp-space-3); overflow-y: auto; }
.sp-drawer__foot { display: flex; gap: var(--sp-space-2); padding: var(--sp-space-3); border-top: 1px solid var(--sp-color-line); background: var(--sp-color-bg); }
.sp-drawer__foot > * { flex: 1; }
</style>
