import type { Availability, Category, PriceLevel, Review, Supplier } from './types'

export const categories: Category[] = [
  { code: 'venue_and_equipment', label: 'Místo konání', icon: 'fa6-solid:landmark' },
  { code: 'photography_and_video', label: 'Foto a video', icon: 'fa6-solid:camera' },
  { code: 'catering_and_dining', label: 'Catering', icon: 'fa6-solid:utensils' },
  { code: 'decoration_and_flowers', label: 'Dekorace a květiny', icon: 'fa6-solid:seedling' },
  { code: 'music_and_entertainment', label: 'Hudba a zábava', icon: 'fa6-solid:music' },
  { code: 'fashion_and_beauty', label: 'Móda a krása', icon: 'fa6-solid:wand-magic-sparkles' },
  { code: 'organization_and_coordination', label: 'Organizace a koordinace', icon: 'fa6-solid:clipboard-list' },
  { code: 'printing_and_invitations', label: 'Tisk a pozvánky', icon: 'fa6-solid:envelope-open-text' },
]
export const categoryLabel = (code: string) => categories.find((c) => c.code === code)?.label ?? code

export const regions = ['Praha', 'Středočeský kraj', 'Jihočeský kraj', 'Plzeňský kraj', 'Pardubický kraj', 'Jihomoravský kraj', 'Moravskoslezský kraj']

const IMG = ['suppliers-jumbotron', 'home-jumbotron', 'home-suppliers', 'home-inspiration', 'home-gifts', 'home-planner', 'home-marketplace', 'session-new'].map((n) => `/dev/${n}.jpg`)
const imgs = (i: number) => [0, 1, 2, 3, 4].map((k) => IMG[(i + k) % IMG.length]!)

interface Seed { name: string; cat: string; region: string; city: string; km: number; summary: string; price: PriceLevel | null; rating: number | null; reviews: number; cap?: [number, number]; vip?: boolean; sponsored?: boolean; verified?: boolean }

const seeds: Seed[] = [
  { name: 'Zámek Loučeň (ukázka)', cat: 'venue_and_equipment', region: 'Středočeský kraj', city: 'Loučeň', km: 32, summary: 'Romantický zámek s parkem pro svatby od jara do podzimu.', price: '$$$', rating: 4.9, reviews: 120, cap: [20, 200], vip: true },
  { name: 'Statek Čapí hnízdo (ukázka)', cat: 'venue_and_equipment', region: 'Středočeský kraj', city: 'Pecka', km: 45, summary: 'Moderní statek s kouzelným dvorem a ubytováním.', price: '$$', rating: 4.8, reviews: 98, cap: [30, 150] },
  { name: 'Vila Lanna (ukázka)', cat: 'venue_and_equipment', region: 'Praha', city: 'Praha 6', km: 12, summary: 'Elegantní vila pro menší a střední svatby s výhledem na Vltavu.', price: '$$$', rating: 4.7, reviews: 85, cap: [20, 100], sponsored: true },
  { name: 'Pivovar U Lípy (ukázka)', cat: 'venue_and_equipment', region: 'Jihočeský kraj', city: 'Třeboň', km: 118, summary: 'Rustikální sál a zahrada pro oslavy až 120 hostů.', price: '$', rating: 4.5, reviews: 41, cap: [20, 120] },
  { name: 'Foto Světlo – Marie Kovářová (ukázka)', cat: 'photography_and_video', region: 'Praha', city: 'Praha 2', km: 8, summary: 'Přirozené svatební reportáže bez pózování.', price: '$$', rating: 4.9, reviews: 64 },
  { name: 'Studio Dvě oči (ukázka)', cat: 'photography_and_video', region: 'Jihomoravský kraj', city: 'Brno', km: 205, summary: 'Fotografie i video v jednom balíčku, dron v ceně.', price: '$$$', rating: 4.6, reviews: 37, vip: true },
  { name: 'Kamera Vlk (ukázka)', cat: 'photography_and_video', region: 'Středočeský kraj', city: 'Kolín', km: 55, summary: 'Svatební filmy a krátké highlighty.', price: '$$', rating: null, reviews: 0 },
  { name: 'Catering Chuť (ukázka)', cat: 'catering_and_dining', region: 'Praha', city: 'Praha 9', km: 15, summary: 'Rautové i servírované menu, vlastní personál.', price: '$$', rating: 4.7, reviews: 52, sponsored: true },
  { name: 'Svatební dorty od Elišky (ukázka)', cat: 'catering_and_dining', region: 'Pardubický kraj', city: 'Přelouč', km: 78, summary: 'Dorty na míru a candy bary.', price: '$', rating: 4.9, reviews: 29 },
  { name: 'Květiny z Louky (ukázka)', cat: 'decoration_and_flowers', region: 'Středočeský kraj', city: 'Říčany', km: 25, summary: 'Svatební kytice, výzdoba obřadu a stolů.', price: '$$', rating: 4.8, reviews: 46 },
  { name: 'Dekorace Zlatá nit (ukázka)', cat: 'decoration_and_flowers', region: 'Plzeňský kraj', city: 'Plzeň', km: 95, summary: 'Půjčovna dekorací a stylingu pro svatby a oslavy.', price: '$$', rating: 4.4, reviews: 18 },
  { name: 'DJ Matyáš (ukázka)', cat: 'music_and_entertainment', region: 'Praha', city: 'Praha 4', km: 10, summary: 'Hudba na přání, ozvučení obřadu v ceně.', price: '$', rating: 4.6, reviews: 33 },
  { name: 'Kapela Šest strun (ukázka)', cat: 'music_and_entertainment', region: 'Jihomoravský kraj', city: 'Znojmo', km: 230, summary: 'Živá kapela pro svatby a plesy.', price: '$$', rating: 4.8, reviews: 22 },
  { name: 'Salon Perla (ukázka)', cat: 'fashion_and_beauty', region: 'Praha', city: 'Praha 1', km: 5, summary: 'Půjčovna svatebních šatů a doplňků.', price: '$$$', rating: 4.7, reviews: 71 },
  { name: 'Vizáž Anna (ukázka)', cat: 'fashion_and_beauty', region: 'Středočeský kraj', city: 'Mladá Boleslav', km: 60, summary: 'Svatební líčení a účesy, výjezd na místo.', price: '$$', rating: 4.9, reviews: 58 },
  { name: 'Svatební agentura Den D (ukázka)', cat: 'organization_and_coordination', region: 'Praha', city: 'Praha 3', km: 9, summary: 'Koordinace svatebního dne i kompletní plánování.', price: '$$$', rating: 4.8, reviews: 44, vip: true },
  { name: 'Tiskárna Papír a Pero (ukázka)', cat: 'printing_and_invitations', region: 'Pardubický kraj', city: 'Pardubice', km: 85, summary: 'Svatební oznámení, menu a popisky na stůl.', price: '$', rating: 4.5, reviews: 26 },
  { name: 'Mobilní fotokoutek Klik (ukázka)', cat: 'music_and_entertainment', region: 'Moravskoslezský kraj', city: 'Ostrava', km: 290, summary: 'Fotokoutek s rekvizitami a okamžitým tiskem.', price: null, rating: null, reviews: 0, verified: false },
]

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const suppliers: Supplier[] = seeds.map((s, i) => ({
  id: i + 1,
  slug: `${i + 1}-${slugify(s.name)}`,
  name: s.name,
  categoryCode: s.cat,
  region: s.region,
  city: s.city,
  distanceKm: s.km,
  summary: s.summary,
  description: `${s.summary} Toto je ukázkový popis dodavatele pro náhled rozhraní. Skutečná data se doplní z databáze. Dodavatel působí primárně v regionu ${s.region} a je ochoten dojíždět i dále po dohodě.`,
  images: imgs(i),
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
