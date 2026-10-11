<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Přihlášení – SelfPlan', robots: 'noindex' })

const route = useRoute()
const { login } = useMockSession()
const form = reactive({ email: '', password: '' })
const error = ref('')
const busy = ref(false)

// Dummy auth: any credentials work. "dodavatel" / "admin" in the e-mail pick that role for previewing.
async function submit() {
  error.value = ''
  if (!form.email.includes('@')) return (error.value = 'Zadejte platnou e-mailovou adresu.')
  if (!form.password) return (error.value = 'Zadejte heslo.')
  busy.value = true
  const role = form.email.includes('admin') ? 'admin' : form.email.includes('dodavatel') ? 'supplier' : 'customer'
  login(role)
  const back = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : null
  await navigateTo(back ?? { customer: '/ucet', supplier: '/dodavatel', admin: '/admin' }[role])
}
</script>

<template>
  <div>
    <SpHeading :level="1" class="auth-title">Přihlášení</SpHeading>
    <p class="auth-text">Nemáte účet? <NuxtLink to="/registrace">Zaregistrujte se zdarma</NuxtLink></p>

    <SpAlert v-if="error" variant="danger">{{ error }}</SpAlert>
    <SpAlert v-else variant="info" class="sp-mb-3">Náhled: použijte libovolný e-mail a heslo. E-mail s „dodavatel“ nebo „admin“ otevře danou roli.</SpAlert>

    <form novalidate @submit.prevent="submit">
      <SpInput v-model="form.email" label="E-mail" type="email" autocomplete="email" name="email" required />
      <SpPasswordInput v-model="form.password" label="Heslo" autocomplete="current-password" name="password" required />
      <div class="auth-actions">
        <NuxtLink to="/zapomenute-heslo" class="sp-text-sm">Zapomněli jste heslo?</NuxtLink>
      </div>
      <SpButton type="submit" block :loading="busy">Přihlásit se</SpButton>
    </form>

    <p class="auth-or"><span>nebo</span></p>
    <SpButton variant="border" block @click="login('customer'); navigateTo('/ucet')"><SpIcon name="fa6-brands:google" /> Pokračovat přes Google</SpButton>
  </div>
</template>

<style scoped>
.auth-title { margin-bottom: var(--sp-space-2); }
.auth-text { margin-bottom: var(--sp-space-4); font-size: var(--sp-text-sm); }
.auth-actions { display: flex; justify-content: flex-end; margin-bottom: var(--sp-space-3); }
.auth-or { display: flex; align-items: center; gap: var(--sp-space-3); margin: var(--sp-space-4) 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.auth-or::before, .auth-or::after { content: ''; flex: 1; border-top: 1px solid var(--sp-color-line); }
</style>
