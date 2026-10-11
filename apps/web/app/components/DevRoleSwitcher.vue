<script setup lang="ts">
/** Frontend-phase helper: switch the fake session role to preview guest / customer / supplier / admin views. Not shown in production. */
const { role } = useMockSession()
const roles = [
  { v: 'guest', l: 'Host' },
  { v: 'customer', l: 'Zákazník' },
  { v: 'supplier', l: 'Dodavatel' },
  { v: 'admin', l: 'Admin' },
] as const
const collapsed = ref(true)
</script>

<template>
  <aside class="dev" aria-label="Přepínač role (vývojový nástroj)">
    <button type="button" class="dev__toggle" :aria-expanded="!collapsed" @click="collapsed = !collapsed">
      <SpIcon name="fa6-solid:user-gear" /> <span>Role: {{ roles.find((r) => r.v === role)?.l }}</span>
    </button>
    <div v-show="!collapsed" class="dev__menu">
      <button v-for="r in roles" :key="r.v" type="button" :class="{ 'is-on': role === r.v }" @click="role = r.v; collapsed = true">{{ r.l }}</button>
    </div>
  </aside>
</template>

<style scoped>
.dev { position: fixed; left: 0.75rem; bottom: 0.75rem; z-index: 1100; font-size: 0.8rem; }
.dev__toggle { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; color: #fff; background: #1f2835; border: 0; border-radius: 999px; box-shadow: 0 2px 8px rgb(0 0 0 / 0.3); }
.dev__menu { display: flex; flex-direction: column; margin-bottom: 0.4rem; position: absolute; bottom: 100%; left: 0; background: #fff; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgb(0 0 0 / 0.2); }
.dev__menu button { padding: 0.5rem 1rem; text-align: left; background: none; border: 0; white-space: nowrap; }
.dev__menu button:hover { background: #f0f0f0; }
.dev__menu button.is-on { font-weight: 700; background: #eadbcd; }
</style>
