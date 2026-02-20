import { z } from "zod"

export const onboardingSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "Le poste est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  offerDescription: z.string().min(1, "La description de l'offre est requise"),
  idealTarget: z.string().min(1, "La cible idéale est requise"),
  tone: z.enum(["PROFESSIONAL", "CASUAL", "EXPERT", "FRIENDLY"]),
  linkedinUrl: z.string().url("URL invalide").optional().or(z.literal("")),
})

export const createListSchema = z.object({
  name: z.string().min(1, "Le nom de la liste est requis"),
  description: z.string().optional(),
  defaultObjective: z.enum(["CALL", "MEETING", "SELL", "TESTIMONIAL"]).optional(),
})

export const prospectInfoSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  linkedinUrl: z.string().url("URL LinkedIn invalide"),
  currentPosition: z.string().min(1, "Le poste actuel est requis"),
  currentCompany: z.string().min(1, "L'entreprise actuelle est requise"),
  profilePhotoUrl: z.string().url().optional().or(z.literal("")),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  pastExperiences: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  languages: z.string().optional(),
  services: z.string().optional(),
  recentPosts: z
    .array(
      z.object({
        content: z.string(),
        date: z.string().optional(),
      })
    )
    .optional(),
  mutualConnections: z.string().optional(),
  connectionCount: z.coerce.number().int().positive().optional(),
})

export const extensionProspectSchema = prospectInfoSchema.extend({
  listId: z.string().min(1, "L'ID de la liste est requis"),
  objective: z.enum(["CALL", "MEETING", "SELL", "TESTIMONIAL"]).optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
export type CreateListFormData = z.infer<typeof createListSchema>
export type ProspectInfoFormData = z.infer<typeof prospectInfoSchema>
