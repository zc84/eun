import type { Activity } from '../types/activity'
import type { ActivityFilters } from '../types/filters'
import type { UserRole } from '../types/user'

interface PersistedState {
  role: UserRole
  createdActivities: Activity[]
  joinedActivityIds: string[]
  highContrast: boolean
  filters: ActivityFilters
}

const STORAGE_KEY = 'eu-code-week-prototype:app-state'

export function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

export function savePersistedState(state: PersistedState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearPersistedState() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}
