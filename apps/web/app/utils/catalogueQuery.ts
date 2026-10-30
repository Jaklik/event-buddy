import type { CatalogueQuery, AvailabilityMode, SortKey } from '~/repositories/suppliers'
import type { PriceLevel } from '~/data/mock/types'
import { attrDefs, attrsFor, catByCode, subLabel } from '~/data/mock/taxonomy'

/** Catalogue state lives in the URL. `a_<key>` params carry category-specific attribute filters. */
export type RawQuery = Record<string, string | string[] | null | undefined>
const one = (q: RawQuery, k: string) => (typeof q[k] === 'string' ? (q[k] as string) : '')

/** Params that survive a category switch (spec: keep date and location, drop incompatible filters). */
export const COMMON_KEYS = ['region', 'typ', 'date', 'dostupnost', 'vip', 'sort']

export function parseCatalogueQuery(raw: RawQuery, category?: string): CatalogueQuery {
  const attrs: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw)) if (k.startsWith('a_') && typeof v === 'string' && v) attrs[k.slice(2)] = v
  // keep only attributes valid for the current category
  const valid = new Set(attrsFor(category, one(raw, 'podkategorie') || undefined, 'filter').map((a) => a.key))
  for (const k of Object.keys(attrs)) if (!valid.has(k)) delete attrs[k]
  const date = one(raw, 'date')
  return {
    category,
    sub: one(raw, 'podkategorie') || undefined,
    region: one(raw, 'region') || undefined,
    eventType: one(raw, 'typ') || undefined,
    date: date || undefined,
    availability: (date ? (one(raw, 'dostupnost') || 'all') : 'all') as AvailabilityMode,
    priceLevels: one(raw, 'cena').split(',').filter(Boolean) as PriceLevel[],
    vipOnly: one(raw, 'vip') === '1',
    guests: Number(one(raw, 'hostu')) || undefined,
    attrs,
    sort: (one(raw, 'sort') || 'relevance') as SortKey,
    page: Number(one(raw, 'page')) || 1,
  }
}

export interface ActiveFilter { id: string; label: string; remove: Record<string, undefined> }

const eventLabels: Record<string, string> = { svatba: 'Svatba', narozeniny: 'Narozeniny', oslava: 'Oslava', firemni: 'Firemní akce' }
const availLabels: Record<string, string> = { free: 'Jen ověřeně volní', 'free-or-unknown': 'Volní i k ověření' }

export function activeFilters(raw: RawQuery, category?: string): ActiveFilter[] {
  const out: ActiveFilter[] = []
  const sub = one(raw, 'podkategorie')
  if (sub && category) out.push({ id: 'sub', label: subLabel(category, sub) ?? sub, remove: { podkategorie: undefined } })
  if (one(raw, 'region')) out.push({ id: 'region', label: one(raw, 'region'), remove: { region: undefined } })
  if (one(raw, 'typ')) out.push({ id: 'typ', label: eventLabels[one(raw, 'typ')] ?? one(raw, 'typ'), remove: { typ: undefined } })
  if (one(raw, 'date')) out.push({ id: 'date', label: `Termín ${new Intl.DateTimeFormat('cs').format(new Date(one(raw, 'date')))}`, remove: { date: undefined, dostupnost: undefined } })
  if (one(raw, 'dostupnost')) out.push({ id: 'dostupnost', label: availLabels[one(raw, 'dostupnost')] ?? '', remove: { dostupnost: undefined } })
  if (one(raw, 'cena')) out.push({ id: 'cena', label: `Cena ${one(raw, 'cena').split(',').join(' ')}`, remove: { cena: undefined } })
  if (one(raw, 'vip') === '1') out.push({ id: 'vip', label: 'Pouze VIP', remove: { vip: undefined } })
  if (one(raw, 'hostu')) out.push({ id: 'hostu', label: `${one(raw, 'hostu')} hostů`, remove: { hostu: undefined } })
  const valid = new Set(attrsFor(category, sub || undefined, 'filter').map((a) => a.key))
  for (const [k, v] of Object.entries(raw)) {
    if (!k.startsWith('a_') || typeof v !== 'string' || !v) continue
    const key = k.slice(2)
    const def = attrDefs.find((a) => a.key === key)
    if (!def || !valid.has(key)) continue
    const label = def.type === 'bool' || def.type === 'tri' ? def.label : def.type === 'number' ? `${def.label}: min. ${v}` : `${def.label}: ${v.split(',').map((x) => def.options?.find((o) => o.value === x)?.label ?? x).join(', ')}`
    out.push({ id: k, label, remove: { [k]: undefined } })
  }
  return out
}

export const categoryTitle = (code?: string) => (code ? catByCode(code)?.label : undefined)
