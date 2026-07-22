import type { AppStoreState } from './appStore'

export function selectPublishedActivities(state: AppStoreState) {
  return state.activities.filter((activity) => activity.status === 'published')
}

export function selectPendingActivities(state: AppStoreState) {
  return state.activities.filter((activity) => activity.status === 'pending')
}

export function selectSelectedActivity(state: AppStoreState) {
  if (!state.selectedActivityId) {
    return null
  }

  return state.activities.find((activity) => activity.id === state.selectedActivityId) ?? null
}
