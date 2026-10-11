<script setup lang="ts">
import { events, inquiries, notifications, tasks } from '~/data/mock/account'
import { categoryLabel, suppliers } from '~/data/mock/suppliers'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Můj účet – SelfPlan', robots: 'noindex, nofollow' })

const { displayName } = useMockSession()
const favorites = useFavorites()
const firstName = computed(() => displayName.value.split(' ')[0])

const active = events[0]!
const eventTasks = tasks.filter((t) => t.eventId === active.id)
const doneCount = eventTasks.filter((t) => t.done).length
const nextTask = eventTasks.filter((t) => !t.done).sort((a, b) => a.due.localeCompare(b.due))[0]
const unread = notifications.filter((n) => !n.read).length
const activeInquiries = inquiries.filter((i) => !['odmitnuta', 'uzavrena'].includes(i.status)).length
const recommended = suppliers.filter((s) => s.categoryCode === 'organization_and_coordination' || s.vip).slice(0, 3)
</script>

<template>
  <div>
    <SpPageHeader :title="`Vítejte, ${firstName}`" text="Přehled vašich akcí, poptávek a nových zpráv.">
      <SpButton to="/ucet/akce">Naplánovat novou akci</SpButton>
      <SpButton to="/dodavatele" variant="border">Najít dodavatele</SpButton>
    </SpPageHeader>

    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4 dash__stats">
      <SpStat :value="events.length" label="Akce" icon="fa6-regular:calendar-check" to="/ucet/akce" />
      <SpStat :value="favorites.ids.value.length" label="Oblíbení dodavatelé" icon="fa6-regular:heart" to="/ucet/oblibeni" />
      <SpStat :value="activeInquiries" label="Aktivní poptávky" icon="fa6-regular:paper-plane" to="/ucet/poptavky" />
      <SpStat :value="unread" label="Nepřečtené zprávy" icon="fa6-regular:comments" to="/ucet/zpravy" />
    </div>

    <div class="dash__cols">
      <SpSurface variant="card" class="dash__panel">
        <header class="dash__panel-head">
          <h2>Aktivní akce</h2>
          <NuxtLink to="/ucet/akce/1" class="sp-text-sm">Otevřít plánovač</NuxtLink>
        </header>
        <h3 class="dash__event">{{ active.name }}</h3>
        <p class="dash__event-meta">
          <span><SpIcon name="fa6-regular:calendar" /> {{ fmtDateLong(active.date!) }} (za {{ daysUntil(active.date!) }} dní)</span>
          <span><SpIcon name="fa6-solid:location-dot" /> {{ active.place }}</span>
          <span><SpIcon name="fa6-solid:users" /> {{ active.guests }} hostů</span>
        </p>
        <SpProgress :value="eventTasks.length ? Math.round((doneCount / eventTasks.length) * 100) : null" label="Postup úkolů" />
        <p class="dash__next" v-if="nextTask"><strong>Nejbližší úkol:</strong> {{ nextTask.title }} <span class="sp-text-muted">(do {{ fmtDate(nextTask.due) }})</span></p>
      </SpSurface>

      <SpSurface variant="card" class="dash__panel">
        <header class="dash__panel-head"><h2>Poslední aktivita</h2></header>
        <ul class="dash__activity">
          <li v-for="n in notifications" :key="n.id" :class="{ 'is-unread': !n.read }">
            <NuxtLink :to="n.to"><strong>{{ n.title }}</strong><span>{{ n.text }}</span><small>{{ n.at }}</small></NuxtLink>
          </li>
        </ul>
      </SpSurface>
    </div>

    <h2 class="dash__h2">Rychlé akce</h2>
    <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4">
      <SpFeatureCard title="Vyhledat dodavatele" text="Podle termínu a lokality." icon="fa6-solid:magnifying-glass" to="/dodavatele" />
      <SpFeatureCard title="Vytvořit akci" text="Checklist, rozpočet, hosté." icon="fa6-regular:calendar-plus" to="/ucet/akce" />
      <SpFeatureCard title="Odeslat poptávku" text="Vyberte dodavatele a pošlete poptávku." icon="fa6-regular:paper-plane" to="/dodavatele" />
      <SpFeatureCard title="Napsat recenzi" text="Ohodnoťte dodavatele, se kterým jste spolupracovali." icon="fa6-regular:star" to="/ucet/recenze" />
    </div>

    <h2 class="dash__h2">Doporučení dodavatelé</h2>
    <div class="sp-grid sp-grid--md-3">
      <SpSupplierCard v-for="s in recommended" :key="s.id" :to="`/dodavatele/${s.slug}`" :name="s.name" :image="s.images[0]" :category="categoryLabel(s.categoryCode)" :location="`${s.city}, ${s.region}`" :summary="s.summary" :rating="s.rating ?? undefined" :rating-count="s.reviewCount" :price-level="s.priceLevel" :favorite="favorites.has(s.id)" @toggle-favorite="favorites.toggle(s.id)" />
    </div>

    <p class="dash__help">Potřebujete poradit? <NuxtLink to="/poradna">Poradna</NuxtLink> · <NuxtLink to="/ucet/podpora">Kontaktovat podporu</NuxtLink></p>
  </div>
</template>

<style scoped>
.dash__stats { margin-bottom: var(--sp-space-4); }
.dash__cols { display: grid; gap: var(--sp-space-3); margin-bottom: var(--sp-space-4); }
@media (min-width: 992px) { .dash__cols { grid-template-columns: 3fr 2fr; } }
.dash__panel { padding: var(--sp-space-3) var(--sp-space-4); }
.dash__panel-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--sp-space-2); }
.dash__panel-head h2 { margin: 0; font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.dash__event { margin: 0 0 var(--sp-space-1); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
.dash__event-meta { display: flex; flex-wrap: wrap; gap: var(--sp-space-1) var(--sp-space-3); margin: 0 0 var(--sp-space-3); font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
.dash__next { margin: var(--sp-space-3) 0 0; font-size: var(--sp-text-sm); }
.dash__activity { margin: 0; padding: 0; list-style: none; }
.dash__activity li { border-top: 1px solid var(--sp-color-line); }
.dash__activity li:first-child { border-top: 0; }
.dash__activity a { display: grid; gap: 0.1rem; padding: var(--sp-space-2) 0; color: inherit; text-decoration: none; font-size: var(--sp-text-sm); }
.dash__activity li.is-unread strong::before { content: ''; display: inline-block; width: 0.5rem; height: 0.5rem; margin-right: 0.4rem; background: var(--sp-color-primary); border-radius: 50%; }
.dash__activity small { color: var(--sp-color-text-muted); }
.dash__h2 { margin: var(--sp-space-5) 0 var(--sp-space-3); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
.dash__help { margin-top: var(--sp-space-5); font-size: var(--sp-text-sm); color: var(--sp-color-text-secondary); }
</style>
