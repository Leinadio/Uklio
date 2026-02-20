"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { createCampaignSchema } from "@/lib/validations"

export async function createCampaign(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    defaultObjective: formData.get("defaultObjective") as string,
  }

  const result = createCampaignSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await prisma.campaign.create({
    data: {
      ...result.data,
      userId: session.user.id,
    },
  })

  revalidatePath("/campaigns")
  return { success: true }
}

export async function deleteCampaign(campaignId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  await prisma.campaign.delete({
    where: { id: campaignId, userId: session.user.id },
  })

  revalidatePath("/campaigns")
}

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

export async function getCampaignWithProspects(campaignId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.campaign.findUnique({
    where: { id: campaignId, userId: session.user.id },
    include: {
      prospects: {
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
        orderBy: { createdAt: "desc" },
      },
    },
  })
}
