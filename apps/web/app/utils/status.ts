import type { InquiryStatus } from '~/data/mock/types'

type Variant = 'home' | 'neutral' | 'success' | 'danger' | 'warning'
export const inquiryStatus: Record<InquiryStatus, { label: string; variant: Variant }> = {
  nova: { label: 'Odesláno', variant: 'warning' },
  rozpracovana: { label: 'Rozpracováno', variant: 'warning' },
  nabidka: { label: 'Dodavatel odpověděl', variant: 'home' },
  vyjednavani: { label: 'Vyjednávání', variant: 'home' },
  potvrzena: { label: 'Domluveno', variant: 'success' },
  odmitnuta: { label: 'Odmítnuto', variant: 'danger' },
  uzavrena: { label: 'Uzavřeno', variant: 'neutral' },
}
export const eventTypeLabel: Record<string, string> = { svatba: 'Svatba', narozeniny: 'Narozeniny', oslava: 'Oslava', firemni: 'Firemní akce' }
