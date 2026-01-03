export const isGuestUser = () => {
  if (typeof window === 'undefined') return false

  const hasGuestFlag = localStorage.getItem('anonverse_guest') === 'true'

  // Supabase stores session in localStorage under this key
  const hasSupabaseSession = Object.keys(localStorage).some(key =>
    key.startsWith('sb-') && key.endsWith('-auth-token')
  )

  return hasGuestFlag && !hasSupabaseSession
}
