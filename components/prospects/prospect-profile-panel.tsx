"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProspect } from "@/actions/prospects"
import { toast } from "sonner"
import {
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Users,
  Sparkles,
  FileText,
  Trash2,
} from "lucide-react"

interface Experience {
  title: string
  company: string
  duration?: string
  location?: string
}

interface RecentPost {
  content: string
  date?: string
}

interface ProspectProfilePanelProps {
  prospect: {
    id: string
    firstName: string
    lastName: string
    currentPosition: string
    currentCompany: string
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
  }
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h3>
      <div className="text-sm">{children}</div>
    </div>
  )
}

function parseExperiences(raw: unknown): Experience[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as Experience[]
  // Legacy: pipe-separated string
  if (typeof raw === "string") {
    return raw
      .split("|")
      .map((e) => e.trim())
      .filter(Boolean)
      .map((e) => {
        const [title, company] = e.split(" - ")
        return { title: title?.trim() || e, company: company?.trim() || "" }
      })
  }
  return []
}

function parsePosts(raw: unknown): RecentPost[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as RecentPost[]
  // Legacy: || separated string
  if (typeof raw === "string") {
    return raw
      .split("||")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((content) => ({ content }))
  }
  return []
}

export function ProspectProfilePanel({ prospect }: ProspectProfilePanelProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const initials = `${prospect.firstName[0]}${prospect.lastName[0]}`.toUpperCase()

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProspect(prospect.id)
      toast.success("Prospect supprimé")
      router.push("/dashboard")
    } catch {
      toast.error("Erreur lors de la suppression")
      setDeleting(false)
    }
  }

  const pastExperiences = parseExperiences(prospect.pastExperiences)

  const educationList = prospect.education
    ?.split("|")
    .map((e) => e.trim())
    .filter(Boolean)

  const skillsList = prospect.skills
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const languagesList = prospect.languages
    ?.split(",")
    .map((l) => l.trim())
    .filter(Boolean)

  const recentPosts = parsePosts(prospect.recentPosts)

  return (
    <div className="space-y-4">
      {/* Header: photo + name + headline */}
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar className="h-16 w-16">
          {prospect.profilePhotoUrl && (
            <AvatarImage src={prospect.profilePhotoUrl} alt={prospect.firstName} />
          )}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">
            {prospect.firstName} {prospect.lastName}
          </p>
          {prospect.headline && (
            <p className="text-xs text-muted-foreground">{prospect.headline}</p>
          )}
        </div>
      </div>

      {/* Completeness */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Profil</span>
          <span>{prospect.profileCompleteness}%</span>
        </div>
        <Progress value={prospect.profileCompleteness} />
      </div>

      {/* LinkedIn link */}
      <a
        href={prospect.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
      >
        <Linkedin className="h-3.5 w-3.5" />
        Voir sur LinkedIn
      </a>

      <Separator />

      {/* Current position */}
      <Section icon={Briefcase} title="Poste actuel">
        <p>
          {prospect.currentPosition}
          <span className="text-muted-foreground"> chez </span>
          {prospect.currentCompany}
        </p>
      </Section>

      {/* Bio */}
      {prospect.bio && (
        <>
          <Separator />
          <Section icon={FileText} title="A propos">
            <p className="whitespace-pre-line">{prospect.bio}</p>
          </Section>
        </>
      )}

      {/* Past experiences */}
      {pastExperiences.length > 0 && (
        <>
          <Separator />
          <Section icon={Briefcase} title="Experiences">
            <ul className="space-y-2">
              {pastExperiences.map((exp, i) => (
                <li key={i}>
                  <p className="font-medium">{exp.title}</p>
                  {exp.company && (
                    <p className="text-muted-foreground text-xs">{exp.company}</p>
                  )}
                  {exp.duration && (
                    <p className="text-muted-foreground text-xs">{exp.duration}</p>
                  )}
                  {exp.location && (
                    <p className="text-muted-foreground text-xs">{exp.location}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      {/* Education */}
      {educationList && educationList.length > 0 && (
        <>
          <Separator />
          <Section icon={GraduationCap} title="Formation">
            <ul className="space-y-1">
              {educationList.map((edu, i) => (
                <li key={i} className="text-muted-foreground">
                  {edu}
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      {/* Skills */}
      {skillsList && skillsList.length > 0 && (
        <>
          <Separator />
          <Section icon={Sparkles} title="Competences">
            <div className="flex flex-wrap gap-1">
              {skillsList.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Languages */}
      {languagesList && languagesList.length > 0 && (
        <>
          <Separator />
          <Section icon={Languages} title="Langues">
            <p className="text-muted-foreground">{languagesList.join(", ")}</p>
          </Section>
        </>
      )}

      {/* Location */}
      {prospect.location && (
        <>
          <Separator />
          <Section icon={MapPin} title="Localisation">
            <p className="text-muted-foreground">{prospect.location}</p>
          </Section>
        </>
      )}

      {/* Connection count */}
      {prospect.connectionCount != null && (
        <>
          <Separator />
          <Section icon={Users} title="Connexions">
            <p className="text-muted-foreground">
              {prospect.connectionCount.toLocaleString("fr-FR")} connexions
            </p>
          </Section>
        </>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <>
          <Separator />
          <Section icon={FileText} title="Posts recents">
            <ul className="space-y-2">
              {recentPosts.map((post, i) => (
                <li
                  key={i}
                  className="rounded-md border bg-muted/50 p-2 text-xs text-muted-foreground"
                >
                  <p className="whitespace-pre-line">{post.content}</p>
                  {post.date && (
                    <p className="mt-1 text-[10px] opacity-60">{post.date}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <Separator />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer le prospect
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {prospect.firstName} {prospect.lastName} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le prospect, sa séquence de messages et tout l&apos;historique de conversation seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
