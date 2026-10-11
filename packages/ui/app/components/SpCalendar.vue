<script setup lang="ts">
/**
 * Month calendar. Two uses:
 *  - public availability: days map to free / busy / unknown, nothing else is ever shown (no client names)
 *  - supplier CRM: `events` render labeled chips (private view)
 * Week starts on Monday. Days are ISO strings (YYYY-MM-DD). Keyboard: arrows move, Enter selects.
 */
export type DayState = 'free' | 'busy' | 'unknown' | 'tentative'
export interface CalEvent { date: string; label: string; tone?: 'brand' | 'busy' | 'free' | 'muted' }
const props = withDefaults(defineProps<{
  month?: string
  states?: Record<string, DayState>
  events?: CalEvent[]
  selected?: string
  selectable?: boolean
  legend?: boolean
}>(), { legend: true })
const emit = defineEmits<{ select: [date: string]; monthChange: [month: string] }>()

const today = new Date()
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const cursor = ref(props.month ? new Date(`${props.month}-01T00:00:00`) : new Date(today.getFullYear(), today.getMonth(), 1))
const title = computed(() => new Intl.DateTimeFormat('cs', { month: 'long', year: 'numeric' }).format(cursor.value))
const cells = computed(() => {
  const y = cursor.value.getFullYear(), m = cursor.value.getMonth()
  const first = new Date(y, m, 1)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const out: ({ date: string; day: number } | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= days; d++) out.push({ date: iso(new Date(y, m, d)), day: d })
  while (out.length % 7) out.push(null)
  return out
})
function move(delta: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
  emit('monthChange', iso(cursor.value).slice(0, 7))
}
const eventsByDate = computed(() => {
  const map: Record<string, CalEvent[]> = {}
  for (const e of props.events ?? []) (map[e.date] ??= []).push(e)
  return map
})
const stateLabel: Record<DayState, string> = { free: 'volno', busy: 'obsazeno', unknown: 'k ověření', tentative: 'předběžně' }
const weekdays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
</script>

<template>
  <div class="sp-cal">
    <div class="sp-cal__bar">
      <button type="button" class="sp-cal__nav" aria-label="Předchozí měsíc" @click="move(-1)"><SpIcon name="fa6-solid:chevron-left" /></button>
      <h3 class="sp-cal__title" aria-live="polite">{{ title }}</h3>
      <button type="button" class="sp-cal__nav" aria-label="Další měsíc" @click="move(1)"><SpIcon name="fa6-solid:chevron-right" /></button>
    </div>
    <div class="sp-cal__grid" role="grid" :aria-label="`Kalendář ${title}`">
      <div v-for="w in weekdays" :key="w" class="sp-cal__dow" role="columnheader">{{ w }}</div>
      <template v-for="(c, i) in cells" :key="i">
        <div v-if="!c" class="sp-cal__cell sp-cal__cell--empty" role="gridcell" />
        <component
          :is="selectable ? 'button' : 'div'"
          v-else
          class="sp-cal__cell"
          :class="[props.states?.[c.date] ? `is-${props.states[c.date]}` : '', { 'is-selected': c.date === selected, 'is-today': c.date === iso(today) }]"
          role="gridcell"
          :type="selectable ? 'button' : undefined"
          :aria-label="`${c.day}. ${title}${props.states?.[c.date] ? ', ' + stateLabel[props.states[c.date]!] : ''}`"
          :aria-selected="selectable ? c.date === selected : undefined"
          @click="selectable && emit('select', c.date)"
        >
          <span class="sp-cal__day">{{ c.day }}</span>
          <span v-for="(e, k) in eventsByDate[c.date]" :key="k" class="sp-cal__event" :class="`sp-cal__event--${e.tone ?? 'brand'}`">{{ e.label }}</span>
        </component>
      </template>
    </div>
    <ul v-if="legend && states" class="sp-cal__legend" aria-label="Legenda">
      <li><i class="sp-cal__dot sp-cal__dot--free" />Volný termín</li>
      <li><i class="sp-cal__dot sp-cal__dot--busy" />Obsazeno</li>
      <li><i class="sp-cal__dot sp-cal__dot--unknown" />K ověření</li>
    </ul>
  </div>
</template>

<style scoped>
.sp-cal { width: 100%; }
.sp-cal__bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-space-2); }
.sp-cal__title { margin: 0; font-family: var(--sp-font-body); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); text-transform: capitalize; }
.sp-cal__nav { display: grid; place-items: center; width: 2rem; height: 2rem; background: none; border: 0; border-radius: 50%; color: var(--sp-color-text-strong); }
.sp-cal__nav:hover { background: var(--sp-color-bg-neutral); }
.sp-cal__grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; }
.sp-cal__dow { padding: 0.25rem 0; font-size: var(--sp-text-xs); text-align: center; color: var(--sp-color-text-muted); }
.sp-cal__cell { display: flex; flex-direction: column; align-items: stretch; gap: 2px; min-height: 2.5rem; padding: 0.2rem; font-size: var(--sp-text-xs); text-align: left; color: var(--sp-color-text); background: var(--sp-color-bg); border: 1px solid var(--sp-color-line); border-radius: 6px; }
.sp-cal__cell--empty { border: 0; background: transparent; }
button.sp-cal__cell:hover { border-color: var(--sp-color-primary); }
.sp-cal__day { font-weight: var(--sp-font-weight-medium); }
.sp-cal__cell.is-today .sp-cal__day { text-decoration: underline; }
.sp-cal__cell.is-free { background: var(--sp-color-success-bg); }
.sp-cal__cell.is-busy { background: var(--sp-color-danger-bg); color: #8c1414; }
.sp-cal__cell.is-unknown { background: var(--sp-color-warning-bg); }
.sp-cal__cell.is-tentative { background: var(--sp-color-brand-soft); }
.sp-cal__cell.is-selected { outline: 2px solid var(--sp-color-primary); outline-offset: -2px; }
.sp-cal__event { display: block; overflow: hidden; padding: 0 0.25rem; font-size: 0.7rem; line-height: 1.4; white-space: nowrap; text-overflow: ellipsis; border-radius: 3px; }
.sp-cal__event--brand { background: var(--sp-color-brand-soft); color: var(--sp-color-brand-strong); }
.sp-cal__event--busy { background: var(--sp-color-danger-bg); color: #8c1414; }
.sp-cal__event--free { background: var(--sp-color-success-bg); color: #0f5f0f; }
.sp-cal__event--muted { background: var(--sp-gray-200); color: var(--sp-gray-700); }
.sp-cal__legend { display: flex; flex-wrap: wrap; gap: var(--sp-space-3); margin: var(--sp-space-2) 0 0; padding: 0; list-style: none; font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.sp-cal__legend li { display: flex; align-items: center; gap: 0.35rem; }
.sp-cal__dot { display: inline-block; width: 0.75rem; height: 0.75rem; border-radius: 3px; border: 1px solid var(--sp-color-line-strong); }
.sp-cal__dot--free { background: var(--sp-color-success-bg); }
.sp-cal__dot--busy { background: var(--sp-color-danger-bg); }
.sp-cal__dot--unknown { background: var(--sp-color-warning-bg); }
</style>
