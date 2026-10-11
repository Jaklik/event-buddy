<script setup lang="ts">
import { reviews } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'supplier' })
useSeoMeta({ title: 'Recenze – SelfPlan', robots: 'noindex, nofollow' })
const list = reviews.filter((r) => r.supplierId === 1)
</script>

<template>
  <div>
    <SpPageHeader title="Recenze" text="Recenze na SelfPlanu a hodnocení Google jsou oddělená. Dodavatel může recenze komentovat podle pravidel moderace, nemůže je mazat." />
    <div class="sp-grid sp-grid--md-2">
      <div v-for="r in list" :key="r.id" class="rv">
        <SpReviewCard :author="r.author" :date="r.date" :text="r.text" :rating="r.rating" :context="r.kind === 'komunikace' ? 'Hodnocení komunikace' : 'Hodnocení realizace'" />
        <SpButton size="sm" variant="border">Odpovědět</SpButton>
        <SpButton size="sm" variant="link">Nahlásit recenzi</SpButton>
      </div>
    </div>
    <p class="sp-text-sm sp-text-secondary sp-mt-4">Google: <a href="https://www.google.com/maps" target="_blank" rel="noopener">Zobrazit profil na Google</a> (průměr a počet hodnocení se v první fázi neimportují).</p>
  </div>
</template>

<style scoped>
.rv { display: grid; gap: var(--sp-space-2); justify-items: start; }
.rv > :first-child { width: 100%; }
</style>
