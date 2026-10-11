<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Registrace – SelfPlan', robots: 'noindex' })

const route = useRoute()
const { login } = useMockSession()
// Spec (Registrace v1.1): no role choice, no wizard; e-mail + password + terms, newsletter separate and unchecked, name optional.
const form = reactive({ email: '', password: '', terms: false, newsletter: false })
const errors = reactive<Record<string, string>>({})
const sent = ref(false)

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.email.includes('@')) errors.email = 'Zadejte platnou e-mailovou adresu.'
  if (form.password.length < 10) errors.password = 'Heslo musí mít alespoň 10 znaků.'
  if (!form.terms) errors.terms = 'Pro registraci je nutné potvrdit seznámení s obchodními podmínkami.'
  return Object.keys(errors).length === 0
}
function submit() {
  if (!validate()) return
  login('customer')
  sent.value = true
}
const supplierIntent = computed(() => route.query.typ === 'dodavatel')
</script>

<template>
  <div>
    <template v-if="!sent">
      <SpHeading :level="1" class="auth-title">{{ supplierIntent ? 'Registrace dodavatele' : 'Registrace' }}</SpHeading>
      <p class="auth-text">Máte účet? <NuxtLink to="/prihlaseni">Přihlaste se</NuxtLink></p>
      <p v-if="supplierIntent" class="auth-text">Po registraci vás provedeme založením dodavatelského profilu.</p>

      <form novalidate @submit.prevent="submit">
        <SpInput v-model="form.email" label="E-mail" type="email" autocomplete="email" name="email" required :error="errors.email" />
        <SpPasswordInput v-model="form.password" label="Heslo" autocomplete="new-password" name="password" required :error="errors.password" hint="Alespoň 10 znaků." />
        <SpCheckbox v-model="form.terms" :error="errors.terms">
          Seznámil/a jsem se s <NuxtLink to="/obchodni-podminky" target="_blank">obchodními podmínkami</NuxtLink> a <NuxtLink to="/ochrana-osobnich-udaju" target="_blank">informacemi o zpracování osobních údajů</NuxtLink>.
        </SpCheckbox>
        <SpCheckbox v-model="form.newsletter" label="Chci dostávat novinky e-mailem (nepovinné)" />
        <SpButton type="submit" block>Vytvořit účet</SpButton>
      </form>

      <p class="auth-or"><span>nebo</span></p>
      <SpButton variant="border" block @click="login('customer'); sent = true"><SpIcon name="fa6-brands:google" /> Registrovat přes Google</SpButton>
    </template>

    <template v-else>
      <SpHeading :level="1" class="auth-title">Ověřte svůj e-mail</SpHeading>
      <SpAlert variant="success">Poslali jsme ověřovací odkaz na <strong>{{ form.email || 'váš e-mail' }}</strong>. Platí 24 hodin.</SpAlert>
      <p class="sp-mt-3">Do ověření můžete portál prohlížet a používat plánovač, ale nemůžete odesílat poptávky ani zveřejňovat obsah (recenze, inzeráty, fotografie, dodavatelský profil).</p>
      <div class="sp-row sp-mt-3">
        <SpButton variant="border" @click="() => {}">Poslat odkaz znovu</SpButton>
        <SpButton :to="supplierIntent ? '/dodavatel/profily/novy' : '/ucet'">{{ supplierIntent ? 'Založit profil' : 'Pokračovat' }}</SpButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.auth-title { margin-bottom: var(--sp-space-2); }
.auth-text { margin-bottom: var(--sp-space-3); font-size: var(--sp-text-sm); }
.auth-or { display: flex; align-items: center; gap: var(--sp-space-3); margin: var(--sp-space-4) 0; font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.auth-or::before, .auth-or::after { content: ''; flex: 1; border-top: 1px solid var(--sp-color-line); }
</style>
