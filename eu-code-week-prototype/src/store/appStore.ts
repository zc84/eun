import { createContext, createElement, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { initialActivities } from '../data/activities'
import { currentUser } from '../data/currentUser'
import { defaultActivityFilters, type ActivityFilters } from '../types/filters'
import type { Activity, ActivityStatus, CreateActivityInput } from '../types/activity'
import type { UserRole } from '../types/user'
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from './persistence'

interface AppState {
  role: UserRole
  activities: Activity[]
  filters: ActivityFilters
  selectedActivityId?: string
  joinedActivityIds: string[]
  createdActivityIds: string[]
  highContrast: boolean
}

export type AppStoreState = AppState

type AppAction =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_FILTERS'; payload: ActivityFilters }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_ACTIVITY'; payload?: string }
  | { type: 'JOIN_ACTIVITY'; payload: string }
  | { type: 'CREATE_ACTIVITY'; payload: Activity }
  | { type: 'APPROVE_ACTIVITY'; payload: string }
  | { type: 'TOGGLE_HIGH_CONTRAST' }
  | { type: 'RESET_STATE' }

interface AppStore extends AppState {
  setRole: (role: UserRole) => void
  setFilters: (filters: ActivityFilters) => void
  resetFilters: () => void
  selectActivity: (id?: string) => void
  joinActivity: (id: string) => void
  createActivity: (input: CreateActivityInput) => Activity
  approveActivity: (id: string) => void
  toggleHighContrast: () => void
  resetState: () => void
  getActivities: (filters: ActivityFilters) => Promise<Activity[]>
  getActivityById: (id: string) => Promise<Activity | null>
}

const AppStoreContext = createContext<AppStore | null>(null)

function createBaseState(): AppState {
  return {
    role: 'participant',
    activities: [...initialActivities],
    filters: defaultActivityFilters,
    joinedActivityIds: [...currentUser.joinedActivityIds],
    createdActivityIds: [...currentUser.createdActivityIds],
    highContrast: false,
  }
}

function createInitialState(): AppState {
  const persistedState = loadPersistedState()
  const baseState = createBaseState()

  if (!persistedState) {
    return baseState
  }

  return {
    role: persistedState.role,
    activities: [...initialActivities, ...persistedState.createdActivities],
    filters: persistedState.filters,
    joinedActivityIds: [
      ...new Set([...currentUser.joinedActivityIds, ...persistedState.joinedActivityIds]),
    ],
    createdActivityIds: [
      ...new Set([
        ...currentUser.createdActivityIds,
        ...persistedState.createdActivities.map((activity) => activity.id),
      ]),
    ],
    highContrast: persistedState.highContrast,
  }
}

function withDelay<T>(value: T, min = 150, max = 400): Promise<T> {
  const timeoutMs = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), timeoutMs)
  })
}

function generateId(prefix = 'act') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function persistState(state: AppState) {
  const createdActivities = state.activities.filter((activity) => state.createdActivityIds.includes(activity.id))
  savePersistedState({
    role: state.role,
    createdActivities,
    joinedActivityIds: state.joinedActivityIds,
    highContrast: state.highContrast,
    filters: state.filters,
  })
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE': {
      const nextState = { ...state, role: action.payload }
      persistState(nextState)
      return nextState
    }
    case 'SET_FILTERS': {
      const nextState = { ...state, filters: action.payload }
      persistState(nextState)
      return nextState
    }
    case 'RESET_FILTERS': {
      const nextState = { ...state, filters: defaultActivityFilters }
      persistState(nextState)
      return nextState
    }
    case 'SELECT_ACTIVITY':
      return { ...state, selectedActivityId: action.payload }
    case 'JOIN_ACTIVITY': {
      if (state.joinedActivityIds.includes(action.payload)) {
        return state
      }

      const nextState = {
        ...state,
        joinedActivityIds: [...state.joinedActivityIds, action.payload],
        activities: state.activities.map((activity) =>
          activity.id === action.payload
            ? {
                ...activity,
                participantCount: activity.participantCount + 1,
              }
            : activity,
        ),
      }

      persistState(nextState)
      return nextState
    }
    case 'CREATE_ACTIVITY': {
      const nextState = {
        ...state,
        activities: [action.payload, ...state.activities],
        createdActivityIds: [...state.createdActivityIds, action.payload.id],
      }
      persistState(nextState)
      return nextState
    }
    case 'APPROVE_ACTIVITY': {
      const nextState = {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.payload
            ? {
                ...activity,
                status: 'published' as ActivityStatus,
              }
            : activity,
        ),
      }
      persistState(nextState)
      return nextState
    }
    case 'TOGGLE_HIGH_CONTRAST': {
      const nextState = { ...state, highContrast: !state.highContrast }
      persistState(nextState)
      return nextState
    }
    case 'RESET_STATE': {
      clearPersistedState()
      return createBaseState()
    }
    default:
      return state
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)

  const store = useMemo<AppStore>(
    () => ({
      ...state,
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
      setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
      selectActivity: (id) => dispatch({ type: 'SELECT_ACTIVITY', payload: id }),
      joinActivity: (id) => dispatch({ type: 'JOIN_ACTIVITY', payload: id }),
      createActivity: (input) => {
        const activity: Activity = {
          id: generateId(),
          ...input,
          organiser: {
            name: currentUser.displayName,
            organisation: currentUser.organisation,
            verified: true,
          },
          status: 'pending',
          participantCount: 0,
          createdByCurrentUser: true,
        }
        dispatch({ type: 'CREATE_ACTIVITY', payload: activity })
        return activity
      },
      approveActivity: (id) => dispatch({ type: 'APPROVE_ACTIVITY', payload: id }),
      toggleHighContrast: () => dispatch({ type: 'TOGGLE_HIGH_CONTRAST' }),
      resetState: () => dispatch({ type: 'RESET_STATE' }),
      getActivities: async (filters) => {
        const byStatus = state.activities.filter((activity) =>
          ['published', 'pending'].includes(activity.status),
        )

        const filtered = byStatus.filter((activity) => {
          const query = filters.query.trim().toLowerCase()
          const searchable = [
            activity.title,
            activity.summary,
            activity.city,
            activity.countryName,
            activity.organiser.name,
            activity.topics.join(' '),
          ]
            .join(' ')
            .toLowerCase()

          if (query && !searchable.includes(query)) {
            return false
          }

          if (filters.countryCodes.length > 0 && !filters.countryCodes.includes(activity.countryCode)) {
            return false
          }

          if (
            filters.activityTypes.length > 0
            && !filters.activityTypes.includes(activity.activityType)
          ) {
            return false
          }

          if (filters.modes.length > 0 && !filters.modes.includes(activity.mode)) {
            return false
          }

          if (
            filters.languages.length > 0
            && !filters.languages.some((language) => activity.languages.includes(language))
          ) {
            return false
          }

          if (
            filters.ageGroups.length > 0
            && !filters.ageGroups.some((ageGroup) => activity.ageGroups.includes(ageGroup))
          ) {
            return false
          }

          if (filters.topics.length > 0 && !filters.topics.some((topic) => activity.topics.includes(topic))) {
            return false
          }

          if (filters.dateFrom && new Date(activity.startDate) < new Date(filters.dateFrom)) {
            return false
          }

          if (filters.dateTo && new Date(activity.endDate) > new Date(filters.dateTo)) {
            return false
          }

          return true
        })

        return withDelay(filtered)
      },
      getActivityById: async (id) => {
        const activity = state.activities.find((item) => item.id === id) ?? null
        return withDelay(activity)
      },
    }),
    [state],
  )

  return createElement(AppStoreContext.Provider, { value: store }, children)
}

export function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }

  return context
}
