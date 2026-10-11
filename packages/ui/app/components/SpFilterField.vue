<script setup lang="ts">
/** One field inside SpFilterBar: leading icon, small label, borderless control. Select when `options` is given. */
defineProps<{ label: string; icon?: string; type?: string; options?: { value: string; label: string }[]; placeholder?: string }>()
const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="sp-filter-field">
    <SpIcon v-if="icon" :name="icon" class="sp-filter-field__icon" />
    <div class="sp-filter-field__main">
      <label :for="id" class="sp-filter-field__label">{{ label }}</label>
      <select v-if="options" :id="id" v-model="model" class="sp-filter-field__control">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <input v-else :id="id" v-model="model" class="sp-filter-field__control" :type="type ?? 'text'" :placeholder="placeholder" />
    </div>
  </div>
</template>

<style scoped>
.sp-filter-field { display: flex; flex: 1; align-items: center; min-width: 0; padding-block: 0.25rem; }
.sp-filter-field__icon { margin-right: var(--sp-space-2); font-size: 1.25rem; color: var(--sp-color-text-muted); width: 1.25rem; text-align: center; }
.sp-filter-field__main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.sp-filter-field__label { font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.sp-filter-field__control { width: 100%; padding: 0.125rem 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-strong); background: transparent; border: 0; border-radius: var(--sp-radius-input); }
.sp-filter-field__control::placeholder { color: var(--sp-color-text-muted); }
.sp-filter-field__control:focus { outline: none; }
.sp-filter-field:focus-within { outline: var(--sp-focus-ring); outline-offset: 2px; border-radius: var(--sp-radius-input); }
@media (min-width: 768px) { .sp-filter-field__control { font-size: var(--sp-text-md); } }
</style>
