export interface GeneratedMessage {
  type: "INITIAL"
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
  pastExperiences?: Array<{ title: string; company: string; duration?: string; location?: string }>
  education?: string
  skills?: string
  languages?: string
  services?: string
  recentPosts?: Array<{ content: string; date?: string }>
  mutualConnections?: Array<{ name: string; headline?: string }>
  connectionCount?: number
}
