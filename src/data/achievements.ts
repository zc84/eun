import type { Achievement, Certificate } from '../types/achievement'

export const achievements: Achievement[] = [
  {
    id: 'first-join',
    title: 'First activity joined',
    description: 'Joined your first Code Week activity.',
    icon: '🎯',
    unlocked: true,
  },
  {
    id: 'first-organised',
    title: 'First activity organised',
    description: 'Published your first activity as organiser.',
    icon: '🧭',
    unlocked: false,
  },
  {
    id: 'contributor',
    title: 'Code Week Contributor',
    description: 'Contributed to multiple activities in one season.',
    icon: '🌍',
    unlocked: false,
  },
  {
    id: 'inclusive-learning',
    title: 'Inclusive Learning Champion',
    description: 'Promoted inclusive participation across age groups.',
    icon: '🤝',
    unlocked: false,
  },
  {
    id: 'cross-border',
    title: 'Cross-border Collaborator',
    description: 'Joined events spanning multiple countries.',
    icon: '🛫',
    unlocked: false,
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Sustained engagement with the local coding community.',
    icon: '🏘️',
    unlocked: false,
  },
]

export const certificates: Certificate[] = [
  {
    id: 'cert-2025-1',
    title: 'EU Code Week Participation Certificate 2025',
    issueDate: '2025-10-21',
    fileUrl: '/mock-certificates/mock-certificate-2025.pdf',
  },
  {
    id: 'cert-trainers-2025',
    title: 'Train the Trainers — Inclusive Coding Practice (Concept Sample)',
    issueDate: '2025-05-14',
    fileUrl: '/mock-certificates/mock-certificate-2025.pdf',
  },
]
