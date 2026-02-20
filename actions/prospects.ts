"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { prospectInfoSchema } from "@/lib/validations"
import type { Objective, ProspectStatus } from "@/generated/prisma"

const OPTIONAL_FIELDS = [
  "profilePhotoUrl",
  "headline",
  "bio",
  "location",
  "pastExperiences",
  "education",
  "skills",
  "languages",
  "services",
  "recentPosts",
  "mutualConnections",
  "connectionCount",
] as const

function computeCompleteness(data: Record<string, unknown>): number {
  const filled = OPTIONAL_FIELDS.filter((f) => {
    const val = data[f]
    if (val == null || val === "" || val === 0) return false
    if (Array.isArray(val)) return val.length > 0
    return true
  }).length
  return Math.round((filled / OPTIONAL_FIELDS.length) * 100)
}

export async function createProspect(data: {
  campaignId: string
  objective?: string
  firstName: string
  lastName: string
  linkedinUrl: string
  currentPosition: string
  currentCompany: string
  profilePhotoUrl?: string
  headline?: string
  bio?: string
  location?: string
  pastExperiences?: { title: string; company: string; duration?: string; location?: string }[]
  education?: string
  skills?: string
  languages?: string
  services?: string
  recentPosts?: { content: string; date?: string }[]
  mutualConnections?: string
  connectionCount?: number
  selectedContext?: string
  contextDetail?: string
  selectedStrategy?: string
  strategyDetail?: string
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  // Verify campaign belongs to user
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId, userId: session.user.id },
  })
  if (!campaign) {
    return { error: "Campagne introuvable" }
  }

  const completeness = computeCompleteness(data)

  const prospect = await prisma.prospect.create({
    data: {
      ...data,
      objective: data.objective as Objective | undefined,
      profileCompleteness: completeness,
    },
  })

  revalidatePath(`/campaigns/${data.campaignId}`)
  return { success: true, prospectId: prospect.id }
}

export async function updateProspectStatus(
  prospectId: string,
  status: ProspectStatus
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, campaign: { userId: session.user.id } },
  })
  if (!prospect) return { error: "Prospect introuvable" }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { status },
  })

  revalidatePath(`/campaigns/${prospect.campaignId}`)
  revalidatePath(`/prospects/${prospectId}`)
}

export async function updateProspectStrategy(
  prospectId: string,
  data: {
    objective?: string
    selectedContext?: string
    contextDetail?: string
    selectedStrategy?: string
    strategyDetail?: string
  }
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, campaign: { userId: session.user.id } },
  })
  if (!prospect) return { error: "Prospect introuvable" }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      objective: data.objective as Objective | undefined,
      selectedContext: data.selectedContext,
      contextDetail: data.contextDetail,
      selectedStrategy: data.selectedStrategy,
      strategyDetail: data.strategyDetail,
    },
  })

  revalidatePath(`/campaigns/${prospect.campaignId}`)
}

export async function deleteProspect(prospectId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, campaign: { userId: session.user.id } },
  })
  if (!prospect) return

  await prisma.prospect.delete({ where: { id: prospectId } })
  revalidatePath(`/campaigns/${prospect.campaignId}`)
}

export async function getProspect(prospectId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.prospect.findFirst({
    where: { id: prospectId, campaign: { userId: session.user.id } },
    include: {
      campaign: true,
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  })
}
