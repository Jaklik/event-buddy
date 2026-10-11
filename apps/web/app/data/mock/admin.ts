/** Fictional admin data. Admin never sees private CRM, RSVP lists or message content here (spec §5). */
export const adminKpis = { newUsers: 42, activeSuppliers: 128, inquiries: 213, revenue: 18490, awaitingPayment: 3, newReviews: 7, reports: 5 }
export const queue = [
  { id: 1, type: 'Profil dodavatele', title: 'Rytířský sál Loučeň – čeká na schválení', age: '2 dny', priority: 'normální', to: '/admin/dodavatele' },
  { id: 2, type: 'Reklamní objednávka', title: 'Další karusel na homepage – čeká na platbu', age: '1 den', priority: 'vysoká', to: '/admin/platby' },
  { id: 3, type: 'Nahlášený obsah', title: 'Bazar: podezření na podvod', age: '5 hodin', priority: 'vysoká', to: '/admin/moderace' },
  { id: 4, type: 'Podezřelý účet', title: '12 registrací z jedné sítě za 10 minut', age: '3 hodiny', priority: 'vysoká', to: '/admin/bezpecnost' },
  { id: 5, type: 'Recenze', title: '3 recenze ke schválení', age: '1 den', priority: 'normální', to: '/admin/recenze' },
]
export const adminUsers = [
  { id: 1, email: 'tereza@example.cz', name: 'Tereza Nováková', roles: ['zákazník'], verified: true, status: 'aktivní', created: '2026-03-14', profiles: 0 },
  { id: 2, email: 'info@zamek.example.cz', name: 'Zámek Loučeň (ukázka)', roles: ['zákazník', 'dodavatel'], verified: true, status: 'aktivní', created: '2025-11-02', profiles: 2 },
  { id: 3, email: 'foto@example.cz', name: 'Marie Kovářová', roles: ['dodavatel'], verified: true, status: 'aktivní', created: '2025-12-20', profiles: 1 },
  { id: 4, email: 'spam123@mailinator.example', name: 'asdf', roles: ['zákazník'], verified: false, status: 'podezřelý', created: '2026-10-09', profiles: 0 },
  { id: 5, email: 'petr@example.cz', name: 'Petr Svoboda', roles: ['zákazník'], verified: false, status: 'aktivní', created: '2026-10-10', profiles: 0 },
]
export const pendingProfiles = [
  { id: 1, name: 'Rytířský sál Loučeň (ukázka)', owner: 'info@zamek.example.cz', category: 'Místo konání', submitted: '2026-10-09', duplicates: ['Zámek Loučeň (ukázka): shoda adresy a webu'] },
  { id: 2, name: 'Květiny od Anny (ukázka)', owner: 'anna@example.cz', category: 'Dekorace a květiny', submitted: '2026-10-10', duplicates: [] },
  { id: 3, name: 'DJ Honza (ukázka)', owner: 'honza@example.cz', category: 'Hudba a zábava', submitted: '2026-10-10', duplicates: ['DJ Matyáš (ukázka): podobný název'] },
  { id: 4, name: 'Catering U Mostu (ukázka)', owner: 'most@example.cz', category: 'Catering', submitted: '2026-10-11', duplicates: [] },
]
export const reviewQueue = [
  { id: 1, supplier: 'Kamera Vlk (ukázka)', author: 'Tereza N.', rating: 4, text: 'Komunikace před objednávkou byla rychlá a jasná.', kind: 'komunikace' },
  { id: 2, supplier: 'Pivovar U Lípy (ukázka)', author: 'Jan B.', rating: 2, text: 'Prostory pěkné, ale parkování malé a obsluha pomalá.', kind: 'realizace' },
  { id: 3, supplier: 'Salon Perla (ukázka)', author: 'Eva D.', rating: 5, text: 'Skvělý výběr šatů.', kind: 'realizace' },
]
export const reports = [
  { id: 1, target: 'Bazar: Sada váz 650 Kč', reason: 'Podezření na podvod', by: 'uživatel', at: 'před 5 hodinami', status: 'otevřeno' },
  { id: 2, target: 'Inspirace: Návrh barevné palety (AI)', reason: 'Chybí označení AI', by: 'uživatel', at: 'včera', status: 'otevřeno' },
  { id: 3, target: 'Recenze: Statek Čapí hnízdo', reason: 'Střet zájmů', by: 'dodavatel', at: 'před 2 dny', status: 'vyřešeno' },
]
export const payments = [
  { id: 1, order: 'OBJ-2026-0012', product: 'Další karusel na homepage, 90 dní', payer: 'Zámek Loučeň (ukázka)', amount: 1323, vs: '2026001201', due: '2026-10-22', status: 'ceka' },
  { id: 2, order: 'OBJ-2026-0011', product: 'Sponzorovaná pozice v katalogu, 30 dní', payer: 'Catering Chuť (ukázka)', amount: 290, vs: '2026001101', due: '2026-10-12', status: 'zaplaceno' },
  { id: 3, order: 'OBJ-2026-0010', product: 'Eventový web', payer: 'Tereza Nováková', amount: 490, vs: '2026001001', due: '2026-10-05', status: 'po-splatnosti' },
]
export const auditLog = [
  { at: '2026-10-11 09:12', actor: 'admin', action: 'Schválen profil „Statek Čapí hnízdo“', entity: 'SupplierProfile #2' },
  { at: '2026-10-11 08:40', actor: 'admin', action: 'Potvrzena platba OBJ-2026-0011', entity: 'Payment #2' },
  { at: '2026-10-10 17:05', actor: 'admin', action: 'Zamítnuta recenze (střet zájmů)', entity: 'Review #31' },
  { at: '2026-10-10 11:22', actor: 'admin', action: 'Přihlášení s MFA', entity: 'Session' },
]
