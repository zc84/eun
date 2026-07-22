import type { ActivityMode } from './activity'

export type ActivitySortBy = 'relevance' | 'dateAscending' | 'dateDescending'

export interface ActivityFilters {
  query: string
  countryCodes: string[]
  activityTypes: string[]
  ageGroups: string[]
  languages: string[]
  modes: ActivityMode[]
  dateFrom?: string
  dateTo?: string
  topics: string[]
  sortBy: ActivitySortBy
}

export const defaultActivityFilters: ActivityFilters = {
  query: '',
  countryCodes: [],
  activityTypes: [],
  ageGroups: [],
  languages: [],
  modes: [],
  topics: [],
  sortBy: 'relevance',
}
