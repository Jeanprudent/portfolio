import type { Metadata } from "next"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import { absoluteUrl, SITE_URL } from "@/lib/site"
import { getLocalVilles } from "@/lib/supabase-data"
import { ServicesIndex } from "@/components/services/ServicesIndex"

// Les liens « par ville » reflètent les villes actives de /gestion/zones.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Services : sites web, SEO & automatisation à Cotonou",
  description:
    "Création de sites web sur mesure, référencement naturel, maintenance WordPress et automatisation. Prestations pour PME, artisans et entrepreneurs à Cotonou et au Bénin.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "Services : sites web, SEO & automatisation à Cotonou | Jean Prudent",
    description:
      "Des solutions digitales concrètes pour gagner en visibilité, convertir plus de clients et gagner du temps. PME, TPE et entrepreneurs au Bénin.",
    url: absoluteUrl("/services"),
    locale: "fr_FR",
  },
}

export default async function Page() {
  const services = SERVICES.filter((s) => s.visible)
  const villes = await getLocalVilles()

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: absoluteUrl(`/services/${serviceSlug(s)}`),
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ServicesIndex villes={villes} />
    </>
  )
}
