/**
 * Public catalogue taxonomy and attribute (filter) definitions, per Katalog v1.2-v1.4.
 * - "Organizace a koordinace" is NOT public (SelfPlan sells coordination itself; separate service page).
 * - "Prodejci a trhy" is removed; accommodation is NOT a category (beds are an attribute of venues).
 * - Not every parameter is a filter: scope says filter | detail (profile only) | inquiry (request form only).
 * The legacy codes are kept so the migration can map old categories 1:1 (see inactiveCategories).
 */
export interface Subcategory { code: string; label: string }
export interface TaxCategory { code: string; label: string; icon: string; slug: string; intro: string; subs: Subcategory[] }

export const taxonomy: TaxCategory[] = [
  { code: 'venue_and_equipment', slug: 'mista-konani-akci', label: 'Místa konání akcí', icon: 'fa6-solid:landmark', intro: 'Zámky, statky, sály a zahrady pro svatby, oslavy, firemní akce, konference i menší festivaly.', subs: [{ code: 'venue_rentals', label: 'Místa a prostory k pronájmu' }, { code: 'equipment_rentals', label: 'Půjčovny vybavení' }] },
  { code: 'photography_and_video', slug: 'fotografie-a-video', label: 'Fotografie a video', icon: 'fa6-solid:camera', intro: 'Fotografové, kameramani a tvůrci obsahu na sociální sítě pro každou událost.', subs: [{ code: 'photographers', label: 'Fotografové' }, { code: 'videographers', label: 'Kameramani' }, { code: 'content_creators', label: 'Tvůrci obsahu na sociální sítě' }] },
  { code: 'catering_and_dining', slug: 'catering-a-obcerstveni', label: 'Catering a občerstvení', icon: 'fa6-solid:utensils', intro: 'Cateringové firmy, food trucky, mobilní bary a cukrářské dorty.', subs: [{ code: 'catering_firms', label: 'Cateringové firmy' }, { code: 'food_trucks', label: 'Food trucky' }, { code: 'mobile_bars', label: 'Mobilní bary, baristé, kávové stánky' }, { code: 'pastry_chefs', label: 'Cukráři a dorty' }] },
  { code: 'decoration_and_flowers', slug: 'dekorace-a-kvetiny', label: 'Dekorace a květiny', icon: 'fa6-solid:seedling', intro: 'Floristé a dekoratéři pro obřady, stoly a celé prostory.', subs: [{ code: 'florists', label: 'Floristé' }, { code: 'decorators', label: 'Dekoratéři' }] },
  { code: 'music_and_entertainment', slug: 'hudba-a-zabava', label: 'Hudba a zábava', icon: 'fa6-solid:music', intro: 'DJ, kapely, moderátoři, fotobudky a další zábava na akce.', subs: [{ code: 'djs', label: 'DJ' }, { code: 'bands', label: 'Kapely a živá hudba' }, { code: 'hosts', label: 'Moderátoři' }, { code: 'photo_booths', label: 'Fotobudky' }, { code: 'entertainers', label: 'Zábavní umělci' }] },
  { code: 'fashion_and_beauty', slug: 'moda-a-krasa', label: 'Móda a krása', icon: 'fa6-solid:wand-magic-sparkles', intro: 'Svatební šaty a obleky, vizáž a kadeřnictví.', subs: [{ code: 'attire', label: 'Šaty a obleky' }, { code: 'makeup_hair', label: 'Vizáž a kadeřnictví' }] },
  { code: 'printing_and_invitations', slug: 'tisk-grafika-darky', label: 'Tiskoviny, grafika a dárky', icon: 'fa6-solid:envelope-open-text', intro: 'Oznámení, menu, cedulky a dárky pro hosty.', subs: [{ code: 'printers', label: 'Tiskoviny a grafika' }, { code: 'gifts', label: 'Dárky' }] },
  { code: 'technical_support', slug: 'technika-a-vybaveni', label: 'Technika a vybavení', icon: 'fa6-solid:sliders', intro: 'Ozvučení, světla, projekce a další technika včetně obsluhy.', subs: [{ code: 'tech_rental', label: 'Technika a vybavení' }] },
  { code: 'guest_services', slug: 'sluzby-pro-hosty', label: 'Služby pro hosty', icon: 'fa6-solid:people-group', intro: 'Praktické služby pro pohodlí hostů.', subs: [{ code: 'guest_care', label: 'Služby pro hosty' }] },
  { code: 'transport', slug: 'doprava-osob', label: 'Doprava osob', icon: 'fa6-solid:bus', intro: 'Přeprava hostů a novomanželů. Jen přeprava osob, nikoli logistika materiálu.', subs: [{ code: 'passenger_transport', label: 'Doprava osob' }] },
]

/** Legacy categories that are no longer public; existing profiles are mapped, never deleted (see /admin/kategorie). */
export const inactiveCategories = [
  { code: 'organization_and_coordination', label: 'Organizace a koordinace', reason: 'Prodává přímo SelfPlan; samostatná služba /koordinace.', mapTo: '— (profily skryty, posoudí administrátorka)' },
  { code: 'specialized_services', label: 'Prodejci a trhy', reason: 'Kategorie zrušena; služby se přemapují podle skutečné nabídky.', mapTo: 'Podle služby do jiných kategorií' },
]

export const catByCode = (code: string) => taxonomy.find((c) => c.code === code)
export const catBySlug = (slug: string) => taxonomy.find((c) => c.slug === slug)
export const subLabel = (catCode: string, sub?: string) => catByCode(catCode)?.subs.find((s) => s.code === sub)?.label

/* ---------- Attribute definitions ---------- */
export type AttrType = 'bool' | 'tri' | 'number' | 'multi' | 'select'
export interface AttrOption { value: string; label: string }
export interface AttrDef {
  key: string
  label: string
  type: AttrType
  help?: string
  unit?: string
  options?: AttrOption[]
  scope: 'filter' | 'detail' | 'inquiry'
  level: 'basic' | 'extended'
  group: string
  /** category codes or sub codes this attribute applies to */
  appliesTo: string[]
}
const yn = (key: string, label: string, group: string, appliesTo: string[], help?: string, level: AttrDef['level'] = 'extended', scope: AttrDef['scope'] = 'filter'): AttrDef => ({ key, label, type: 'bool', group, appliesTo, help, level, scope })
const tri = (key: string, label: string, group: string, appliesTo: string[], help?: string, level: AttrDef['level'] = 'extended', scope: AttrDef['scope'] = 'filter'): AttrDef => ({ key, label, type: 'tri', group, appliesTo, help, level, scope })
const num = (key: string, label: string, group: string, appliesTo: string[], unit: string, help?: string, level: AttrDef['level'] = 'basic'): AttrDef => ({ key, label, type: 'number', group, appliesTo, unit, help, level, scope: 'filter' })
const V = ['venue_and_equipment']

export const attrDefs: AttrDef[] = [
  // Místa konání akcí
  num('capacity', 'Počet hostů (kapacita hostiny)', 'Kapacita', V, 'osob', 'Minimální požadovaná kapacita hostiny.'),
  num('beds', 'Lůžka přímo v místě', 'Ubytování', V, 'lůžek', 'Ubytování není samostatná kategorie, jde o vlastnost místa.', 'extended'),
  yn('rain', 'Kryté prostory pro případ deště', 'Déšť', V, 'Místo má kryté prostory, kam se hosté vejdou, když prší. Uveďte, kolik hostů se tam vejde.', 'basic'),
  { key: 'rainCapacity', label: 'Kapacita krytých prostor', type: 'number', unit: 'osob', group: 'Déšť', appliesTo: V, scope: 'detail', level: 'basic', help: 'Kolik hostů pojme krytá alternativa.' },
  yn('ceremonyInside', 'Obřad uvnitř', 'Obřad', V, undefined, 'extended'),
  yn('ceremonyOutside', 'Obřad venku', 'Obřad', V, undefined, 'extended'),
  yn('danceSpace', 'Prostor pro tanec', 'Prostory', V),
  yn('privateRental', 'Soukromý pronájem celého areálu', 'Prostory', V),
  yn('externalCatering', 'Externí catering povolen', 'Jídlo a nápoje', V),
  yn('ownCatering', 'Vlastní catering', 'Jídlo a nápoje', V),
  yn('kitchen', 'Přípravná kuchyně', 'Jídlo a nápoje', V),
  tri('dishesOnSite', 'Nádobí na místě', 'Vybavení', V, 'Rozlišujeme: místo nádobí nemá / má vlastní / umí zajistit (např. pronájmem nebo za příplatek). Nic netvrdíme „v ceně“.', 'extended'),
  yn('parking', 'Parkování', 'Dostupnost', V),
  yn('accessible', 'Bezbariérovost', 'Dostupnost', V),
  yn('projector', 'Projektor / plátno', 'Konference', V),
  yn('sound', 'Ozvučení a mikrofony', 'Konference', V),
  yn('internet', 'Internet', 'Konference', V),
  yn('playground', 'Hřiště / dětské hřiště', 'Zábava', V),
  yn('wellness', 'Bazén, sauna nebo wellness', 'Zábava', V),
  // Catering
  tri('dishes', 'Dokáže zajistit nádobí a servírovací vybavení', 'Vybavení', ['catering_firms'], 'Filtr „zajistí nádobí“ vrací jen dodavatele s potvrzenou schopností (vlastní nebo umí zajistit).', 'basic'),
  yn('service', 'Zajistí obsluhu', 'Služby', ['catering_firms']),
  yn('barService', 'Barmanský servis', 'Služby', ['catering_firms', 'mobile_bars']),
  { key: 'diet', label: 'Dietní možnosti', type: 'multi', group: 'Dieta', appliesTo: ['catering_firms'], scope: 'filter', level: 'extended', options: [{ value: 'gluten', label: 'Bezlepkové' }, { value: 'lactose', label: 'Bezlaktózové' }, { value: 'vegan', label: 'Veganské' }, { value: 'vegetarian', label: 'Vegetariánské' }], help: 'Rozšířený filtr k potvrzení.' },
  // Food trucky
  { key: 'cuisine', label: 'Typ jídla / kuchyně', type: 'select', group: 'Nabídka', appliesTo: ['food_trucks'], scope: 'filter', level: 'basic', options: [{ value: 'burger', label: 'Burgery' }, { value: 'asian', label: 'Asijská' }, { value: 'sweet', label: 'Sladké' }, { value: 'bbq', label: 'BBQ' }] },
  // DJ / hudba
  yn('moderation', 'Moderování', 'Služby', ['djs'], undefined, 'basic'),
  yn('ownSound', 'Vlastní ozvučení', 'Technika', ['djs'], undefined, 'basic'),
  yn('lights', 'Světelná technika', 'Technika', ['djs'], undefined, 'basic'),
  { key: 'genre', label: 'Hudební žánr', type: 'select', group: 'Hudba', appliesTo: ['bands'], scope: 'filter', level: 'basic', options: [{ value: 'pop', label: 'Pop' }, { value: 'rock', label: 'Rock' }, { value: 'jazz', label: 'Jazz' }, { value: 'folk', label: 'Lidová' }], help: 'Číselník žánrů se doplní před naplněním dat.' },
  { key: 'language', label: 'Jazyk moderování', type: 'multi', group: 'Jazyk', appliesTo: ['hosts'], scope: 'filter', level: 'basic', options: [{ value: 'cs', label: 'Čeština' }, { value: 'en', label: 'Angličtina' }, { value: 'ru', label: 'Ruština' }, { value: 'uk', label: 'Ukrajinština' }] },
  yn('instantPrint', 'Okamžitý tisk', 'Fotobudka', ['photo_booths'], undefined, 'basic'),
  yn('digitalShare', 'Digitální sdílení', 'Fotobudka', ['photo_booths'], undefined, 'basic'),
  yn('booth360', '360° fotobudka', 'Fotobudka', ['photo_booths']),
  yn('operator', 'Zajistí obsluhu techniky', 'Technika', ['tech_rental']),
  { key: 'vehicle', label: 'Typ vozidla / služby', type: 'select', group: 'Doprava', appliesTo: ['passenger_transport'], scope: 'filter', level: 'basic', options: [{ value: 'limo', label: 'Limuzína / veterán' }, { value: 'bus', label: 'Autobus / minibus' }, { value: 'taxi', label: 'Osobní vůz' }] },
  // Jen poptávka / detail
  yn('kitchenNeeded', 'Potřebuji kuchyň a zázemí na místě', 'Poptávka', ['catering_firms'], undefined, 'extended', 'inquiry'),
  yn('needDishes', 'Potřebuji přivézt nádobí', 'Poptávka', ['catering_firms'], undefined, 'extended', 'inquiry'),
  yn('needService', 'Potřebuji obsluhu / bar', 'Poptávka', ['catering_firms'], undefined, 'extended', 'inquiry'),
]

/** Attributes valid for a category and optional subcategory. */
export function attrsFor(catCode?: string, subCode?: string, scope?: AttrDef['scope']) {
  if (!catCode) return []
  const subs = catByCode(catCode)?.subs.map((s) => s.code) ?? []
  return attrDefs.filter((a) => (!scope || a.scope === scope) && (a.appliesTo.includes(catCode) || (subCode ? a.appliesTo.includes(subCode) : a.appliesTo.some((x) => subs.includes(x)))))
}

export const triLabels: Record<string, string> = { no: 'Neposkytuje', own: 'Má vlastní', can: 'Umí zajistit' }
