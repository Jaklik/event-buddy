<script setup lang="ts">
/** Bottom info row: brand, verified operator identification (from one shared config), contact link and copyright. */
defineProps<{ operator: string; ico: string; contactTo?: string }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="sp-footer">
    <div class="sp-container sp-footer__bar">
      <div class="sp-footer__brand"><img src="/brand/logo.svg" alt="SelfPlan" width="90" height="24"><span>© {{ year }} {{ operator }}, IČO {{ ico }}</span></div>
      <nav class="sp-footer__links" aria-label="Kontakt"><NuxtLink :to="contactTo ?? '/kontakt'">Kontakt</NuxtLink><slot /></nav>
    </div>
  </footer>
</template>

<style scoped>
.sp-footer { border-top: 1px solid var(--sp-color-line); padding-block: var(--sp-space-3); }
.sp-footer__bar { display: flex; flex-direction: column; align-items: flex-start; gap: var(--sp-space-2); font-size: var(--sp-text-sm); }
.sp-footer__brand { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-space-2) var(--sp-space-3); color: var(--sp-color-text-secondary); }
.sp-footer__brand img { height: auto; }
.sp-footer__links { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); }
.sp-footer__links a { display: inline-flex; align-items: center; min-height: 2.5rem; color: var(--sp-color-primary); }
@media (min-width: 768px) { .sp-footer__bar { flex-direction: row; align-items: center; justify-content: space-between; } }
</style>
