<script setup lang="ts">
/**
 * Cookie consent bar, visual layer only (cookie_bar.scss): fixed bottom, warm #EFE3D8, radius 2rem,
 * slides in with translateY. Consent logic (Consent Mode v2, versioned records, blocking before consent)
 * belongs to the CMP module and drives this component through props and events.
 */
defineProps<{ visible: boolean }>()
const emit = defineEmits<{ accept: []; reject: []; customize: [] }>()
</script>

<template>
  <aside class="sp-cookie" :class="{ 'is-visible': visible }" role="region" aria-label="Souhlas s cookies" :aria-hidden="!visible" :inert="!visible || undefined">
    <div class="sp-cookie__content">
      <div class="sp-cookie__text">
        <p class="sp-cookie__title">Používáme cookies</p>
        <p class="sp-cookie__message"><slot>Pro správné fungování webu používáme nezbytné cookies. Analytické a marketingové cookies použijeme jen s&nbsp;vaším souhlasem.</slot></p>
        <button type="button" class="sp-cookie__customize" @click="emit('customize')">Nastavit podrobně</button>
      </div>
      <div class="sp-cookie__actions">
        <SpButton variant="border" size="sm" class="sp-cookie__reject" @click="emit('reject')">Odmítnout</SpButton>
        <SpButton variant="cta" size="sm" @click="emit('accept')">Přijmout vše</SpButton>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sp-cookie {
  position: fixed;
  right: 0;
  bottom: 1rem;
  left: 0;
  z-index: var(--sp-z-cookie-bar);
  margin-inline: 1rem;
  color: var(--sp-color-text-strong);
  background: var(--sp-color-bg-warm-strong);
  border-radius: var(--sp-radius-lg);
  box-shadow: var(--sp-shadow-bar);
  transform: translateY(calc(100% + 100px));
  transition: transform var(--sp-duration) var(--sp-ease);
}
.sp-cookie.is-visible { transform: translateY(0); }
.sp-cookie__content { display: flex; flex-direction: column; gap: var(--sp-space-3); padding: var(--sp-space-3) var(--sp-space-4); }
.sp-cookie__title { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-xl); font-weight: var(--sp-font-weight-semibold); }
.sp-cookie__message { margin: 0 0 var(--sp-space-2); font-size: var(--sp-text-sm); }
.sp-cookie__customize { padding: 0; font-size: 0.9rem; font-weight: var(--sp-font-weight-medium); color: var(--sp-color-text-warm); text-decoration: underline; background: none; border: 0; }
.sp-cookie__customize:hover { color: var(--sp-color-text-warm-hover); }
.sp-cookie__actions { display: flex; gap: var(--sp-space-2); }
.sp-cookie__actions > * { flex: 1; min-width: 100px; }
.sp-cookie__reject { border-color: var(--sp-color-primary); }
@media (min-width: 768px) {
  .sp-cookie { margin-inline: 2rem; }
  .sp-cookie__content { flex-direction: row; align-items: center; justify-content: space-between; }
  .sp-cookie__actions > * { flex: none; }
}
</style>
