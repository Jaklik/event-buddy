<script setup lang="ts">
/**
 * Flash/notice message. `banner` = full-width, centered, no radius (old `body > .Alert`).
 * Variants cta / star are the original `.alert-cta` / `.alert-star`.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'danger' | 'warning' | 'cta' | 'star'
    banner?: boolean
    dismissible?: boolean
  }>(),
  { variant: 'info' },
)
const emit = defineEmits<{ close: [] }>()
const visible = ref(true)
const role = computed(() => (props.variant === 'danger' ? 'alert' : 'status'))
function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="sp-alert" :class="[`sp-alert--${variant}`, { 'sp-alert--banner': banner }]" :role="role">
    <div class="sp-alert__body"><slot /></div>
    <button v-if="dismissible" type="button" class="sp-alert__close" aria-label="Zavřít" @click="close">
      <SpIcon name="fa6-solid:xmark" />
    </button>
  </div>
</template>

<style scoped>
.sp-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-space-3);
  padding: var(--sp-space-3);
  border: 1px solid transparent;
  border-radius: 0.375rem;
}
.sp-alert__body { flex: 1; }
.sp-alert--banner { margin: 0; justify-content: center; text-align: center; border-radius: 0; }
.sp-alert--banner .sp-alert__body { flex: 0 1 auto; }

.sp-alert--info { background: var(--sp-color-info-bg); border-color: var(--sp-color-line-strong); color: var(--sp-color-text); }
.sp-alert--success { background: var(--sp-color-success-bg); border-color: #b9dfb9; color: #0f5f0f; }
.sp-alert--danger { background: var(--sp-color-danger-bg); border-color: #efbcbc; color: #8c1414; }
.sp-alert--warning { background: var(--sp-color-warning-bg); border-color: #ffe69c; color: #664d03; }
.sp-alert--cta { background: var(--sp-color-primary); color: var(--sp-color-on-primary); border: none; }
.sp-alert--star { background: var(--sp-color-brand); color: var(--sp-color-on-brand); border: none; }

.sp-alert__close {
  flex: none;
  padding: 0.25rem;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  border-radius: 0.25rem;
}
.sp-alert__close:hover { opacity: 1; }
</style>
