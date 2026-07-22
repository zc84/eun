export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface Certificate {
  id: string
  title: string
  issueDate: string
  fileUrl: string
}
