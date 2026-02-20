export interface ContextSuggestion {
  id: string
  title: string
  description: string
  relevanceScore: number
}

export interface StrategySuggestion {
  id: string
  name: string
  description: string
  steps: number
  toneIndicator: string
}

export interface GeneratedMessage {
  type: "INITIAL" | "FOLLOW_UP_1" | "FOLLOW_UP_2" | "FOLLOW_UP_3"
  content: string
  suggestedDelay: string
}

export interface ResponseAnalysis {
  sentiment:
    | "positive"
    | "warm"
    | "question"
    | "negative_polite"
    | "negative_firm"
    | "acceptance"
  nextMessage: string
  suggestedStatus: string
  reasoning: string
}

export interface ProspectData {
  firstName: string
  lastName: string
  currentPosition: string
  currentCompany: string
  headline?: string
  bio?: string
  location?: string
  pastExperiences?: string
  education?: string
  skills?: string
  languages?: string
  services?: string
  recentPosts?: string
  mutualConnections?: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  role: string
  company: string
  offerDescription: string
  idealTarget: string
  tone: string
  linkedinUrl?: string
}
