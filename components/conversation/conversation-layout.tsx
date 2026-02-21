"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageTimeline } from "./message-timeline"
import { AiAssistantPanel } from "./ai-assistant-panel"
import { ProspectProfilePanel } from "@/components/prospects/prospect-profile-panel"

interface Message {
  id: string
  type: string
  status: string
  content: string
  suggestedDelay: string | null
  sentAt: Date | null
  createdAt: Date
}

interface Prospect {
  id: string
  firstName: string
  lastName: string
  currentPosition: string
  currentCompany: string
  objective: string | null
  signal: string | null
  aiApproachAngle: string | null
  status: string
  linkedinUrl: string
  profilePhotoUrl: string | null
  headline: string | null
  bio: string | null
  location: string | null
  pastExperiences: unknown
  education: string | null
  skills: string | null
  languages: string | null
  connectionCount: number | null
  recentPosts: unknown
  profileCompleteness: number
  services: string | null
  mutualConnections: unknown
  conversation: {
    id: string
    currentStep: number
    followUpCount: number
    messages: Message[]
  } | null
}

export function ConversationLayout({ prospect }: { prospect: Prospect }) {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  function handleRefresh() {
    setRefreshKey((k) => k + 1)
    router.refresh()
  }

  const messages = prospect.conversation?.messages || []

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      {/* Left panel — Prospect profile (25%) */}
      <div className="flex-[2.5] overflow-y-auto rounded-lg border bg-card p-4">
        <ProspectProfilePanel prospect={prospect} />
      </div>

      {/* Center panel — Message timeline (45%) */}
      <div className="flex-[4.5] overflow-y-auto rounded-lg border bg-card p-4">
        <MessageTimeline
          messages={messages}
          prospectFirstName={prospect.firstName}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Right panel — AI Assistant (30%) */}
      <div className="flex-[3] overflow-y-auto rounded-lg border bg-card p-4">
        <AiAssistantPanel
          prospect={prospect}
          messages={messages}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
