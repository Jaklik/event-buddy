<script setup lang="ts">
/**
 * Variants (from btn.scss):
 *  cta     primary action, pill, filled primary             (.btn-cta)
 *  border  secondary action, pill, outlined                 (.btn-border)
 *  brand   brand accent, beige, 6px radius                  (.btn-brand)
 *  link    tertiary, text only                              (Form__btn-link)
 *  danger  destructive                                      (Bootstrap btn-danger)
 * `circle` makes a 40x40 round icon button (.btn-circle / Filter__btn).
 */
const props = withDefaults(
  defineProps<{
    variant?: 'cta' | 'border' | 'brand' | 'link' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    circle?: boolean
    disabled?: boolean
    loading?: boolean
    label?: string
  }>(),
  { variant: 'cta', size: 'md', type: 'button' },
)

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="sp-btn"
    :class="[
      `sp-btn--${variant}`,
      `sp-btn--${size}`,
      { 'sp-btn--block': block, 'sp-btn--circle': circle, 'is-disabled': disabled, 'is-loading': loading },
    ]"
    :aria-label="circle ? label : undefined"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span v-if="loading" class="sp-btn__spinner" aria-hidden="true" />
    <slot />
  </component>
</template>

<style scoped>
.sp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-space-2);
  min-height: var(--sp-control-h);
  padding: 0.5rem 1.25rem;
  font-size: var(--sp-text-md);
  font-weight: var(--sp-font-weight-semibold);
  line-height: var(--sp-leading-body);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: transparent;
  transition:
    background-color var(--sp-duration-fast) var(--sp-ease),
    color var(--sp-duration-fast) var(--sp-ease),
    border-color var(--sp-duration-fast) var(--sp-ease);
}
.sp-btn.is-disabled,
.sp-btn:disabled {
  opacity: 0.65;
  pointer-events: none;
}

/* Sizes */
.sp-btn--sm { min-height: 2.25rem; padding: 0.25rem 0.9rem; font-size: var(--sp-text-sm); }
.sp-btn--lg { min-height: 3.25rem; padding: 0.65rem 1.75rem; font-size: var(--sp-text-md); }
.sp-btn--block { display: flex; width: 100%; }

/* cta */
.sp-btn--cta {
  background: var(--sp-color-primary);
  color: var(--sp-color-on-primary);
  border-radius: var(--sp-radius-pill);
}
.sp-btn--cta:hover { background: var(--sp-color-primary-hover); color: var(--sp-color-on-primary); }

/* border */
.sp-btn--border {
  color: var(--sp-color-text-strong);
  border-color: var(--sp-color-line-strong);
  border-radius: var(--sp-radius-pill);
}
.sp-btn--border:hover {
  background: var(--sp-color-primary-hover);
  border-color: var(--sp-color-primary-hover);
  color: var(--sp-color-on-primary);
}

/* brand: original used white text (low contrast); --sp-color-on-brand fixes it */
.sp-btn--brand {
  background: var(--sp-color-brand);
  color: var(--sp-color-on-brand);
  font-weight: var(--sp-font-weight-medium);
}
.sp-btn--brand:hover { background: var(--sp-color-brand-hover); color: var(--sp-color-on-brand); }

/* link */
.sp-btn--link {
  color: var(--sp-color-text-strong);
  font-weight: var(--sp-font-weight-medium);
}
.sp-btn--link:hover { color: var(--sp-color-primary); }

/* danger */
.sp-btn--danger { background: var(--sp-color-danger); color: #fff; }
.sp-btn--danger:hover { background: #a31818; color: #fff; }

/* circle */
.sp-btn--circle {
  width: var(--sp-control-h);
  height: var(--sp-control-h);
  padding: 0;
  border-radius: var(--sp-radius-full);
}

.sp-btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: sp-spin 0.75s linear infinite;
}
@keyframes sp-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .sp-btn__spinner { animation-duration: 3s; } }
</style>
