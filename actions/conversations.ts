"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"

export async function markMessageSent(messageId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      conversation: {
        include: { prospect: true },
      },
    },
  })

  if (!message || message.conversation.prospect.userId !== session.user.id) {
    return { error: "Message introuvable" }
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { status: "SENT", sentAt: new Date() },
  })

  // Update prospect status
  const prospect = message.conversation.prospect
  if (prospect.status === "MESSAGE_READY" || prospect.status === "NEW") {
    await prisma.prospect.update({
      where: { id: prospect.id },
      data: { status: "WAITING" },
    })
  } else if (prospect.status === "IN_PROGRESS") {
    await prisma.prospect.update({
      where: { id: prospect.id },
      data: { status: "WAITING" },
    })
  }

  // Update conversation step
  const stepMap: Record<string, number> = {
    INITIAL: 1,
    FOLLOW_UP_1: 2,
    FOLLOW_UP_2: 3,
    FOLLOW_UP_3: 4,
  }
  const newStep = stepMap[message.type]
  if (newStep) {
    await prisma.conversation.update({
      where: { id: message.conversationId },
      data: {
        currentStep: newStep,
        followUpCount:
          message.type.startsWith("FOLLOW_UP")
            ? { increment: 1 }
            : undefined,
      },
    })
  }

  revalidatePath(`/prospects/${prospect.id}/conversation`)
}

export async function editMessage(messageId: string, content: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      conversation: {
        include: { prospect: true },
      },
    },
  })

  if (!message || message.conversation.prospect.userId !== session.user.id) {
    return { error: "Message introuvable" }
  }

  if (message.status !== "DRAFT") {
    return { error: "Seuls les brouillons peuvent être modifiés" }
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { content },
  })

  revalidatePath(
    `/prospects/${message.conversation.prospectId}/conversation`
  )
}
