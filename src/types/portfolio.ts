export interface PersonalInfo {
  fullName: string
  email: string
  phone?: string
  location: string
  title: string
  bio: string
  avatar?: string
  linkedin?: string
  github?: string
  twitter?: string
}

export interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  startDate: string
  endDate?: string
}

export interface Portfolio {
  id: string
  personalInfo: PersonalInfo
  skills: Skill[]
  projects: Project[]
  template: string
  createdAt: string
  updatedAt: string
}
