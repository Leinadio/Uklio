"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"

export async function getCampaigns() {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.campaign.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { prospects: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCampaign(campaignId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.campaign.findFirst({
    where: { id: campaignId, userId: session.user.id },
    include: {
      prospects: {
        orderBy: { updatedAt: "desc" },
        include: {
          conversation: {
            include: {
              messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  })
}

export async function createCampaign(data: { name: string; offer: string }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      offer: data.offer,
      userId: session.user.id,
    },
  })

  revalidatePath("/campaigns")
  return campaign
}

export async function updateCampaign(
  campaignId: string,
  data: { name?: string; offer?: string }
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, userId: session.user.id },
  })
  if (!campaign) return { error: "Campagne introuvable" }

  await prisma.campaign.update({
    where: { id: campaignId },
    data,
  })

  revalidatePath("/campaigns")
  revalidatePath(`/campaigns/${campaignId}`)
}

export async function deleteCampaign(campaignId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, userId: session.user.id },
  })
  if (!campaign) return

  // Detach prospects before deleting
  await prisma.prospect.updateMany({
    where: { campaignId },
    data: { campaignId: null },
  })

  await prisma.campaign.delete({ where: { id: campaignId } })
  revalidatePath("/campaigns")
}

export async function assignProspectToCampaign(
  prospectId: string,
  campaignId: string | null
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
  })
  if (!prospect) return { error: "Prospect introuvable" }

  if (campaignId) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id },
    })
    if (!campaign) return { error: "Campagne introuvable" }
  }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { campaignId },
  })

  revalidatePath("/dashboard")
  revalidatePath("/campaigns")
}
