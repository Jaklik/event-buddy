/**
 * Cookie consent state (frontend part of the CMP). Stored in a versioned first-party cookie.
 * Optional technologies (analytics, marketing) must stay blocked until the matching flag is true; no such
 * scripts exist in this app yet, so the flags only record the choice. Server-side audit log comes with the backend.
 */
export interface ConsentChoice { v: 1; analytics: boolean; marketing: boolean; functional: boolean; at: string }

export function useConsent() {
  const cookie = useCookie<ConsentChoice | null>('sp_consent', { default: () => null, maxAge: 60 * 60 * 24 * 180, sameSite: 'lax', path: '/' })
  const settingsOpen = useState('consent-settings-open', () => false)
  const decided = computed(() => !!cookie.value)
  function save(c: Pick<ConsentChoice, 'analytics' | 'marketing' | 'functional'>) {
    cookie.value = { v: 1, ...c, at: new Date().toISOString() }
    settingsOpen.value = false
  }
  const acceptAll = () => save({ analytics: true, marketing: true, functional: true })
  const rejectOptional = () => save({ analytics: false, marketing: false, functional: false })
  const openSettings = () => { settingsOpen.value = true }
  return { choice: cookie, decided, settingsOpen, save, acceptAll, rejectOptional, openSettings }
}
