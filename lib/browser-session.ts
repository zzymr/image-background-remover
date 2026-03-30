const STORAGE_KEY = 'ethereal-cutout-session-id'

export function getOrCreateBrowserSessionId() {
  if (typeof window === 'undefined') return ''

  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (existing) return existing

  const nextValue = window.crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, nextValue)
  return nextValue
}

export function getExistingBrowserSessionId() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(STORAGE_KEY) || ''
}
