export type ActivityMode = 'online' | 'onsite' | 'hybrid'

export type ActivityStatus = 'published' | 'pending' | 'draft'

export interface ActivityOrganiser {
  name: string
  organisation: string
  verified: boolean
}

export interface Activity {
  id: string
  title: string
  summary: string
  description: string
  countryCode: string
  countryName: string
  city: string
  address?: string
  latitude: number
  longitude: number
  startDate: string
  endDate: string
  mode: ActivityMode
  activityType: string
  ageGroups: string[]
  languages: string[]
  topics: string[]
  organiser: ActivityOrganiser
  imageUrl?: string
  registrationUrl?: string
  status: ActivityStatus
  participantCount: number
  capacity?: number
  featured?: boolean
  createdByCurrentUser?: boolean
}

export interface CreateActivityInput {
  title: string
  summary: string
  description: string
  countryCode: string
  countryName: string
  city: string
  address?: string
  latitude: number
  longitude: number
  startDate: string
  endDate: string
  mode: ActivityMode
  activityType: string
  ageGroups: string[]
  languages: string[]
  topics: string[]
  registrationUrl?: string
  capacity?: number
}
