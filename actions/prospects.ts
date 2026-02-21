"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import type { ProspectStatus } from "@/generated/prisma"

export async function updateProspectStatus(
  prospectId: string,
  status: ProspectStatus
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
  })
  if (!prospect) return { error: "Prospect introuvable" }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { status },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/prospects/${prospectId}`)
}

export async function updateProspectStrategy(
  prospectId: string,
  data: {
    objective?: string
    selectedContext?: string
    contextDetail?: string
  }
) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
  })
  if (!prospect) return { error: "Prospect introuvable" }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      objective: data.objective,
      selectedContext: data.selectedContext,
      contextDetail: data.contextDetail,
    },
  })

  revalidatePath("/dashboard")
}

export async function deleteProspect(prospectId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  const prospect = await prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
  })
  if (!prospect) return

  await prisma.prospect.delete({ where: { id: prospectId } })
  revalidatePath("/dashboard")
}

export async function getProspect(prospectId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.prospect.findFirst({
    where: { id: prospectId, userId: session.user.id },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  })
}
