<script setup lang="ts">
import { budget as allBudget, events, guests as allGuests, schedule as allSchedule, tasks as allTasks } from '~/data/mock/account'

definePageMeta({ layout: 'panel', panel: 'account' })
useSeoMeta({ title: 'Akce – SelfPlan', robots: 'noindex, nofollow' })

const route = useRoute()
const ev = events.find((e) => e.id === Number(route.params.id))
if (!ev) throw createError({ statusCode: 404, statusMessage: 'Akce nenalezena' })

const tab = ref('prehled')
const tasks = ref(allTasks.filter((t) => t.eventId === ev.id).map((t) => ({ ...t })))
const budget = allBudget.filter((b) => b.eventId === ev.id)
const guests = ref(allGuests.filter((g) => g.eventId === ev.id))
const schedule = allSchedule.filter((s) => s.eventId === ev.id)

const doneCount = computed(() => tasks.value.filter((t) => t.done).length)
const progress = computed(() => (tasks.value.length ? Math.round((doneCount.value / tasks.value.length) * 100) : null))
const sum = (k: 'planned' | 'offered' | 'confirmed' | 'actual') => budget.reduce((a, b) => a + (b[k] ?? 0), 0)
const guestStats = computed(() => {
  const by = (s: string) => guests.value.filter((g) => g.status === s).reduce((a, g) => a + g.persons, 0)
  return { yes: by('potvrzen'), no: by('odmitl'), wait: by('ceka') + by('pozvan'), total: guests.value.reduce((a, g) => a + g.persons, 0) }
})
const tabs = computed(() => [
  { id: 'prehled', label: 'Přehled' },
  { id: 'ukoly', label: 'Úkoly', badge: tasks.value.length - doneCount.value || undefined },
  { id: 'rozpocet', label: 'Rozpočet' },
  { id: 'hoste', label: 'Hosté' },
  { id: 'harmonogram', label: 'Harmonogram' },
  { id: 'dodavatele', label: 'Dodavatelé' },
])
const guestStatus = { pozvan: ['Pozván', 'neutral'], potvrzen: ['Potvrzeno', 'success'], odmitl: ['Odmítl', 'danger'], ceka: ['Čeká', 'warning'] } as const
const newTask = ref('')
function addTask() {
  if (!newTask.value.trim()) return
  tasks.value.push({ id: Date.now(), eventId: ev!.id, title: newTask.value, due: '', category: 'Vlastní', done: false, auto: false })
  newTask.value = ''
}
const used = computed(() => sum('actual') + sum('confirmed'))
</script>

<template>
  <div>
    <nav class="crumbs" aria-label="Drobečková navigace"><NuxtLink to="/ucet/akce">Moje akce</NuxtLink> / <span>{{ ev.name }}</span></nav>
    <SpPageHeader :title="ev.name" :text="`${ev.date ? fmtDateLong(ev.date) : 'Termín zatím neurčen'} · ${ev.place} · ${ev.guests} hostů`">
      <SpButton variant="border" to="/ucet/eventove-weby">Eventový web</SpButton>
      <SpButton to="/dodavatele">Najít dodavatele</SpButton>
    </SpPageHeader>

    <SpTabs v-model="tab" id-prefix="ev" :items="tabs" label="Části akce" />

    <section v-show="tab === 'prehled'" id="ev-panel-prehled" role="tabpanel" aria-labelledby="ev-tab-prehled">
      <div class="sp-grid sp-grid--cols-2 sp-grid--lg-4 sp-mb-4">
        <SpStat :value="progress === null ? '–' : `${progress} %`" label="Úkoly splněny" :hint="`${doneCount} z ${tasks.length}`" icon="fa6-regular:square-check" />
        <SpStat :value="money(ev.budget)" label="Cílový rozpočet" :hint="`Potvrzeno ${money(used)}`" icon="fa6-solid:wallet" />
        <SpStat :value="guestStats.yes" label="Potvrzení hosté" :hint="`z ${guestStats.total} pozvaných osob`" icon="fa6-solid:users" />
        <SpStat :value="ev.date ? `${daysUntil(ev.date)} dní` : '–'" label="Do akce" icon="fa6-regular:clock" />
      </div>
      <SpSurface variant="warm">
        <h2 class="h2">Doporučený další krok</h2>
        <p class="sp-mb-2">{{ tasks.find((t) => !t.done)?.title ?? 'Všechny úkoly jsou hotové.' }}</p>
        <SpButton size="sm" @click="tab = 'ukoly'">Zobrazit úkoly</SpButton>
      </SpSurface>
    </section>

    <section v-show="tab === 'ukoly'" id="ev-panel-ukoly" role="tabpanel" aria-labelledby="ev-tab-ukoly">
      <SpProgress :value="progress" label="Postup úkolů" class="sp-mb-3" />
      <ul class="tasks">
        <li v-for="t in tasks" :key="t.id" :class="{ 'is-done': t.done }">
          <SpCheckbox v-model="t.done"><span class="task__title">{{ t.title }}</span></SpCheckbox>
          <span class="task__meta"><SpBadge variant="neutral">{{ t.category }}</SpBadge> <SpBadge v-if="t.auto" variant="home">Doporučeno</SpBadge> <span v-if="t.due" class="sp-text-xs sp-text-muted">do {{ fmtDate(t.due) }}</span></span>
        </li>
      </ul>
      <form class="add" @submit.prevent="addTask"><SpInput v-model="newTask" label="Nový úkol" /><SpButton type="submit" variant="border">Přidat</SpButton></form>
      <p class="sp-text-xs sp-text-muted">Ruční úpravy se při opětovném generování doporučených úkolů zachovají.</p>
    </section>

    <section v-show="tab === 'rozpocet'" id="ev-panel-rozpocet" role="tabpanel" aria-labelledby="ev-tab-rozpocet">
      <SpTable striped caption="Rozpočet">
        <thead><tr><th>Kategorie</th><th>Plán</th><th>Nabídka</th><th>Potvrzeno</th><th>Skutečně</th><th>Dodavatel</th></tr></thead>
        <tbody>
          <tr v-for="b in budget" :key="b.id"><td>{{ b.category }}</td><td>{{ money(b.planned) }}</td><td>{{ money(b.offered) }}</td><td>{{ money(b.confirmed) }}</td><td>{{ money(b.actual) }}</td><td>{{ b.supplier ?? '–' }}</td></tr>
          <tr class="total"><td>Celkem</td><td>{{ money(sum('planned')) }}</td><td>{{ money(sum('offered')) }}</td><td>{{ money(sum('confirmed')) }}</td><td>{{ money(sum('actual')) }}</td><td></td></tr>
        </tbody>
      </SpTable>
      <p class="sp-text-xs sp-text-muted">Plán, nabídka, potvrzená a skutečná částka jsou odlišeny. Změna počtu hostů nabídne přepočet, potvrzenou cenu nikdy sama nepřepíše.</p>
    </section>

    <section v-show="tab === 'hoste'" id="ev-panel-hoste" role="tabpanel" aria-labelledby="ev-tab-hoste">
      <p class="sp-text-sm sp-mb-3">Potvrzeno {{ guestStats.yes }} · čeká {{ guestStats.wait }} · odmítlo {{ guestStats.no }} osob. Seznam hostů vidíte jen vy.</p>
      <SpTable striped caption="Hosté">
        <thead><tr><th>Jméno</th><th>Skupina</th><th>Osob</th><th>Stav</th><th>Poznámka</th></tr></thead>
        <tbody><tr v-for="g in guests" :key="g.id"><td>{{ g.name }}</td><td>{{ g.group }}</td><td>{{ g.persons }}</td><td><SpBadge :variant="guestStatus[g.status][1]">{{ guestStatus[g.status][0] }}</SpBadge></td><td>{{ g.diet ?? '' }}</td></tr></tbody>
      </SpTable>
    </section>

    <section v-show="tab === 'harmonogram'" id="ev-panel-harmonogram" role="tabpanel" aria-labelledby="ev-tab-harmonogram">
      <ol class="timeline">
        <li v-for="s in schedule" :key="s.id"><time>{{ s.time }}</time><div><strong>{{ s.title }}</strong><span v-if="s.place" class="sp-text-sm sp-text-muted"> · {{ s.place }}</span></div></li>
      </ol>
    </section>

    <section v-show="tab === 'dodavatele'" id="ev-panel-dodavatele" role="tabpanel" aria-labelledby="ev-tab-dodavatele">
      <SpEmpty title="Dodavatelé akce" text="Vybrané dodavatele a jejich nabídky najdete u poptávek. Odtud je můžete přidat k akci a do rozpočtu."><SpButton to="/ucet/poptavky">Moje poptávky</SpButton></SpEmpty>
    </section>
  </div>
</template>

<style scoped>
.crumbs { margin-bottom: var(--sp-space-2); font-size: var(--sp-text-sm); color: var(--sp-color-text-muted); }
.h2 { margin: 0 0 var(--sp-space-1); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.tasks { margin: 0 0 var(--sp-space-3); padding: 0; list-style: none; }
.tasks li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-space-2); padding: var(--sp-space-2) 0; border-bottom: 1px solid var(--sp-color-line); }
.tasks li :deep(.sp-check) { margin: 0; }
.tasks li.is-done .task__title { text-decoration: line-through; color: var(--sp-color-text-muted); }
.add { display: flex; gap: var(--sp-space-2); align-items: flex-start; max-width: 32rem; }
.add :deep(.sp-input) { flex: 1; margin: 0; }
.total td { font-weight: var(--sp-font-weight-bold); }
.timeline { margin: 0; padding: 0; list-style: none; border-left: 2px solid var(--sp-color-brand); }
.timeline li { display: flex; gap: var(--sp-space-3); padding: var(--sp-space-2) 0 var(--sp-space-2) var(--sp-space-3); }
.timeline time { min-width: 3.5rem; font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-brand-strong); }
</style>
