/**
 * Frontend-first dummy data. Shapes follow the spec entities (v2-spec-digest.md) so the real backend
 * can replace `repositories/*` without changing pages. Everything here is FICTIONAL sample data.
 */

export type Availability = 'free' | 'busy' | 'unknown'
export type PriceLevel = '$' | '$$' | '$$$'

export interface Category { code: string; label: string; icon: string }

export interface ServicePackage { name: string; priceFrom: number; description: string; includes: string[] }

export interface ModelScenario { title: string; description: string; totalPrice: number; updatedAt: string; note?: string }

export interface Supplier {
  id: number
  slug: string
  name: string
  categoryCode: string
  region: string
  city: string
  distanceKm: number
  summary: string
  description: string
  images: string[]
  rating: number | null
  reviewCount: number
  priceLevel: PriceLevel | null
  capacity?: { min: number; max: number }
  packages: ServicePackage[]
  scenario: ModelScenario | null
  languages: string[]
  verified: boolean
  vip: boolean
  sponsored: boolean
  phone: string
  email: string
  website: string
  social: { instagram?: string; facebook?: string }
  googleRatingUrl?: string
}

export interface Review {
  id: number
  supplierId: number
  author: string
  date: string
  rating: number
  text: string
  kind: 'realizace' | 'komunikace'
}

export type InquiryStatus = 'nova' | 'rozpracovana' | 'nabidka' | 'vyjednavani' | 'potvrzena' | 'odmitnuta' | 'uzavrena'
export interface Inquiry {
  id: number
  supplierId: number
  customer: string
  eventType: string
  date: string
  place: string
  guests: number
  status: InquiryStatus
  lastMessage: string
  unread: boolean
  budget?: number
}

export interface ThreadMessage { id: number; inquiryId: number; from: 'customer' | 'supplier'; author: string; at: string; text: string }

export interface PlannerEvent {
  id: number
  name: string
  type: 'svatba' | 'narozeniny' | 'oslava' | 'firemni'
  date: string | null
  place: string
  guests: number
  budget: number
  progress: number
}
export interface PlannerTask { id: number; eventId: number; title: string; due: string; category: string; done: boolean; auto: boolean }
export interface BudgetItem { id: number; eventId: number; category: string; planned: number; offered: number | null; confirmed: number | null; actual: number | null; supplier?: string }
export interface Guest { id: number; eventId: number; name: string; group: string; persons: number; status: 'pozvan' | 'potvrzen' | 'odmitl' | 'ceka'; diet?: string }
export interface ScheduleItem { id: number; eventId: number; time: string; title: string; place?: string }

export interface Listing { id: number; slug: string; title: string; category: string; price: number; condition: string; city: string; image: string; createdAt: string; expiresAt: string; highlighted: boolean; top: boolean; status: 'active' | 'expiring' | 'sold' | 'archived'; description: string; seller: string }

export interface InspirationPhoto { id: number; slug: string; title: string; image: string; eventType: string; style: string; color: string; real: boolean; ai: boolean; author: string; supplierSlug?: string }

export interface Article { id: number; slug: string; title: string; perex: string; image: string; type: 'clanek' | 'faq' | 'hra' | 'tradice' | 'smlouva'; tag: string; eventType: string; date: string; body: string[] }

export type AdProduct = 'home-main' | 'billboard' | 'home-carousel' | 'catalog' | 'detail'
export interface AdOrder { id: number; supplier: string; product: AdProduct; productLabel: string; from: string; to: string; days: number; price: number; status: 'zadost' | 'schvaleno' | 'ceka-na-platbu' | 'aktivni' | 'dokonceno' | 'zamitnuto'; impressions: number; clicks: number }

export interface EventSite { id: number; name: string; template: string; status: 'local_draft' | 'draft' | 'payment_pending' | 'paid_unpublished' | 'published' | 'expired'; privacy: 'odkaz' | 'verejny' | 'heslo'; slug: string; publishedAt: string | null; expiresAt: string | null; rsvpYes: number; rsvpNo: number; rsvpWaiting: number }

export interface CoordinationService { code: string; title: string; description: string; priceNote: string; includes: string[] }

export type UserRole = 'guest' | 'customer' | 'supplier' | 'admin'
