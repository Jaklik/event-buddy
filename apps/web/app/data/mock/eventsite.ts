export interface SiteTemplate { id: string; name: string; types: string[]; accent: string; soft: string; text: string; heading: 'serif' | 'sans' }
/** Template look = a few CSS variables. Real templates come later; colors here are demo values scoped to the preview only. */
export const siteTemplates: SiteTemplate[] = [
  { id: 'zahradni', name: 'Zahradní romance', types: ['svatba'], accent: '#6f8f6a', soft: '#eef3ec', text: '#2d3a2b', heading: 'serif' },
  { id: 'elegantni', name: 'Elegantní minimal', types: ['svatba', 'oslava'], accent: '#8a6f55', soft: '#f6f0ea', text: '#2a211a', heading: 'serif' },
  { id: 'pudrova', name: 'Pudrová', types: ['svatba', 'narozeniny'], accent: '#b9788a', soft: '#faeff2', text: '#3a2229', heading: 'serif' },
  { id: 'modra', name: 'Večerní modrá', types: ['svatba', 'firemni'], accent: '#506e92', soft: '#eef2f7', text: '#1f2835', heading: 'sans' },
  { id: 'party', name: 'Oslava', types: ['narozeniny', 'oslava'], accent: '#d07a2d', soft: '#fdf1e4', text: '#3a2a16', heading: 'sans' },
  { id: 'firma', name: 'Firemní event', types: ['firemni'], accent: '#35607a', soft: '#eaf1f5', text: '#14232d', heading: 'sans' },
]
export interface SiteSection { id: string; label: string; visible: boolean }
export const defaultSections: SiteSection[] = [
  { id: 'hero', label: 'Úvod', visible: true }, { id: 'datum', label: 'Datum a odpočet', visible: true }, { id: 'misto', label: 'Místo a doprava', visible: true },
  { id: 'program', label: 'Harmonogram', visible: true }, { id: 'dresscode', label: 'Dress code a barvy', visible: true }, { id: 'rsvp', label: 'RSVP', visible: true },
  { id: 'dary', label: 'Dary a přání', visible: true }, { id: 'faq', label: 'Časté dotazy', visible: false }, { id: 'kontakt', label: 'Kontakt', visible: true },
]
export interface SiteContent {
  title: string; subtitle: string; date: string; time: string; place: string; address: string; travel: string
  program: { time: string; title: string }[]; dress: string; palette: string[]; gifts: { title: string; done: boolean }[]
  faq: { q: string; a: string }[]; contact: string; rsvpDeadline: string; rsvpMode: 'verejny' | 'individualni'
}
export const defaultContent: SiteContent = {
  title: 'Tereza & Martin', subtitle: 'Zveme vás na naši svatbu', date: '2027-06-26', time: '12:00', place: 'Zámek Loučeň', address: 'Zámecká 1, Loučeň',
  travel: 'Parkování je přímo u zámku. Pro hosty bez auta zajistíme odvoz z nádraží v Nymburce.',
  program: [{ time: '12:00', title: 'Obřad v zámecké zahradě' }, { time: '13:00', title: 'Přípitek a focení' }, { time: '14:30', title: 'Svatební hostina' }, { time: '18:00', title: 'První tanec a zábava' }],
  dress: 'Slavnostní, zahradní elegance', palette: ['#6f8f6a', '#eef3ec', '#c9b79c', '#ffffff'],
  gifts: [{ title: 'Příspěvek na svatební cestu', done: false }, { title: 'Sada skleniček', done: true }, { title: 'Dárkový poukaz na společný zážitek', done: false }],
  faq: [{ q: 'Mohu přijít s dětmi?', a: 'Samozřejmě, připravíme dětský koutek.' }, { q: 'Do kdy se mám vyjádřit?', a: 'Prosíme o odpověď do 31. 3. 2027.' }],
  contact: 'Tereza: +420 777 000 000 · svatba@example.cz', rsvpDeadline: '2027-03-31', rsvpMode: 'verejny',
}
