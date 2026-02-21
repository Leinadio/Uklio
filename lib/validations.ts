import { z } from "zod"

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
  mutualConnections: z
    .array(
      z.object({
        name: z.string(),
        headline: z.string().optional(),
      })
    )
    .optional(),
  connectionCount: z.coerce.number().int().positive().optional(),
})

export const extensionProspectSchema = prospectInfoSchema

export type ProspectInfoFormData = z.infer<typeof prospectInfoSchema>
