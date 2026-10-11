<script setup lang="ts">
/** Radio option, same look as SpCheckbox but round. Use several with the same `name` and v-model. */
defineProps<{ value: string | number; label?: string; name?: string; disabled?: boolean }>()
const model = defineModel<string | number>()
const id = useId()
</script>

<template>
  <div class="sp-radio">
    <input :id="id" v-model="model" type="radio" class="sp-radio__input" :name="name" :value="value" :disabled="disabled" />
    <label class="sp-radio__label" :for="id"><slot>{{ label }}</slot></label>
  </div>
</template>

<style scoped>
.sp-radio { display: grid; grid-template-columns: auto 1fr; column-gap: 0.6rem; align-items: start; margin-bottom: var(--sp-space-2); }
.sp-radio__input { width: 1.25rem; height: 1.25rem; margin: 0.125rem 0 0; appearance: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line-strong); border-radius: 50%; }
.sp-radio__input:checked { border: 0.4rem solid var(--sp-color-primary); background: var(--sp-color-bg); }
.sp-radio__input:disabled { opacity: 0.5; }
.sp-radio__label { font-size: var(--sp-text-sm); }
.sp-radio__input:disabled + .sp-radio__label { color: var(--sp-color-text-muted); }
</style>
