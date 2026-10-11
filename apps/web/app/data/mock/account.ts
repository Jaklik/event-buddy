import type { BudgetItem, EventSite, Guest, Inquiry, PlannerEvent, PlannerTask, ScheduleItem, ThreadMessage } from './types'

/** Fictional data of the demo customer "Tereza Nováková". */

export const events: PlannerEvent[] = [
  { id: 1, name: 'Svatba Tereza a Martin', type: 'svatba', date: '2027-06-26', place: 'Zámek Loučeň', guests: 80, budget: 450000, progress: 42 },
  { id: 2, name: 'Padesátiny maminky', type: 'narozeniny', date: '2026-12-12', place: 'Praha', guests: 35, budget: 40000, progress: 70 },
  { id: 3, name: 'Firemní vánoční večírek', type: 'firemni', date: null, place: 'Zatím neurčeno', guests: 60, budget: 90000, progress: 0 },
]

const t = (id: number, eventId: number, title: string, due: string, category: string, done = false, auto = true): PlannerTask => ({ id, eventId, title, due, category, done, auto })
export const tasks: PlannerTask[] = [
  t(1, 1, 'Potvrdit místo konání a termín obřadu', '2026-11-15', 'Místo', true),
  t(2, 1, 'Vybrat fotografa a video', '2026-12-20', 'Fotografie', true),
  t(3, 1, 'Zaslat poptávku na catering (3 dodavatelé)', '2026-11-30', 'Catering'),
  t(4, 1, 'Rozhodnout o hudbě a DJ', '2027-01-31', 'Hudba'),
  t(5, 1, 'Objednat svatební oznámení', '2027-02-28', 'Tisk'),
  t(6, 1, 'Sestavit seznam hostů', '2027-03-15', 'Hosté', false, false),
  t(7, 1, 'Vybrat květinovou výzdobu', '2027-03-31', 'Dekorace'),
  t(8, 1, 'Zajistit ubytování pro hosty', '2027-04-15', 'Ubytování'),
  t(9, 1, 'Zkouška líčení a účesu', '2027-05-20', 'Móda a krása'),
  t(10, 1, 'Potvrdit harmonogram dne s dodavateli', '2027-06-12', 'Harmonogram'),
  t(11, 2, 'Rezervovat restauraci', '2026-10-25', 'Místo', true),
  t(12, 2, 'Objednat dort', '2026-11-20', 'Catering'),
  t(13, 2, 'Rozeslat pozvánky', '2026-11-05', 'Hosté'),
]

const b = (id: number, category: string, planned: number, offered: number | null, confirmed: number | null, actual: number | null, supplier?: string): BudgetItem => ({ id, eventId: 1, category, planned, offered, confirmed, actual, supplier })
export const budget: BudgetItem[] = [
  b(1, 'Místo konání', 120000, 118000, 118000, null, 'Zámek Loučeň (ukázka)'),
  b(2, 'Catering', 130000, 124000, null, null, 'Catering Chuť (ukázka)'),
  b(3, 'Fotografie a video', 45000, 48000, 48000, null, 'Foto Světlo (ukázka)'),
  b(4, 'Hudba', 25000, null, null, null),
  b(5, 'Dekorace a květiny', 35000, 31000, null, null, 'Květiny z Louky (ukázka)'),
  b(6, 'Svatební šaty a oblečení', 45000, null, null, 38000),
  b(7, 'Tisk a pozvánky', 8000, null, null, null),
  b(8, 'Ubytování hostů', 30000, null, null, null),
  b(9, 'Rezerva', 12000, null, null, null),
]

export const guests: Guest[] = [
  { id: 1, eventId: 1, name: 'Rodina Nováková', group: 'Rodina nevěsty', persons: 5, status: 'potvrzen' },
  { id: 2, eventId: 1, name: 'Rodina Dvořákova', group: 'Rodina ženicha', persons: 4, status: 'potvrzen', diet: 'vegetariánské menu (1 osoba)' },
  { id: 3, eventId: 1, name: 'Jana a Petr Svobodovi', group: 'Přátelé', persons: 2, status: 'ceka' },
  { id: 4, eventId: 1, name: 'Lucie Procházková', group: 'Přátelé', persons: 1, status: 'pozvan' },
  { id: 5, eventId: 1, name: 'Tomáš Král s partnerkou', group: 'Kolegové', persons: 2, status: 'odmitl' },
  { id: 6, eventId: 1, name: 'Babička Marie', group: 'Rodina nevěsty', persons: 1, status: 'potvrzen', diet: 'bez lepku' },
]

export const schedule: ScheduleItem[] = [
  { id: 1, eventId: 1, time: '11:00', title: 'Příprava nevěsty, líčení' },
  { id: 2, eventId: 1, time: '12:00', title: 'Svatební obřad', place: 'Zámecká zahrada' },
  { id: 3, eventId: 1, time: '12:45', title: 'Přípitek a focení' },
  { id: 4, eventId: 1, time: '14:00', title: 'Svatební hostina', place: 'Rytířský sál' },
  { id: 5, eventId: 1, time: '17:00', title: 'První tanec a zábava' },
  { id: 6, eventId: 1, time: '00:00', title: 'Konec akce' },
]

export const inquiries: Inquiry[] = [
  { id: 1, supplierId: 8, customer: 'Tereza Nováková', eventType: 'Svatba', date: '2027-06-26', place: 'Zámek Loučeň', guests: 80, status: 'nabidka', lastMessage: 'Posíláme nabídku na rautové menu pro 80 osob.', unread: true, budget: 130000 },
  { id: 2, supplierId: 5, customer: 'Tereza Nováková', eventType: 'Svatba', date: '2027-06-26', place: 'Zámek Loučeň', guests: 80, status: 'potvrzena', lastMessage: 'Termín je potvrzen, těšíme se.', unread: false, budget: 48000 },
  { id: 3, supplierId: 10, customer: 'Tereza Nováková', eventType: 'Svatba', date: '2027-06-26', place: 'Zámek Loučeň', guests: 80, status: 'nova', lastMessage: 'Poptávka odeslána.', unread: false },
  { id: 4, supplierId: 12, customer: 'Tereza Nováková', eventType: 'Svatba', date: '2027-06-26', place: 'Zámek Loučeň', guests: 80, status: 'vyjednavani', lastMessage: 'Můžeme upravit hrací dobu na 6 hodin?', unread: true },
  { id: 5, supplierId: 14, customer: 'Tereza Nováková', eventType: 'Narozeniny', date: '2026-12-12', place: 'Praha', guests: 35, status: 'odmitnuta', lastMessage: 'Bohužel v tomto termínu nemáme volno.', unread: false },
  { id: 6, supplierId: 9, customer: 'Tereza Nováková', eventType: 'Narozeniny', date: '2026-12-12', place: 'Praha', guests: 35, status: 'uzavrena', lastMessage: 'Děkujeme za objednávku dortu.', unread: false },
]

export const messages: ThreadMessage[] = [
  { id: 1, inquiryId: 1, from: 'customer', author: 'Tereza Nováková', at: '2026-10-02 09:14', text: 'Dobrý den, poptáváme catering na svatbu 26. 6. 2027, cca 80 hostů, raut a obřadní občerstvení.' },
  { id: 2, inquiryId: 1, from: 'supplier', author: 'Catering Chuť', at: '2026-10-03 11:02', text: 'Dobrý den, děkujeme za poptávku. Termín je volný. Připravíme nabídku s variantami menu.' },
  { id: 3, inquiryId: 1, from: 'supplier', author: 'Catering Chuť', at: '2026-10-08 15:40', text: 'Posíláme nabídku na rautové menu pro 80 osob. Orientační cena 124 000 Kč včetně obsluhy.' },
  { id: 4, inquiryId: 4, from: 'customer', author: 'Tereza Nováková', at: '2026-10-05 10:00', text: 'Poptáváme hudbu na svatbu, 26. 6. 2027, od 17:00.' },
  { id: 5, inquiryId: 4, from: 'supplier', author: 'Kapela Šest strun', at: '2026-10-07 18:21', text: 'Můžeme upravit hrací dobu na 6 hodin?' },
]

export const myReviews = [
  { id: 1, supplier: 'Salon Perla (ukázka)', rating: 5, text: 'Skvělý výběr šatů a milý personál.', status: 'schvaleno', date: '2026-08-14', revision: 1, pendingRevision: false },
  { id: 2, supplier: 'Kamera Vlk (ukázka)', rating: 4, text: 'Komunikace před objednávkou byla rychlá a jasná.', status: 'ceka', date: '2026-10-01', revision: 1, pendingRevision: false },
  { id: 3, supplier: 'Pivovar U Lípy (ukázka)', rating: 3, text: 'Prostory pěkné, ale parkování je malé.', status: 'schvaleno', date: '2026-06-20', revision: 2, pendingRevision: true },
]

export const notifications = [
  { id: 1, title: 'Nová odpověď na poptávku', text: 'Catering Chuť poslal nabídku.', to: '/ucet/poptavky/1', at: 'před 2 hodinami', read: false },
  { id: 2, title: 'Nová zpráva', text: 'Kapela Šest strun odpověděla na poptávku.', to: '/ucet/poptavky/4', at: 'včera', read: false },
  { id: 3, title: 'Recenze schválena', text: 'Vaše recenze pro Salon Perla je zveřejněna.', to: '/ucet/recenze', at: 'před 3 dny', read: true },
  { id: 4, title: 'Blíží se úkol', text: 'Zaslat poptávku na catering (do 30. 11.).', to: '/ucet/akce/1', at: 'před 5 dny', read: true },
]

export const eventSites: EventSite[] = [
  { id: 1, name: 'Svatba Tereza a Martin', template: 'Zahradní romance', status: 'published', privacy: 'odkaz', slug: 'tereza-a-martin', publishedAt: '2026-09-01', expiresAt: '2027-09-01', rsvpYes: 38, rsvpNo: 6, rsvpWaiting: 14 },
  { id: 2, name: 'Padesátiny maminky', template: 'Elegantní minimal', status: 'draft', privacy: 'odkaz', slug: 'padesatiny', publishedAt: null, expiresAt: null, rsvpYes: 0, rsvpNo: 0, rsvpWaiting: 0 },
]
