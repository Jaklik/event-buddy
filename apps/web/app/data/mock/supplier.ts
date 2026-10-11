import type { AdOrder } from './types'

/** Fictional data of the demo supplier "Zámek Loučeň (ukázka)" (supplier id 1). */
export type DealStage = 'nova' | 'rozpracovana' | 'nabidka' | 'potvrzeno' | 'hotovo'
export interface Deal { id: number; title: string; customer: string; date: string; value: number; stage: DealStage; source: 'selfplan' | 'mimo'; note?: string }
export const stages: { id: DealStage; label: string }[] = [
  { id: 'nova', label: 'Nové' }, { id: 'rozpracovana', label: 'Rozpracované' }, { id: 'nabidka', label: 'Nabídka odeslána' }, { id: 'potvrzeno', label: 'Potvrzeno' }, { id: 'hotovo', label: 'Dokončeno' },
]
export const deals: Deal[] = [
  { id: 1, title: 'Svatba, 80 hostů', customer: 'Tereza Nováková', date: '2027-06-26', value: 118000, stage: 'potvrzeno', source: 'selfplan' },
  { id: 2, title: 'Svatba, 60 hostů', customer: 'Lucie Novotná', date: '2027-07-10', value: 96000, stage: 'nabidka', source: 'selfplan' },
  { id: 3, title: 'Firemní akce', customer: 'Alfa s.r.o.', date: '2026-12-05', value: 74000, stage: 'rozpracovana', source: 'mimo', note: 'Zakázka mimo SelfPlan: soukromý CRM záznam.' },
  { id: 4, title: 'Oslava 50 let', customer: 'Petr Svoboda', date: '2027-03-20', value: 42000, stage: 'nova', source: 'selfplan' },
  { id: 5, title: 'Svatba, 110 hostů', customer: 'Martina Procházková', date: '2026-08-15', value: 134000, stage: 'hotovo', source: 'selfplan' },
  { id: 6, title: 'Svatba, 45 hostů', customer: 'Eva Dvořáková', date: '2027-09-04', value: 88000, stage: 'nova', source: 'selfplan' },
]
export const supplierTasks = [
  { id: 1, title: 'Poslat fakturu – Procházková', due: '2026-10-14', done: false },
  { id: 2, title: 'Zavolat Novotné ohledně nabídky', due: '2026-10-16', done: false },
  { id: 3, title: 'Aktualizovat fotografie sálu', due: '2026-10-30', done: true },
]
export const supplierInquiries = [
  { id: 101, customer: 'Eva Dvořáková', eventType: 'Svatba', date: '2027-09-04', guests: 45, status: 'nova' as const, text: 'Dobrý den, máme zájem o prostor na svatbu 4. 9. 2027.', unread: true },
  { id: 102, customer: 'Petr Svoboda', eventType: 'Oslava', date: '2027-03-20', guests: 50, status: 'nova' as const, text: 'Poptávám sál na oslavu padesátin.', unread: true },
  { id: 103, customer: 'Lucie Novotná', eventType: 'Svatba', date: '2027-07-10', guests: 60, status: 'nabidka' as const, text: 'Děkujeme za nabídku, ještě zvažujeme.', unread: false },
  { id: 104, customer: 'Jan Beneš', eventType: 'Firemní akce', date: '2026-11-28', guests: 80, status: 'odmitnuta' as const, text: 'V tomto termínu je sál obsazen.', unread: false },
]
export const calendarEvents = [
  { date: '2026-12-05', label: 'Firemní akce (mimo SelfPlan)', tone: 'brand' as const },
  { date: '2027-03-20', label: 'Předběžně: oslava', tone: 'muted' as const },
  { date: '2027-06-25', label: 'Příprava sálu', tone: 'muted' as const },
  { date: '2027-06-26', label: 'Svatba – Nováková', tone: 'busy' as const },
  { date: '2027-06-27', label: 'Úklid', tone: 'muted' as const },
  { date: '2027-07-10', label: 'Předběžně: Novotná', tone: 'muted' as const },
]
export const stats = { views: 1248, viewsDelta: 12, inquiries: 32, inquiriesDelta: 39, confirmed: 8, rating: 4.9, ratingCount: 120 }
export const adOrders: AdOrder[] = [
  { id: 1, supplier: 'Zámek Loučeň (ukázka)', product: 'catalog', productLabel: 'Sponzorovaná pozice v katalogu (Místo konání, Středočeský kraj)', from: '2026-10-15', to: '2026-11-14', days: 30, price: 290, status: 'aktivni', impressions: 4210, clicks: 187 },
  { id: 2, supplier: 'Zámek Loučeň (ukázka)', product: 'home-carousel', productLabel: 'Další karusel na homepage', from: '2026-11-15', to: '2027-02-12', days: 90, price: 1323, status: 'ceka-na-platbu', impressions: 0, clicks: 0 },
]
export const myProfiles = [
  { id: 1, name: 'Zámek Loučeň (ukázka)', category: 'Místo konání', status: 'APPROVED', url: '/dodavatele/1-zamek-loucen-ukazka' },
  { id: 2, name: 'Rytířský sál Loučeň (ukázka)', category: 'Místo konání', status: 'SUBMITTED', url: '' },
]
