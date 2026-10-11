<script setup lang="ts">
/**
 * Floating-label field (the old UI used `form-floating` 72x). Look from Form__input:
 * tinted background, no border, radius 8px, .875rem text, label #919EAB.
 * `multiline` renders a textarea. Error/hint are linked via aria-describedby.
 */
const props = withDefaults(
  defineProps<{
    label: string
    type?: string
    multiline?: boolean
    rows?: number
    error?: string
    hint?: string
    required?: boolean
    autocomplete?: string
    name?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { type: 'text', rows: 4 },
)
const model = defineModel<string>({ default: '' })
const id = useId()
const describedBy = computed(() => [props.error ? `${id}-error` : '', props.hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="sp-input" :class="{ 'sp-input--error': !!error, 'sp-input--multiline': multiline }">
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      class="sp-input__control"
      :rows="rows"
      :name="name"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder ?? ' '"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      class="sp-input__control"
      :type="type"
      :name="name"
      :required="required"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :placeholder="placeholder ?? ' '"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    />
    <label class="sp-input__label" :for="id">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <slot name="append" />
    <p v-if="error" :id="`${id}-error`" class="sp-input__message sp-input__message--error">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="sp-input__message">{{ hint }}</p>
  </div>
</template>

<style scoped>
.sp-input { position: relative; margin-bottom: var(--sp-space-3); }
.sp-input__control {
  display: block;
  width: 100%;
  min-height: 3.5rem;
  padding: 1.5rem 0.75rem 0.5rem;
  font-size: var(--sp-text-sm);
  line-height: 1.25;
  color: var(--sp-color-text-strong);
  background: var(--sp-color-bg-input);
  border: 1px solid transparent;
  border-radius: var(--sp-radius-input);
  appearance: none;
  transition: background-color var(--sp-duration-fast) var(--sp-ease), border-color var(--sp-duration-fast) var(--sp-ease);
}
textarea.sp-input__control { min-height: 6rem; resize: vertical; }
.sp-input__control::placeholder { color: transparent; }
.sp-input__control:focus { background: var(--sp-color-bg-input-focus); outline: none; border-color: var(--sp-color-primary); }
.sp-input__control:disabled { opacity: 0.65; }

.sp-input__label {
  position: absolute;
  inset: 0 auto auto 0;
  max-width: 100%;
  padding: 1rem 0.75rem;
  overflow: hidden;
  font-size: var(--sp-text-sm);
  color: var(--sp-color-text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  transform-origin: 0 0;
  transition: transform var(--sp-duration-fast) var(--sp-ease);
}
.sp-input__control:focus ~ .sp-input__label,
.sp-input__control:not(:placeholder-shown) ~ .sp-input__label {
  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
}

.sp-input--error .sp-input__control { border-color: var(--sp-color-danger); }
.sp-input__message { margin: var(--sp-space-1) 0 0 0.75rem; font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.sp-input__message--error { color: var(--sp-color-danger); }
</style>
