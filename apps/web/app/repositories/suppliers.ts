/**
 * Supplier repository. TODAY: reads dummy data. LATER: same signatures, backed by the API.
 * Pages and composables must only talk to repositories, never import data/mock directly.
 *
 * Search rules (Katalog v1.2-v1.4):
 *  - an empty date never means "free"; availability filters apply only with a date
 *  - an unknown attribute is NOT "No" and never counts as a match when the filter is "Yes"
 *  - rain-covered capacity must be >= requested guests; unknown capacity never satisfies it
 *  - relevance ignores paid status AND VIP; "VIP only" filters but never reorders the rest
 */
import { availabilityFor, regions, reviews, suppliers } from '~/data/mock/suppliers'
import { attrDefs, taxonomy } from '~/data/mock/taxonomy'
import type { Availability, PriceLevel, Review, Supplier } from '~/data/mock/types'

export type AvailabilityMode = 'free' | 'free-or-unknown' | 'all'
export type SortKey = 'relevance' | 'name' | 'distance' | 'price'

export interface CatalogueQuery {
  category?: string
  sub?: string
  region?: string
  eventType?: string
  date?: string
  availability?: AvailabilityMode
  priceLevels?: PriceLevel[]
  vipOnly?: boolean
  guests?: number
  /** attribute filters keyed by attribute key; value is the raw string from the URL */
  attrs?: Record<string, string>
  sort?: SortKey
  page?: number
  pageSize?: number
}
export interface SupplierResult extends Supplier { availability: Availability | null }
export interface CatalogueResult {
  items: SupplierResult[]
  total: number
  page: number
  pages: number
  sponsored: SupplierResult[]
  /** with "only free": how many suppliers were dropped only because their availability is unknown */
  unknownCount: number
}

const delay = <T>(v: T, ms = 0) => new Promise<T>((r) => setTimeout(() => r(v), ms))

function matchesAttr(s: Supplier, key: string, raw: string): boolean {
  const def = attrDefs.find((a) => a.key === key)
  const v = s.attrs[key]
  if (!def || raw === '') return true
  if (def.type === 'bool') return raw === '1' ? v === true : true
  if (def.type === 'tri') return raw === '1' ? v === 'own' || v === 'can' : true
  if (def.type === 'number') return typeof v === 'number' && v >= Number(raw)
  if (def.type === 'select') return v === raw
  if (def.type === 'multi') return raw.split(',').filter(Boolean).every((o) => Array.isArray(v) && v.includes(o))
  return true
}

function matches(s: SupplierResult, q: CatalogueQuery, mode: AvailabilityMode, ignoreAvailability = false): boolean {
  if (q.category && s.categoryCode !== q.category) return false
  if (q.sub && s.subcategoryCode !== q.sub) return false
  if (q.region && s.region !== q.region) return false
  if (q.eventType && !s.eventTypes.includes(q.eventType)) return false
  if (q.priceLevels?.length && !(s.priceLevel && q.priceLevels.includes(s.priceLevel))) return false
  if (q.vipOnly && !s.vip) return false
  if (q.guests && s.attrs.capacity !== undefined && typeof s.attrs.capacity === 'number' && s.attrs.capacity < q.guests) return false
  for (const [k, raw] of Object.entries(q.attrs ?? {})) {
    if (k === 'rain') {
      if (raw !== '1') continue
      // covered capacity must cover the requested guests; unknown capacity is not a match
      if (s.attrs.rain !== true) return false
      if (q.guests && !(typeof s.attrs.rainCapacity === 'number' && s.attrs.rainCapacity >= q.guests)) return false
      continue
    }
    if (!matchesAttr(s, k, raw)) return false
  }
  if (!ignoreAvailability && q.date) {
    if (mode === 'free' && s.availability !== 'free') return false
    if (mode === 'free-or-unknown' && s.availability === 'busy') return false
  }
  return true
}

export async function listSuppliers(q: CatalogueQuery = {}): Promise<CatalogueResult> {
  const pageSize = q.pageSize ?? 9
  const mode = q.availability ?? 'all'
  const all: SupplierResult[] = suppliers.map((s) => ({ ...s, availability: q.date ? availabilityFor(s.id, q.date) : null }))
  const rows = all.filter((s) => matches(s, q, mode))
  const unknownCount = q.date && mode === 'free' ? all.filter((s) => matches(s, q, 'free-or-unknown') && s.availability === 'unknown').length : 0

  const sponsored = rows.filter((s) => s.sponsored).slice(0, 3)
  const organic = rows.filter((s) => !s.sponsored)

  const sort = q.sort ?? 'relevance'
  const score = (s: SupplierResult) => (s.availability === 'free' ? 2 : s.availability === 'unknown' ? 0.5 : 0) + (q.region && s.region === q.region ? 1 : 0) + (s.rating ?? 0) / 5
  if (sort === 'name') organic.sort((a, b) => a.name.localeCompare(b.name, 'cs'))
  if (sort === 'distance') organic.sort((a, b) => a.distanceKm - b.distanceKm)
  if (sort === 'price') organic.sort((a, b) => (a.scenario?.totalPrice ?? Infinity) - (b.scenario?.totalPrice ?? Infinity))
  if (sort === 'relevance') organic.sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name, 'cs')) // never uses vip or paid status

  const page = Math.max(1, q.page ?? 1)
  const pages = Math.max(1, Math.ceil(organic.length / pageSize))
  return delay({ items: organic.slice((page - 1) * pageSize, page * pageSize), total: organic.length, page, pages, sponsored, unknownCount })
}

/** Public categories with supplier counts (the catalogue entry "rozcestník"). */
export async function categoryOverview() {
  return delay(taxonomy.map((c) => ({ ...c, count: suppliers.filter((s) => s.categoryCode === c.code).length })))
}

/** The price level filter is offered only where enough comparable model prices exist. */
export function priceFilterAvailable(category?: string) {
  const rows = suppliers.filter((s) => (!category || s.categoryCode === category) && s.priceLevel)
  return rows.length >= 3
}

export async function getSupplier(slug: string): Promise<SupplierResult | null> {
  const id = Number.parseInt(slug, 10)
  const s = suppliers.find((x) => x.id === id)
  return delay(s ? { ...s, availability: null } : null)
}

export async function getSupplierReviews(supplierId: number): Promise<Review[]> {
  return delay(reviews.filter((r) => r.supplierId === supplierId))
}

export async function getRelatedSuppliers(supplier: Supplier, limit = 3): Promise<SupplierResult[]> {
  const rows = suppliers.filter((s) => s.id !== supplier.id && s.categoryCode === supplier.categoryCode).slice(0, limit)
  const fill = rows.length < limit ? suppliers.filter((s) => s.id !== supplier.id && !rows.includes(s)).slice(0, limit - rows.length) : []
  return delay([...rows, ...fill].map((s) => ({ ...s, availability: null })))
}

export const regionOptions = regions
