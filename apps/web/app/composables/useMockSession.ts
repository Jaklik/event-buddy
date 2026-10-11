import type { UserRole } from '~/data/mock/types'

/**
 * Fake session for the frontend-first phase. The role lives in a cookie so SSR and client agree.
 * The dev switcher (layouts/default.vue) changes it. Replaced by real auth in the backend phase.
 */
export function useMockSession() {
  const role = useCookie<UserRole>('sp_mock_role', { default: () => 'guest', sameSite: 'lax' })
  const loggedIn = computed(() => role.value !== 'guest')
  const displayName = computed(() => ({ guest: '', customer: 'Tereza Nováková', supplier: 'Zámek Loučeň', admin: 'Administrátor' })[role.value])
  const login = (r: UserRole = 'customer') => { role.value = r }
  const logout = () => { role.value = 'guest' }
  return { role, loggedIn, displayName, login, logout }
}
