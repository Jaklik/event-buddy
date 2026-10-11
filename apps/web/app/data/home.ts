interface CategoryItem { label: string; to: string; icon?: string; image?: string }
interface Slide { id: string | number; image: string; alt: string; title?: string; text?: string; href?: string; cta?: string; sponsored?: boolean }

/**
 * Homepage content. TEMPORARY static source: in production the homepage reads published content
 * (categories, campaigns, articles, references) from the database/CMS; empty lists hide their section
 * (spec: no empty placeholders, no invented reviews or campaigns).
 */

/** Top-level supplier categories of the existing SelfPlan taxonomy (db/migrate/…_migrate_categories.rb). */
export const categories = [
  { code: 'venue_and_equipment', label: 'Místo konání', icon: 'fa6-solid:landmark' },
  { code: 'photography_and_video', label: 'Foto a video', icon: 'fa6-solid:camera' },
  { code: 'catering_and_dining', label: 'Catering', icon: 'fa6-solid:utensils' },
  { code: 'decoration_and_flowers', label: 'Dekorace a květiny', icon: 'fa6-solid:seedling' },
  { code: 'music_and_entertainment', label: 'Hudba a zábava', icon: 'fa6-solid:music' },
  { code: 'fashion_and_beauty', label: 'Móda a krása', icon: 'fa6-solid:wand-magic-sparkles' },
  { code: 'organization_and_coordination', label: 'Organizace a koordinace', icon: 'fa6-solid:clipboard-list' },
  { code: 'printing_and_invitations', label: 'Tisk a pozvánky', icon: 'fa6-solid:envelope-open-text' },
] as const

export const categoryItems: CategoryItem[] = categories.map((c) => ({
  label: c.label,
  icon: c.icon,
  to: `/dodavatele?category=${c.code}`,
}))

export const tools = [
  { title: 'Plánovač událostí', text: 'Checklist, rozpočet a harmonogram na jednom místě.', icon: 'fa6-regular:square-check', to: '/planovac-akci' },
  { title: 'Vlastní eventový web', text: 'Web s RSVP pro vaši událost za pár minut.', icon: 'fa6-solid:desktop', to: '/eventovy-web' },
  { title: 'Inspirace', text: 'Skutečné realizace, nápady a trendy.', icon: 'fa6-regular:lightbulb', to: '/inspirace' },
  { title: 'Bazar', text: 'Prodejte nebo najděte svatební a eventové věci.', icon: 'fa6-solid:bag-shopping', to: '/bazar' },
  { title: 'Poradna', text: 'Články, tipy, hry, tradice a vzory smluv.', icon: 'fa6-solid:book-open', to: '/poradna' },
]

export const eventTypes = [
  { label: 'Svatby', to: '/dodavatele?event=svatba' },
  { label: 'Narozeniny a oslavy', to: '/dodavatele?event=oslava' },
  { label: 'Firemní akce', to: '/dodavatele?event=firemni' },
]

/**
 * Dev-only sample data, shown with `/?preview=1` so empty sections can be checked visually.
 * It is never used in production builds. Texts are clearly fictional and marked as such.
 */
export const devFixtures = {
  campaigns: [
    { id: 'dev-1', image: '/dev/suppliers-jumbotron.jpg', alt: 'Ukázková reklama', title: 'Ukázková kampaň (vzorová data)', text: 'Takto vypadá placená pozice v karuselu.', href: '#', cta: 'Zobrazit profil', sponsored: true },
    { id: 'dev-2', image: '/dev/home-jumbotron.jpg', alt: 'Ukázková reklama 2', title: 'Druhá ukázková kampaň', text: 'Vzorová data pro náhled.', href: '#', sponsored: true },
  ] satisfies Slide[],
  articles: [
    { to: '#', title: 'Ukázkový článek z inspirace (vzorová data)', image: '/dev/home-inspiration.jpg', tag: 'Inspirace' },
    { to: '#', title: 'Ukázkový článek z poradny (vzorová data)', image: '/dev/home-gifts.jpg', tag: 'Tipy a rady' },
    { to: '#', title: 'Další ukázkový článek (vzorová data)', image: '/dev/home-planner.jpg', tag: 'Plánování' },
    { to: '#', title: 'Čtvrtý ukázkový článek (vzorová data)', image: '/dev/home-marketplace.jpg', tag: 'Bazar' },
  ],
  references: [
    { author: 'Ukázkový klient', context: 'Vzorová reference', text: 'Toto je pouze vzorový text pro kontrolu vzhledu sekce Reference z osobní koordinace.', date: 'vzorová data' },
  ],
}
