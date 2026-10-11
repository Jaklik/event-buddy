import type { Article, InspirationPhoto, Listing } from './types'

/** Fictional content for inspiration, bazaar and advice modules. */
const IMG = ['suppliers-jumbotron', 'home-jumbotron', 'home-suppliers', 'home-inspiration', 'home-gifts', 'home-planner', 'home-marketplace', 'session-new', 'home-notifications'].map((n) => `/dev/${n}.jpg`)
const img = (i: number) => IMG[i % IMG.length]!
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/* ---------- Inspirace ---------- */
const photoSeeds: [string, string, string, string, boolean, boolean][] = [
  ['Zahradní obřad s květinovým obloukem', 'svatba', 'rustikální', 'zelená', true, false], ['Stůl v pudrových barvách', 'svatba', 'romantický', 'růžová', true, false],
  ['Minimalistická výzdoba sálu', 'svatba', 'minimalistický', 'bílá', true, false], ['Narozeninový candy bar', 'narozeniny', 'hravý', 'pastelová', true, false],
  ['Firemní večírek v industriálním prostoru', 'firemni', 'moderní', 'modrá', true, false], ['Vizualizace obřadu u jezera (AI)', 'svatba', 'romantický', 'zlatá', false, true],
  ['Svatební kytice z lučních květin', 'svatba', 'rustikální', 'žlutá', true, false], ['Stolování pod širým nebem', 'oslava', 'rustikální', 'zelená', true, false],
  ['Návrh barevné palety (AI)', 'svatba', 'elegantní', 'modrá', false, true], ['Dětská oslava s balónky', 'narozeniny', 'hravý', 'pastelová', true, false],
  ['Zimní svatební výzdoba', 'svatba', 'elegantní', 'bílá', true, false], ['Letní firemní piknik', 'firemni', 'moderní', 'zelená', true, false],
]
export const photos: InspirationPhoto[] = photoSeeds.map(([title, eventType, style, color, real, ai], i) => ({
  id: i + 1, slug: `${i + 1}-${slug(title)}`, title, image: img(i), eventType, style, color, real, ai, author: real ? 'Foto Světlo (ukázka)' : 'Vygenerováno AI', supplierSlug: real ? '5-foto-svetlo-marie-kovarova-ukazka' : undefined,
}))
export const collections = [
  { slug: 'zahradni-svatba', title: 'Zahradní svatba', count: 24, image: img(0) },
  { slug: 'pudrova-paleta', title: 'Pudrová paleta', count: 18, image: img(1) },
  { slug: 'firemni-akce', title: 'Firemní akce, které fungují', count: 12, image: img(4) },
  { slug: 'detska-oslava', title: 'Dětské oslavy', count: 15, image: img(3) },
]

/* ---------- Bazar ---------- */
const listingSeeds: [string, string, number, string, string, string, boolean, boolean, Listing['status']][] = [
  ['Svatební oblouk, bílý kov', 'Dekorace', 1800, 'Dobrý stav', 'Praha', 'Marie', true, false, 'active'], ['Sada 12 skleněných váz', 'Květinové dekorace', 650, 'Velmi dobrý', 'Brno', 'Petr', false, true, 'active'],
  ['LED řetězy (50 m)', 'Osvětlení', 900, 'Nové', 'Plzeň', 'Jana', false, false, 'active'], ['Cedule „Vítejte“ ze dřeva', 'Cedule a tiskoviny', 400, 'Dobrý stav', 'Ostrava', 'Lucie', false, false, 'expiring'],
  ['Kompletní balíček dekorací pro 60 hostů', 'Kompletní balíčky', 6500, 'Velmi dobrý', 'Praha', 'Eva', true, true, 'active'], ['Fotokoutek – pozadí a rekvizity', 'Fotokoutky', 1200, 'Dobrý stav', 'Olomouc', 'Tomáš', false, false, 'active'],
  ['Ubrusy bílé 10 ks', 'Stolování', 500, 'Použité', 'Liberec', 'Anna', false, false, 'sold'], ['Balónkový set pro narozeniny', 'Dětské oslavy', 250, 'Nové', 'Kladno', 'Radek', false, false, 'active'],
]
export const listings: Listing[] = listingSeeds.map(([title, category, price, condition, city, seller, highlighted, top, status], i) => ({
  id: i + 1, slug: `${i + 1}-${slug(title)}`, title, category, price, condition, city, seller, image: img(i + 2), highlighted, top, status,
  createdAt: '2026-09-20', expiresAt: status === 'expiring' ? '2026-10-18' : '2026-11-19',
  description: 'Ukázkový popis inzerátu. Předání osobně nebo po domluvě. Platba za zboží probíhá mimo SelfPlan; SelfPlan platbu ani dopravu nezprostředkovává.',
}))
export const listingCategories = ['Dekorace', 'Stolování', 'Květinové dekorace', 'Osvětlení', 'Cedule a tiskoviny', 'Fotokoutky', 'Dětské oslavy', 'Plesy a večírky', 'Kompletní balíčky', 'Ostatní vybavení']

/* ---------- Obsah: články, poradna, hry, tradice, smlouvy ---------- */
const body = ['Toto je ukázkový text článku pro náhled rozhraní. Skutečný obsah doplní redaktorka v administraci.', 'Druhý odstavec ukázkového textu. Obsahuje praktické rady, odkazy na dodavatele a nástroje SelfPlanu.', 'Třetí odstavec: shrnutí a doporučený další krok.']
const mk = (id: number, title: string, perex: string, type: Article['type'], tag: string, eventType = 'svatba'): Article => ({ id, slug: `${id}-${slug(title)}`, title, perex, image: img(id + 3), type, tag, eventType, date: '2026-09-15', body })
export const articles: Article[] = [
  mk(1, '10 tipů pro nezapomenutelnou svatbu v přírodě', 'Co zařídit, když chcete obřad pod širým nebem a jak mít plán B.', 'clanek', 'Inspirace'),
  mk(2, 'Jak vybrat svatební kytici, která vydrží', 'Květiny podle ročního období, stylu a rozpočtu.', 'clanek', 'Tipy a rady'),
  mk(3, 'Kdy poslat svatební oznámení', 'Praktický časový plán od výběru po rozeslání.', 'faq', 'Poradna'),
  mk(4, 'Kolik stojí svatba v roce 2027', 'Orientační rozpočet podle počtu hostů a místa.', 'clanek', 'Rozpočet'),
  mk(5, 'Svatební hra: Kdo zná nevěstu nejlépe?', 'Jednoduchá hra pro hosty, bez rekvizit.', 'hra', 'Hry'),
  mk(6, 'Házení kyticí: odkud zvyk pochází', 'Historie a moderní podoby oblíbené svatební tradice.', 'tradice', 'Tradice'),
  mk(7, 'Vzor smlouvy s fotografem', 'Co by měla smlouva obsahovat. Vzor je informativní, nejde o právní poradenství.', 'smlouva', 'Vzory smluv'),
  mk(8, 'Firemní vánoční večírek bez stresu', 'Program, rozpočet a dodavatelé pro firemní akci.', 'clanek', 'Firemní akce', 'firemni'),
  mk(9, 'Narozeninová oslava pro děti: nápady', 'Jednoduché nápady na hry, výzdobu a občerstvení.', 'clanek', 'Narozeniny', 'narozeniny'),
]
export const articleTypeLabel: Record<Article['type'], string> = { clanek: 'Články', faq: 'Poradna', hra: 'Hry', tradice: 'Tradice', smlouva: 'Vzory smluv' }
