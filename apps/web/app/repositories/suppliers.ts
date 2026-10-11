/**
 * Supplier repository. TODAY: reads dummy data. LATER: same signatures, backed by the API.
 * Pages and composables must only talk to repositories, never import data/mock directly.
 */
import { availabilityFor, regions, reviews, suppliers } from '~/data/mock/suppliers'
import type { Availability, PriceLevel, Review, Supplier } from '~/data/mock/types'

export type AvailabilityMode = 'free' | 'free-or-unknown' | 'all'
export type SortKey = 'relevance' | 'name' | 'distance' | 'price'

export interface CatalogueQuery {
  categories?: string[]
  date?: string
  region?: string
  priceLevels?: PriceLevel[]
  availability?: AvailabilityMode
  vipOnly?: boolean
  sort?: SortKey
  page?: number
  pageSize?: number
}
export interface SupplierResult extends Supplier { availability: Availability | null }
export interface CatalogueResult { items: SupplierResult[]; total: number; page: number; pages: number; sponsored: SupplierResult[] }

const delay = <T>(v: T, ms = 0) => new Promise<T>((r) => setTimeout(() => r(v), ms))

export async function listSuppliers(q: CatalogueQuery = {}): Promise<CatalogueResult> {
  const pageSize = q.pageSize ?? 9
  const mode = q.availability ?? 'all'
  let rows: SupplierResult[] = suppliers.map((s) => ({ ...s, availability: q.date ? availabilityFor(s.id, q.date) : null }))

  if (q.categories?.length) rows = rows.filter((s) => q.categories!.includes(s.categoryCode))
  if (q.region) rows = rows.filter((s) => s.region === q.region)
  if (q.priceLevels?.length) rows = rows.filter((s) => s.priceLevel && q.priceLevels!.includes(s.priceLevel))
  if (q.vipOnly) rows = rows.filter((s) => s.vip)
  // Spec: an empty date never means "free"; the availability filter only applies when a date is given.
  if (q.date && mode === 'free') rows = rows.filter((s) => s.availability === 'free')
  if (q.date && mode === 'free-or-unknown') rows = rows.filter((s) => s.availability !== 'busy')

  const sponsored = rows.filter((s) => s.sponsored).slice(0, 3)
  const organic = rows.filter((s) => !s.sponsored)

  const sort = q.sort ?? 'relevance'
  if (sort === 'name') organic.sort((a, b) => a.name.localeCompare(b.name, 'cs'))
  if (sort === 'distance') organic.sort((a, b) => a.distanceKm - b.distanceKm)
  if (sort === 'price') organic.sort((a, b) => (a.scenario?.totalPrice ?? Infinity) - (b.scenario?.totalPrice ?? Infinity))
  if (sort === 'relevance') organic.sort((a, b) => Number(b.vip) - Number(a.vip) || (b.rating ?? 0) - (a.rating ?? 0))

  const page = Math.max(1, q.page ?? 1)
  const pages = Math.max(1, Math.ceil(organic.length / pageSize))
  return delay({ items: organic.slice((page - 1) * pageSize, page * pageSize), total: organic.length, page, pages, sponsored })
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
