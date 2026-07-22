import { describe, expect, it } from 'vitest'
import { initialActivities } from '../data/activities'
import { defaultActivityFilters } from '../types/filters'
import { selectFilteredActivities } from './selectors'

const baseState = {
  activities: initialActivities,
  filters: defaultActivityFilters,
  selectedActivityId: undefined,
}

describe('selectFilteredActivities', () => {
  it('filters by query across title and topic', () => {
    const state = {
      ...baseState,
      filters: {
        ...defaultActivityFilters,
        query: 'robotics',
      },
    }

    const result = selectFilteredActivities(state)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((item) => `${item.title} ${item.topics.join(' ')}`.toLowerCase().includes('robotics'))).toBe(true)
  })

  it('filters by selected country code', () => {
    const state = {
      ...baseState,
      filters: {
        ...defaultActivityFilters,
        countryCodes: ['IT'],
      },
    }

    const result = selectFilteredActivities(state)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((item) => item.countryCode === 'IT')).toBe(true)
  })

  it('sorts by ascending date', () => {
    const state = {
      ...baseState,
      filters: {
        ...defaultActivityFilters,
        sortBy: 'dateAscending' as const,
      },
    }

    const result = selectFilteredActivities(state)
    const timestamps = result.map((item) => new Date(item.startDate).getTime())
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b))
  })
})