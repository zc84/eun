export type UserRole = 'participant' | 'organiser'

export interface UserProfile {
  id: string
  displayName: string
  organisation: string
  countryCode: string
  roleLabel: string
  avatarUrl?: string
  earnedBadgeIds: string[]
  certificateIds: string[]
  joinedActivityIds: string[]
  createdActivityIds: string[]
}
