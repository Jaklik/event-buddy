import type { Availability, Category, PriceLevel, Review, Supplier } from './types'

import { taxonomy } from './taxonomy'

export const categories: Category[] = taxonomy.map((c) => ({ code: c.code, label: c.label, icon: c.icon }))
export const categoryLabel = (code: string) => taxonomy.find((c) => c.code === code)?.label ?? code

export const regions = ['Praha', 'Středočeský kraj', 'Jihočeský kraj', 'Plzeňský kraj', 'Pardubický kraj', 'Jihomoravský kraj', 'Moravskoslezský kraj']

const IMG = ['suppliers-jumbotron', 'home-jumbotron', 'home-suppliers', 'home-inspiration', 'home-gifts', 'home-planner', 'home-marketplace', 'session-new'].map((n) => `/dev/${n}.jpg`)
const imgs = (i: number) => [0, 1, 2, 3, 4].map((k) => IMG[(i + k) % IMG.length]!)

type Attrs = Supplier['attrs']
interface Seed { name: string; cat: string; sub: string; region: string; city: string; km: number; summary: string; price: PriceLevel | null; rating: number | null; reviews: number; cap?: [number, number]; vip?: boolean; sponsored?: boolean; verified?: boolean; noPhoto?: boolean; attrs?: Attrs }

const seeds: Seed[] = [
  { name: 'Zámek Loučeň (ukázka)', cat: 'venue_and_equipment', sub: 'venue_rentals', region: 'Středočeský kraj', city: 'Loučeň', km: 32, summary: 'Romantický zámek s parkem pro svatby od jara do podzimu.', price: '$$$', rating: 4.9, reviews: 120, cap: [20, 200], vip: true, attrs: { capacity: 200, beds: 40, rain: true, rainCapacity: 120, ceremonyInside: true, ceremonyOutside: true, danceSpace: true, privateRental: true, externalCatering: true, kitchen: true, dishesOnSite: 'own', parking: true, accessible: true, projector: true, sound: true, internet: true } },
  { name: 'Statek Čapí hnízdo (ukázka)', cat: 'venue_and_equipment', sub: 'venue_rentals', region: 'Středočeský kraj', city: 'Pecka', km: 45, summary: 'Moderní statek s kouzelným dvorem a ubytováním.', price: '$$', rating: 4.8, reviews: 98, cap: [30, 150], attrs: { capacity: 150, beds: 20, rain: true, rainCapacity: 40, ceremonyOutside: true, danceSpace: true, externalCatering: true, dishesOnSite: 'can', parking: true } },
  { name: 'Vila Lanna (ukázka)', cat: 'venue_and_equipment', sub: 'venue_rentals', region: 'Praha', city: 'Praha 6', km: 12, summary: 'Elegantní vila pro menší a střední svatby s výhledem na Vltavu.', price: '$$$', rating: 4.7, reviews: 85, cap: [20, 100], sponsored: true, attrs: { capacity: 100, beds: 0, ceremonyInside: true, ceremonyOutside: true, danceSpace: true, ownCatering: true, parking: false } },
  { name: 'Pivovar U Lípy (ukázka)', cat: 'venue_and_equipment', sub: 'venue_rentals', region: 'Jihočeský kraj', city: 'Třeboň', km: 118, summary: 'Rustikální sál a zahrada pro oslavy až 120 hostů.', price: '$', rating: 4.5, reviews: 41, cap: [20, 120], attrs: { capacity: 120, beds: 0, rain: true, rainCapacity: 120, externalCatering: true, kitchen: true, dishesOnSite: 'own', parking: true, accessible: true, playground: true } },
  { name: 'Foto Světlo – Marie Kovářová (ukázka)', cat: 'photography_and_video', sub: 'photographers', region: 'Praha', city: 'Praha 2', km: 8, summary: 'Přirozené svatební reportáže bez pózování.', price: '$$', rating: 4.9, reviews: 64 },
  { name: 'Studio Dvě oči (ukázka)', cat: 'photography_and_video', sub: 'videographers', region: 'Jihomoravský kraj', city: 'Brno', km: 205, summary: 'Fotografie i video v jednom balíčku, dron v ceně.', price: '$$$', rating: 4.6, reviews: 37, vip: true },
  { name: 'Kamera Vlk (ukázka)', cat: 'photography_and_video', sub: 'videographers', region: 'Středočeský kraj', city: 'Kolín', km: 55, summary: 'Svatební filmy a krátké highlighty.', price: '$$', rating: null, reviews: 0, noPhoto: true },
  { name: 'Reels z akce – Tvůrce (ukázka)', cat: 'photography_and_video', sub: 'content_creators', region: 'Praha', city: 'Praha 5', km: 10, summary: 'Krátká videa a příběhy pro sociální sítě přímo z vaší akce.', price: null, rating: null, reviews: 0 },
  { name: 'Catering Chuť (ukázka)', cat: 'catering_and_dining', sub: 'catering_firms', region: 'Praha', city: 'Praha 9', km: 15, summary: 'Rautové i servírované menu, vlastní personál.', price: '$$', rating: 4.7, reviews: 52, sponsored: true, attrs: { dishes: 'can', service: true, barService: true, diet: ['vegetarian', 'gluten'] } },
  { name: 'Svatební dorty od Elišky (ukázka)', cat: 'catering_and_dining', sub: 'pastry_chefs', region: 'Pardubický kraj', city: 'Přelouč', km: 78, summary: 'Dorty na míru a candy bary.', price: '$', rating: 4.9, reviews: 29 },
  { name: 'Burger Truck Motor (ukázka)', cat: 'catering_and_dining', sub: 'food_trucks', region: 'Praha', city: 'Praha 8', km: 11, summary: 'Food truck s burgery a hranolky na oslavy a firemní akce.', price: null, rating: null, reviews: 0, attrs: { cuisine: 'burger' } },
  { name: 'Květiny z Louky (ukázka)', cat: 'decoration_and_flowers', sub: 'florists', region: 'Středočeský kraj', city: 'Říčany', km: 25, summary: 'Svatební kytice, výzdoba obřadu a stolů.', price: '$$', rating: 4.8, reviews: 46 },
  { name: 'Dekorace Zlatá nit (ukázka)', cat: 'decoration_and_flowers', sub: 'decorators', region: 'Plzeňský kraj', city: 'Plzeň', km: 95, summary: 'Půjčovna dekorací a stylingu pro svatby a oslavy.', price: '$$', rating: 4.4, reviews: 18, noPhoto: true },
  { name: 'DJ Matyáš (ukázka)', cat: 'music_and_entertainment', sub: 'djs', region: 'Praha', city: 'Praha 4', km: 10, summary: 'Hudba na přání, ozvučení obřadu v ceně.', price: '$', rating: 4.6, reviews: 33, attrs: { moderation: true, ownSound: true, lights: false } },
  { name: 'Kapela Šest strun (ukázka)', cat: 'music_and_entertainment', sub: 'bands', region: 'Jihomoravský kraj', city: 'Znojmo', km: 230, summary: 'Živá kapela pro svatby a plesy.', price: '$$', rating: 4.8, reviews: 22, attrs: { genre: 'pop' } },
  { name: 'Mobilní fotokoutek Klik (ukázka)', cat: 'music_and_entertainment', sub: 'photo_booths', region: 'Moravskoslezský kraj', city: 'Ostrava', km: 290, summary: 'Fotokoutek s rekvizitami a okamžitým tiskem.', price: null, rating: null, reviews: 0, verified: false, attrs: { instantPrint: true, digitalShare: true } },
  { name: 'Salon Perla (ukázka)', cat: 'fashion_and_beauty', sub: 'attire', region: 'Praha', city: 'Praha 1', km: 5, summary: 'Půjčovna svatebních šatů a doplňků.', price: '$$$', rating: 4.7, reviews: 71 },
  { name: 'Vizáž Anna (ukázka)', cat: 'fashion_and_beauty', sub: 'makeup_hair', region: 'Středočeský kraj', city: 'Mladá Boleslav', km: 60, summary: 'Svatební líčení a účesy, výjezd na místo.', price: '$$', rating: 4.9, reviews: 58 },
  { name: 'Tiskárna Papír a Pero (ukázka)', cat: 'printing_and_invitations', sub: 'printers', region: 'Pardubický kraj', city: 'Pardubice', km: 85, summary: 'Svatební oznámení, menu a popisky na stůl.', price: '$', rating: 4.5, reviews: 26 },
]

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const suppliers: Supplier[] = seeds.map((s, i) => ({
  id: i + 1,
  slug: `${i + 1}-${slugify(s.name)}`,
  name: s.name,
  categoryCode: s.cat,
  subcategoryCode: s.sub,
  region: s.region,
  city: s.city,
  distanceKm: s.km,
  summary: s.summary,
  description: `${s.summary} Toto je ukázkový popis dodavatele pro náhled rozhraní. Skutečná data se doplní z databáze. Dodavatel působí primárně v regionu ${s.region} a je ochoten dojíždět i dále po dohodě.`,
  images: s.noPhoto ? [] : imgs(i),
  rating: s.rating,
  reviewCount: s.reviews,
  priceLevel: s.price,
  capacity: s.cap ? { min: s.cap[0], max: s.cap[1] } : undefined,
  packages: [
    { name: 'Základní balíček', priceFrom: 20000 + i * 1500, description: 'Nejčastěji volená varianta.', includes: ['Základní služby', 'Konzultace před akcí', 'Doprava v rámci regionu'] },
    { name: 'Komfortní balíček', priceFrom: 35000 + i * 2000, description: 'Rozšířený rozsah služeb.', includes: ['Vše ze základního balíčku', 'Rozšířený čas', 'Asistent'] },
    { name: 'Prémiový balíček', priceFrom: 60000 + i * 3000, description: 'Kompletní servis na míru.', includes: ['Vše z komfortního balíčku', 'Individuální návrh', 'Prioritní termín'] },
  ],
  scenario: s.price
    ? { title: 'Modelová svatba, 60 hostů, sobota', description: 'Scénář schválený administrátorem: obvyklý rozsah služeb pro svatební den (ukázka).', totalPrice: 28000 + i * 4200, updatedAt: '2026-09-18', note: 'Orientační cena, nezávazná. Konečná nabídka vždy po upřesnění poptávky.' }
    : null,
  languages: ['čeština', i % 3 === 0 ? 'angličtina' : 'slovenština'],
  verified: s.verified ?? true,
  vip: !!s.vip,
  sponsored: !!s.sponsored,
  phone: '+420 600 000 000',
  email: `info@example-${i + 1}.cz`,
  website: `https://example-${i + 1}.cz`,
  social: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
  googleRatingUrl: s.rating ? 'https://www.google.com/maps' : undefined,
  attrs: s.attrs ?? {},
  eventTypes: s.name.startsWith('Pivovar') ? ['narozeniny', 'oslava', 'firemni'] : s.cat === 'printing_and_invitations' ? ['svatba'] : ['svatba', 'narozeniny', 'oslava', 'firemni'],
  demo: true,
}))

/* ---------- availability (deterministic fake) ---------- */
function hash(n: number, d: string) {
  let h = n * 2654435761
  for (let i = 0; i < d.length; i++) h = (h ^ d.charCodeAt(i)) * 16777619
  return Math.abs(h) % 100
}
export function availabilityFor(supplierId: number, isoDate: string): Availability {
  const h = hash(supplierId, isoDate)
  if (h < 18) return 'busy'
  if (h < 30) return 'unknown'
  return 'free'
}

/* ---------- reviews ---------- */
const reviewTexts = [
  'Skvělá komunikace od první chvíle, vše proběhlo přesně podle domluvy.',
  'Profesionální přístup a pohodová atmosféra. Doporučujeme.',
  'Trochu jsme se báli, ale výsledek předčil očekávání.',
  'Rychlá odpověď na poptávku, férová cena, žádné skryté poplatky.',
  'Vše bylo perfektní, hosté si pochvalovali. Rádi se vrátíme.',
]
export const reviews: Review[] = suppliers.flatMap((s) =>
  Array.from({ length: Math.min(s.reviewCount, 4) }, (_, k) => ({
    id: s.id * 10 + k,
    supplierId: s.id,
    author: ['Tereza a Martin', 'Jana K.', 'Lucie P.', 'Petr a Eva'][k % 4]! + ' (ukázka)',
    date: ['červen 2026', 'květen 2026', 'září 2025', 'červenec 2025'][k % 4]!,
    rating: k === 3 ? 4 : 5,
    text: reviewTexts[(s.id + k) % reviewTexts.length]!,
    kind: (k % 2 === 0 ? 'realizace' : 'komunikace') as 'realizace' | 'komunikace',
  })),
)
