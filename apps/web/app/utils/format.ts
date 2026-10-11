export const money = (n: number | null | undefined) =>
  n == null ? '–' : new Intl.NumberFormat('cs', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
export const fmtDate = (iso: string | null | undefined) => (iso ? new Intl.DateTimeFormat('cs', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(iso)) : 'bez termínu')
export const fmtDateLong = (iso: string) => new Intl.DateTimeFormat('cs', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
export const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
