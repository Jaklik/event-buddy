interface CategoryItem { label: string; to: string; icon?: string; image?: string }
interface Slide { id: string | number; image: string; alt: string; title?: string; text?: string; href?: string; cta?: string; sponsored?: boolean }

/**
 * Homepage content. TEMPORARY static source: in production the homepage reads published content
 * (categories, campaigns, articles, references) from the database/CMS; empty lists hide their section
 * (spec: no empty placeholders, no invented reviews or campaigns).
 */

import { taxonomy } from './mock/taxonomy'

/**
 * Homepage categories come from the PUBLIC taxonomy (single source). "Organizace a koordinace" and the cancelled
 * "Prodejci a trhy" are not public categories; coordination is a separate SelfPlan service. Links go to indexable
 * category landing pages, never to ad-hoc filter URLs.
 */
export const categories = taxonomy
export const categoryItems: CategoryItem[] = taxonomy.slice(0, 8).map((c) => ({ label: c.label, icon: c.icon, to: `/dodavatele/kategorie/${c.slug}` }))

export const tools = [
  { title: 'Plánovač událostí', text: 'Checklist, rozpočet a harmonogram na jednom místě.', icon: 'fa6-regular:square-check', to: '/planovac-akci' },
  { title: 'Vlastní eventový web', text: 'Web s RSVP pro vaši událost za pár minut.', icon: 'fa6-solid:desktop', to: '/eventovy-web' },
  { title: 'Inspirace', text: 'Skutečné realizace, nápady a trendy.', icon: 'fa6-regular:lightbulb', to: '/inspirace' },
  { title: 'Eventový bazar', text: 'Prodejte nebo najděte svatební a eventové věci.', icon: 'fa6-solid:bag-shopping', to: '/bazar' },
  { title: 'Poradna', text: 'Články, tipy, hry, tradice a vzory smluv.', icon: 'fa6-solid:book-open', to: '/poradna' },
]

export const eventTypes = [
  { label: 'Svatby', to: '/dodavatele?typ=svatba' },
  { label: 'Narozeniny a oslavy', to: '/dodavatele?typ=oslava' },
  { label: 'Firemní akce', to: '/dodavatele?typ=firemni' },
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
