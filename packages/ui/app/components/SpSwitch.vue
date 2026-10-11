<script setup lang="ts">
/** Toggle (.large-switch): 2.75 x 1.125rem; off = grey track + #d1a05a knob, on = brand track + white knob. */
defineProps<{ label: string; name?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
const id = useId()
</script>

<template>
  <div class="sp-switch">
    <input :id="id" v-model="model" type="checkbox" role="switch" class="sp-switch__input" :name="name" :disabled="disabled" />
    <label class="sp-switch__label" :for="id">{{ label }}</label>
  </div>
</template>

<style scoped>
.sp-switch { display: flex; align-items: center; gap: var(--sp-space-2); }
.sp-switch__input {
  position: relative;
  flex: none;
  width: 2.75rem;
  height: 1.125rem;
  margin: 0;
  appearance: none;
  background: rgb(0 0 0 / 0.25);
  border-radius: 2rem;
  transition: background-color var(--sp-duration-fast) var(--sp-ease);
}
.sp-switch__input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1.125rem;
  height: 1.125rem;
  background: #d1a05a;
  border-radius: 50%;
  transition: transform var(--sp-duration-fast) var(--sp-ease), background-color var(--sp-duration-fast) var(--sp-ease);
}
.sp-switch__input:checked { background: var(--sp-color-brand); }
.sp-switch__input:checked::before { background: #fff; transform: translateX(1.625rem); }
.sp-switch__input:disabled { opacity: 0.5; }
.sp-switch__input:focus-visible { outline: 2px solid var(--sp-color-brand); outline-offset: 2px; }
.sp-switch__label { font-size: var(--sp-text-sm); }
</style>
