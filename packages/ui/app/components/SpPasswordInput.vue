<script setup lang="ts">
/** Password field with show/hide toggle (Form__toggle-password). */
defineProps<{ label: string; error?: string; hint?: string; required?: boolean; autocomplete?: 'current-password' | 'new-password'; name?: string }>()
const model = defineModel<string>({ default: '' })
const shown = ref(false)
</script>

<template>
  <SpInput
    v-model="model"
    :label="label"
    :type="shown ? 'text' : 'password'"
    :error="error"
    :hint="hint"
    :required="required"
    :autocomplete="autocomplete"
    :name="name"
    class="sp-password"
  >
    <template #append>
      <button
        type="button"
        class="sp-password__toggle"
        :aria-label="shown ? 'Skrýt heslo' : 'Zobrazit heslo'"
        :aria-pressed="shown"
        @click="shown = !shown"
      >
        <SpIcon v-if="shown" name="fa6-regular:eye-slash" />
        <SpIcon v-else name="fa6-regular:eye" />
      </button>
    </template>
  </SpInput>
</template>

<style scoped>
.sp-password :deep(.sp-input__control) { padding-right: 2.75rem; }
.sp-password__toggle {
  position: absolute;
  top: 1.75rem;
  right: 0.5rem;
  transform: translateY(-50%);
  padding: 0.5rem;
  background: none;
  border: 0;
  color: var(--sp-color-text-muted);
  border-radius: var(--sp-radius-sm);
}
.sp-password__toggle:hover { color: var(--sp-color-text-strong); }
</style>
