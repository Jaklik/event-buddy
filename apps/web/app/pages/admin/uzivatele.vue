<script setup lang="ts">
import { adminUsers } from '~/data/mock/admin'

definePageMeta({ layout: 'panel', panel: 'admin' })
useSeoMeta({ title: 'Uživatelé – Administrace', robots: 'noindex, nofollow' })
const q = ref('')
const f = ref('')
const list = computed(() => adminUsers.filter((u) => (!q.value || (u.email + u.name).toLowerCase().includes(q.value.toLowerCase())) && (!f.value || (f.value === 'unverified' ? !u.verified : u.status === f.value))))
const detail = ref<(typeof adminUsers)[number] | null>(null)
</script>

<template>
  <div>
    <SpPageHeader title="Uživatelé" text="Jeden účet může vlastnit více dodavatelských profilů. Hesla nelze zobrazit ani měnit, jen bezpečně resetovat." />
    <div class="bar"><SpInput v-model="q" label="Hledat e-mail nebo jméno" /><SpSelect v-model="f" label="Filtr" :options="[{ value: '', label: 'Všichni' }, { value: 'unverified', label: 'Neověřený e-mail' }, { value: 'podezřelý', label: 'Podezřelí' }]" /></div>
    <SpTable striped caption="Uživatelé">
      <thead><tr><th>E-mail</th><th>Jméno</th><th>Role</th><th>E-mail ověřen</th><th>Stav</th><th>Profily</th><th></th></tr></thead>
      <tbody><tr v-for="u in list" :key="u.id"><td>{{ u.email }}</td><td>{{ u.name }}</td><td>{{ u.roles.join(', ') }}</td><td>{{ u.verified ? 'ano' : 'ne' }}</td><td><SpBadge :variant="u.status === 'podezřelý' ? 'danger' : 'success'">{{ u.status }}</SpBadge></td><td>{{ u.profiles }}</td><td><SpButton size="sm" variant="border" @click="detail = u">Detail</SpButton></td></tr></tbody>
    </SpTable>
    <SpModal :model-value="!!detail" :title="detail?.name ?? ''" @update:model-value="detail = null">
      <dl v-if="detail" class="d"><dt>E-mail</dt><dd>{{ detail.email }}</dd><dt>Registrace</dt><dd>{{ fmtDate(detail.created) }}</dd><dt>Role</dt><dd>{{ detail.roles.join(', ') }}</dd><dt>Profily</dt><dd>{{ detail.profiles }}</dd></dl>
      <p class="sp-text-sm sp-text-secondary">Každá ruční změna se zapisuje do auditního logu (kdo, kdy, co, předchozí a nová hodnota).</p>
      <template #footer><SpButton variant="border" size="sm">Poslat reset hesla</SpButton><SpButton variant="danger" size="sm">Omezit účet</SpButton></template>
    </SpModal>
  </div>
</template>

<style scoped>
.bar { display: grid; gap: var(--sp-space-2); margin-bottom: var(--sp-space-3); }
@media (min-width: 768px) { .bar { grid-template-columns: 2fr 1fr; } }
.d { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem var(--sp-space-3); }
.d dt { color: var(--sp-color-text-muted); }
.d dd { margin: 0; }
</style>
