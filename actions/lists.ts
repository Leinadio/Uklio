"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { createListSchema } from "@/lib/validations"

export async function createList(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    defaultObjective:
      (formData.get("defaultObjective") as string) || undefined,
  }

  const result = createListSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await prisma.prospectList.create({
    data: {
      ...result.data,
      userId: session.user.id,
    },
  })

  revalidatePath("/lists")
  return { success: true }
}

export async function deleteList(listId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  await prisma.prospectList.delete({
    where: { id: listId, userId: session.user.id },
  })

  revalidatePath("/lists")
}

export async function getLists() {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.prospectList.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { prospects: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getListWithProspects(listId: string) {
  const session = await getSession()
  if (!session) redirect("/login")

  return prisma.prospectList.findUnique({
    where: { id: listId, userId: session.user.id },
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
