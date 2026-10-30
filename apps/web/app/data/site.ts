/**
 * Single source for operator identification (footer, contact, legal). Verify the legal name, ID number and contact
 * details against official records before publishing; do not hard-code them anywhere else (Homepage dodatek v3 §3A).
 */
export const site = {
  brand: 'SelfPlan',
  operator: 'Event Buddy s.r.o.',
  ico: '22029052',
  contactEmail: 'info@selfplan.cz', // from the existing mailer sender; confirm as the public contact (legal draft still has [DOPLNIT])
  address: 'Školská 660/3, Praha 1', // from the legal drafts
}
