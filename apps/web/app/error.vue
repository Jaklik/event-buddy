<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (is404.value ? 'Stránka nenalezena | SelfPlan' : 'Chyba | SelfPlan'), robots: 'noindex, nofollow' })
const handle = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="err">
    <NuxtLink to="/" class="err__logo" aria-label="SelfPlan – domů"><img src="/brand/logo.svg" alt="SelfPlan" width="160" height="43"></NuxtLink>
    <SpHeading :level="1">{{ is404 ? 'Stránku jsme nenašli' : 'Něco se pokazilo' }}</SpHeading>
    <p class="sp-text-secondary">{{ is404 ? 'Adresa neexistuje nebo byla přesunuta.' : 'Zkuste to prosím znovu za chvíli.' }}</p>
    <div class="sp-row sp-row--center"><SpButton @click="handle">Na úvodní stránku</SpButton><SpButton variant="border" to="/dodavatele">Najít dodavatele</SpButton></div>
  </div>
</template>

<style scoped>
.err { display: grid; justify-items: center; gap: var(--sp-space-3); padding: var(--sp-space-5) var(--sp-space-3); text-align: center; }
.err__logo { margin-bottom: var(--sp-space-4); }
</style>
