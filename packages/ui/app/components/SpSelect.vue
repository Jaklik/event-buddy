<script setup lang="ts">
/** Native select styled like SpInput (always shows the label above the value). */
const props = defineProps<{
  label: string
  options: { value: string | number; label: string }[]
  error?: string
  required?: boolean
  name?: string
  placeholder?: string
  disabled?: boolean
}>()
const model = defineModel<string | number>({ default: '' })
const id = useId()
</script>

<template>
  <div class="sp-select" :class="{ 'sp-select--error': !!error }">
    <select :id="id" v-model="model" class="sp-select__control" :name="name" :required="required" :disabled="disabled" :aria-invalid="error ? 'true' : undefined">
      <option v-if="props.placeholder" value="" disabled>{{ props.placeholder }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <label class="sp-select__label" :for="id">{{ label }}</label>
    <SpIcon name="fa6-solid:chevron-down" class="sp-select__chevron" />
    <p v-if="error" class="sp-select__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.sp-select { position: relative; margin-bottom: var(--sp-space-3); }
.sp-select__control {
  display: block;
  width: 100%;
  min-height: 3.5rem;
  padding: 1.5rem 2.5rem 0.5rem 0.75rem;
  font-size: var(--sp-text-sm);
  color: var(--sp-color-text-strong);
  background: var(--sp-color-bg-input);
  border: 1px solid transparent;
  border-radius: var(--sp-radius-input);
  appearance: none;
}
.sp-select__control:focus { outline: none; background: var(--sp-color-bg-input-focus); border-color: var(--sp-color-primary); }
.sp-select__label {
  position: absolute;
  inset: 0 auto auto 0;
  padding: 0.5rem 0.75rem 0;
  font-size: var(--sp-text-xs);
  color: var(--sp-color-text-muted);
  pointer-events: none;
}
.sp-select__chevron { position: absolute; right: 0.9rem; top: 1.4rem; font-size: 0.75rem; color: var(--sp-color-text-muted); pointer-events: none; }
.sp-select--error .sp-select__control { border-color: var(--sp-color-danger); }
.sp-select__error { margin: var(--sp-space-1) 0 0 0.75rem; font-size: var(--sp-text-xs); color: var(--sp-color-danger); }
</style>
