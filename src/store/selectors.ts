import type { AppStoreState } from './appStore'
import type { Activity } from '../types/activity'
import type { ActivityFilters } from '../types/filters'

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

function matchesFilters(activity: Activity, filters: ActivityFilters) {
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

  if (filters.activityTypes.length > 0 && !filters.activityTypes.includes(activity.activityType)) {
    return false
  }

  if (filters.modes.length > 0 && !filters.modes.includes(activity.mode)) {
    return false
  }

  if (filters.languages.length > 0 && !filters.languages.some((language) => activity.languages.includes(language))) {
    return false
  }

  if (filters.ageGroups.length > 0 && !filters.ageGroups.some((ageGroup) => activity.ageGroups.includes(ageGroup))) {
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
}

export function selectFilteredActivities(
  state: Pick<AppStoreState, 'activities' | 'filters' | 'selectedActivityId'>,
) {
  const filtered = state.activities
    .filter((activity) => activity.status === 'published' || activity.createdByCurrentUser)
    .filter((activity) => matchesFilters(activity, state.filters))

  if (state.filters.sortBy === 'dateAscending') {
    return [...filtered].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  if (state.filters.sortBy === 'dateDescending') {
    return [...filtered].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }

  return filtered
}
