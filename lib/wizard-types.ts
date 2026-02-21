export type ObjectiveType = "CALL" | "MEETING" | "SELL" | "TESTIMONIAL"

export interface WizardState {
  firstName: string
  lastName: string
  linkedinUrl: string
  currentPosition: string
  currentCompany: string
  profilePhotoUrl: string
  headline: string
  bio: string
  location: string
  pastExperiences: string
  education: string
  skills: string
  languages: string
  services: string
  recentPosts: string
  mutualConnections: string
  connectionCount: string
  objective: ObjectiveType | ""
  signal: string
}
