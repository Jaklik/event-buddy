import type { AdProduct } from '~/data/mock/types'

/**
 * Ad pricing per Reklamy spec §2-3: 30-day base prices (introductory until 2027-05-31, standard from 2027-06-01),
 * duration discounts 0 / 10 % / 20 % for 30 / 90 / 365 days, catalogue +50 % of base per additional region.
 * Formula: price30 × (days / 30) × (1 − discount); money is rounded to whole CZK.
 */
export interface AdProductDef { id: AdProduct; label: string; intro: number; standard: number; capacity: number; note: string }
export const adProducts: AdProductDef[] = [
  { id: 'home-main', label: 'Hlavní reklama na homepage', intro: 990, standard: 5000, capacity: 3, note: 'Rotace 3 inzerentů, celostátně.' },
  { id: 'billboard', label: 'Billboard – přihlášení a registrace', intro: 990, standard: 5000, capacity: 3, note: 'Rotace 3 inzerentů na přihlašovacích stránkách.' },
  { id: 'home-carousel', label: 'Další karusel na homepage', intro: 490, standard: 2500, capacity: 6, note: 'Až 6 současných inzerentů.' },
  { id: 'catalog', label: 'Sponzorovaná pozice v katalogu', intro: 290, standard: 1500, capacity: 9, note: 'Kategorie a kraj; další kraj +50 % základní ceny. Max. 3 viditelné najednou.' },
  { id: 'detail', label: 'Reklama na detailu dodavatele', intro: 190, standard: 1000, capacity: 6, note: 'Rotace na detailech dodavatelů.' },
]
export const durations = [{ days: 30, discount: 0 }, { days: 90, discount: 0.1 }, { days: 365, discount: 0.2 }]
export const INTRO_UNTIL = '2027-05-31'

export function calcAdPrice(product: AdProduct, days: number, regions = 1, onDate = new Date().toISOString().slice(0, 10)) {
  const def = adProducts.find((p) => p.id === product)!
  const base = onDate <= INTRO_UNTIL ? def.intro : def.standard
  const regionFactor = product === 'catalog' ? 1 + 0.5 * Math.max(0, regions - 1) : 1
  const discount = durations.find((d) => d.days === days)?.discount ?? 0
  const price = Math.round(base * regionFactor * (days / 30) * (1 - discount))
  return { base, regionFactor, discount, price, intro: onDate <= INTRO_UNTIL }
}
