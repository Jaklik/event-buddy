/**
 * Favorites that work without an account (spec "Profil zákazníka" §5): stored locally under a versioned key,
 * no personal data. After login the list is merged to the server idempotently (backend phase).
 */
const KEY = 'sp:favorites:v1'

export function useFavorites() {
  const ids = useState<number[]>('favorites', () => [])
  onMounted(() => {
    try { ids.value = JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { ids.value = [] }
  })
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(ids.value)) } catch { /* storage may be blocked */ }
  }
  const has = (id: number) => ids.value.includes(id)
  function toggle(id: number) {
    ids.value = has(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
    persist()
  }
  return { ids, has, toggle }
}
