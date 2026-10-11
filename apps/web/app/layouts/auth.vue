<script setup lang="ts">
/** Login / registration layout (SessionPage): form column left, billboard image with warm gradient right (hidden < 768px). */
const config = useRuntimeConfig()
</script>

<template>
  <div class="auth">
    <div class="auth__form">
      <NuxtLink to="/" class="auth__logo" aria-label="SelfPlan – domů"><img src="/brand/logo.svg" alt="SelfPlan" width="180" height="48" /></NuxtLink>
      <main id="main" class="auth__main"><slot /></main>
    </div>
    <aside class="auth__image" aria-hidden="true">
      <img src="/dev/session-new.jpg" alt="" />
      <p class="auth__quote">Naplánujte svou událost jednoduše.</p>
    </aside>
    <DevRoleSwitcher v-if="config.public.mock" />
  </div>
</template>

<style scoped>
.auth { display: grid; min-height: 100vh; }
.auth__form { display: flex; flex-direction: column; padding: var(--sp-space-4); }
.auth__logo { display: inline-block; margin: var(--sp-space-3) 0 var(--sp-space-5); }
.auth__logo img { width: 50%; max-width: 12rem; height: auto; }
.auth__main { width: 100%; max-width: 28rem; }
.auth__image { display: none; position: relative; overflow: hidden; }
.auth__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.auth__image::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(0 0 0 / 0) -1.23%, var(--sp-color-brand-deep) 80%); }
.auth__quote { position: absolute; z-index: 2; left: 0; right: 0; top: 80%; margin: auto; font-family: var(--sp-font-heading); font-size: var(--sp-text-3xl); font-weight: var(--sp-font-weight-light); text-align: center; color: var(--sp-color-text-strong); }
@media (min-width: 768px) { .auth { grid-template-columns: 4fr 8fr; } .auth__image { display: block; } }
</style>
