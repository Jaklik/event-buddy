<script setup lang="ts">
/**
 * Panel layout for the logged-in areas: public header + side navigation + content.
 * The nav is chosen by `definePageMeta({ panel: 'account' | 'supplier' | 'admin' })`.
 * Access is checked here with the fake session; real auth replaces it later.
 */
interface SideNavItem { label: string; to: string; icon?: string; badge?: number | string; exact?: boolean }

const route = useRoute()
const config = useRuntimeConfig()
const { role, displayName, logout } = useMockSession()
const panel = computed(() => (route.meta.panel as 'account' | 'supplier' | 'admin') ?? 'account')

const navs: Record<string, { title: string; items: SideNavItem[] }> = {
  account: {
    title: 'Můj účet',
    items: [
      { label: 'Přehled', to: '/ucet', icon: 'fa6-solid:house', exact: true },
      { label: 'Moje akce', to: '/ucet/akce', icon: 'fa6-regular:calendar-check' },
      { label: 'Oblíbení', to: '/ucet/oblibeni', icon: 'fa6-regular:heart' },
      { label: 'Poptávky', to: '/ucet/poptavky', icon: 'fa6-regular:paper-plane' },
      { label: 'Zprávy', to: '/ucet/zpravy', icon: 'fa6-regular:comments', badge: 2 },
      { label: 'Recenze', to: '/ucet/recenze', icon: 'fa6-regular:star' },
      { label: 'Eventové weby', to: '/ucet/eventove-weby', icon: 'fa6-solid:desktop' },
      { label: 'Moje inzeráty', to: '/ucet/inzeraty', icon: 'fa6-solid:bag-shopping' },
      { label: 'Osobní údaje', to: '/ucet/osobni-udaje', icon: 'fa6-regular:id-card' },
      { label: 'Nastavení', to: '/ucet/nastaveni', icon: 'fa6-solid:gear' },
      { label: 'Podpora', to: '/ucet/podpora', icon: 'fa6-regular:circle-question' },
    ],
  },
  supplier: {
    title: 'Moje podnikání',
    items: [
      { label: 'Přehled', to: '/dodavatel', icon: 'fa6-solid:house', exact: true },
      { label: 'Moje profily', to: '/dodavatel/profily', icon: 'fa6-regular:building' },
      { label: 'Poptávky', to: '/dodavatel/poptavky', icon: 'fa6-regular:paper-plane', badge: 3 },
      { label: 'CRM / Zakázky', to: '/dodavatel/crm', icon: 'fa6-solid:users' },
      { label: 'Kalendář', to: '/dodavatel/kalendar', icon: 'fa6-regular:calendar' },
      { label: 'Služby a ceny', to: '/dodavatel/sluzby', icon: 'fa6-solid:tags' },
      { label: 'Recenze', to: '/dodavatel/recenze', icon: 'fa6-regular:star' },
      { label: 'Statistiky', to: '/dodavatel/statistiky', icon: 'fa6-solid:chart-column' },
      { label: 'Propagace', to: '/dodavatel/propagace', icon: 'fa6-solid:bullhorn' },
      { label: 'Nastavení', to: '/dodavatel/nastaveni', icon: 'fa6-solid:gear' },
    ],
  },
  admin: {
    title: 'Administrace',
    items: [
      { label: 'Dashboard', to: '/admin', icon: 'fa6-solid:gauge', exact: true },
      { label: 'Uživatelé', to: '/admin/uzivatele', icon: 'fa6-solid:users' },
      { label: 'Dodavatelé', to: '/admin/dodavatele', icon: 'fa6-regular:building', badge: 4 },
      { label: 'Poptávky', to: '/admin/poptavky', icon: 'fa6-regular:paper-plane' },
      { label: 'Reklama', to: '/admin/reklama', icon: 'fa6-solid:bullhorn', badge: 2 },
      { label: 'Platby', to: '/admin/platby', icon: 'fa6-solid:money-bill-transfer' },
      { label: 'Recenze', to: '/admin/recenze', icon: 'fa6-regular:star' },
      { label: 'Obsah a SEO', to: '/admin/obsah', icon: 'fa6-regular:newspaper' },
      { label: 'Inspirace a bazar', to: '/admin/moderace', icon: 'fa6-regular:images', badge: 5 },
      { label: 'Kategorie', to: '/admin/kategorie', icon: 'fa6-solid:sitemap' },
      { label: 'Parametry a filtry', to: '/admin/parametry', icon: 'fa6-solid:filter' },
      { label: 'Koordinace', to: '/admin/koordinace', icon: 'fa6-solid:clipboard-list' },
      { label: 'Bezpečnost', to: '/admin/bezpecnost', icon: 'fa6-solid:shield-halved' },
    ],
  },
}
const cur = computed(() => navs[panel.value]!)

const needed = computed(() => ({ account: ['customer', 'supplier', 'admin'], supplier: ['supplier', 'admin'], admin: ['admin'] })[panel.value])
const allowed = computed(() => needed.value.includes(role.value))
</script>

<template>
  <div class="panel-layout">
    <SpHeader :items="[{ label: 'Dodavatelé', to: '/dodavatele' }, { label: 'Plánování', to: '/planovac-akci' }, { label: 'Inspirace', to: '/inspirace' }, { label: 'Bazar', to: '/bazar' }]">
      <template #actions>
        <SpHeaderAction to="/" icon="fa6-solid:house">Web</SpHeaderAction>
        <SpHeaderAction icon="fa6-solid:right-from-bracket" @click="logout(); navigateTo('/')">Odhlásit</SpHeaderAction>
      </template>
    </SpHeader>

    <div class="sp-container panel-layout__body">
      <template v-if="allowed">
        <SpSideNav :items="cur.items" :title="panel === 'account' ? displayName : cur.title" :subtitle="panel === 'account' ? 'Zákaznický účet' : displayName" :label="cur.title" />
        <main id="main" class="panel-layout__main"><slot /></main>
      </template>
      <main v-else id="main" class="panel-layout__denied">
        <SpHeading :level="1">Přístup jen pro přihlášené</SpHeading>
        <p>Tato část vyžaduje jinou roli. V náhledu ji přepnete vlevo dole (Role), nebo se přihlaste.</p>
        <SpButton to="/prihlaseni">Přihlásit se</SpButton>
      </main>
    </div>
    <DevRoleSwitcher v-if="config.public.mock" />
  </div>
</template>

<style scoped>
.panel-layout { min-height: 100vh; background: var(--sp-color-bg); }
.panel-layout__body { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--sp-space-4); padding-block: var(--sp-space-4); align-items: start; }
.panel-layout__main { min-width: 0; }
.panel-layout__denied { padding-block: var(--sp-space-5); }
@media (min-width: 992px) { .panel-layout__body { grid-template-columns: 16rem minmax(0, 1fr); } }
</style>
