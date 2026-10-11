<script setup lang="ts">
/** `home` is the original .badge-home (soft beige). Others map to Bootstrap badge colors used in admin. */
withDefaults(defineProps<{ variant?: 'home' | 'neutral' | 'success' | 'danger' | 'warning' }>(), { variant: 'home' })
</script>

<template>
  <span class="sp-badge" :class="`sp-badge--${variant}`"><slot /></span>
</template>

<style scoped>
.sp-badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: var(--sp-font-weight-bold);
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}
.sp-badge--home { background: var(--sp-color-brand-soft); color: var(--sp-color-brand-strong); }
.sp-badge--neutral { background: var(--sp-gray-500); color: #fff; }
.sp-badge--success { background: var(--sp-color-success); color: #fff; }
.sp-badge--danger { background: var(--sp-color-danger); color: #fff; }
.sp-badge--warning { background: var(--sp-color-warning-bg); color: var(--sp-color-warning); }
</style>
