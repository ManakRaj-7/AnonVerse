export const isGuestUser = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('anonverse_guest') === 'true'
}
