import type { Metadata } from "next"
import { getProjects } from "@/lib/supabase-data"
import { ProjectsList } from "./ProjectsList"

// Relire les projets depuis Supabase à chaque requête pour refléter les
// ajouts/suppressions faits dans le back-office (même règle que /blog).
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Projets réalisés | sites web, SEO et automatisation",
  description:
    "Découvrez la pluspart de mes réalisations : sites web sur mesure, référencement naturel et automatisation, pour des PME, artisans et entrepreneurs au Bénin et ailleurs.",
  alternates: { canonical: "/projets" },
  openGraph: {
    type: "website",
    title: "Projets réalisés | Jean Prudent",
    description:
      "Tous mes projets : création de sites web, SEO et automatisation.",
    url: "/projets",
  },
}

export default async function ProjetsPage() {
  const projects = await getProjects()
  return <ProjectsList projects={projects} />
}
