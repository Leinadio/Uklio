"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { onboardingSchema } from "@/lib/validations"

export async function saveOnboarding(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    role: formData.get("role") as string,
    company: formData.get("company") as string,
    offerDescription: formData.get("offerDescription") as string,
    idealTarget: formData.get("idealTarget") as string,
    tone: formData.get("tone") as string,
    linkedinUrl: (formData.get("linkedinUrl") as string) || "",
  }

  const result = onboardingSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...result.data,
      linkedinUrl: result.data.linkedinUrl || null,
      onboardingCompleted: true,
    },
  })

  redirect("/dashboard")
}

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    role: formData.get("role") as string,
    company: formData.get("company") as string,
    offerDescription: formData.get("offerDescription") as string,
    idealTarget: formData.get("idealTarget") as string,
    tone: formData.get("tone") as string,
    linkedinUrl: (formData.get("linkedinUrl") as string) || "",
  }

  const result = onboardingSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...result.data,
      linkedinUrl: result.data.linkedinUrl || null,
    },
  })

  return { success: true }
}
