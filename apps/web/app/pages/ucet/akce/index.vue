<script setup lang="ts">
import { events } from '~/data/mock/account'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Moje akce – SelfPlan', robots: 'noindex, nofollow' })

const createOpen = ref(false)
const form = reactive({ name: '', type: 'svatba', date: '' })
const typeOptions = [{ value: 'svatba', label: 'Svatba' }, { value: 'narozeniny', label: 'Narozeniny' }, { value: 'oslava', label: 'Rodinná oslava' }, { value: 'firemni', label: 'Firemní akce' }, { value: 'vlastni', label: 'Vlastní typ' }]
const typeIcon: Record<string, string> = { svatba: 'fa6-solid:ring', narozeniny: 'fa6-solid:cake-candles', oslava: 'fa6-solid:champagne-glasses', firemni: 'fa6-solid:briefcase' }
</script>

<template>
  <div>
    <SpPageHeader title="Moje akce" text="Jedna akce je zdroj dat pro úkoly, rozpočet, hosty, harmonogram i eventový web.">
      <SpButton @click="createOpen = true">Nová akce</SpButton>
    </SpPageHeader>

    <div class="sp-grid sp-grid--md-2">
      <NuxtLink v-for="e in events" :key="e.id" :to="`/ucet/akce/${e.id}`" class="ev">
        <SpCircleIcon size="3rem" :icon="typeIcon[e.type] ?? 'fa6-solid:star'" />
        <div class="ev__body">
          <h2>{{ e.name }}</h2>
          <p><SpIcon name="fa6-regular:calendar" /> {{ e.date ? fmtDateLong(e.date) : 'Termín zatím neurčen' }} · <SpIcon name="fa6-solid:users" /> {{ e.guests }} hostů</p>
          <SpProgress :value="e.progress || null" label="Postup úkolů" />
        </div>
      </NuxtLink>
    </div>

    <SpModal v-model="createOpen" title="Nová akce">
      <form class="sp-stack" @submit.prevent="createOpen = false; navigateTo('/ucet/akce/1')">
        <SpInput v-model="form.name" label="Název akce" required />
        <SpSelect v-model="form.type" label="Typ akce" :options="typeOptions" />
        <SpInput v-model="form.date" label="Datum (můžete doplnit později)" type="date" hint="Termín může být přibližný nebo zatím neznámý." />
        <SpButton type="submit">Vytvořit akci</SpButton>
      </form>
    </SpModal>
  </div>
</template>

<style scoped>
.ev { display: flex; gap: var(--sp-space-3); align-items: center; padding: var(--sp-space-3); color: inherit; text-decoration: none; background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-md); transition: box-shadow var(--sp-duration) var(--sp-ease); }
.ev:hover { box-shadow: var(--sp-shadow-card); color: inherit; }
.ev__body { flex: 1; min-width: 0; }
.ev h2 { margin: 0; font-family: var(--sp-font-heading); font-size: var(--sp-text-lg); font-weight: var(--sp-font-weight-regular); }
.ev p { margin: 0.25rem 0 var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
</style>
