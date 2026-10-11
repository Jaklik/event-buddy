<script setup lang="ts">
/** Checkbox with brand-colored checked state (.form-check-input:checked: #e2cebb / #f9f3ed). */
defineProps<{ label?: string; error?: string; name?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
const id = useId()
</script>

<template>
  <div class="sp-check">
    <input :id="id" v-model="model" type="checkbox" class="sp-check__input" :name="name" :disabled="disabled" :aria-invalid="error ? 'true' : undefined" />
    <label class="sp-check__label" :for="id"><slot>{{ label }}</slot></label>
    <p v-if="error" class="sp-check__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.sp-check { position: relative; display: grid; grid-template-columns: auto 1fr; column-gap: 0.6rem; align-items: start; margin-bottom: var(--sp-space-3); }
.sp-check__input {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.125rem 0 0;
  appearance: none;
  background: var(--sp-color-bg);
  border: 1px solid var(--sp-color-line-strong);
  border-radius: 0.25rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 0.8rem;
}
.sp-check__input:checked {
  background-color: #e2cebb;
  border-color: #f9f3ed;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%234a2f1a' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}
.sp-check__input:disabled { opacity: 0.5; }
.sp-check__label { font-size: var(--sp-text-sm); }
.sp-check__error { grid-column: 2; margin: var(--sp-space-1) 0 0; font-size: var(--sp-text-xs); color: var(--sp-color-danger); }
</style>
