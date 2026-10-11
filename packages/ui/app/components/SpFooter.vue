<script setup lang="ts">
/** Footer (old _footer): hairline top border, copyright left, legal links right. Links are slotted. */
defineProps<{ copyright: string }>()
</script>

<template>
  <footer class="sp-footer">
    <div class="sp-container sp-footer__bar">
      <span class="sp-footer__text">{{ copyright }}</span>
      <nav class="sp-footer__links" aria-label="Právní informace"><slot /></nav>
    </div>
  </footer>
</template>

<style scoped>
.sp-footer { margin-top: var(--sp-space-4); border-top: 1px solid var(--sp-color-line); padding-block: var(--sp-space-3); }
.sp-footer__bar { display: flex; flex-direction: column; align-items: center; gap: var(--sp-space-2); text-align: center; }
.sp-footer__text { font-size: var(--sp-text-md); }
.sp-footer__links { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--sp-space-2) var(--sp-space-3); }
.sp-footer__links :deep(a), .sp-footer__links :deep(button) {
  color: var(--sp-color-text-strong);
  font-weight: var(--sp-font-weight-regular);
  text-decoration: none;
  background: none;
  border: 0;
  padding: 0;
}
.sp-footer__links :deep(a:hover), .sp-footer__links :deep(button:hover) { text-decoration: underline; }
@media (min-width: 768px) {
  .sp-footer__bar { flex-direction: row; justify-content: space-between; }
}
</style>
